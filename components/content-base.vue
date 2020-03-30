<template>

</template>

<script>
module.exports = {
  data: function () {
    return {
      env: window.finchNest.env,
      mini: false
    }
  },
  props: ["module"],
  created: function(){
  },
  mounted: function(){
  },
  methods: {
    isActive: function(){
      return finchNest.env.page == this.slug || finchNest.env.page == this.title 
    }
	}
  
}
</script>

<style>
main {

}
</style>