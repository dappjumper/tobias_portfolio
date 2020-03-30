<template>
  <form v-on:submit="submit($event)">
    <h2>Log in</h2>
    <input-group type="email" name="email" label="Email"/></input-group>
    <input-group type="password" name="password" label="Password"></input-group>
    <input-group type="submit" label="Login"></input-group>
  </form>
</template>

<script>
module.exports = {
  data: function () {
    return {
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
    setLoading: function(input_fields, unset){
      for(let field in input_fields) {
        input_fields[field].loading = (typeof unset == 'undefined' ? true : false)
      }
    },
    submit: function(event){
        event.preventDefault()

        //Defaults
        let input_fields = {
          email: {},
          password: {},
          password_repeat: {}
        }

        //Loop through all input-groups in component
        for(let i in this.$children) {
          let child = this.$children[i]
          if(child.$options._componentTag == 'input-group') { //If child is input-group
            if(typeof input_fields[child.name] == 'object') { //Add only kids from default
              input_fields[child.name] = child;
              child.error = "";
            } else {
              //Add submit button as well
              if(child.type == 'submit') input_fields.submit = child;
            }
          }
        }

        //Check validity
        if(!input_fields.email.data) return input_fields.email.error = "Please enter an email";
        if(!input_fields.password.data) return input_fields.password.error = "Please enter a password";

        //If no return statement then set all fields to loading
        this.setLoading(input_fields);

        //Ready to go!
        axios.post(this.target,
          {
            email: input_fields.email.data,
            password: input_fields.password.data
          }
        ).then((response)=>{
          if(response.data.error) {
            if(response.data.name) {
              input_fields[response.data.name].error = response.data.error;
            } else {
              input_fields.submit.error = response.data.error;
            }
            this.setLoading(input_fields, true);
          } else {
            //No errors, let's go!
          }
        }).catch((response)=>{
          input_fields.submit.error = "Registration failed due to fatal error.";
          this.setLoading(input_fields, true);
        })

    }
	}
  
}
</script>

<style scoped>
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