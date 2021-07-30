class Assembly { // after assembly is constructed, models are all already loaded (due to waiting to move them to main model)
    static parse(assemblyCfg, materialsCfg) { // parses the json cfg and returns a modelHelper
        var materials = Materials.parse(materialsCfg)
        const metaCfg = assemblyCfg.meta
        const assemblyID = metaCfg.assemblyID
        const srcPath = metaCfg.srcPath
        const loadModels = assemblyCfg.models
        var meta = new Object()
        meta.id = assemblyID
        meta.materials = materials
        var models = new Object()
        // create a model for each and store in models Object
        Object.keys(loadModels).forEach(id => {
            const modelCfg = loadModels[id]
            models[id] = new xeogl.STLModel({
                id: id,
                src: srcPath + modelCfg.src,
                material: materials.fixed[modelCfg.material] ? materials.fixed[modelCfg.material] : materials.configurable[modelCfg.material],
                visible: modelCfg.visible
            })
            // if moddle is toggleable, add to toolbar
            if (modelCfg.toggle) {
                Toolbar.addToggleOption(modelCfg.toggle, models[id])
            }
            // if model is lowest model, update meta
            if (id == metaCfg.lowestModel) {
                meta.lowestModel = models[id]
            }
            // if model is main model, center on origin
            if (id == metaCfg.mainModel) {
                this.centerOnOrigin(models[id])
                meta.mainModel = models[id]
            } else {
                // else move to main models position (to align them - IMPT all models must have same origin)
                // requires main model to be the first in models list in json
                this.moveToModel(models[id], meta.mainModel)
            }           
        })

        return [assemblyID, new Assembly(meta, models)]
    }

    static centerOnOrigin(model) {
        model.on("loaded", () => {
            var modelLimits = model.aabb
            model.position = [
                (modelLimits[0] - modelLimits[3])/2 - modelLimits[0],
                (modelLimits[1] - modelLimits[4])/2 - modelLimits[1],
                (modelLimits[2] - modelLimits[5])/2 - modelLimits[2]
            ]
        })
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

    
}