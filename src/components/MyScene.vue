<template>
  <canvas ref="bjsCanvas"/>
</template>

<script>
import {BABYLON} from 'vue-babylonjs';

export default {
  name: "MyScene",
  components: {},
  data() {
    return {
      myScene: null,
      myEngine: null,
      myBox: null,
    };
  },
  methods: {
    load_meshes() {
      BABYLON.SceneLoader.ImportMesh(
          "",
          'assets/',
          "dummy3.babylon",
          this.myScene,
          function (meshes, particleSystems, skeletons) {
            var dude = meshes[0];
          });
    },
    create_scene() {
      var canvas = this.$refs.bjsCanvas;
      this.myEngine = new BABYLON.Engine(canvas);
      this.myScene = new BABYLON.Scene(this.myEngine);

      // const camera = new FreeCamera("camera1", new Vector3(0, 5, -5), this.myScene);
      const camera = new BABYLON.ArcRotateCamera("camera1", 5, 5, 5, BABYLON.Vector3.Zero(), this.myScene);
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, true);

      new BABYLON.HemisphericLight("light", BABYLON.Vector3.Up(), this.myScene);

      var sceneBro = this.myScene;
      this.myEngine.runRenderLoop(() => {
        sceneBro.render();
      });
    }
  },
  created() {
    console.log('created')
  },
  mounted() {
    console.log('mounted');
    this.create_scene();
    this.load_meshes();
  },
  watch: {
    myScene() {
      console.log("this.myScene changed");
    }
  }
}
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>