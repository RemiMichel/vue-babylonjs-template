<template>
  <div class="home">
    <MyScene/>
  </div>
</template>

<script>
// @ is an alias to /src
import MyScene from '@/components/MyScene.vue'

export default {
  name: 'Home',
  components: {
    MyScene
  }
}
</script>
