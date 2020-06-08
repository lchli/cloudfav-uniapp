<template>
	<view id="cotainer">
		<input v-model="name" placeholder="输入账号"></input>
		<input v-model="pwd" placeholder="输入密码" class="pwdbt"></input>
		<button type="primary" class="login" @click="register()">登录</button>
		<button type="primary" class="reg" @click="gotoRegister()">去注册</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				name: '',
				pwd: ''
			}
		},
		methods: {
			gotoRegister() {
				uni.navigateTo({
					url: 'register'
				})
			},
			register: function() {
				const data = {
					pwd: this.pwd,
					account: this.name
				}

				uni.request({
						url: '/api/user/login',
						data: data,
						method: 'GET'
					}).then(function(data) {
						console.log(data)

						let [error, response] = data;

						if (error != null) {
							uni.showToast({title:error})
							return
						}

						if (response == null) {
							uni.showToast({title:'登录失败'})
							return
						}
						const apiData = response.data

						if (apiData == null) {
							uni.showToast({title:'登录失败'})
							return
						}

						if (apiData.code !== '1') {
							uni.showToast({title:apiData.errmsg})
							return
						}

						uni.setStorageSync('userId', apiData.uid)
						uni.setStorageSync('userName', apiData.account)
						uni.setStorageSync('token', apiData.token)

						uni.reLaunch({
							url: './index/index'
						})

						console.log("login success.")
					})
					.catch(function(error) {
						// handle error
						console.log(error)
						uni.showToast({title:error})
					})
					.finally(function() {
						// always executed
						console.log('always executed')
					})
			}
		}
	}
</script>

<style lang="scss">
	.pwdbt {
		margin-top: 20px;
	}

	.reg {
		margin-top: 30px;
		margin-left: 10px;
		margin-right: 10px;
	}
	
	.login {
		margin-top: 50px;
		margin-left: 10px;
		margin-right: 10px;
	}
</style>
