<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
</template>

<script>

export default {
  name: "TopNavBar",
  data() {
    return {
    };
  },
  methods: {
  },
  created() {
    // console.log('created')
  },
  mounted() {
    // console.log('mounted');
  }
}
</script>

<style scoped lang="less">
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>