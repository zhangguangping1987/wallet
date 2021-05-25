<template>
		<view v-if="isShowWallet" class="myWalletIndex">
			<Top title='我的钱包' topStyle="background:#ff9900;color:white;" ref="top"></Top>
			<view class="back_card">
				<view class="content_top">
					<view class="title_text">钱包总余额（元）</view>
					<view class="money">{{this.$tools.formatMoney(money)}}</view>
				</view>
				<view class="content_middle">
					<u-row gutter="16" justify="space-between" align="center">
						<u-col span="6" text-align="center">
							<u-button type="warning" size="medium" plain @click="Recharge">充值</u-button>
						</u-col>
						<u-col span="6" text-align="center">
							<u-button type="warning" size="medium" plain @click="Withdrawal">提现</u-button>
						</u-col>
					</u-row>
				</view>
			</view>
			<view class="content_bottom">
				<u-row gutter="16" justify="fix" align="center" class="index_row" @click="goBank()">
					<u-col span="1" style="font-size: 20px;">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#iconyinhangqia"></use>
						</svg>
					</u-col>
					<u-col span="10">
						银行卡
					</u-col>
					<u-col span="1">
						<u-icon name="arrow-right"></u-icon>
					</u-col>
				</u-row>
				<u-row gutter="16" justify="fix" align="center" class="index_row" @click="goWalletDetail()">
					<u-col span="1" class="bigIcon">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#iconqianbao1"></use>
						</svg>
					</u-col>
					<u-col span="10">
						钱包明细
					</u-col>
					<u-col span="1">
						<u-icon name="arrow-right"></u-icon>
					</u-col>
				</u-row>
			</view>
		</view>
</template>

<script>
	import Top from "../top/top.vue"
	export default {
		components: {
			Top
		},
		data() {
			return {
				money: '',
				bizUserId: '',
				channelCode: '',
				isShowWallet: false
			}
		},
		onLoad(options) {
			this.bizUserId = options.bizUserId || '18563534425test' //zhanggp11
			this.channelCode = options.channelCode || 'daojia'
			sessionStorage.setItem("bizUserId", this.bizUserId) //如果存储敏感需要加密，获取的时候需要解密
			sessionStorage.setItem("channelCode", this.channelCode)
		},
		onShow(){
			this.checkIdentity()
		},
		methods: {
			checkIdentity(){
				this.$api.request({
					url: 'member/paymember/isIdentityChecked',
					methods: 'post',
					data: {
						bizUserId: this.bizUserId
					},
					success: (res) => {
						if (res.isIdentityChecked == true) {
							this.getMoney()
							this.isShowWallet = true
						} else {
							this.isShowWallet = false
							uni.redirectTo({
								url: '../infoDisplay/infoDisplay?params=' + this.$tools.setParams4url({
									type: 'error',
									title: '实名认证',
									infoContent:'根据法律规定，用户实名认证之后方可使用钱包业务',
									navigateURL:'../identity/identityIndex',
									confirmBtnText:'实名认证'
								})
							})
						}
					}
				})
			},
			getMoney() {
				let obj = {
					bizUserId: this.bizUserId,
					channelCode: this.channelCode
				}
				console.log("获取余额")

				this.$api.request({
					url: 'member/paywallet/queryBalance',
					methods: 'post',
					data: obj,
					success: (res) => {
						console.log(res, "res")
						this.money = res.totalMoney
					}
				})

			},
			// 充值
			Recharge() {
				uni.navigateTo({
					url: '../wallet/recharge'
				})
			},
			// 提现
			Withdrawal() {
				uni.navigateTo({
					url: '../wallet/with_drawal'
				})
			},
			// 银行卡
			goBank() {
				uni.navigateTo({
					url: '../bank/bank_list?type=index'
				})
			},
			// 钱包明细
			goWalletDetail() {
				uni.navigateTo({
					url: '../wallet/wallet_detail'
				})
			}
		}
	}
</script>

<style lang="scss">
	.myWalletIndex {
		width: 100%;
		height: 100vh;
		background: linear-gradient(to bottom, $uni-color-warning 0%, $uni-color-warning 25%, #ffffff 25%, #ffffff 100%);

		/* 标准语法 (必须在最后) */
		.back_card {
			width: calc(100% - 40px);
			margin: 0 auto;
			padding: 40px;
			background: $uni-bg-color;
			border-radius: 8px;
			box-shadow: 0 0 8px $uni-border-color;
		}

		.content_top {
			width: 100%;
			text-align: center;
			margin-bottom: 20px;
		}

		.title_text {
			margin-bottom: 10px;
		}

		.money {
			font-size: 36px;
		}

		.content_middle {
			width: 100%;
			text-align: center;
		}

		.bigIcon {
			color: $uni-color-warning;
			font-size: 20px;
		}

		.content_bottom {
			width: 100%;
			padding: 20px;

			.index_row {
				height: 50px;
				line-height: 50px;
			}
		}
	}

</style>
