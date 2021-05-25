<template>
	<view>
		<web-view :src="setPWDUrl" style="width: 100vw;height: 100vh;"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				setPWDUrl: 'https://www.baidu.com/',
				jumpUrl:''
			}
		},
		onLoad(options) { 
			this.jumpUrl = location.host+'/pages/infoDisplay/infoDisplay?params=' + this.$tools.setParams4url({
									type: 'success',
									title: '钱包开通成功！',
									infoContent:'',
									navigateURL:'../index/index',
									confirmBtnText:'确定'
								}) ; //获取主机名+端口号 例如：172.20.11.111:8000
			this.getUrl()
		},
		methods: {
			getUrl() {
				this.$api.request({
					url: 'member/paymember/setPayPwd',
					data: {
						 "bizUserId": sessionStorage.getItem("bizUserId"),
						  "jumpPageType": 1,
						  "jumpUrl": this.jumpUrl,
						  "backUrl": "www.baidu.com",
						  "channelCode":  sessionStorage.getItem("channelCode")
					},
					success: (res) => {
						this.setPWDUrl = res
					}
				})
			}
		}
	}
</script>
<style lang="scss">

</style>
