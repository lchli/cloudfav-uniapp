<template>
	<view class="container">
		<input v-model="title" placeholder="输入标题"></input>
		<input class="url-input" v-model="url" placeholder="输入网址"></input>
		<button type="primary" class="btn" @click="add">添加</button>
	</view>
</template>

<script>
	export default {

		data: function() {
			return {
				url: '',
				title: ''
			}
		},
		methods: {
			add: function() {
				if (uni.getStorageSync('userName') == null) {

					uni.redirectTo({
						url: 'Login'
					})
					return
				}
				if (this.url == null || this.url === '') {
					uni.showToast({
						title: 'url为空'
					})
					return
				}
				this.sendAd()
			},
			sendAd: function() {
				const data = {
					'title': this.title,
					'url': this.url,
					'userId': uni.getStorageSync('userId'),
					'token': uni.getStorageSync('token')
				}

				uni.request({
						url: '/api/fav/add',
						data: data,
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						}
					}).then(function(data) {
						// handle success
						console.log(data)

						let [error, response] = data;

						if (response.data == null) {
							uni.showToast({
								title: '添加失败'
							})
							return
						}
						if (response.data.code === '-1') {
							uni.showToast({
								title: response.data.errmsg
							})
							return
						}

						uni.showToast({
							title: '添加成功'
						})
						uni.reLaunch({
							url: './index/index'
						})
					})
					.catch(function(error) {
						// handle error
						console.log(error)
						uni.showToast({
							title: '添加失败'
						})
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
	.url-input {
		margin-top: 10px;

	}

	.btn {
		margin-top: 50px;
		margin-left: 10px;
		margin-right: 10px;
	}
</style>
