<template>
	<view class="infoDisplay">
		<div class="infoBody">
			<div class="waringIcon" style="text-align: center;">
				<u-icon v-if="type == 'success'" name="info-circle-fill" color="#ff9900" size="208"></u-icon>
				<u-icon v-else name="checkmark-circle-fill" color="#ff9900" size="208"></u-icon>
			</div>
			<div class="title">
				{{title}}
			</div>
			<div class="content">
				{{infoContent}}
			</div>
		</div>
		<div class="button_content">
			<u-button type="warning" size="default" @click="childclick()">{{confirmBtnText}}</u-button>
		</div>
	</view>
</template>

<script>
	export default {
		/**'type',
		'title', 提示页面的标题
		'navigateURL', 提示页面确定按钮要做的事情
		'confirmBtnText',提示页面按钮文本
		"infoContent" 提示页面中间内容,暂时只支持文字
		 * */
		props: ['params'],
		data() {
			return {
				type: 'error',
				title: '实名认证',
				infoContent: '根据法律规定，用户实名认证之后方可使用钱包业务',
				navigateURL: '../index/index',
				confirmBtnText: "确定"
			};
		},
		onLoad(options) {
			let params = options.params;
			if (params) {
				params = this.$tools.getParams4url(params)
				if (params.title) {
					this.title = params.title
				}
				if (params.type) {
					this.type = params.type
				}
				if (params.infoContent) {
					this.infoContent = params.infoContent
				}
				if (params.navigateURL) {
					this.navigateURL = params.navigateURL
				}
				if (params.confirmBtnText) {
					this.confirmBtnText = params.confirmBtnText
				}
			}
		},
		methods: {
			childclick: function() {
				this.navigateURL = this.navigateURL || '../index/index'
				uni.navigateTo({
					url: this.navigateURL
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.infoDisplay {
		width: 100%;
		height: 100vh;
		padding: 20px;
		display: flex;

		flex-flow: row wrap;/*×使用行布局，并可以换行。*/ 
		.infoBody {
			align-self: flex-start;
			height: 70%;
			width: 100%;
			text-align: center;
		}

		.waringIcon {
			margin-top: 40px;
		}

		.title {
			margin-top: 40px;
			font-weight: bold;
			font-size: $uni-font-size-lg;
			text-align: center;
		}

		.content {
			margin-top: 40px;
			font-size: $uni-font-size-base;
			text-align: center;
		}

		.button_content {
			height: 50px;
			width: 100%;
			vertical-align: bottom;
			align-self: flex-end;
		}
	}
</style>
