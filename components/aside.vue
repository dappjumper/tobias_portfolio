<template>
  <transition name="aside">
  	<aside v-if="!env.closed && show" v-bind:class="{minimized:mini=='yes'}">
  		<ul>
  			<menu-item title="Dashboard" slug="dashboard" icon="tachometer"></menu-item>
  			<menu-item title="My bots" slug="bots" icon="robot"></menu-item>
  			<menu-item title="My account" slug="account" icon="user"></menu-item>
  			<menu-item userOnly="true" title="Billing" slug="billing" icon="file-invoice"></menu-item>
  		</ul>
  		<div v-bind:class="{minimizer:true}" v-on:mousedown="minimize">
  			<i v-bind:class="{['fas fa-'+(mini == 'yes' ? 'chevron-right' : 'chevron-left')]:true}"></i>
  		</div>
  	</aside>
  </transition>
</template>

<script>
module.exports = {
  data: function () {
    return {
      env: window.finchNest.env,
      show: false,
      mini: localStorage.getItem('aside_minimized')
    }
  },
  components: {
  	'menu-item': window.httpVueLoader('/components/elements/menu-item.vue')
  },
  methods: {
  	minimize: function(){
  		this.mini = (this.mini == "yes" ? 'no' : 'yes')
  		finchNest.header._data.mini = this.mini;
      finchNest.env.minimized = this.mini;
  		localStorage.setItem('aside_minimized', this.mini);
  	}
  },
  mounted: function(){
    let user = JSON.parse(finchNest.load('user'))
    if(user) {
      this.show = true;
    }
  	finchNest.aside = this;
    finchNest.env.minimized = this.mini;
  }
}
</script>

<style>
aside {
	background:rgba(250,250,250,0.9);
}

aside .minimizer {
	background:none;
}

@media (orientation:landscape) {
  aside.minimized,aside.minimized ul {
  	max-width:64px;
    display:block;
  }
  
  aside ul {
    box-shadow: 0px -64px 0px #0f2027;
  }
}
</style>