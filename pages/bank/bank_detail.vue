<template>
	<view class="bank_detail">
		<Top ref="top" title='银行详情'></Top>
		<view class="content">
			<view class="content_item">
				<div class="content_item_left">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#iconyinhangqia"></use>
					</svg>
				</div>
				<div class="content_item_right">
					<div class="bank_label">{{bankInfo.bankName}}</div>
					<div class="bank_number">{{formatCardNum(bankInfo.bankCardNo)}}</div>
				</div>
			</view>
			<view class="content_item" style="padding:0px 20px;">
				<div>
					<div class="content_item_label">单笔支付限额</div>
					<div class="content_item_money">{{singlePay}}元</div>
				</div>
				<div>
					<div class="content_item_label">每日支付限额</div>
					<div class="content_item_money">{{dayPay}}元</div>
				</div>
			</view>

		</view>

		<view class="content_bottom">
			<div class="bottom_button" @click="remove">解除绑定</div>
		</view>

		<view v-if="visible" class="again_popup">
			<view class="popup_content">
				<view class="popup_content_top">确定解除绑定该银行卡吗？</view>
				<view class="popup_content_left" @click="confirmCancel">取消</view>
				<view class="popup_content_right" @click="unbindBankCard">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	let timer = null
	import Top from "../top/top.vue"
	export default {
		props: [],
		components: {
			Top
		},
		data() {
			return {
				bankInfo: {},
				singlePay: 50000,
				dayPay: 50000,
				visible: false,
				password: '',
				bankCardNo: ''
			}
		},
		watch:{
			"bankInfo.cardType"(newVal,oldVal){
				this.bankInfo.bankName + this.bankInfo.cardType == "1"?"借记卡":"信用卡" //银行卡类型 1：借记卡2：信用卡
			}
		},
		onLoad(options) {
			// console.log(option,"参数")
			let params = this.$tools.getParams4url(options.params)
			this.bankCardNo = params.bankCardNo
			this.getBankDetail()
		},
		methods: {
			getBankDetail() {
				this.$api.request({
					url: 'member/paymember/queryBankCard',
					data: {
						bizUserId: sessionStorage.getItem("bizUserId"),
						cardNo: this.bankCardNo,
						channelCode: sessionStorage.getItem("channelCode")
					},
					success: (res) => {
						console.log(res, "res")
						if (res.bindCardList && res.bindCardList.length > 0) {
							this.bankInfo = res.bindCardList[0]
						} else {
							this.bankInfo = [{
								"bankCardNo": "",
								"bankName": "",
								"bindTime": new Date(),
								"phone": "",
								"cardType": "",
								"bindState": "",
								"bankCardPro": ""
							}]
						}
					}
				})
			},
			formatCardNum(value) {
				if (value) {
					let str = value.substr(value.length - 4)
					let result = "**** **** **** " + str
					return result
				} else {
					return ""
				}
			},
			// 解除绑定
			remove() {
				// console.log("解除绑定确认弹框")
				this.visible = true
			},
			confirmCancel() {
				this.visible = false
			},
			unbindBankCard() {
				this.visible = false
				this.IsShowVerificationCode = true
				this.$api.request({
					url: 'member/paymember/unbindBankCard', //todo 现在有问题。
					data: {
						"bizUserId": sessionStorage.getItem("bizUserId"),
						"cardNo": this.bankCardNo,
						"channelCode": sessionStorage.getItem("channelCode"),
					},
					success: (res) => {
						uni.showModal({
						    title: '提示',
						    content: "银行卡解绑成功！",
							showCancel:false,
						    success: (res)=>{
						        if (res.confirm) {
						            this.$refs.top.goBack(); // 返回方法通用调用
						        } else if (res.cancel) {
						        }
						    }
						});
						
					}
				})
			}

		}
	}
</script>

<style lang="scss">
	* {
		color: #8A8C8E;
	}

	.bank_detail {
		width: 100vw;
		height: 100vh;
		background: #F7F7F7;

		.content {
			width: 100%;
			height: auto;
		}

		.content_item {
			width: 100%;
			height: auto;
			margin-top: 10px;
			padding: 20px;
			background: white;
			float: left;
		}

		.content_item_left {
			width: 50px;
			height: 50px;
			float: left;
		}

		.bank_icon {
			width: 35px;
			height: 35px;
			margin-top: 8px;
			border-radius: 20px;
		}

		.bank_label {
			width: 100%;
			height: 30px;
			line-height: 30px;
			text-align: left;
			/* color:#8A8C8E; */
			font-size: 20px;
			/* background:red; */
		}

		.bank_number {
			width: 100%;
			height: 20px;
			line-height: 20px;
			text-align: left;
			/* color:#8A8C8E; */
			/* background:green; */
		}

		.content_item_right {
			width: calc(100% - 50px);
			height: 50px;
			float: left;
		}


		.content_item_label {
			width: 150px;
			height: 50px;
			line-height: 50px;
			text-align: left;
			float: left;
		}

		.content_item_money {
			width: calc(100% - 190px);
			height: 50px;
			line-height: 50px;
			text-align: right;
			float: left;
		}



		.content_bottom {
			width: 100%;
			height: 60px;
			/* background:white; */
			position: fixed;
			left: 0px;
			bottom: 0px;
			/*background:white;*/
			text-align: center;
			padding: 0px 20px;
		}

		.bottom_button {
			width: calc(100% - 40px);
			height: 40px;
			border: 1px solid #F39800;
			color: #F39800;
			margin-top: 10px;
			border-radius: 8px;
			line-height: 40px;
		}


		.again_popup {
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.6);
			position: fixed;
			top: 0px;
		}

		.popup_content {
			width: 80%;
			height: 180px;
			background: white;
			margin: auto;
			border-radius: 8px;
			margin-top: 200px;
			overflow: hidden;
		}

		.popup_content_top {
			width: 100%;
			height: 130px;
			line-height: 130px;
			color: #66645D;
			float: left;
			background: #F7F7F7;
			text-align: center;
		}

		.popup_content_left {
			width: 50%;
			height: 50;
			line-height: 50px;
			color: #66645D;
			float: left;
			text-align: center;
		}

		.popup_content_right {
			width: 50%;
			height: 50px;
			line-height: 50px;
			color: #F39800;
			float: left;
			text-align: center;
		}


		.again_popup_password {
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.6);
			position: fixed;
			top: 0px;
		}

		.popup_password_content_top {
			width: 100%;
			height: 50px;
			line-height: 50px;
			color: #66645D;
			float: left;
			text-align: center;
		}

		.popup_password_close {
			width: 24px;
			height: 24px;
			line-height: 24px;
			text-align: center;
			position: absolute;
			right: 50px;
			font-size: 24px;
			margin-top: 13px;
			color: black;
		}

		.popup_password_input {
			width: 100%;
			height: 50px;
			line-height: 50px;
			margin-top: 10px;
			float: left;
			/* background:red; */
		}

		.content_item_password {
			width: calc(100% - 20px);
			height: auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0px 10px;
		}

		.password_item {
			width: 42px;
			height: 42px;
			border-radius: 4px;
			background: #EEEEEE;
			text-align: center;
			line-height: 40px;
			font-size: 28px;
		}

		.password_s {
			/* position: relative; */
			color: black;
		}

		.password_s_input {
			width: 100%;
			height: 42px;
			position: relative;
			background: white;
			color: white;
			z-index: 1;
			margin-top: -42px;
			margin-left: -15px;
			opacity: 0.01;
		}


		.popup_password_forget {
			width: calc(100% - 10px);
			height: 50px;
			line-height: 50px;
			color: #F39800;
			text-align: right;
			margin-top: 10px;
			float: left;
			padding-right: 10px;
		}

	}
</style>
