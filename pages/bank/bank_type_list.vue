<template>
	<view class="bank_type_list">
		<Top ref="top" title='银行列表'></Top>
		<view class="content">
			<div class="content_title">选择银行卡</div>
			<scroll-view style="height:calc(100% - 60px)" :scroll-top="scrollTop" scroll-y="true" class="scroll-Y"
				@scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
				<view class="content_item" v-if="total > 0">
					<u-row v-for="(item,index) in bankList" :key="index"
						:class="item.bankCode==sel_bank.bankCode?'content_item_active':''" @click='selBank(item)'
						gutter="16" justify="space-between" align="center" class="content_item">
						<u-col span="1">
							<svg class="icon" aria-hidden="true">
								<use :xlink:href="item.bankLogo ||'#iconyinhangqia'"></use>
							</svg>
						</u-col>
						<u-col span="11" text-align="left">
							{{item.bankName}}
						</u-col>
					</u-row>
				</view>

				<u-empty v-if="total <= 0" text="暂无数据" mode="data"></u-empty>
			</scroll-view>
			<view @tap="goTop" v-if="pages > 2" class="goTopLink">
				点击这里返回顶部
			</view>
		</view>
	</view>
</template>

<script>

	import Top from "../top/top.vue"
	const pageSize = 15
	export default {
		props: [],
		components: {
			Top
		},
		data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				currentPage: 1,
				pages: 0,
				total: 0,
				bankList: [],
				sel_bank: {}
			}
		},
		mounted() {

		},
		onShow() {
			this.getBankList()
		},
		onLoad(options) {
		},
		methods: {
			upper: function(e) {
				this.currentPage = this.currentPage - 1
				if (this.currentPage <= 0) {
					this.currentPage = 0
					this.bankList.length = 0
				} else {
					this.getBankList()
				}
			},
			lower: function(e) {
				this.currentPage = this.currentPage + 1
				if (this.currentPage > this.pages) {
					this.currentPage = this.pages
				} else {
					this.getBankList()
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
			selBank(value) {
				this.sel_bank = value
				sessionStorage.setItem('bank_type_list-selectBank',JSON.stringify(this.sel_bank))
				this.$refs.top.goBack(); // 返回方法通用调用
			},
			getBankList() {
				this.$api.request({
					url: 'member/paymember/queryBankList',
					methods:'post',
					data: {
						current	: this.currentPage,
						size: pageSize
					},
					success: (res) => {
						this.total = res.total
						this.pages = res.pages
						this.bankList.push(...res.records)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.bank_type_list {
		width: 100vw;
		height: 100vh;
		.content {
			padding: 0px 20px;
			color: #66645D;
			height: calc(100% - 60px);
			.content_title {
				font-weight: bold;
				font-size: $uni-font-size-lg;
				color: #66645D;
				margin-bottom: 20px;
			}
		}

		.content_item {
			width: 100%;
			height: 50px;
			border-bottom: 1px solid #eee;
		}

		.content_item_active {
			background: rgba(255, 165, 00, 0.1);
		}
		.goTopLink{
					text-align: center;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-grey;
		}
	}
</style>
