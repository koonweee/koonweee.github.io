class Materials {
    static parse(cfg, toolbar) {
        var materials = new Object() // dictionary for materials
        materials.fixed = new Object()
        materials.configurable = new Object()
        Object.keys(cfg.fixed).forEach(materialCfgKey => {
            materials.fixed[materialCfgKey] = this.createMaterial(cfg.fixed[materialCfgKey])
        })
        Object.keys(cfg.configurable).forEach(materialCfgKey => {
            const materialCfg = cfg.configurable[materialCfgKey];
            const material = this.createMaterial(materialCfg)
            materials.configurable[materialCfgKey] = material
            toolbar.addColorPicker(materialCfg.displayName, material, materialCfg.presets)
        })
        return materials
    }

    static createMaterial(cfg) { // takes json cfg specifying material properties and returns xeogl Material
         var material = cfg.type == "specular" ? new xeogl.SpecularMaterial() : new xeogl.MetallicMaterial()
         Object.keys(cfg).forEach(attr => {
            if (attr != "type") {
                if (attr.includes("Map")) { //texture needed
                    material[attr] = this.createTexture(cfg[attr])
                } else if (attr == "diffuse") {
                    material[attr] = cfg[attr]
                    material["specular"] = cfg[attr]
                } else {
                    material[attr] = cfg[attr]
                }
            }
         })
         return material
    }

    static createTexture(cfg) { // takes a JSON cfg specifying texture properties and returns xeogl Texture
        var texture = new xeogl.Texture()
        Object.keys(cfg).forEach(attrKey => { // iterate over that texture attributes in CFG, adding them to the new texture
            texture[attrKey] = cfg[attrKey]
        })
        return texture
    }
}