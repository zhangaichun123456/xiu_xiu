<template>
	<div class="modifyadminpw">
		<Form :label-width="150">
			<Form-item label="当前管理密码">
				<Input v-model="password" placeholder="请输入当前管理密码" type="text" style="width: 360px"></Input>
				<span class="formstar"><Icon type="asterisk"></Icon></span>
			</Form-item>
			<Form-item label="新管理密码">
				<Input v-model="newpassword" placeholder="请输入新的管理密码" type="password" style="width: 360px"></Input>
				<span class="formstar"><Icon type="asterisk"></Icon></span>
				<p class="tip">新密码必须包含数字、小写字母、大写字母,长度不低于6位,且不能与账号相同</p>
			</Form-item>
			<Form-item label="确认管理密码">
				<Input v-model="agginpassword" placeholder="请再次输入新的管理密码" type="password" style="width: 360px"></Input>
				<span class="formstar"><Icon type="asterisk"></Icon></span>
			</Form-item>
			<Form-item>
               <Button type="primary" @click="savepassword">保存</Button>
            </Form-item>
		</Form>
	</div>
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import qs from 'qs';
export default{
	data (){
		return {
			password:'',
			newpassword:'',
			agginpassword:'',
		}
	},
	computed:{
    ...mapState([
      'entId',
      'admintelnum',
    ]),
  },
	methods:{
		 ...mapMutations([
            ]),
		savepassword (){
			if(this.password==''||this.newpassword==''||this.agginpassword==''){
				this.$Message.error('请把表单填写完整');
			}else if(!/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,}$/.test(this.newpassword)){
				this.$Message.error('新密码必须包含数字、小写字母、大写字母,长度不低于6位');
			}else if(this.agginpassword!=this.newpassword){
				this.$Message.error('两次输入密码不一致，请重新输入');
			}else{
				// 发出后台
				var pramas={
	    			entId:this.entId,
	    			telNo:this.admintelnum,
	    			password:this.password,
	    			newpwd:this.newpassword,
	    		}
	    		this.axios.post(this.baseurl+'shezhi/deitpwd',qs.stringify(pramas)).then((res)=>{
	    			var res=res.data;
	    			if(res.code==0){
                         this.$Message.success('修改成功');
                         this.axios.post(this.baseurl+'logout').then((res)=>{
					        var res=res.data;
					        if(res.code==0){
					          this.$router.push('/login');
					        }
					       })
	    			}else{
	    				this.$Message.error(res.msg);
	    			}
	    		  })
			}
		}
	}
}	
</script>
<style scoped>
.modifyadminpw{
	margin: 10px;
	background-color: #fff;
	min-height: 600px;
	padding-top: 50px;
}
.formstar{
  color: #e41d14;
}
.tip{
	padding-top: 10px;
	font-size: 12px;
	color: #9a9a9a;
}
button{
	width: 120px;
	height: 36px;
	font-size: 14px;
	background-color: #475cc7;
}
</style>