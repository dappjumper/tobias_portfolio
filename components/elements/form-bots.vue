<template>
  <form v-on:submit="submit($event)">
    <h2><i v-bind:class="{['fa fa-'+icon]:(typeof icon == 'string')}"></i>{{(mode == 'new' ? 'Add bot' : 'Add existing bot')}}</h2>
    <transition name="dash">
      <input-group autofocus="true" type="apikey" name="apikey" label="Please paste the API key from <a target='_blank' href='https://t.me/botfather'>@botfather</a>"/></input-group>
    </transition>
    <transition name="dash">
      <input-group v-if="mode != 'new'" icon="plus" type="submit" label="Add"></input-group>
    </transition>
    <transition name="dash">
      <input-group v-if="mode == 'new'" iconfull="fa fa-plus" type="submit" label="Add"></input-group>
    </transition>
  </form>
</template>

<script>
module.exports = {
  data: function () {
    return {
      state: "initial",
      mode: "new",
      inputs: []
    }
  },
  created: function(){
  },
  props: ["target","mode","icon","small"],
  components: {
    'input-group': window.httpVueLoader('/components/elements/input-group.vue'),
    'menu-item': window.httpVueLoader('/components/elements/menu-item.vue')
  },
  mounted: function(){
    
  },
  methods: {
    resetState: function(component){
      
    },
    checkUser: function(input_group){
      
    },
    setLoading: function(unset){
      for(let k in this.$children) {
          this.$children[k].loading = (unset ? false : true);
        }
    },
    submit: function(event){
        event.preventDefault();
        if(!this.$children[0].data) return this.$children[0].error = "Field can't be blank"
        this.setLoading();
        let apikey = this.$children[0].data;
        let user = JSON.parse(finchNest.load('user'))
        console.log(this.target+'/'+user.id+'/createBot')
        new Promise((resolve, reject)=>{
          axios.post(this.target+'/'+user.id+'/createBot',{apikey:apikey},{headers: { Authorization: `Bearer ${user.token}` }}).then((userData)=>{
            if(userData.data.error) reject(userData.data.error);
            resolve(userData.data)
          }).catch(()=>{
            reject("Request failed");
          })
        }).then((result)=>{
          this.setLoading(true)
          this.$emit('bot_created',result)
        }).catch((error)=>{
          this.setLoading(true);
          this.$children[0].error = error
        })
    }
	}
  
}
</script>

<style scoped>
  h2 {
    display:relative;
  }

  h2 i {
    opacity:0.8;
    width:48px;
    text-align:left;
    display:inline-block;
  }
</style>