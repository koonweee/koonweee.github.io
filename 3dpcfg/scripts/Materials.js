class Materials {
    static parse(cfg, toolbar) {
        console.log(cfg)
        var materials = new Object() // dictionary for materials
        Object.keys(cfg.fixed).forEach(materialCfgKey => { // create fixed materials
            const materialCfg = cfg.fixed[materialCfgKey];
            const material = this.createMaterial(materialCfg)
            materials[materialCfgKey] = material
        })
        Object.keys(cfg.configurable).forEach(materialCfgKey => { // create toggleable materials
            const materialCfg = cfg.configurable[materialCfgKey];
            const material = this.createMaterial(materialCfg)
            materials[materialCfgKey] = material
            // TODO: add to toolbar
            var rgbStr = material.color.getStyle() // rgb(x, y, z)
            if (material.transparent) {
                rgbStr = rgbStr
                    .replace(")", "," + material.opacity + ")")
                    .replace("rgb", "rgba")
            }
            toolbar.addColorPicker(material, materialCfg.displayName, rgbStr)
        })
        return materials
    }

    static createMaterial(cfg) { // takes json cfg specifying material properties and returns material
        const colorStr = "rgb(" + [cfg.r, cfg.g, cfg.b].join(", ") + ")"
        var material = new THREE.MeshStandardMaterial({
            flatShading: true,
            color: new THREE.Color(colorStr),
            metalness: cfg.metalness,
            roughness: cfg.roughness,
            transparent: cfg.alpha ? true : false,
            opacity: cfg.alpha ? cfg.alpha : 1
            // side: THREE.DoubleSide
        })
        return material
   }
}