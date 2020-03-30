<template>
	<transition name="header">
		<header v-if="!env.closed && show">
			<div class="logo" v-bind:class="{mini:(mini == 'yes' ? true : false)}" v-on:click="logoClick">
				<i class="fas fa-crow"></i>
				<span>Project Finch</span>
			</div>
			<div v-bind:class="{mini:(mini == 'yes' ? true : false)}" class="pageTitle">
        <span v-bind:class="{root:(tab)}" v-if="env.page">{{env.page}}</span>
        <span v-if="tab">{{tab}}</span>
			</div>
			<div class="exit" v-on:click="closeApp"><i class="fal fa-times"></i></div>
		</header>
	</transition>
</template>

<script>
module.exports = {
  data: function () {
    return {
      env: window.finchNest.env,
      user: {},
      tab: "",
      show: false,
      mini: false
    }
  },
  mounted: function(){
    finchNest.header = this;
    if(JSON.parse(finchNest.load('user'))) this.show = true;
  },
  methods: {
		logoClick: function(){

		},
		closeApp: function(){
      this.env.closed = (this.env.closed ? false : true);
    }
	}
  
}
</script>

<style>
  .logo.mini {
    max-width:64px!important;
  }
  .pageTitle.mini {
    left:64px!important;
  }
  header .root {
    opacity:0.8;
  }
  header .root:after {
    content:" | ";
    margin:0 16px;
  }
</style>