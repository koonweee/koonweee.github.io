// set defaults for jscolor pickers
jscolor.presets.default = {
    width: 200,               // make the picker a little narrower
    position: 'right',        // position it to the right of the target
    previewPosition: 'right', // display color preview on the right
    previewSize: 10,          // make the color preview bigger
    previewPadding: 0,
    padding: 5,
    palette: [
        '#000000', '#7d7d7d', '#870014', '#ec1c23', '#ff7e26',
        '#fef100', '#22b14b', '#00a1e7', '#3f47cc', '#a349a4',
        '#ffffff', '#c3c3c3', '#b87957', '#feaec9', '#ffc80d',
        '#eee3af', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
    ],
    format:"rgba",
    forceStyle: false,
    borderRadius: 2
};

// shows drop down menus on mouseover
$(document).on({
    mouseenter: function () {
        $(this).find("div.dropdown-content").css("display", "block");
    },
    mouseleave: function () {
        $(this).find("div.dropdown-content").css("display", "none");
    }
}, "li.dropdown");

$(document).on({
    mouseenter: function () {
        $("#colorDrop").css("display", "block");
    },
    mouseleave: function () { 
        $("#colorDrop").css("display", "none");    
    }
}, "div.jscolor-picker");


class Toolbar {
    static addAssemblies(assemblies) {
        Object.keys(assemblies).forEach(assemblyName => {
            this.createDropdownElement("modelDrop", assemblyName, () => {
                modelView.unloadAssemblies()
                modelView.loadAssembly(assemblies[assemblyName].assembly, assemblies[assemblyName].materials)
            })
        })
    }

    static addAboutButton() {
        document.getElementById("aboutBtn").onclick = () => {
            document.getElementById("overlay").style.display = "block"
            document.getElementById("overlayBg").style.display = "block"
        }
        document.getElementById("overlayBg").onclick = () => {
            document.getElementById("overlay").style.display = "none"
            document.getElementById("overlayBg").style.display = "none"
        }
    }
    //Tool bar has cameraDrop, toggleDrop and colorDrop div's, to be populated with dropdown <a>option name</a>
    static addOrbitToggle() { //registers onclick listener to call appropriate function
        document.getElementById("orbitToggle").onclick = () => modelView.toggleOrbit()
    }

    static addDeskToggle(desk) {
        this.createDropdownElement("toggleDrop", "Desk", () => desk.visible = !desk.visible)
    } 

    static createDropdownElement(dropdown, text, fn) {
        const drop = document.getElementById(dropdown)
        var a = document.createElement("a")
        if (text) {
            var text = document.createTextNode(text)
            a.appendChild(text)
        }        
        if (fn) {
            a.onclick = fn
        }        
        drop.appendChild(a)
        return a;
    }
    static xeoglToRGBA(material) {
        var color
        var alpha
        if (material instanceof xeogl.MetallicMaterial) {
           color = material.baseColor
           alpha = 1
        } else {
            color = material.diffuse
            alpha = material.alphaMode == "blend" ? material.alpha : 1
        }
        color = new Array(color.map(x => Math.round(x*255)))
        color.push(alpha)
        const RGBA = "rgba(" + color.join(",") + ")"
        return RGBA
    }
    static RGBAtoXeogl(RGBA) {
        RGBA = RGBA.replace("rgba(","").replace(")","").split(",")
        return [RGBA[0]/255, RGBA[1]/255, RGBA[2]/255, RGBA[3]]
    }
    static updateMaterialColor(rgbaStr, material) {
        var rgba = this.RGBAtoXeogl(rgbaStr)
        const alpha = rgba.pop()
        if (material instanceof xeogl.MetallicMaterial) {
            material.baseColor = rgba
            material.alpha = alpha
        } else {
            material.specular = rgba
            material.diffuse = rgba
            material.alpha = alpha
        }
    }

    // manages toolbar entities that are specific to an assembly, allow for cleaner load and unload
    constructor() {
        this.toggles = new Object()
        this.colorPickers = [] 
    }

    addToggleOption(name, model) { //registers onclick listener to call appropriate function
        if (this.toggles[name]) { // toggle with this name already exists, add more models for this toggle to change
            this.toggles[name].models.push(model)
        } else { // this toggle does not exists, create toggle and array of models to toggle (currently just one model)
            this.toggles[name] = new Object()
            this.toggles[name].models = [model]
            this.toggles[name].ele = Toolbar.createDropdownElement("toggleDrop", name, () => {
                for (var target of this.toggles[name].models) {
                    target.visible = !target.visible
                }
            })
        }
    }
    unloadToggles() {
        Object.values(this.toggles).forEach(toggle => {
            toggle.ele.removeAttribute("onclick")
            toggle.ele.remove()
        })
    }
    addColorPicker(name, material, presets) { //registers onclick listener to call appropriate function
        // create dropdown element and picker
        var ele = Toolbar.createDropdownElement("colorDrop", name)
        var colorBox = document.createElement("div")
        colorBox.id = "colorBox_" + name
        ele.appendChild(colorBox)
        ele.appendChild(document.createElement("br"))
        var colorInput = document.createElement("input")
        colorInput.type = "text"
        colorInput.setAttribute("size", "15")
        ele.appendChild(colorInput)
        var picker = new JSColor(ele, {
            previewElement: colorBox,
            valueElement: colorInput,
            onInput: () =>  {
                Toolbar.updateMaterialColor(picker.toRGBAString(), material)
            }
        })
        picker.fromString(Toolbar.xeoglToRGBA(material))

        // create event listeners: mouseover dropdown = show picker, mouseleave picker = hide picker
        const showPicker = () => picker.show()
        ele.addEventListener("mouseover", showPicker)
        this.colorPickers.push([ele, showPicker])
    }
    unloadColorPickers() {
        for (var colorPicker of this.colorPickers) {
            colorPicker[0].removeEventListener("mouseover", colorPicker[1])
            colorPicker[0].remove()
        }
    }
}