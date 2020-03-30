<template>
  <div class="page">
    <div v-if="ready" class="content">
      <article>Content ready</article>
    </div>
    <app-loader v-if="!ready"></app-loader>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      env: window.finchNest.env,
      ready: false
    }
  },
  components: {
    'app-loader': window.httpVueLoader('/components/elements/app-loader.vue')
  },
  created: function(){
  },
  props: ["module"],
  mounted: function(){
    finchNest.pages[this.module] = this;
    this.env = finchNest.env;  
    this.ready = true;
  },
  methods: {
    
  }
  
}
</script>

<style>
main {

}
</style>