<template>
	<view class="flex column q-pa-md">
		<uni-nav-bar ref='navbar' :title="mtitle" rightText="操作" @clickRight="navClickRight">

		</uni-nav-bar>

		<uni-search-bar placeholder="输入关键字" @confirm="search" v-model="searchKey"></uni-search-bar>

		<uni-list dense padding>
			<uni-list-item clickable v-ripple v-for="url in urls" :key="url.uid" @click="itemClick(url.uid,url.url)" id="titleLayout">
				<div v-html="url.title" id="title">
				</div>
				<div id="createDate">
					创建日期：{{formatDate(url.createDate)}}
				</div>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import moment from 'moment'
	import VueClipboard from 'vue-clipboard2'
	export default {

		data() {
			return {
				urls: [],
				searchKey: '',
				mtitle: ''
			}
		},
		mounted() {
			console.log('token:' + uni.getStorageSync('token'))
			//uni.setStorageSync('token','lch')
			//uni.setStorageSync('userName','lch')

			if (uni.getStorageSync('token') == null || uni.getStorageSync('token') === '') {
				uni.redirectTo({
					url: '../Login'
				})
			} else {
				this.mtitle = `云收藏首页(${uni.getStorageSync('userName')})`

				this.getList()
			}

		},



		methods: {
			navClickRight() {
				uni.showActionSheet({
					itemList: ['退出登录', '添加收藏'],
					success: function(res) {
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						if (res.tapIndex === 0) {
							uni.removeStorageSync('userId')
							uni.removeStorageSync('userName')
							uni.removeStorageSync('token')

							this.userName = uni.getStorageSync('userName')
							this.essentialLinks = []

							uni.redirectTo({
								url: '../Login'
							})
						} else if (res.tapIndex === 1) {
							uni.navigateTo({
								url: '../addFav'
							})
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			formatDate: function(dateMills) {
				return moment(dateMills).format('YYYY-MM-DD HH:mm:ss');
			},
			delete: function(urlId) {
				const data = {
					userId: uni.getStorageSync('userId'),
					token: uni.getStorageSync('token'),
					favId: urlId

				}
				uni.request({
						url: '/api/fav/delete',
						data: data
					}).then(function(data) {
						console.log(data)

						let [error, response] = data;
						if (response.data == null) {
							uni.showToast({
								title: '删除失败'
							})
							return
						}
						if (response.data.code !== '1') {
							uni.showToast({
								title: response.data.errmsg
							})
							return
						}
						this.getList()
					}.bind(this))
					.catch(function(error) {
						// handle error
						console.log(error)
						uni.showToast({
							title: error
						})
					})
					.finally(function() {
						// always executed
						console.log('always executed')
					})
			},
			copy: function(url) {

				if (uni.getSystemInfoSync().AppPlatform == null || uni.getSystemInfoSync().AppPlatform === '') {
					this.copyLink(url)
					return
				}
				uni.setClipboardData({
					data: url,
					success: function() {
						uni.showToast({
							title: '复制成功'
						})
					},
					fail: function() {
						uni.showToast({
							title: '复制失败'
						})
					}
				})

			},
			copyLink(url) {
				this.$copyText(url).then(function(e) {
					uni.showToast({
						title: '复制成功'
					})
				}, function(e) {
					uni.showToast({
						title: '复制失败'
					})
				})
			},
			getList: function() {
				const data = {

					userId: uni.getStorageSync('userId'),
					token: uni.getStorageSync('token')

				}
				uni.request({
						url: '/api/fav/queryFavs',
						data: data
					}).then(function(data) {
						// handle success
						console.log(data)

						let [error, response] = data;

						if (response.data == null) {
							uni.showToast({
								title: '加载失败'
							})
							return
						}
						if (response.data.code === '-1') {
							uni.showToast({
								title: response.data.errmsg
							})
							return
						}
						console.log(response.data.items)
						this.urls = response.data.items
					}.bind(this))
					.catch(function(error) {
						// handle error
						console.log(error)
						uni.showToast({
							title: error
						})
					})
					.finally(function() {
						// always executed
						console.log('always executed')
					})
			},
			search: function() {
				const data = {

					userId: uni.getStorageSync('userId'),
					token: uni.getStorageSync('token'),
					keyword: this.searchKey,
					page: 0,
					size: 100,
					sort: ''

				}
				uni.request({
						url: '/api/search/list',
						data: data
					}).then(function(data) {
						// handle success
						console.log(data)

						let [error, response] = data;

						if (response.data == null) {
							uni.showToast({
								title: '加载失败'
							})
							return
						}
						if (response.data.code === '-1') {
							uni.showToast({
								title: response.data.errmsg
							})
							return
						}
						console.log(response.data.items)
						this.urls = response.data.items
					}.bind(this))
					.catch(function(error) {
						// handle error
						console.log(error)
						uni.showToast({
							title: error
						})

					})
					.finally(function() {
						// always executed
						console.log('always executed')
					})
			},
			itemClick: function(urlId, url) {
				const vu = this;
				uni.showActionSheet({
					itemList: ['复制', '删除'],
					success: function(res) {
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						if (res.tapIndex === 0) {
							vu.copy(url)
						} else if (res.tapIndex === 1) {
							vu.delete(urlId)
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});

			}
		}
	}
</script>

<style lang="scss">
	#createDate {
		font-size: 10px;
		margin-left: 0px;
	}

	#titleLayout {
		align-content: center;
		align-items: center;
	}

	.eslight {
		color: #C10015;
	}

	#searchLayout {
		align-content: center;
		align-items: center;
		align-self: center;
	}

	#btn_search {
		margin-left: 10px;
	}
</style>
