let PG = window.PG || {};
PG.babylonRenderer = {
    init: function () {
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, true);

        this.scene = this.createScene();
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    },

    createScene: function () {
        scene = new BABYLON.Scene(this.engine);
        scene.clearColor = new BABYLON.Color3(1, 0.8, 0.8);
        scene.ambientColor = new BABYLON.Color3(.3, .7, .6);
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.01;
        scene.fogColor = new BABYLON.Color3(.9, .9, .85);

        let camera = new BABYLON.ArcRotateCamera("Camera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
        scene.activeCamera.attachControl(this.cavnas);

        let myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
        myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
        myMaterial.specularColor = new BABYLON.Color3(.5, .6, .87);
        myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        myMaterial.ambientColor = new BABYLON.Color3(.23, .98, .53);

        let light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 0, 10), scene);
        for(let i = 0; i < 1; i++){
            let box = BABYLON.Mesh.CreateBox("box", 3.0, scene);
            //box.scaling = new BABYLON.Vector3(4, 10, 8);
            box.position = new BABYLON.Vector3(i * 5, 0, 0);
            box.material = myMaterial;
        }

        return scene;
    }
}

PG.babylonRenderer.init();