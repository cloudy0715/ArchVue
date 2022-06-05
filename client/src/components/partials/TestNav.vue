<template>
  <div class="page-wrapper chiller-theme toggled">
    <!-- <nav class="row navbar">
     
      <div class="logo">
        <span class="logo1">Temp</span>
        <span class="logo2">Logo</span>
      </div>
      <b-button class="hamburger" @click="menuOpen = !menuOpen">
        <b-icon icon="grid3x3-gap-fill"></b-icon>
      </b-button>
    </nav> -->
    <!-- <div class="row" :class="{ 'dropdown-after': menuOpen }">
      <a v-b-toggle="'collapse-1'" class="mb-1">Dashboard</a>
      <b-collapse id="collapse-1">
        <b-list-group>
          <b-list-group-item href="#"></b-list-group-item>
          <b-list-group-item href="#">Link with active state</b-list-group-item>
          <b-list-group-item href="#">Action links are easy</b-list-group-item>
        </b-list-group>
      </b-collapse> -->
    <!-- <ul class="navlist">
        <li class="navlistitem">
          <a href="#">home</a>
        </li>
        <li class="navlistitem">
          <a href="#">about</a>
        </li>
        <li class="navlistitem">
          <a href="#">contact</a>
        </li>
      </ul> -->
    <!-- </div> -->

    <nav id="sidebar" class="sidebar-wrapper">
      <div class="sidebar-content">
        <div class="sidebar-brand">
          <a href="#">ClouDay1</a>
          <!-- <div id="close-sidebar">
              <i class="bi bi-chevron-double-left"></i>
            </div> -->
          <b-button class="hamburger" @click="menuOpen = !menuOpen">
            <b-icon icon="grid3x3-gap-fill"></b-icon>
          </b-button>
        </div>
        <div class="sidebar-menu">
          <ul>
            <li class="sidebar-dropdown">
              <a href="#">
                <i class="fa fa-tachometer-alt mx-1"></i>
                <span>Dashboard</span>
                <!-- <span class="badge badge-pill badge-warning">New</span> -->
              </a>
              <div class="sidebar-submenu">
                <ul>
                  <li>
                    <a href="#"
                      >Support Services
                      <!-- <span class="badge badge-pill badge-success">Pro</span> -->
                    </a>
                  </li>
                  <li>
                    <a href="#">FAQ</a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="sidebar-dropdown">
              <a href="#">
                <i class="fa fa-coins mx-1"></i>
                <span>Billing</span>
                <!-- <span class="badge badge-pill badge-danger">3</span> -->
              </a>
              <div class="sidebar-submenu">
                <ul>
                  <li>
                    <a href="#">Products </a>
                  </li>
                  <li>
                    <a href="#">Orders</a>
                  </li>
                  <li>
                    <a href="#">Credit cart</a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="sidebar-dropdown">
              <a href="#">
                <i class="fa fa-globe mx-1"></i>
                <span>Automation</span>
              </a>
              <div class="sidebar-submenu">
                <ul>
                  <li>
                    <a href="#">General</a>
                  </li>
                  <li>
                    <a href="#">Panels</a>
                  </li>
                  <li>
                    <a href="#">Tables</a>
                  </li>
                  <li>
                    <a href="#">Icons</a>
                  </li>
                  <li>
                    <a href="#">Forms</a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="sidebar-dropdown" :class="active" @click="toggleSubmenu">
              <a href="#">
                <i class="fa fa-object-group mx-1"></i>
                <span>Architecture</span>
              </a>
              <div class="sidebar-submenu" :class="active">
                <ul>
                  <li class="" @click.stop="child">
                    <router-link to="/about" class="navbar-item" :class="active">
                      <img
                        src="https://img.icons8.com/color/28/000000/amazon-web-services.png"
                      />
                      AWS
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/about" class="navbar-item">
                      <img
                        src="https://img.icons8.com/color/28/000000/azure-1.png"
                      />
                      Azure
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/about" class="navbar-item">
                      <img
                        src="https://img.icons8.com/color/28/000000/google-cloud.png"
                      />
                      GCP
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <!-- sidebar-menu  -->
      </div>
      <!-- sidebar-content  -->
      <div class="sidebar-footer">
        <a href="#">
          <i class="fa fa-bell"></i>
          <span class="badge badge-pill badge-warning notification">3</span>
        </a>
        <a href="#">
          <i class="fa fa-envelope"></i>
          <span class="badge badge-pill badge-success notification">7</span>
        </a>
        <a href="#">
          <i class="fa fa-cog"></i>
          <span class="badge-sonar"></span>
        </a>
        <!-- <a href="#">
            <i class="fa fa-power-off"></i>
          </a> -->
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  name: "Nav",
  data() {
    return {
      menuOpen: false,
      active: "active",
    };
  },
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
    toggleSubmenu() {
      if (this.active.includes("active")) {
        this.active = "";
      } else {
        this.active = "active";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-wrapper {
  position: absolute;
  left: 0;
  margin: 0;
  width: 230px;
  //   background: darkcyan;
  background: #2794a5;
  height: 100%;
  .sidebar-wrapper {
    overflow-y: scroll;

    height: 100%;
  }
}

.sidebar-brand {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  a {
    font-size: 20px;
    text-decoration: none;
  }
}

.navbar {
  //   background: darkcyan;

  //   height: 100%;
  padding: 12px 8px;
  display: flex;
  //   flex-direction: column;
}

a.navbar-item:focus,
a.navbar-item:focus-within,
a.navbar-item:hover,
a.navbar-item.is-active,
.navbar-link:focus,
.navbar-link:focus-within,
.navbar-link:hover
 {
  background: transparent;
  color: #ffffff;
}

.dropdown {
  //   margin-top: -20px;
  height: 0px;
  background-color: lightgreen;
  transition: height 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.dropdown-after {
  height: 100%;
  transition: height 0.2s ease;
}

.navlist {
  list-style: none;
}

.navlistitem {
  text-transform: uppercase;
  text-align: center;
  padding: 20px;
}

.navlistitem a {
  color: #ffffff;
}
</style>