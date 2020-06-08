<template>
	<view class="container">
		<input v-model="name" placeholder="输入账号"></input>
		<input v-model="pwd" placeholder="输入密码" class="pwdbt"></input>
		<button type="primary" class="btn" @click="register()">注册</button>
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
			register: function() {

				console.log("this.name:" + this.name)
				uni.request({
						url: '/api/user/register',
						data: {
							'pwd': this.pwd,
							'account': this.name
						},
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						}
					}).then(function(data) {
						// handle success
						console.log(data)

						let [error, response] = data;

						if (error != null) {
							uni.showToast({title:error})
							return
						}

						if (response == null) {
							uni.showToast({title:'注册失败'})
							return
						}
						const apiData = response.data

						if (apiData == null) {
							uni.showToast({title:'注册失败'})
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

						console.log("register success.")
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
		margin-top: 10px;
	}

	.btn {
		margin-top: 30px;
		margin-left: 10px;
		margin-right: 10px;
	}
</style>
