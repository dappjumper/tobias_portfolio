<template>
  <form v-on:submit="submit($event)">
    <h2>{{(state == 'initial' ? 'Register or log in' : state == 'register' ? 'Register an account' : 'Log in')}}</h2>
    <transition name="dash">
      <input-group class="shown" autocomplete="email" windowprefill="verifiedEmail" autofocus="true" validate="email" v-on:field_changed="resetState" v-on:field_enter="checkUser" v-on:field_blurred="checkUser" type="email" name="email" label="Please type your email"/></input-group>
    </transition>
    <transition name="dash">
      <input-group autofocus="true" :autocomplete="(state != 'register' ? 'current-password' : 'new-password')" v-bind:class="{shown:(state == 'login' || state == 'register')}" type="password" name="password" label="Password"></input-group>
    </transition>
    <transition name="dash">
      <input-group v-bind:class="{shown:(state == 'register')}" autocomplete="false" type="password" name="password_repeat" label="Repeat password"></input-group>
    </transition>
    <transition name="dash">
      <input-group v-bind:icon="(state == 'login' ? 'sign-in-alt' : 'user-plus')" v-bind:class="{shown:(state == 'login' || state == 'register')}" type="submit" v-bind:label="state"></input-group>
    </transition>
  </form>
</template>

<script>
module.exports = {
  data: function () {
    return {
      state: "initial",
      email: "",
      inputs: [],
      loading: false,
      time: false
    }
  },
  created: function(){
  },
  props: ["target"],
  components: {
    'input-group': window.httpVueLoader('/components/elements/input-group.vue'),
    'menu-item': window.httpVueLoader('/components/elements/menu-item.vue')
  },
  mounted: function(){
    
  },
  methods: {
    resetState: function(component){
      this.loading = false;
      if(this.state != 'initial' && !this.$children[0].loading) {
        this.state = 'initial';
        this.$children[1].data = "";
        this.$children[2].data = "";
        window.keepEmail = false;
        component._self.disabled = false;
      }
    },
    checkUser: function(input_group){
      if(this.loading) return false; //Dont repeat
      this.loading = true;
      this.$children[0].loading = true;
      input_group._self.error = ""
      if(input_group.element.checkValidity()) {
        input_group._self.loading = true;
        axios.post(this.target+"check",
          {
            email: input_group.data
          }
        ).then((response)=>{
          this.$children[0].loading = false;
          if(!response.data.error) {
            console.log(this.$children[1].$el.querySelector("input").focus())
            this.state = response.data.next;
          } else {
            input_group._self.error = response.data.error || "Something went wrong"
          }
          this.setLoading(true)
        }).catch((response)=>{
          this.$children[0].loading = false;
          input_group._self.error = response.error;
          this.setLoading(true)
        })
      } else {
        this.$children[0].loading = false;
        input_group._self.error = "Email is invalid"
      }
    },
    setLoading: function(input_fields, unset){
      if(typeof input_fields == 'boolean' || typeof input_fields == 'undefined') {
        unset = (input_fields ? true : false)
        input_fields = this.$children;
      }
      for(let field in input_fields) {
        input_fields[field].loading = (typeof unset == 'undefined' ? true : false)
      }
    },
    submit: function(event){
        event.preventDefault();
        if(this.state == 'initial') {
          this.$children[0].emitEvent('field_blurred', 'blur');
          return true;
        }

        for(var kid in this.$children) if(this.$children[kid].error) this.$children[kid].error = "";

        //Defaults
        let input_fields = {
          email: this.$children[0],
          password: this.$children[1],
          password_repeat: this.$children[2]
        }

        //Check validity
        if(!input_fields.email.data) return input_fields.email.error = "Please enter an email";
        if(!input_fields.password.data) return input_fields.password.error = "Please enter a password";
        if(!input_fields.password_repeat.data && this.state == 'register') return input_fields.password_repeat.error = "Please re-enter password";
        if(!(input_fields.password.data == input_fields.password_repeat.data) && this.state == 'register') return input_fields.password_repeat.error = input_fields.password.error = "Passwords must match";

        //If no return statement then set all fields to loading
        this.setLoading(input_fields);

        //Ready to go!
        axios.post(this.target+'entry',
          {
            email: input_fields.email.data,
            password: input_fields.password.data
          }
        ).then((response)=>{
          if(response.data.error) {
            if(response.data.next == 'forgot') input_fields.password.error = response.data.error;
            if(response.data.next == 'verify') input_fields.email.error = response.data.error;
            this.setLoading(this.$children, true);
          } else {
            if(response.data.next == 'login') {
              this.state = 'login';
              this.submit({preventDefault:()=>{}})
            } else {
              this.$emit('user_logged_in',response.data)
              this.setLoading(this.$children, true);
            }
          }
        }).catch((response)=>{
          this.$children[this.$children.length-1].error = "Registration failed due to fatal error.";
          this.setLoading(this.$children, true);
        })

    }
	}
  
}
</script>

<style scoped>
  .form-group {
    opacity:0;
    pointer-events:none;
    transition:all .1s;
    transform:scale(0,0);
    max-height:0;
    position:absolute;
  }
  .form-group.shown {
    position:relative;
    transform:scale(1,1);
    max-height:200px;
    height:auto;
    opacity:1!important;
    pointer-events:all!important;

  }
  label {
    display:block;
  }
  input {
    width:100%;
    max-width:500px;
  }
  .form-group, .submit-group {
    margin-top:32px;
    margin-bottom:16px;
  }
</style>