<template>
	<div class="replacemainadmin">
	    <div class="step1" v-show="step=='one'">
		    <p class="head">换绑主管理账号，需要验证当前主管理账号的身份</p>
			<Form :label-width="170">
				<Form-item label="当前管理员">
				    <Input v-model="companyinfo.username" disabled style="width: 360px"></Input>
				</Form-item>
				<Form-item label="手机号">
					<Input v-model="admintelnum" disabled style="width: 360px"></Input>
				</Form-item>
				<Form-item label="验证码">
					<Input v-model="VeriCode" placeholder="请输入验证码"style="width: 360px"></Input>
					<Button v-show="!sendCode" type="primary" @click="getVerifyCode">获取验证码</Button>
					<Button v-show="sendCode" disabled type="primary">{{Times}}s</Button>
					<span class="formstar"><Icon type="asterisk"></Icon></span>
				</Form-item>
				<Form-item>
	               <Button type="primary" @click="nextstep">下一步</Button>
	            </Form-item>
			</Form>
		</div>
		<div class="step2" v-show="step=='two'">
			<p class="head">修改完成后，绑定的安全手机号都会修改</p>
			<Form :label-width="170">
				<Form-item label="绑定咻咻账号">
					<Select v-model="accout" style="width:360px" @on-change="getoption($event)">
						<Option v-for="item in emplist" :value="item.empId" :key="item.empId">{{item.name}}:{{item.telno}}</Option>
					</Select>
				</Form-item>
				<Form-item label="手机号">
					<Input v-model="tel" disabled style="width: 360px"></Input>
				</Form-item>
				<Form-item label="验证码">
					<Input v-model="VeriCode1" placeholder="请输入验证码"style="width: 360px"></Input>
					<Button v-show="!sendCode1" type="primary" @click="getVerifyCode1">获取验证码</Button>
					<Button v-show="sendCode1" disabled type="primary">{{Times1}}s</Button>
					<span class="formstar"><Icon type="asterisk"></Icon></span>
				</Form-item>
				<Form-item>
	               <Button type="primary" @click="submitbtn">下一步</Button>
	            </Form-item>
			</Form>
		</div>
	</div>
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import qs from 'qs';
export default{
	data (){
		return {
			step:'one',
			tel:'',
			VeriCode:'',
			Times:'60',
			sendCode:false,
			vcode:'',
			VeriCode1:'',
			Times1:'60',
			sendCode1:false,
			vcode1:'',
			accout:null,
			emplist:[],
		}
	},
	mounted:function(){
        this.$nextTick(function(){
        })     
    },
	computed:{
        ...mapState([
            'entId',
            'admintelnum',
            'companyinfo',
        ]),
    },
    methods:{
    	 ...mapMutations([
    	 	'RECORD_ADMINTEL'
            ]),
    	getVerifyCode (){
    	  var _this=this;
    		var params={
	          'type':31,
	          'telNo':this.admintelnum,
	        };
	        this.axios.post(this.baseurl+'enterprise/sendValidateCode',qs.stringify(params)).then((res)=>{
	        	var res=res.data;
	        	if(res.code==0){
	        		this.vcode=res.data.vcodeId;
	        		jishi();
			          function jishi(){
			              if(_this.Times==0){
			                _this.sendCode=false;
			                _this.Times=60;
			                return;
			              }else{
			                _this.sendCode=true;
			                _this.Times--;
			              }
			               setteltime();
			            }
			          function setteltime (){
			                  setTimeout(function(){
			                    jishi();
			                  }, 1000)
			              };
	        	}else{
                    this.$Message.error(res.msg);
	        	}
	        })
    	},
    	nextstep (){
           var params={
	          'entId':this.entId,
	          'telNo':this.admintelnum,
	          'vcodeId':this.vcode,
	          'vcode':this.VeriCode,
	        };
	        if(this.VeriCode==''){
	        	this.$Message.error('请填写验证码');
	        }else{
	        	this.axios.post(this.baseurl+'shezhi/delmanager',qs.stringify(params)).then((res)=>{
		        	var res=res.data;
		        	console.log(res);
		        	if(res.code==0){
		        		this.emplist=res.data;
		        		// 找出管理员的员工id
		        		for(var i=0;i<this.emplist.length;i++){
				           	if(this.admintelnum==this.emplist[i].telno){
				           		this.accout=this.emplist[i].empId;
				           	}
				           }
		        		this.step='two';
		        	}else{
	                    this.$Message.error(res.msg);
		        	}
		        })
	        }
	        
    	},
    	//返回员工id，进行对比，找到并渲染手机input
    	getoption (empid){
    		for(var i=0;i<this.emplist.length;i++){
           	if(empid==this.emplist[i].empId){
           	   this.tel=this.emplist[i].telno;
           	}
           }
    	},
    	getVerifyCode1 (){
    	  var _this=this;
    		var params={
	          'type':30,
	          'telNo':this.tel,
	        };
	        this.axios.post(this.baseurl+'enterprise/sendValidateCode',qs.stringify(params)).then((res)=>{
	        	var res=res.data;
	        	console.log(res);
	        	if(res.code==0){
	        		this.vcode1=res.data.vcodeId;
	        		 jishi();
			          function jishi(){
			              if(_this.Times1==0){
			                _this.sendCode1=false;
			                _this.Times1=60;
			                return;
			              }else{
			                _this.sendCode1=true;
			                _this.Times1--;
			              }
			               setteltime();
			            }
			          function setteltime (){
			                  setTimeout(function(){
			                    jishi();
			                  }, 1000)
			              };
	        	}else{
                    this.$Message.error(res.msg);
	        	}
	        })
    	}, 
    	submitbtn (){
            var params={
	          'entId':this.entId,
	          'empId':this.accout,
	          'vcodeId':this.vcode1,
	          'vcode':this.VeriCode1,
	        };
	        console.log(params);
	        this.axios.post(this.baseurl+'shezhi/savemanager',qs.stringify(params)).then((res)=>{
	        	var res=res.data;
	        	if(res.code==0){
	        	  this.$Message.success('主管理员更换成功');
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
</script>
<style scoped>
.replacemainadmin{
	margin: 10px;
	background-color: #fff;
	min-height: 600px;
	padding: 20px;
}
.head{
	font-size: 12px;
	color: #475cc7;
	line-height: 30px;
	background-color: #eceef9;
	padding-left: 10px;
}
form{
	padding-top: 60px;
}
button{
	width: 120px;
	height: 36px;
	font-size: 14px;
	background-color: #475cc7;
}
.formstar{
  color: #e41d14;
}	
</style>