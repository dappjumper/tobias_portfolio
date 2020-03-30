<template>
  <div class="type" :class="{chosen: (type == data.slug ? true : false)}" v-on:click="chooseType">
    <i :class="'fa fa-'+data.icon"></i>
    <span>{{data.title}}</span>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {

    }
  },
  methods: {
    chooseType: function(){
      if(this.type != this.slug) {
        this.$emit('type_chosen',this.data);
      }
    }
  },
  props: [
  "type",
  "data"
  ],
  mounted: function(){
  }
}
</script>

<style>



</style>

<style scoped>
.type {
  cursor:pointer;
  display:inline-block;
  text-align:center;
  box-sizing:border-box;
  padding:8px 8px;
  padding-top:16px;
  border-radius:8px;
  margin:4px;
  transition: all .1s;
}
.type.chosen {
  cursor:default;
}
.type i {
  width:120px;
  display:block;
  margin-bottom:16px;
  font-size:28px;
}
.type:hover {
  background-color:rgba(0,0,0,0.2);
}
.type.chosen {
  background-color:rgb(15, 32, 39);
  color:#fafafa;
  opacity:0.8;
}
.type span {
  display:block;
}
</style>