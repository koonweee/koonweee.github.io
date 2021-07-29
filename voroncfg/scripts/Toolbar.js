// set defaults for jscolor pickers
jscolor.presets.default = {
    width: 200,               // make the picker a little narrower
    position: 'bottom',        // position it to the right of the target
    previewPosition: 'right', // display color preview on the right
    previewSize: 50,          // make the color preview bigger
    previewPadding: 0,
    shadow: false,
    padding: 5,
    palette: [
        '#000000', '#7d7d7d', '#870014', '#ec1c23', '#ff7e26',
        '#fef100', '#22b14b', '#00a1e7', '#3f47cc', '#a349a4',
        '#ffffff', '#c3c3c3', '#b87957', '#feaec9', '#ffc80d',
        '#eee3af', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
    ],
    format:"rgb"
};

class Toolbar {
    // Init toggle buttons
    static toggleBtns = [
        ["toggleVoronBtn", "v1logo"], 
        ["toggleClearPanelsBtn", "v1clearpanels"]
    ]
    
    // Init color pickers
    static colorPickers = [
        ["baseColorPicker", ["v1base"]],
        ["accentColorPicker", ["v1accent", "v1logo"]]
    ]

    static setupToggleButtons(document) {
        for (const toggleBtn of Toolbar.toggleBtns) {
            // get element for toggle button
            toggleBtn[0] = document.getElementById(toggleBtn[0])
            // add click event listener to toggle model
            toggleBtn[0].addEventListener('click', () => modelView.toggleModel(toggleBtn[1]), false)
        }
    }

    static setupColorPickers(document) {
        for (const colorPicker of Toolbar.colorPickers) {
            // initialize colorpicker on given element ID, enable listening for input changes to update model color
            const id = colorPicker[0]
            colorPicker[0] = new JSColor(document.getElementById(colorPicker[0]), {
                onInput: () => {
                    modelView.updateModelsColor(colorPicker[1], colorPicker[0].toRGBAString())
                    document.getElementById(id).textContent= //"Base: " + 
                    [colorPicker[0].channel("R"), colorPicker[0].channel("G"), colorPicker[0].channel("b")].map(x => Math.round(x)).join(", ")
                }
            })
            // set initial picker color (also adds initial color to pallette)
            Toolbar.setInitialPickerColor(colorPicker[0], colorPicker[1][0])
        }
    } 

    // set initial picker color (also adds initial color to pallette)
    static setInitialPickerColor(colorPicker, modelKey) {
        var material = modelView.models.relatedModels[modelKey]._material
        var rgb = material.diffuse
        var alpha = material.alpha
        var rgba = new Array(...rgb.map(ele => ele * 255))
        rgba.push(alpha)
        colorPicker.fromRGBA.apply(colorPicker, rgba)
        var palette = colorPicker.palette
        palette[0] = "rgb(" + rgba.join(",") + ")"
        colorPicker.option({
            palette: palette
        })          
    }
}