<template>
	<view class="bank_list">
		<Top title='银行卡' ref="top"></Top>
		<view class="content">
			<view class="content_item">
				
				<div v-for="(item,index) in bankList" class="bank_card" @click="selBank(item)">
					<u-row gutter="16" justify="space-between" align="center">
						<u-col span="2" text-align="right">
							<span class="bank_card_top">
								<svg class="icon" aria-hidden="true">
									<use xlink:href="#iconyinhangqia"></use>
								</svg>
							</span>
						</u-col>
						<u-col span="10" class="bank_card_label">
							{{item.bankName}}
						</u-col>
					</u-row>
					<u-row gutter="16" justify="space-between" align="center">
					<u-col span="2">
					
					</u-col>
					<u-col span="10" class="bank_card_number">
						{{formatCardNum(item.bankCardNo)}}
					</u-col>
					</u-row>
				</div>
			</view>
			
			<view class="content_item_add">
				<div class="content_button_add" @click="addBank">
					<div class="label_add_icon">+</div>
					<div class="label_add_text">添加银行卡</div>
				</div>
			</view>
		</view>
	</view>
</template>

<script>
	import Top from "../top/top.vue"
	export default {
		props:[],
		components: {
			Top
		},
		data(){
			return {
				type:'',//withdrawal:提现   index:钱包首页
				payType:'',
				bankList:[],
			}
		},
		onLoad(option) {
			this.type = option.type
		},
		onShow(){
			this.getBankList()
		},
		methods:{
			getBankList(){
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
						}else{
							this.bankList =[]
						}
					}
				})
			},
			formatCardNum(value){
				let str = value.substr(value.length-4)
				let result = "•••• ••••• •••• " + str
				return result
			},
			selBank(value){
				uni.navigateTo({
					url:'./bank_detail?params='+this.$tools.setParams4url({bankCardNo:value.bankCardNo})
				})
			},
			// 添加银行卡
			addBank(){
				uni.navigateTo({
					url:'./add_bank?params='+this.$tools.setParams4url({type:'add'})
				})
			}
		}
	}
	
</script>

<style lang="scss">
	.bank_list{
		width:100vw;
		height:100vh;
		background:#F7F7F7;
		.content{
			width:100%;
			height:auto;
		}
		.content_item{
			width:100%;
			height:auto;
			padding:20px 20px;
		}
		.bank_card{
			height:150px;
			background:rgba(255,0,0,0.6);
			border-radius: 8px;
			margin-top:10px;
			padding:0px 20px;
			 &:first-child{
				 margin-top:0;
			 }
		}
		.bank_card_top{
			height:auto;
			font-size: 24px;
		}

		.bank_card_label{
			height:50px;
			line-height: 50px;
			margin:20px 0;
			padding-left:10px;
			color:white;
			font-size:20px;
		}
		.bank_card_bottom{
			width:100%;
			height:50px;
			margin-top:40px;
			text-shadow:#666666 3px 4px 5px;
		}
		.bank_card_number{
			height:50px;
			text-align: center;
			line-height: 50px;
			font-size:24px;
			color:white;
		}
		
		.content_item_add{
			width:100%;
			height:auto;
			padding:0 20px 20px 20px;
			.content_button_add{
				height:50px;
				background:white;
				padding:0px 20px;
				border: 1px solid #f1f1f2;
			}
			.label_add_icon{
				width:36px;
				height:50px;
				font-size: 36px;
				line-height: 45px;
				float:left;
			}
			.label_add_text{
				width:calc(100% - 36px);
				height:50px;
				float:left;
				line-height: 50px;
			}
		}
	}
</style>
