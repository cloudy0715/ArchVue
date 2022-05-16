<template>
  <div id="app">
    <Nav />
    <router-view/>
  </div>
</template>
<script>
import Nav from './components/partials/Nav.vue';
export default {
  name: 'app',
  components: {
    Nav
  }  
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

@media (min-width: 992px) {
  .modal-lg,
  .modal-xl {
    // margin: 0 auto;
    max-width: 98% !important;
  }
}

.modal-dialog {
  margin: 10px auto !important;
}
</style>