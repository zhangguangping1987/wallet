<template>
	<view class="wallet_detail">
		<Top title='钱包明细' ref="top"></Top>
		<scroll-view style="height:calc(100% - 60px);" :scroll-top="scrollTop" scroll-y="true" class="scroll-Y"
			@scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
			<view class="content">
				<!-- <u-sticky offset-top="40"> -->
					<view class="content_item">
						<div>
							<picker style="color: #666666;" mode="date" fields="month" :end="end" :start="start"
								:value="currentDate" @change="changeDate">
								<!-- :start="startTime" :end="endTime" -->
								<span style="font-size:20px;">{{currentDateShow}}</span>
								<u-icon name="arrow-down-fill" size="10"></u-icon>
							</picker>
						</div>
						<div class="content_item_top_label">
							<span>支出 ￥{{this.$tools.formatMoney(outAmount)}}</span><span style="margin-left: 18px;">收入
								￥{{this.$tools.formatMoney(inAmount)}}</span>
						</div>
					</view>
				<!-- </u-sticky> -->
				<view class="content_item" style="padding:0px 20px" v-if="total > 0">
					<u-row v-for="(item,index) in walletDetailList" gutter="16" justify="space-between"
						align="center" class="detail_item">
						<u-col span="9" class="detail_item_left">
							<div class="detail_item_left_top">{{item.remarks}}<span style="visibility: hidden;">11</span></div>
							<div class="detail_item_left_bottom">{{item.createDate}}</div>
						</u-col>
						<u-col span="3" class="detail_item_right" text-align="right">
							<span v-show="item.payMoney > 0" class="money_label">+{{item.payMoney}}</span>
							<span v-show="item.payMoney < 0" >-{{item.payMoney}}</span>
						</u-col>
					</u-row>
				</view>

				<u-empty v-if="total <= 0" text="暂无数据" mode="data"></u-empty>
			</view>
		</scroll-view>
		<view @tap="goTop" class="goTopLink" v-if="pages > 2">
			点击这里返回顶部
		</view>
	</view>
</template>

<script>
	const pageSize = 10
	import Top from "../top/top.vue"
	export default {
		components: {
			Top
		},
		data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				end: this.$tools.formatDate(new Date(), 'yyyy-MM-dd'),
				start: (new Date().getFullYear() - 100) + new Date().toLocaleDateString().replace(/(\/)/g, '-').slice(4),
				currentDate: '',
				currentDateShow: '',
				headerFixed: false,
				outAmount: 0,
				inAmount: 0,
				walletDetailList:  [],
				currentPage: 1,
				pages: 0,
				total: 0
			}
		},
		watch: {
			currentDate(current) {
				this.currentDateShow = current.replace('-', '年') + '月'
			}
		},
		onLoad() {
			this.currentDate = this.$tools.formatDate(new Date(), 'yyyy-MM')
			// this.walletDetailList.length = 0
			this.getWalletDetailList()
		},
		methods: {
			upper: function(e) {
				this.currentPage = this.currentPage - 1
				if (this.currentPage <= 0) {
					this.currentPage = 0
					this.walletDetailList.length = 0
				} else {
					this.getWalletDetailList()
				}
			},
			lower: function(e) {
				this.currentPage = this.currentPage + 1
				if (this.currentPage > this.pages) {
					this.currentPage = this.pages
				} else {
					this.getWalletDetailList()
				}
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				uni.showToast({
					icon: "none",
					title: "回到顶部0"
				})
			},
			changeDate(e) {
				this.currentDate = e.detail.value.substr(0, 7)
				this.getWalletDetailList()
			},
			getWalletDetailList() {
				this.$api.request({
					url: 'order/paywalletbill/walletBillList',
					data: {
						bizUserId: sessionStorage.getItem("bizUserId"),
						//channelCode: sessionStorage.getItem("channelCode"),//参数channelCode字段不传，钱包充值不是业务平台发起的，所以不传、。
						startDate: this.$tools.getCurrentMonthFirstDay(this.currentDate),
						endDate: this.$tools.getCurrentMonthLastDay(this.currentDate),
						current: this.currentPage,
						size: pageSize
					},
					success: (res) => {
						this.total = res.total
						this.pages = res.pages
						this.walletDetailList.push(...res.records)
						this.outAmount = res.outAmount
						this.inAmount = res.inAmount
					}
				})
			}
		},
		destroyed() {
		}
	}
</script>

<style lang="scss">
	.wallet_detail {
		width: 100vw;
		height: 100vh;
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
		.detail_item_left{
			.detail_item_left_top{
				font-size: $uni-font-size-lg;
				line-height: 18px;
				margin: 20px auto 10px 0;
			}
			.detail_item_left_bottom{
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
				margin: 10px auto 20px 0;
			}
		}

		.none_data {
			color: #8A8C8E;
		}

		.content_item_top_label {
			margin-top: 20px;
			color: #8A8C8E;
		}

		.detail_item {
			width: 100%;
			border-bottom: 1px solid #EEEEEE;
		}

		.detail_item:last-child {
			border: none;
		}

		.money_label {
			color: #F39800;
		}
		.goTopLink{
			text-align: center;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
		}
	}
</style>
