// requires: Xeogl.js, STLModel.js, cameraFollowAnimation.js, CombinedModel loaded in html

// const declarations for commonly used
const TEXTURES = "../textures"
const MODELS = "../models"

// // setup scene for viewer
// var scene = new xeogl.Scene({
//     canvas: "myCanvas",
//     transparent: false
// });

// xeogl.setDefaultScene(scene)

// define materials
var base3dp = new xeogl.SpecularMaterial({
    diffuse: [0.1, 0.1, 0.8], // all 3dp base will be blue
    specular: [0.1, 0.1, 0.8],
    glossiness: 0.2
})
var baseMetal = new xeogl.MetallicMaterial({
    baseColor: [0.8, 0.1, 0.1], // all base metal will be red
    roughness: 0.75
});
var groundGrid = new xeogl.SpecularMaterial({
    diffuse: [0.2, 0.2, 0.2],
    specular: [0.1, 0.1, 0.1],
    diffuseMap: new xeogl.Texture({
        src: TEXTURES + "diffuse/UVCheckerMap11-1024.png",
        scale: [-5.0, 5.0]
    }),
    glossiness: 0.2
})
var scene = xeogl.getDefaultScene()

// setup base camera
var camera = scene.camera
camera.projection = "ortho" // ortho graphic projection
camera.worldAxis = [ // set +Z axis as up
1, 0, 0, // Right
0, 0, 1, // Up
0, 1, 0  // Forward
]
camera.up = [0, 0, 1]; // +Z is up
camera.look = [0, 0, 0]; // focal point
camera.eye = [-5, -10, 1]; // looking at focal point from (~8 deg up, 50deg from left)
camera.gimbalLock = true // locks rotation in horizontal direction to be around Z axis 
var cameraFlight = new xeogl.CameraFlightAnimation() // used for flying around
var cameraControl = new xeogl.CameraControl() // enable user camera control
cameraControl.intertia = 0.2

// load model configs from JSON
$.getJSON("../models/load.json", function(json) {
    console.log(json); // this will show the info it in firebug console
});


