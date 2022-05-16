<template>
    <sidebar-menu
      class="sidebar"
      :menu="menu"
      :collapsed="collapsed"
      @item-click="onItemClick"
      @collapse="onCollapse"
    />
</template>
<script>

export default {
  data() {
    return {
      menu: [
        {
          header: true,
          title: "Getting Started",
        },
        {
          href: "/",
          title: "home",
          icon: "fa fa-download",
        },
        {
          href: "/about",
          title: "about",
          icon: "fa fa-code",
        },
        {
          title: "Dropdown Page",
          icon: "fa fa-list-ul",
          child: [
            {
              href: "/arch/AWS",
              title: "AWS",
              icon: "fa fa-file-alt",
            },
            {
              href: "/page/sub-page-2",
              title: "Azure",
              icon: "fa fa-file-alt",
            },
            {
              href: "/page/sub-page-2",
              title: "GCP",
              icon: "fa fa-file-alt",
            },
          ],
        },
      ],
      collapsed: false,
    };
  },
  methods: {
    onItemClick(e, i) {
      console.log("onItemClick");
    },
    onCollapse(c) {
      console.log("onCollapse");
      this.collapsed = c;
    },
  },
}
</script>

<style>
.sidebar.v-sidebar-menu .vsm-arrow:after {
  content: "\f105";
  font-family: "FontAwesome";
}
.sidebar.v-sidebar-menu .collapse-btn:after {
  content: "\f07e";
  font-family: "FontAwesome";
}
</style>