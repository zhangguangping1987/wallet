<template>
	<view class="rechargeDIV">
		<Top ref="top" title='充值'></Top>
		<view class="content">
			<view class="content_item">
				<view class="content_label">充值金额</view>
				<u-row gutter="16" justify="flex-start">
					<u-col text-align="center" span="4" v-for="(item,index) in moneyList">
						<div @click="selMoney(item)"
							:class="activeMoney==item?'active_money_item money_item':'money_item'">{{item}}元</div>
					</u-col>
				</u-row>
			</view>
			<view class="content_item">
				<view class="content_label">其他金额</view>
				<view class="content_input">
					<div class="money_text">￥</div>
					<input class="money_input" placeholder="输入其他金额" :value="inputMoney" type="number"
						@input="changeMoney" />
				</view>
			</view>
			<view class="content_item">
				<view class="content_label">支付方式</view>
				<view class="pay_method">
					<u-row gutter="16" justify="space-between" v-for="(item,index) in payMethodList">
						<u-col span=11 text-align="left" class="pay_method_item">
							<svg class="icon" aria-hidden="true">
								<use :xlink:href="item.iconImg || '#iconyinhangqia'"></use>
							</svg>
							<span style="margin-right: 10px;">&nbsp;</span>{{item.payMethodName}}
						</u-col>
						<u-col span=1 text-align="right" class="pay_method_item">
							<icon v-if="activePay.payMethodCode===item.payMethodCode" type="success" size='22'
								class="selected" color="#F89800" @click="selectPay(item,index)" />
							<div v-if="activePay.payMethodCode!==item.payMethodCode" class="unselect"
								@click="selectPay(item,index)">
							</div>
						</u-col>
					</u-row>
				</view>
			</view>
		</view>

		<view class="content_bottom">
			<div class="bottom_button" @click="toPay">立即支付</div>
		</view>
		<u-modal v-model="IsShowVerificationCode" :show-cancel-button="true" confirm-text="确认支付" @cancel="cancel"
			@confirm="execIntPayOrder" :show-title="false" confirm-color="#ff9900" z-index="3">
			<view class="slot-content">
				<div>
					<div class="title">验证手机号</div>
					<div class="info">为了你的信息安全，验证码已发送至您在招商银行预留的手机号，请输入短信验证码。</div>
					<u-input v-model="verificationCode" placeholder="短信验证码" type="number" :border="true" />
					<div class="retrieve" @click="retrieve">{{retrieveBtnTxt}}</div>
				</div>
			</view>
		</u-modal>
	</view>
</template>

<script>
	let timer = null
	import Top from "../top/top.vue"
	export default {
		components: {
			Top
		},
		data() {
			return {
				activeMoney: '', //选择金额
				inputMoney: '',
				moneyList: [1000, 500, 200, 100, 50, 20],
				activePay: {},
				payMethodList: [],
				bizUserId: '',
				channelCode: '',
				payInfo: {},
				IsShowVerificationCode: false,
				verificationCode: '',
				depositResp: {},
				retrieveBtnTxt: '已发送，59s后可以再次发送'
			}
		},
		onLoad(options) {
			this.$api.request({
				url: 'member/paymethod/obtainPayMethod',
				data: {
					"bizUserId": sessionStorage.getItem("bizUserId"),
					"channelCode": sessionStorage.getItem("channelCode"),
					"sceneFlag": "h5_scene",
					"payStatus": "1" //类型，1：充值，2：消费
				},
				success: (res) => {
					console.log(res, "res");
					this.payInfo = res.payInfo
					this.payMethodList.push(...res.payInfo.payMethods)
				}
			})
		},
		methods: {
			selMoney(value) {
				this.activeMoney = value
				// this.inputMoney = ''
				this.inputMoney = value
			},
			changeMoney(e) {
				this.inputMoney = e.detail.value
				// this.activeMoney = ''
				this.activeMoney = e.detail.value
			},
			selectPay(value, index) {
				this.activePay = value
			},
			// 立即支付
			toPay() {
				let money = 0
				if (this.inputMoney == '') {
					money = this.activeMoney
				} else {
					money = this.inputMoney
				}
				money = money * 100 //元转换成分
				this.$api.request({
					url: 'order/payorderbill/deposit',
					data: {
						"bizUserId": sessionStorage.getItem("bizUserId"),
						"amount": money, //TODO 单位为分，注意转换
						"bankCardNo": this.activePay.bankCardNo, //选填
						"bankName": this.activePay.bankCardName, //选填
						"payMethodCode": this.activePay.payMethodCode,
						"source": 1
					},
					success: (res) => {
						this.depositResp = res
						this.IsShowVerificationCode = true
						this.countDown(59)
					}
				})
			},
			execIntPayOrder() {
				this.$api.request({
					url: 'order/payorderbill/execIntPayOrder',
					data: {
						"notifyUrl": "www.baidu.com",
						"bizUserId": sessionStorage.getItem("bizUserId"),
						"bizOrderNo": this.depositResp.bizOrderNo,
						"verificationCode":this.verificationCode,
						"tradeNo": this.depositResp.tradeNo,
						"channelCode": sessionStorage.getItem("channelCode"),
						"plaOrderNo": this.depositResp.plaOrderNo,
						"payMethodCode": this.activePay.payMethodCode,
						"channelId": this.depositResp.channelId
					},
					success: (res) => {
						this.IsShowVerificationCode = false
						this.verificationCode = ""
						uni.showModal({
						    title: '提示',
						    content: "充值成功！",
							showCancel:false,
						    success:(res) => {
						        if (res.confirm) {
						            this.$refs.top.goBack(); // 返回方法通用调用
						        } else if (res.cancel) {
						        }
						    }
						});
					},
					fail: (res) => {
						this.IsShowVerificationCode = true
						this.verificationCode = ""
						this.retrieveBtnTxt == "重新获取验证码"
					}
				})
			},
			cancel() {
				this.verificationCode = ""
			},
			retrieve() {
				if (this.retrieveBtnTxt == "重新获取验证码") {
					this.verificationCode = ""
					this.$api.request({
						url: 'order/payorderbill/execIntResendPaySMS',
						data: {
							"bizOrderNo": this.depositResp.bizOrderNo,
							"channelCode": sessionStorage.getItem("channelCode")
						},
						success: (res) => {
							this.retrieveBtnTxt = '已发送，59s后可以再次发送'
							this.countDown(59)
						},
						fail: (res) => {
							this.retrieveBtnTxt = '重新获取验证码'
						}
					})
				}
			},
			countDown(count) {
				clearInterval(timer)
				timer = setInterval(() => {
					count--
					if (count > 0) {
						this.retrieveBtnTxt = '已发送，' + count + 's后可以再次发送'
					} else {
						clearInterval(timer)
						this.retrieveBtnTxt = '重新获取验证码'
					}
				}, 1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rechargeDIV {
		width: 100vw;
		height: calc(100vh - 60px);
		background: #F7F7F7;
		font-size: $uni-font-size-base;
		overflow: scroll;
		.back {
			width: 100%;
			height: 50px;
			line-height: 50px;
			padding-left: 20px;
			background: white;
		}

		.back_arrow {
			width: 20px;
			height: 50px;
			float: left;
		}

		.back_title {
			width: calc(100% - 80px);
			height: 50px;
			float: left;
			text-align: center;
			font-size: 18px;
		}

		.content {
			width: 100%;
			height: auto;
		}

		.content_item {
			width: 100%;
			height: auto;
			margin-top: 10px;
			padding: 10px 20px 10px 20px;
			background: white;
		}

		.money_item {
			border: 1px solid #CCCCCC;
			border-radius: 4px;
			text-align: center;
			line-height: 48px;
			margin: auto;
			margin-top: 8px;
		}

		.active_money_item {
			border: 1px solid $uni-color-warning;
			border-radius: 4px;
			background: #FEF4E5;
			color: $uni-color-warning;
		}

		.content_label {
			margin: 10px 0;
			font-weight: bold;
			color: $u-content-color;
			font-size: $uni-font-size-lg;
		}

		.content_input {
			width: 100%;
			height: 50px;
		}

		.money_text {
			height: 50px;
			line-height: 50px;
			float: left;
			font-size: $uni-font-size-lg;
		}

		.money_input {
			height: 50px;
			float: left;
		}

		.pay_method {
			width: 100%;

			/* background:red; */
			.pay_method_item {
				line-height: 50px;
				height: 50px;
				font-size: $uni-font-size-lg;
			}

			.selected {
				margin-top: 0px;
				line-height: 50px;
				display: inline-block;
				vertical-align: middle;
			}

			.unselect {
				width: 20px;
				height: 20px;
				border: 1px solid #ccc;
				border-radius: 15px;
				display: inline-block;
				vertical-align: middle;
			}
		}

		.text_add {
			font-size: 36px;
			line-height: 45px;
		}

		.bank_img {
			width: 25px;
			height: 25px;
			margin-top: 13px;
			border-radius: 15px;
		}

		.content_bottom {
			width: 100%;
			height: 60px;
			background: white;
			position: fixed;
			left: 0px;
			bottom: 0px;
			/*background:white;*/
			text-align: center;
			padding: 0px 20px;
		}

		.bottom_button {
			width: 100%;
			height: 40px;
			background: #F39800;
			margin-top: 10px;
			color: white;
			border-radius: 8px;
			line-height: 40px;
		}

		.slot-content {
			font-size: 32rpx;
			color: $u-content-color;
			padding: 20px;

			.title {
				font-weight: bold;
				font-size: $uni-font-size-xlg;
				margin-bottom: 20px;
				text-align: center;
			}

			.info {
				margin: 40rpx 0;
			}

			.retrieve {
				margin-top: 40rpx;
				color: $uni-color-warning;
			}
		}
	}
</style>
