// shows drop down menus on mouseover
$(document).on({
    mouseenter: function () {
        $(this).find("div.dropdown-content").css("display", "block");
    },
    mouseleave: function () {
        $(this).find("div.dropdown-content").css("display", "none");
    }
}, "li.dropdown");

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

    static guidGenerator() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    // manages toolbar entities that are specific to an assembly, allow for cleaner load and unload
    constructor() {
        this.toggles = []
        this.colorPickers = [] 
    }

    addModelToggle(model, displayText) {
        this.toggles.push(Toolbar.createDropdownElement("toggleDrop", displayText, () => {
            model.visible = !model.visible
        }))
    }

    addColorPicker(material, displayText, initialColor) {
        const id = "#colorPicker_" + Toolbar.guidGenerator()
        var dropdownEle = Toolbar.createDropdownElement("colorDrop", displayText)
        var colorpicker = document.createElement("input")
        colorpicker.id = id.replace("#","")
        dropdownEle.appendChild(colorpicker)
        const jqueryEle = $(id)
        jqueryEle.spectrum({
            type: "color",
            hideAfterPaletteSelect: true,
            showInput: true,
            showInitial: true,
            allowEmpty: false,
            move: colorMap =>  {
                if (colorMap._a != 1) {
                    material.opacity = colorMap._a
                }
                material.color.setStyle(                    
                    "rgb(" + [
                        Math.round(colorMap._r), 
                        Math.round(colorMap._g), 
                        Math.round(colorMap._b)
                    ].join(",") + ")"                    
                ) 
            }
        })
        jqueryEle.spectrum("set", initialColor)
        this.colorPickers.push(dropdownEle)
    }

}