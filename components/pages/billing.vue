<template>
  <div class="page">
    <div v-if="ready" class="content">
      <article v-if="loggedIn">
        {{user.email}}
      </article>
      <app-wall v-if="!loggedIn"></app-wall>
    </div>
    <app-loader v-if="!ready"></app-loader>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      env: window.finchNest.env,
      ready: false,
      loggedIn: false,
      user: false
    }
  },
  components: {
    'app-loader': window.httpVueLoader('/components/elements/app-loader.vue'),
    'app-wall': window.httpVueLoader('/components/elements/app-wall.vue')
  },
  created: function(){
  },
  props: ["module"],
  mounted: function(){
    finchNest.pages[this.module] = this;
    this.env = finchNest.env;
    this.user = JSON.parse(finchNest.load('user'));
    this.loggedIn = (this.user ? true : false);
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