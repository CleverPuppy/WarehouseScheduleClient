<template>
  <div id="app">
    <Index/>
  </div>
</template>

<script>
import SetupWarehouse from './components/SetupWarehouse.vue';
import Index from './components/index';

export default {
  name: 'app',
  components: {
    SetupWarehouse,
    Index
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
