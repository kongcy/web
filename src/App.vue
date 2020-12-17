<template>
  <router-view v-if="isRouterAlive"/>
</template>

<script>
export default {
  name: 'App',
  provide() {
  	return {
  		reload: this.reload
  	}
  },
  data() {
  	return {
  		isRouterAlive: true
  	}
  },
  methods: {
  	reload() {
		this.isRouterAlive = false;
		let user = xtxk.cache.get('USER') //dj 0623 新加
  		this.$nextTick(function() {  //刷新后 xtxk.cache.get('USER') underfind  dj0623 新加
			  this.isRouterAlive = true;
			  this.$store.commit("updateUserinfo", user); //dj0623 新加
              xtxk.cache.set('USER',user); //dj0623 新加
  		})
  	}
  }
}
</script>
