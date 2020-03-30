<template>
  <keep-alive>
  <div class="page" :class="{fullpage:!loggedIn}" id="account" v-bind:data-uid="_uid">
    <div v-if="ready" class="content">
      <transition name="tab">
        <div v-if="loggedIn">
          <article class="toolbar">
            <button v-on:click="logOut">
              <i class="fa fa-sign-out-alt"></i>
              <span>Log out</span>
            </button>
          </article>
          <article>
            <input-group type="email" name="email" :prefill="user.email" label="Email"></input-group>
            <input-group type="submit" name="submit" label="Update"></input-group>
          </article>
        </div>
      </transition>
      <transition name="tab">
        <div v-if="!loggedIn">
          <article id="dualForm">
            <form-dual v-on:user_logged_in="userLoggedIn" target="/api/user"></form-dual>
          </article>
          <article class="toolbar back">
            <button v-on:click="closeApp">
              <i class="fa fa-times"></i>
              <span>Close</span>
            </button>
          </article>
        </div>
      </transition>
    </div>
    <app-loader v-if="!ready"></app-loader>
  </div>
</keep-alive>
</template>

<script>
module.exports = {
  data: function () {
    return {
      env: window.finchNest.env,
      fullpage:false,
      ready: false,
      user: {},
      loginFirst: false,
      loggedIn: false,
      error: ""
    }
  },
  components: {
    'app-loader': window.httpVueLoader('/components/elements/app-loader.vue'),
    'form-dual': window.httpVueLoader('/components/elements/form-dual.vue'),
    'input-group': window.httpVueLoader('/components/elements/input-group.vue')
  },
  props: ["module"],
  mounted: function(){
    finchNest.pages[this.module] = this;

    this.env = finchNest.env;

    let user = finchNest.load('user');
        user = JSON.parse(user);
      this.ready = false;

    if(!user) {
      this.loggedIn = false;
      this.ready = true;
    } else {
      //Verify user
      try {
        this.getUserData(user).then((userData)=>{
          this.loggedIn = true;
          let dataToSave = userData;
          dataToSave.token = user.token;
          finchNest.env.user = dataToSave;
          this.user = dataToSave;
          finchNest.save('user',dataToSave)
          this.ready = true;
        }).catch((e)=>{
          if(e.next == 'verify') {
            this.ready = true;
            this.loggedIn = false;
            finchNest.save('user',false);
          } else {
            this.ready = true;
            this.loggedIn = false;
            finchNest.save('user',false);
          }
        });
      } catch(e){
          this.ready = true;
          this.loggedIn = false;
          finchNest.save('user',false);

      }
    }
  },
  methods: {
    closeApp: function(){
      finchNest.header.closeApp();
    },
    logOut: function(){
      finchNest.save('user',false);
      finchNest.env.user = false
      this.loggedIn = false;
      finchNest.header.show = finchNest.aside.show = false;
    },
    userLoggedIn: function(user) {
      if(user.id && user.email && user.token) {
        finchNest.save('user',user);
        this.loggedIn = true;
        this.user = user;
        finchNest.header.show = finchNest.aside.show = true;
      }
    },
    getUserData: function(user){
      this.ready = false;
      return new Promise((resolve, reject)=>{
        axios.post('/api/user/'+user.id+'/profile',{},{headers: { Authorization: `Bearer ${user.token}` }}).then((userData)=>{
          if(userData.data.error) reject(userData.data);
          resolve(userData.data)
        }).catch(()=>{
          reject();
        })
      })
    }
  }
  
}
</script>

<style scope>
  .page {
    transition:all .1s;
  }
  .fullpage {
    height:100%;
    width:100%;
    position:fixed;
    top:0;
    left:0;
    background: -webkit-linear-gradient(to top left,#2c3e50,#3c556e,#2c3e50);
        background: linear-gradient(to top left,#2c3e50,#3c556e,#2c3e50);
  }
  .fullpage #dualform {
    margin:0 auto!important;
    width:500px;
    box-shadow:0 0 50px rgba(0,0,0,0.2);
  }
  .fullpage .content {
    position:fixed;
    top:50%;
    left:50%;
    width:100%;
    box-sizing: border-box;
    max-width:800px;
    transform:translate(-50%,-50%);
  }
  .fullpage .toolbar {
    width:100%;
    text-align:center;
    max-width:500px;
    position:absolute;
    left:50%;
    transform:translate(-50%,0);
    margin:32px auto;
  }
  .fullpage .toolbar button:hover {
    background:rgb(210,210,210);
  }
  .fullpage input, .fullpage button {
    text-align:left!important;
  }
  .fullpage .toolbar button {
    width:auto!important;
    background:none!important;
    color:#fafafa!important;
  }
</style>