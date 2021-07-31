class Assembly { // after assembly is constructed, models are all already loaded (due to waiting to move them to main model)
    static parse(assemblyCfg, materialsCfg, groundMaxZ) { // parses the json cfg and returns a modelHelper
        var materials = Materials.parse(materialsCfg)
        const metaCfg = assemblyCfg.meta
        const assemblyID = metaCfg.assemblyID
        const srcPath = metaCfg.srcPath
        const loadModels = assemblyCfg.models
        const lowestID = metaCfg.lowestModel
        var meta = new Object()
        meta.id = assemblyID
        meta.materials = materials
        meta.toggles = []
        var models = new Object()
        // lowest model is loaded first
        const lowestCfg = loadModels[lowestID]
        var lowestModel = new xeogl.STLModel ({
            id: lowestID,
            src: srcPath + lowestCfg.src,
            material: materials.fixed[lowestCfg.material] ? materials.fixed[lowestCfg.material] : materials.configurable[lowestCfg.material],
            visible: lowestCfg.visible
        })
        models[lowestID] = lowestModel
        lowestModel.on("loaded", () => {
            // center on origin and shift to top of ground
            this.centerOnOrigin(lowestModel)
            this.moveToGround(lowestModel, groundMaxZ)
            // start loading all others, shifting them to align with lowest model
            Object.keys(loadModels).filter(id => id != lowestID).forEach(id => {
                const modelCfg = loadModels[id]
                models[id] = new xeogl.STLModel({
                    id: id,
                    src: srcPath + modelCfg.src,
                    material: materials.fixed[modelCfg.material] ? materials.fixed[modelCfg.material] : materials.configurable[modelCfg.material],
                    visible: modelCfg.visible,
                    position: lowestModel.position
                })
                // if moddle is toggleable, add to toolbar
                if (modelCfg.toggle) {
                    meta.toggles.push(Toolbar.addToggleOption(modelCfg.toggle, models[id]))
                }
            })
        })
        return [assemblyID, new Assembly(meta, models)]   
    }

    static centerOnOrigin(model) {
        var modelLimits = model.aabb
        model.position = [
            (modelLimits[0] - modelLimits[3])/2 - modelLimits[0],
            (modelLimits[1] - modelLimits[4])/2 - modelLimits[1],
            (modelLimits[2] - modelLimits[5])/2 - modelLimits[2]
        ]
    }

    static moveToGround(model, groundMaxZ) {
        var modelMinZ = model.aabb[2]
        var zAdjust = groundMaxZ - modelMinZ
        model.position = [model.position[0], model.position[1], model.position[2] + zAdjust]
    }

    static moveToModel(modelFrom, modelTo) {
        modelTo.on("loaded", () => {
            modelFrom.position = modelTo.position
        })
    }

    constructor(meta, models) {
        this.meta = meta
        this.models = models
    }

    unload() {
        for (var ele of this.meta.toggles) {
            Toolbar.removeDropdownElement(ele)
        }
        for (var ele of this.meta.materials.toggles) {
            Toolbar.removeColorOption(ele[0], ele[1])
        }
        Object.values(this.models).forEach(model => {
            model.destroy()
        })
    }
    
}