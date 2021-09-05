<template>
  <Scene>
    <Box :position="[0, 0, 5]"></Box>
  </Scene>
</template>

<script>
import { Scene, Box, BABYLON,  } from 'vue-babylonjs';
export default {
  name: "MyScene",
  components: { Scene, Box },
}
</script>

<style scoped>

</style>