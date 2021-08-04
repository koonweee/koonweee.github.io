class ModelViewer {
    constructor(canvasEle) {
        this.initiateRenderer(canvasEle) 
        this.initiateCamera()
        window.addEventListener('resize', () => this.onWindowResize(), false); // handles window resizing, updating both render canvas size and camera projection
        this.initiateControls()
        this.initiateScene()
        //this.initiateSky()
        this.initiateSpotlight()
        this.loading = false
        this.assemblies = []

        this.basePlastic = new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            metalness: 0.5
        });
                
        const render = () => {
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    initiateRenderer(canvasEle) {
        this.canvas = canvasEle
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding; // for gltf
    }

    initiateCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
        this.camera.position.set(0, 170, 800)
        this.camera.lookAt(new THREE.Vector3(0,170,0)); 
        
    }  

    initiateControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.controls.target = new THREE.Vector3(0,170,0)
        this.controls.maxDistance = 1600
        this.controls.update()
    }

    initiateScene() {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color('grey')
        const axesHelper = new THREE.AxesHelper(50);
        this.scene.add(axesHelper)
    }    

    initiateSky() {
        const skyColor = 0xFF0000;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 0.1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        this.scene.add(light);
    }

    initiateSpotlight() {
        const light = new THREE.PointLight( 0xffffff, 0.5);
        light.position.set(0, 1500, 200)
        this.scene.add( light )

        const frontDirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        frontDirLight.position.set( 0, 200, 400 );
        const leftDirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        leftDirLight.position.set( -400, 120, 0 );
        const rightDirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        rightDirLight.position.set( 400, 120, 0 );
        const rearDirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        rearDirLight.position.set( 0, 170, -400 );
        this.scene.add(frontDirLight, leftDirLight, rightDirLight, rearDirLight);
        
    }

    loadAssembly(assemblySrc, materialsSrc) {
        var promises = [assemblySrc, materialsSrc].map(src => fetch(src).then(resp => resp.json()))
        // wait for both assembly json and materials json to be fetched
        Promise.allSettled(promises).then( fulfilled => {
            console.log(fulfilled[0])
            var assembly = Assembly.parse(fulfilled[0].value, fulfilled[1].value) // pass assembly and material cfg objects to relevant parsers
            this.assemblies.push(assembly)                
        })
    }

    static modifyMaterial(material, rgb, metalness) {
        if (rgb) {
            const rgbText = "rgb(" + rgb.join(", ") + ")"
            material.color = new THREE.Color(0xFFFFFF)
        }
        if (metalness) {
            material.metalness = 0
        }
    }
}