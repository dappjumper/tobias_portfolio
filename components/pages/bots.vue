<template>
  <div class="page">
    <transition name="dash">
      <div v-if="ready" class="content">
        <article class="toolbar">
          <button v-on:click="showTab()" v-bind:class="{disabled:(state == 'initial')}">
            <i class="fa fa-list"></i>
            <span>Bots</span>
          </button>
          <button v-bind:class="{disabled:(state == 'add_new')}" v-on:click="!user ? env.page = 'My account': showTab('Add bot','add_new')">
            <i :class="(!user ? 'fa fa-lock' : 'fa fa-plus')"></i>
            <span>Add bot</span>
          </button>
          <button v-bind:class="{disabled:(state == 'guide')}" v-on:click="showTab('Help','guide')">
            <i class="fa fa-envelope-open-text"></i>
            <span>Helpful information</span>
          </button>
        </article>

        <transition name="tab">
          <div class="state" v-if="state == 'initial'">
            <div class="bots" v-if="bots.length > 0">
              <ul>
                <li v-for="(bot, index) in bots">
                  <transition name="tab">
                      <bot-info v-on:abandon="bot_remove" :key="bot._id" :index="index" :data="bot"></bot-info>
                  </transition>
                </li>
              </ul>
            </div>
            <div class="bots" v-if="!bots.length > 0">
              <article>No bots saved</article>
            </div>
            </article>
          </div>
        </transition>

        <transition name="tab">
          <div class="state" v-if="state == 'add_new'">
            <article>
              <form-bots v-on:bot_created="bot_created" icon="plus" target="/api/user" mode="new"></form-bots>
            </article>
          </div>
        </transition>

        <transition name="tab">
          <div class="state guide" v-if="state == 'guide'">
            <article>
              <h1>How do I create a bot?</h1>
              <h2>
                Before you begin
              </h2>
              <p>
                Install Telegram if you have not done so already, and create or log into an account there.<br/>This will be your bot owner account where Telegram is considered.
              </p>
            </article><article>
              <h2>
                Step 1:
              </h2>
              <p>
                Open a conversation with <a href="https://t.me/botfather" target="_blank">@botfather</a> and click the start button if it is visible.
              </p>
            </article><article>
              <h2>
                Step 2:
              </h2>
              <p>
                Type the following: <pre>/newbot</pre><br/> and follow the instructions.
              </p>
            </article><article>
              <h2>
                Final step
              </h2>
              <p>
                Upon completion of the setup you will be granted an API key.
              </p>
              <p>
                Highlight the API key and copy it to your clipboard.
              </p>
              <p>
                Click the button below
              </p>
            </article><article class="toolbar">
              <button v-on:click="state = 'add_new'">
                <i class="fa fa-key"></i>
                <span>I have the key</span>
              </button>
            </article>
          </div>
        </transition>

      </div>
    </transition>
    <app-loader v-if="!ready"></app-loader>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      env: window.finchNest.env,
      ready: false,
      bots: [],
      user: {},
      state: "initial"
    }
  },
  components: {
    'app-loader': window.httpVueLoader('/components/elements/app-loader.vue'),
    'form-bots': window.httpVueLoader('/components/elements/form-bots.vue'),
    'bot-info': window.httpVueLoader('/components/elements/bot-info.vue')
  },
  created: function(){
  },
  props: ["module"],
  mounted: function(){
    this.ready = false;
    if(!finchNest.pages[this.module]) finchNest.pages[this.module] = this;
    this.user = JSON.parse(finchNest.load('user'));
    this.env = finchNest.env;
    if(this.user) {
      this.getUserBots(this.user).then((bots)=>{
        //this.bots = bots;
        this.bots = [...this.bots,...bots]
        this.sortBots();
        this.ready = true;
      }).catch(()=>{
        this.ready = true;
      })
    } else {
      this.ready = true;
    }
  },
  methods: {
    sortBots: function(){
      this.bots.sort(function (a, b) {
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      });
    },
    getUserBots: function(user){
      let id = (user.id ? user.id : user._id)
      return new Promise((resolve, reject)=>{
        axios.post('/api/user/'+id+'/bots',{},{headers: { Authorization: `Bearer ${user.token}` }}).then((userData)=>{
          if(userData.data.error) reject();
          resolve(userData.data)
        }).catch(()=>{
          reject();
        })
      })
    },
    bot_remove: function(data){
      let bot = data;
      for(let index in this.bots) {
        if(this.bots[index]._id == bot._id) {
          this.$delete(this.bots, index)
          return true;
        }
      }
    },
    bot_created: function(bot){
      let add = true;
      for(let i in this.bots) {
        if(this.bots[i]._id == bot._id){
          add = false;
        } 
      }
      finchNest.save('bot_'+bot._id,bot)
      if(add) this.bots.push(bot)
      this.sortBots();
      this.state = 'initial'
    },
    showTab: function(title, slug){
      if(!title && !slug) {
        this.state = 'initial';
        return finchNest.header.tab = "";
      }
      if(slug == this.state) {
        this.state = "initial";
        return finchNest.header.tab = "";
      }
      this.state = slug;
      finchNest.header.tab = title;
    }
  }
  
}
</script>

<style scoped>
  .guide h1 {
    margin-bottom:32px;
  }
  .guide h2 {
    margin-top:16px;
    margin-bottom:32px;
  }
  .guide h2, .guide p{
    margin-bottom:16px;
  }
  .guide p{
    line-height:25px;
  }
  .guide h2 {
    margin-top:32px;
  }
  .guide h2:first-child {
    margin-top:0;
  }
.toolbar button{
  transition:all .1s;
}

.tabActive {
  background-color:rgba(0,0,0,0.15)!important;
}
.tabActive:hover {
  background-color:rgba(0,0,0,0.0.05);
}
</style>