<template>
	<view class="identity">
		<Top title='实名认证' ref="top"></Top>
		<view class="form_content">
			<div class="displaybody">
				<div class="title">填写身份信息</div>
				<u-form :model="form" ref="uForm" label-width="190">
					<u-form-item label="姓    名" prop="name">
						<u-input v-model="form.name" placeholder="请输入姓名" type="text" input-align="right"/>
					</u-form-item>
					<u-form-item label="证件类型">
						<div style="text-align: right;width: 100%;">身份证</div>
					</u-form-item>
					<u-form-item label="证件号码" prop="identityCardNo">
						<u-input v-model="form.identityCardNo" placeholder="请输入证件号码" type="text" input-align="right"/>
					</u-form-item>
				</u-form>
			</div>
			<div class="bottom">
				<u-button type="warning" size="default" @click="goIdentity()">下一步</u-button>
			</div>
		</view>
	</view>
</template>

<script>
	import Top from "../top/top.vue"
	export default {
		components:{Top},
		data() {
			return {
				identityTypeCode:1,
				form: {
					identityTypeCodeTXT: "", //证件类型 1：身份证2：护照3：军官证4：回乡证5：台胞证6：警官证7：士兵证99：其它证件
					identityCardNo: "",
					isAuth: true,
					name: "",
				},
				rules: {
					name: [
						{
							required: true,
							message: '请输入姓名',
							trigger: ['blur', 'change']
						}
					],
					identityCardNo: [
						{
							required: true,
							message: '请输入证件号码',
							trigger: ['blur', 'change']
						}
					],
					identityTypeCodeTXT: [
						{
							required: true,
							message: '请输选择证件类型',
							trigger: ['blur', 'change']
						}
					]
				},
		}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			goIdentity() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						let obj={
							 "bizUserId": sessionStorage.getItem("bizUserId"),
							  "identityTypeCode": this.identityTypeCode,
							  "identityCardNo": this.form.identityCardNo,
							  "identityBeginDate": "",
							  "identityEndDate": "",
							  "address": "",
							  "professionNo": "",
							  "telephone": "",
							  "name": this.form.name,
							  "channelCode": sessionStorage.getItem("channelCode")
						}
						this.$api.request({
							url: 'member/paymember/personsVerify',
							methods: 'post',
							data: obj,
							success: (res) => {
								this.goAddBankCard()
							}
						})
					}
				});
			},
			goAddBankCard(){
				uni.redirectTo({
					url: '../bank/add_bank?params='+this.$tools.setParams4url({returnURL:'../identity/identityIndex',type:'identity'})
				})
			}
		}
	}
</script>

<style lang="scss">
	.identity {
		height: 100vh;
		.form_content{
			padding: 40px;
			display: flex;
			height: calc(100vh - 60px);
			flex-flow: row wrap;/*×使用行布局，并可以换行。*/ 
			.displaybody{
				align-self: flex-start;
				height: 70%;
				width: 100%;
				.title{
					font-weight: bold;
					font-size: $uni-font-size-lg;
					margin-bottom: 20px;
				}
			}
			.bottom{
				align-self: flex-end;
				height: 50px;
				width: 100%;
			}
		}
	}
</style>
