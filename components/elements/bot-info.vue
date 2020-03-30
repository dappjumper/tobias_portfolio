<template>
  <div class="bot" v-bind:class="{inactive:inactive,noClick:noClick, expanded:expanded}">
    <div class="plaque" v-bind:class="{error:error}">
      <transition name="state">
          <i v-if="!inactive" v-bind:class="{error:error}" class="fas fa-robot"></i>
      </transition>
      <transition name="state">
        <i v-if="inactive" class="fas fa-cog fa-spin"></i>
      </transition>
    </div>
    <div v-on:click="expand" class="information">
      <div class="title">
        {{data.title}}
      </div>
      <div class="subtitle">
          <transition name="swap">
            <span v-if="inactive">
              Loading...
            </span>
          </transition>
          <transition name="swap">
            <span v-bind:class="{error:error}" v-if="!inactive">
              {{error || subtitle}}
            </span>
          </transition>
      </div>
    </div>
    <div class="actions" v-if="!inactive">
      <div class="action danger" v-on:click="remove">
        <i class="fa fa-times"></i>
        <span>Remove</span>
      </div>
    </div>
    <transition name="tab">
      <div class="details" v-if="expanded">
        <div class="group">
          <label>Telegram data</label>
          <div v-if="data.meta.getMe">
            <b>Username: </b><a target="_blank" :href="'https://t.me/'+data.meta.getMe.username">@{{data.meta.getMe.username}}</a>
          </div>
          <div v-if="!data.meta.getMe">
            API Key is invalid, please update
          </div>
        </div>
        <div class="group">
          <label>Bot type</label>
          <bot-types :bot="data"></bot-types>
        </div>
        <div class="group">
          <label>Statistics</label>
          <bot-group :group="group" :bot="data" v-for="group in data.meta.statistics"></bot-group>
          <div v-if="!data.meta.statistics">No data</div>
        </div>
      </div>
    </transition>
  </article>
</template>

<script>
module.exports = {
  data: function () {
    return {
      data: {},
      expanded: false,
      hasDetails: false,
      type: "Loading...",
      inactive: false,
      subtitle: "Telegram Bot",
      noClick: false,
      error: "",
      show: true
    }
  },
  components: {
    'input-group': window.httpVueLoader('/components/elements/input-group.vue'),
    'bot-types': window.httpVueLoader('/components/elements/bot-types.vue'),
    'bot-group': window.httpVueLoader('/components/elements/bot-group.vue')
  },
  methods: {
    expand: function(){
      if(this.expanded) return this.expanded = false;
      let time = (new Date().getTime() - this.hasDetails);
      let minutesBetween =  time / 1000 / 60;
      this.inactive = true;
      if(minutesBetween < 5) {
        return this.expanded = true;
      }
      let user = JSON.parse(finchNest.load('user'));
      axios.post("/api/user/"+user._id+"/getBotInformation",{
        id: this.data._id
      },{headers: { Authorization: `Bearer ${user.token}` }})
      .then((bot)=>{
        if(bot.data.error) {
          this.error = bot.data.error;
        } else {
          this.data = bot.data;
          this.hasDetails = new Date().getTime()
          this.hasDetails = true;
          this.expanded = true;
        }
        this.inactive = false;
      })
      .catch((error)=>{
        this.inactive = false;
      })
    },
    loadInformation: function(){
      let cache = JSON.parse(finchNest.load('bot_'+this.data._id));
      if(cache) {         
          if(!cache.timestamp) {
            finchNest.save('bot_'+this.data._id,false);
            return this.loadInformation();
          } else {
              let minutesBetween = (new Date().getTime() - parseInt(cache.timestamp) ) / 1000 / 60
              if(minutesBetween > 5) {
                  finchNest.save('bot_'+this.data._id,false);
                  return this.loadInformation();
              } else {
                this.inactive = false;
              }
          }
      } else {
        //Previous information not gathered
        let user = JSON.parse(finchNest.load('user'))
        axios.post('/api/user/'+user.id+'/getBotInformation',{
          id: this.data._id
        },{headers: { Authorization: `Bearer ${user.token}` }})
        .then((result)=>{
            if(result.data.error) {
                this.error = result.data.error
            } else {
                this.data = result.data;
                this.data.timestamp = new Date().getTime()
                finchNest.save('bot_'+result.data._id,this.data)
            }
            this.inactive = false;

        })
        .catch((error)=>{
            this.inactive = false;
            this.error = "Failed to get data. Please contact support."
        })
      }
    },
    remove: function(){
      this.noClick = true; 

      this.error = 'Removing...'; 
      let user = JSON.parse(finchNest.load('user'))
      axios.post('/api/user/'+user.id+'/abandonBot',{
          id: this.data._id
        },{headers: { Authorization: `Bearer ${user.token}` }})
        .then((result)=>{
            if(result.data.error) {
              this.error = "Removal failed";
              setTimeout(()=>{
                this.error = ""
                this.noClick = false;
              },2000)
            } else {
              finchNest.save('bot_'+this.data._id,false)
              this.$emit('abandon',this.data)
            }
        })
        .catch((error)=>{
            this.error = "Removal failed";
            setTimeout(()=>{
              this.error = ""
              this.noClick = false;
            },2000)
        })
    }
  },
  props: ["data","index"],
  mounted: function(){
    if(this.data._id) {
        this.inactive = true;
        this.loadInformation();
    }
  }
}
</script>

<style scoped>
.bot {
  box-sizing:border-box;
  margin:16px 0px;
  padding:16px 32px;
  position:relative;
}


.plaque {
  transition:all .1s;
  font-size:20px;
  height:64px;
  width:64px;
  overflow:hidden;
  background:#0f2027;
  color:#fafafa;
  position:relative;
  opacity:0.8;
}

.information {
  cursor:pointer;
  position:absolute;
  left:32px;
  top:16px;
  width:100%;
  height:64px;
  background:none;
  transition:all .1s;
  padding-left:16px;
  margin-left:64px;
  box-sizing:border-box;
  overflow:hidden;
  padding-top:8px;
}

.title {
  font-size:20px;
  margin-bottom:8px;
}

.plaque i {
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
}

.fa-spin {
    margin-top:-9px;
    margin-left:-9px;
    color:#0f2027;
}

.bot .information:hover {
  background:rgba(0,0,0,0.1);
}

.bot .actions {
  transition:all .1s;
  opacity:0.2;
  pointer-events: none;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
  cursor:pointer;
}

.bot .information, .bot .actions {
  border-top-right-radius: 32px;
  border-bottom-right-radius: 32px;
}

.bot .information {
    background:#fafafa;
}

.bot:hover .actions {
  background:#fafafa;
  opacity:1;
  pointer-events: all;
}

.inactive {
  pointer-events: none;
  opacity:0.8;
}

span {
  opacity:1;
}

.plaque {
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
}

.inactive .plaque {
  background:none;
}

.error {
  color:rgb(200,70,70);
}

.error .fa-robot {
  color:#fafafa;
}

.actions {
  position:absolute;
  top:0;
  margin-top:16px;
  right:0;
  display:block;
  overflow:hidden;
  height:64px;
  width:auto;
}

.action {
  transition:all .3s!important;
  height:64px;
  max-width:64px;
  position:relative;
}

.action.danger i, .action.danger {
  background: rgb(200,70,70)!important;
  color:#fafafa!important;
}

.action i {
  height:64px;
  width:64px;
  overflow:hidden;
  box-sizing:border-box;
  padding-top:19px;
  padding-left:21px;
  font-size:25px;
  color:#fafafa;
}

.action {
  white-space: nowrap;
  max-width:64px;
  transition:all .1s;
}

.action:hover {
  max-width:500px;
  background:rgba(250,250,250,0.1);
} 

.action span {
    position: relative;
    display: inline-block;
    top: -25px;
    padding-left: 16px;
    padding-right: 20px;
}
.plaque.error {
  background:none;
  background:rgb(200,70,70);
}

.noClick, .noClick .action {
  cursor:default!important;
  pointer-events:none!important;
}

.noClick .action {
  opacity:0;
}

.actions {
  margin-right:-96px;
}

.bot {
    box-sizing:border-box;
    width:80%;
}

.expanded {
  height:auto;
}

.details {
  margin-left:64px;
  width:100%;
  background:#fafafa;
  box-sizing: border-box;
  padding:32px 16px;
  border-bottom-right-radius: 32px;
  border-bottom-left-radius: 32px;
}

.details label {
  font-weight:800;
  display:block;
  margin-bottom:16px;
}

.details .group {
  margin:32px 0;
}

.details b {
  font-weight:800;
}

.details a {
  color:#333333;
}

</style>