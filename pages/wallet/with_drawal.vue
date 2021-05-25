<template>
	<view class="with-drawal">
		<Top title='提现' ref="top"></Top>
		<view class="content">
			<view v-if="showBankEntrance" class="content_item" style="padding:0px 20px;">

				<u-row gutter="16" justify="fix" align="center">
					<u-col span="1">
						<span class="money_text">
							<svg class="icon" aria-hidden="true">
								<use :xlink:href="bankInfo.iconImg || '#iconyinhangqia'"></use>
							</svg>
						</span>
					</u-col>
					<u-col span="10">
						{{bankInfo.bankName}}
					</u-col>
					<u-col span="1">
						<u-icon name="arrow-right" @click="goBank()"></u-icon>
					</u-col>
				</u-row>
			</view>

			<view class="content_item">
				<div class="content_label">提现金额</div>
				<div class="content_input">
					<u-row gutter="16" justify="space-between" align="center">
						<u-col span="1">
							<span class="money_text">￥</span>
						</u-col>
						<u-col span="5">
							<u-input v-model="inputMoney" type="number" placeholder="输入其他金额" height="50"
								style="font-size: 20px;" />
						</u-col>
						<u-col span="6" class="content_input_right" text-align="right">
							<div class="label1"><span @click="allin">全部</span></div>
							<div class="lable2">可用余额{{this.$tools.formatMoney(money)}}元</div>
						</u-col>
					</u-row>
				</div>
			</view>
			<view class="content_bottom">
				<div class="content_button" @click="withDrawal">提现</div>
			</view>
		</view>

		<u-popup v-model="showBankPicker" mode="bottom" height="30%">
			<view class="bank_type_content">
				<u-row gutter="16" justify="space-between" align="center">
					<u-col span="10">
						<span style="font-size:18px;font-weight: bold;">请选择到账银行卡</span>
					</u-col>
					<u-col span="1">
						<u-icon name="close" size="28" @click="cancelChooseBank"></u-icon>
					</u-col>
				</u-row>
				<div class="bank_type_content_list">
					<u-row class="bank_line" v-for="(item,index) in bankList" gutter="16" justify="space-between"
						align="center" @click='chooseBank(item)'>
						<u-col span="1">
							<span class="money_text">
								<svg class="icon" aria-hidden="true">
									<use :xlink:href="item.iconImg || '#iconyinhangqia'"></use>
								</svg>
							</span>
						</u-col>
						<u-col span="11" class="bank-name">
							{{item.bankName}}
						</u-col>
					</u-row>
				</div>

			</view>
		</u-popup>
		<u-modal v-model="confirmShow" :show-title="false" confirm-color='#F39800' @confirm="goAddBank">
			<view class="slot-content">
				<rich-text nodes="使用提现功能需要添加<br>一张支持提现的储蓄卡"></rich-text>
			</view>
		</u-modal>
		<u-modal v-model="IsShowVerificationCode" :show-cancel-button="true" confirm-text="确认提现" @cancel="cancel"
			@confirm="confirmWithDrawal" :show-title="false" confirm-color="#ff9900" z-index="3">
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
		props: [],
		components: {
			Top
		},
		data() {
			return {
				money: '', //可用余额
				inputMoney: '',
				payType: '',
				bankInfo: {
					bankCardNo: "-2",
					bankCardPro: "",
					bankName: "支付宝",
					bindMethod: "",
					bindState: "0",
					cardType: "zhifubao", //	银行卡类型 1：借记卡2：信用卡  zhifubao： 表示支付宝，
				},
				bankList: [],
				confirmShow: false, // 添加卡提示展示标示
				showBankEntrance: false, //是否展示顶部已选银行卡信息
				showBankPicker: false, //选择银行卡展示 标示
				IsShowVerificationCode: false,
				verificationCode: '',
				depositResp: {},
				retrieveBtnTxt: '已发送，59s后可以再次发送'
			}
		},
		onLoad(option) {
			if (option.payType != undefined) {
				this.payType = option.payType
			}
			this.getData()
		},
		onShow() {
			this.getData()
		},
		methods: {
			// 银行类型选择确定
			cancelChooseBank() {
				this.showBankPicker = false
			},
			getData() {
				this.$api.request({
					url: 'member/paywallet/queryBalance',
					data: {
						bizUserId: sessionStorage.getItem("bizUserId"),
						channelCode: sessionStorage.getItem("channelCode")
					},
					success: (res) => {
						console.log(res, "res")
						let total = Number.parseFloat(res.totalMoney)
						let freezeMoney = Number.parseFloat(res.freezeMoney)
						this.money = total - freezeMoney;

					}
				})
				this.$api.request({
					url: 'member/paymember/queryBankCard',
					data: {
						bizUserId: sessionStorage.getItem("bizUserId"),
						channelCode: sessionStorage.getItem("channelCode")
					},
					success: (res) => {
						console.log(res, "res")
						if (res.bindCardList && res.bindCardList.length > 0) {
							this.bankInfo = res.bindCardList[0]
							this.bankList = res.bindCardList;
							this.showBankEntrance = true
						} else {
							this.confirmShow = true
						}
					}
				})
			},
			allin() {
				this.inputMoney = this.money / 100 //分转化成元
			},
			// 选择银行卡列表
			goBank(currentBank) {
				this.showBankPicker = true
			},
			// 列表中选择某个银行卡
			chooseBank(currentBank) {
				this.showBankPicker = false
				this.bankInfo = currentBank
			},
			// 跳转添加银行卡
			goAddBank() {
				uni.navigateTo({
					url: '../bank/add_bank?params=' + this.$tools.setParams4url({
						returnURL: '../wallet/with_drawal?payType=this.payType',
						type: 'add'
					})
				})
			},
			// 请求提现
			withDrawal() {
				this.IsShowVerificationCode = true
				this.$api.request({
					url: '', //todo 现在有问题。
					data: {
						"bizUserId": sessionStorage.getItem("bizUserId"),
						"amount": this.inputMoney * 100, //元转化成分 单位为分，注意转换
						"withdrawType": 1,
						"bankCardNo": "",
						"bankCardPro": "1",
						"source": 1,
						"channelCode": ""
					},
					success: (res) => {
						this.depositResp = res
						this.IsShowVerificationCode = true
						this.countDown(59)
					}
				})

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
			},
			confirmWithDrawal() {
				this.$api.request({
					url: 'order/payorderbill/execIntPayOrder',
					data: {
						"notifyUrl": "www.baidu.com",
						"bizUserId": sessionStorage.getItem("bizUserId"),
						"bizOrderNo": this.depositResp.bizOrderNo,
						"verificationCode": 527678, //this.verificationCode,
						"tradeNo": this.depositResp.tradeNo,
						"channelCode": sessionStorage.getItem("channelCode"),
						"plaOrderNo": this.depositResp.plaOrderNo,
						"payMethodCode": this.activePay.payMethodCode,
						"channelId": this.activePay.channelId
					},
					success: (res) => {
						this.IsShowVerificationCode = false
						this.verificationCode = ""
						uni.showModal({
						    title: '提示',
						    content: "提现成功！",
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
			}
		}
	}
</script>

<style lang="scss">
	.with-drawal {
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
		}


		.money_text {
			height: 50px;
			line-height: 50px;
			float: left;
			font-size: 20px;
		}


		.label1 {
			width: 100%;
			height: 30px;
			line-height: 30px;
			font-size: 16px;
			color: #F39800;
		}

		.lable2 {
			width: 100%;
			height: 20px;
			line-height: 20px;
			color: #8A8C8E;
			font-size: 15px;
		}

		.content_bottom {
			width: 100%;
			height: auto;
			margin-top: 10px;
			padding: 20px;
		}

		.content_button {
			width: 100%;
			height: 40px;
			background: #F39800;
			margin-top: 10px;
			color: white;
			border-radius: 8px;
			line-height: 40px;
			text-align: center;
		}

		.bank_type_content {
			width: 100%;
			height: 100%;
			padding: 20px;
			border-radius: 8px;
		}

		.slot-content {
			font-size: 28rpx;
			color: $u-content-color;
			margin: 20px;
			text-align: center;
		}

		.bank_type_content_list {
			margin-top: 10px;

			.bank-name {
				padding-left: 1rem;
			}

			.bank_line {
				border-bottom: 1px solid $uni-border-color;
			}
		}
	}
</style>
