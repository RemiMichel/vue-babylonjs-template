<template>
  <div>
    <button v-on:click="play('2be1')">start/stop (2be1)</button>
    <button v-on:click="play('2be2')">start/stop (2be2)</button>
    <button v-on:click="play('2be3')">start/stop (2be3)</button>
    <canvas ref="bjsCanvas"/>
  </div>
</template>

<script>

import SceneManager from '../mixins/sceneManager.js'

export default {
  name: "Viewport",
  mixins: [SceneManager],
  methods: {
    play(animation){
        let animation_group = this.animation_list.get(animation)[0];
        if(animation_group.isPlaying){
          animation_group.pause()
        }else{
          animation_group.play(true)
        }
    }
  },
  created() {
    console.log('created')
  },
  mounted() {
    console.log('mounted');

    this.create_scene(this.$refs.bjsCanvas);
    this.create_cameras();
    this.create_lights();
    this.create_grounds();
    this.load_assets();
    this.show_world_axis(1);
    this.render_scene();

  }
}
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>