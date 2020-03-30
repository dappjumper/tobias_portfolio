<template>
  <div class="types" :class="{inactive:inactive}">
    <bot-type v-on:type_chosen="saveType" :type="bot.type" :index="index" :data="type" v-for="(type, index) in types"></bot-type>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      error: "",
      inactive: false,
      types: [
      {
        slug: "none",
        title: "No type",
        icon: "snooze"
      },
      {
        slug: "janitor",
        title: "Automoderator",
        icon: "broom"
      }
      ]
    }
  },
  methods: {
    trySaving: function(type){
      return new Promise((resolve,reject)=>{
        let user = JSON.parse(finchNest.load('user'))
        let bot = this.bot._id;
        axios.post('/api/user/'+user.id+'/saveFieldOnBot',{id:this.bot._id, field: "type", value: type.slug},{headers: { Authorization: `Bearer ${user.token}` }}).then((result)=>{
          this.bot.type = type;
          if(result.data.error) reject(result.data.error);
          resolve(result.data)
        }).catch(()=>{
          reject("Request failed");
        })
      })
    },
    saveType: function(type) {
      this.inactive = true;
      this.trySaving(type)
      .then((result)=>{
        this.bot.type = result.value;
        this.inactive = false;
      })
      .catch((error)=>{ 
        this.error = error;
        this.inactive = false;
      })
    }
  },
  props: ["bot"],
  components: {
    'bot-type': window.httpVueLoader('/components/elements/bot-type.vue')
  },
  mounted: function(){

  }
}
</script>

<style>



</style>

<style scoped>
.inactive {
  pointer-events: none;
  opacity:0.8;
}
</style>