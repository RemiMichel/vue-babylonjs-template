<template>
  <div id="app">
    <TopNavBar/>
    <router-view/>
  </div>
</template>

<script>
import TopNavBar from '@/components/TopNavBar.vue'
export default {
  name: 'App',
  components: {
    TopNavBar
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
