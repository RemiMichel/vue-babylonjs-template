<template>
  <div class="home">
    <Viewport/>
  </div>
</template>

<script>
// @ is an alias to /src
import Viewport from '@/components/Viewport.vue'

export default {
  name: 'Home',
  components: {
    Viewport
  }
}
</script>


<style scoped>
.home {
  margin: 0 30%;
  width: 50%;
  /*height: 100%;*/
}
</style>