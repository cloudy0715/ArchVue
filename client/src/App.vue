<template>
  <div id="app">
    <!-- <div class="d-flex"> -->
      <!-- <div class="navbar"> -->
        <div class="navbar-nav">
    <Nav />
    </div>
      <!-- </div> -->
    <div class="router-view">
    <router-view/>
    </div>
    <!-- </div> -->
    
    <!-- <div id="view" :class="[{'collapsed' : collapsed}]">
      <router-view/>
    </div>
    <sidebar-menu
      class="sidebar"
      :menu="menu"
      :collapsed="collapsed"
      hideToggle
      @item-click="onItemClick"
      @collapse="onCollapse"
    /> -->
  </div>
</template>
<script>
import Nav from './components/partials/TestNav.vue';
// import Nav from './components/partials/Nav.vue';


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


.router-view {
  height: 100%;
  margin-left: 230px;
  padding: 0 12px;
  max-width: 100%;
}

.navbar-nav {
  height: 100%;
}

</style>