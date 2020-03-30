<template>
  <li menu-button v-on:mousedown="click" class="menu-button" v-bind:class="{active:isActive(), disabled:disabled}">
    <span>{{title}}</span>
    <i v-bind:class="{['fas fa-'+icon]:true}"></i>
  </li>
</template>

<script>
module.exports = {
  data: function () {
    return {
      env: finchNest.env,
      active: false,
      disabled: false
    }
  },
  props: ["title","icon","slug","userOnly"],
  methods: {
    isActive: function(){
      return finchNest.env.page == this.slug || finchNest.env.page == this.title 
    },
    click: function(){
      if(!this.disabled && !this.active) {
        finchNest.env.page = this.title;
        finchNest.header.tab = "";
        finchNest.save('page',this.title)
      }
    }
  },
  mounted: function(){
  }
}
</script>

<style>
  form button[type="submit"] {
    text-transform: capitalize;
  }
</style>

<style scoped>
[menu-button] {
  display:block;
  max-width:100%;
}

.minimized [menu-button] {
  max-width:64px;
}

@media (orientation:portrait) {
  [menu-button] {
    max-width:25%!important;
    width:25%!important;
  }
}
</style>