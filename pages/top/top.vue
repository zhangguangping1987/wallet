<template>
	<view class="back" :style="topStyle">
		<div class="back_arrow" @click="goBack">
			<u-icon name="arrow-left"></u-icon>
		</div>
		<div class="back_title">{{title}}</div>
	</view>
</template>

<script>
	//父组件传入参数title 表示页面标题，navigateURL 表示返回的路径url 如果不传默认返回index/index
	export default {
		props: ['title','navigateURL','topStyle'],
		data() {
			return {
				myNavigateURL: this.navigateURL
			}
		},
		onLoad(option) {
			if (option.payType != undefined) {
				this.payType = option.payType
			}

		},
		methods: {
			goBack() {
			    var pages = getCurrentPages();
				for(let i = (pages.length-1) ;i > 0; i-- ){
					var currPage = pages[i];   //当前页面
					var prevPage = pages[i-1];  //上一个页面
					if(currPage.$vm.$el != prevPage.$vm.$el){
						break
					}
				}
				if(pages.length <=1){
					uni.redirectTo({
						url:'/'
					})
				}
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.back {
		width: 100%;
		height: 60px;
		line-height: 60px;
		padding-left: 20px;
		background: white;
	}

	.back_arrow {
		width: 20px;
		height: 60px;
		float: left;
	}

	.back_title {
		width: calc(100% - 80px);
		height: 60px;
		float: left;
		text-align: center;
		font-size: 18px;
	}
</style>
