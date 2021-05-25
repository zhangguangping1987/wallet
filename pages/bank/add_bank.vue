<template>
	<view class="add_bank">
		<Top ref="top" title='添加银行卡'></Top>
		<view class="content">
			<div class="content_title">添加银行卡</div>
			<view v-if="type != 'add'" class="text_label">完成实名认证需要添加本人银行卡</view>
			<view class="form_item" style="margin-top:20px;">
				<view class="form_label">银行卡号</view>
				<view class="form_right">
					<input @input="changeBankNum" @confirm="checkBankType" @blur="checkBankType" :value="info.bank_no"
						placeholder="请输入银行卡号" class="form_input" />
				</view>
			</view>
			<view class="form_item" @click="clickBankType">
				<view class="form_label">银行卡类型</view>
				<view class="form_right">
					{{info.bank_type}}
					<u-icon v-if="!info.bank_type" name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="form_item">
				<view class="form_label">预留手机号</view>
				<view class="form_right">
					<input @input="changePhoneNum" :value="info.phoneNum" placeholder="请输入银行预留手机号" class="form_input" />
				</view>
			</view>
		</view>

		<view class="content_bottom">
			<u-button type="warning" size="default" @click="next()">下一步</u-button>
		</view>

		<u-modal v-model="IsShowVerificationCode" :show-cancel-button="true" confirm-text="确认绑定" @cancel="cancel"
			@confirm="bindBankCard" :show-title="false" confirm-color="#ff9900" z-index="3">
			<view class="slot-content">
				<div>
					<div class="title">验证手机号</div>
					<div class="info">为了你的信息安全，验证码已发送至您在招商银行预留的手机号，请输入短信验证码。</div>
					<u-input v-model="verificationCode" placeholder="短信验证码" type="number" :border="true" />
				</div>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import Top from "../top/top.vue"
	let timer = null
	export default {
		props: [],
		components: {
			Top
		},
		data() {
			return {
				isAdd: false,
				info: {
					bank_no: '',
					bank_type: '',
					phoneNum: ''
				},
				type: 'add',
				returnURL: '',
				params: {},
				selectBank: {},
				IsShowVerificationCode: false,
				verificationCode: '',
				depositResp: {}
			}
		},
		onLoad(options) {
			this.params = this.$tools.getParams4url(options.params)
			this.type = this.params.type

		},
		onShow() {
			this.selectBank = sessionStorage.getItem('bank_type_list-selectBank')
			if (this.selectBank) {
				this.selectBank = JSON.parse(this.selectBank)
				this.info.bank_type = this.selectBank.bankName
			}
		},
		onUnload() {
			sessionStorage.removeItem('bank_type_list-selectBank')
		},
		methods: {

			changeBankNum(e) {
				this.info.bank_no = e.detail.value
			},
			checkBankType() {
				if (!this.info.bank_no) {
					return
				}
				this.$api.request({
					url: 'member/paymember/queryBankInfoByCardNo',
					methods: 'post',
					data: {
						"cardNo": this.info.bank_no,
						"channelCode": sessionStorage.getItem("channelCode")
					},
					success: (res) => {
						let carbin = res.cardBinInfo
						this.info.bank_type = carbin.bankName + carbin.cardTypeLabel
					}
				})
			},
			changeBankType(e) {
				this.info.bank_type = e.detail.value
			},
			changePhoneNum(e) {
				this.info.phoneNum = e.detail.value
			},
			clickBankType() {
				this.change_bank_type = true
				uni.navigateTo({
					url: '../bank/bank_type_list'
				})
			},
			next() {
				this.checkBankType()
				this.$api.request({
					url: 'member/paymember/applyBindBankCard',
					data: {
						"bizUserId": sessionStorage.getItem("bizUserId"),
						"cardNo": this.info.bank_no,
						"phone": this.info.phoneNum,
						"channelCode": sessionStorage.getItem("channelCode")
					},
					success: (res) => {
						this.IsShowVerificationCode = true
						this.depositResp = res
						sessionStorage.setItem("tranceNum", this.depositResp.tranceNum)
					},

					fail: (res) => {
						this.IsShowVerificationCode = false
						this.verificationCode = ""
					}
				})

			},
			cancel() {
				this.verificationCode = ""
			},
			bindBankCard() {
				this.$api.request({
					url: 'member/paymember/bindBankCard',
					data: {
						"bizUserId": sessionStorage.getItem("bizUserId"),
						"phone": this.info.phoneNum,
						"cardNo": this.info.bank_no,
						"verificationCode": this.verificationCode,
						"tranceNum": this.depositResp.tranceNum || sessionStorage.getItem("tranceNum"),
						"transDate": this.depositResp.transDate || new Date(),
						"channelCode": sessionStorage.getItem("channelCode")
					},
					success: (res) => {
						sessionStorage.removeItem("tranceNum")
						this.IsShowVerificationCode = false
						uni.showModal({
							title: '提示',
							content: "银行卡绑定成功！",
							showCancel: false,
							success: (res) => {
								if (res.confirm) {
									this.$refs.top.goBack(); // 返回方法通用调用
								} else if (res.cancel) {}
							}
						});
					},
					fail: (res) => {
						this.verificationCode = ""
						this.IsShowVerificationCode = true
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.add_bank {
		.content {
			padding: 0px 20px;
		}

		.content_title {
			font-weight: bold;
			font-size: $uni-font-size-lg;
			color: #66645D;
		}

		.text_label {
			width: 100%;
			margin-top: 20px;
			margin-bottom: 20px;
			font-size: 14px;
			color: #66645D;
		}

		.form_item {
			color: #66645D;
			height: 49px;
			font-size: 18px;
			/* display: flex; */
			/* align-items: center; */
			/* justify-content: space-between; */
			border-bottom: 1px solid #EEEEEE;
		}

		.form_label {
			width: 100px;
			float: left;

			margin-top: 13px;
		}

		.form_right {
			width: calc(100% - 100px);
			float: left;
			text-align: right;
			margin-top: 13px;
		}

		.form_input {
			height: 24px;
			line-height: 24px;
			text-align: right;
			color: #8A8C8E;
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
		}
	}
</style>
