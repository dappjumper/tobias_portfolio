<template>
  <div>
    <article>
      <p>You must be logged in to use this feature</p>
    </article>
    <article class="toolbar">
      <button v-on:click="finchNest.env.page = 'My account'">
        <i class="fa fa-sign-in"></i>
        <span>Log in or register</span>
      </button>
    </article>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {

    }
  },
  methods: {
    
  },
  mounted: function(){
  }
}
</script>

<style>



</style>

<style scoped>

</style>