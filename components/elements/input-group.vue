<template>
  <div class="form-group" v-bind:class="{loading:loading}">
    <div v-if="type !== 'submit'" v-on:click="emitEvent('field_clicked')">
      <label v-html="label">
      </label>
      <input :autocomplete="autocomplete" v-bind:disabled="(disabled || loading ? true : false)" @input="emitEvent('field_changed'); emitIfValidated();" @blur="emitEvent('field_blurred')" v-bind:name="name" v-model="data" v-bind:type="type"/>
      <transition name="header">
        <div v-if="error" v-on:click="clearError" class="error" v-html="error"></div>
      </transition>
    </div>
    <div v-if="type == 'submit'">
      <div v-if="(type == 'submit')" class="form-submit">
        <button type="submit">
          <i v-if="(icon || iconfull)" v-bind:class="{[(iconfull ? iconfull : 'fa fa-'+icon)]:true}"></i>
          <span v-html="label"></span>
        </button>
        <transition name="header">
          <div v-if="error" v-on:click="clearError" class="error" v-html="error"></div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      error: "",
      data: "",
      validate: "",
      loading: false,
      disabled: false,
      autofocus: false,
      knownExtensions: [
        ".com", ".net", ".io", ".org", ".tech"
      ]
    }
  },
  props: ["type","name","label","validate","autofocus","windowprefill","disabled","prefill","icon","iconfull","autocomplete"],
  created: function(){
  },
  mounted: function(){
    if(this.prefill) this.data = this.prefill;
    if(this.windowprefill) {
      if(window[this.windowprefill]) this.data = window[this.windowprefill];
      setTimeout(function(){
        this.$el.querySelector('input').blur()
      }.bind(this),100)
    }
    if(this.autofocus) {
      try{
        this.$el.querySelector('input').focus()
      } catch(e){}
    }
  },
  methods: {
    hasKnownExtension: function(string){
      for(let extension in this.knownExtensions) {
        if(string.endsWith(this.knownExtensions[extension])) return true;
      }
      return false;
    },
    emitIfValidated: function(){
      if(!this.validate) return;
      let validateThis = this.data || "";
      let emit = false;
      if(!validateThis) return;
      switch(this.validate) {
        case 'email':
          if(validateThis.match(/^\S+@\S+\.\S+$/) && this.hasKnownExtension(validateThis)) emit = true;
        break;
      }
      if(emit) {
        this.emitEvent('validated_'+this.validate, true)
      }
    },
    emitEvent: function(event, blurElement){
      if(!this.data) return;
      let field = this.$el.childNodes[0].childNodes;
      for(var el in field) {
        if(((field[el]||{}).tagName || "").toLowerCase() == 'input') field = field[el];
      }
      if(blurElement) field.blur();
      this.$emit(event, {field:this.name,data:this.data,element:field,_self:this})
    },
    clearError: function(){
      this.error = ""
    }
	}
  
}
</script>
<style>
</style>
<style scoped>
  .error {
    overflow:visible;
    box-sizing: border-box;
    max-height:0px;
    margin-top:4px;
    margin-left:4px;
    margin-bottom:-4px;
    color:red;
    cursor:pointer;
  }
  label {
    font-weight:600;
  }
  .loading input, .loading button {
    pointer-events:none;
    opacity:0.5;
  }
  [type="submit"]{
  }
  a {
    color:#333333;
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