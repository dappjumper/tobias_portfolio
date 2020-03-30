<template>
  <div class="loader">
    <i class="fas fa-cog fa-spin"></i>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {

    }
  },
  created: function(){
  },
  mounted: function(){
  },
  methods: {
	}
  
}
</script>

<style>
.loader {
  background:none;border:none;font-size:66vh; color:#fafafa;
  position:absolute;
  top:50%;
  left:50%;

  transform:translate(-50%,-50%);
  transition:all .1s;
}
.loader i {
  animation-duration:6s;
}

@media (orientation: landscape) {
  .loader {
    margin-top:-32px;
    margin-left:-110px!important;
  }
  .minimized .loader {
    margin-left:-32px!important;
  }
}

@media screen and (max-device-aspect-ratio: 1/1), (max-aspect-ratio: 1/1){
  .loader {
    margin-top:-100px!important;
  }
}

</style>