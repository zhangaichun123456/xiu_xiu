<template>
  <div class="teaminvi">
	  <Breadcrumb separator=">">
	        <Breadcrumb-item href="/home/maillist">通讯录</Breadcrumb-item>
	        <Breadcrumb-item>团队邀请</Breadcrumb-item>
	  </Breadcrumb>
	  <div class="one">
		  <p class="headtip">通过链接邀请</p>
		  <p class="oneurl"><span class="urll">{{urldata}}</span><Button type="primary" class="copybtn" data-clipboard-target=".urll">复制链接</Button></p>
	  </div>
	  <div class="two">
		  <p class="headtip">团队二维码</p>
		  <div class="teamqr">
		  	<img :src="logo" alt="">
		  	<p>右键复制或者下载此二维码，发送给好友.</p>
		  </div>
	  </div>
	  <p class="headtip">申请人列表</p>
	  <!-- v-for循环，data里面应该包含关于是否审核，若审核是否通过的字段 -->
	  <ul>
	  	<li>
	  		<div class="left">
	  			<img :src="logo" alt="">
	  			<div>
	  				<p>姓名</p>
	  				<p>123456798710</p>
	  				<p>申请理由：<span>无</span></p>
	  			</div>
	  		</div>
	  		<div class="right">
	  			<div v-if="!examine">
		  			<Button type="ghost" @click="pass()" class="pass">通过</Button>
		  			<Button type="ghost" @click="nopass()">拒绝</Button>
	  			</div>
	  			<div v-else>
	  				<Button v-if="ifpass" type="primary">已通过</Button>
	  				<Button v-else type="warning">已拒绝</Button>
	  			</div>
	  		</div>
	  	</li>
	  </ul>
  </div>
</template>

<script>
import logo from '../../../image/login.jpg'
import clipboard from '../../../../static/js/clipboard.js'
export default {
   data (){
   	return {
   		logo:logo,
   		urldata:"https://t.dingtalk.com/invite/index?code=918139e2d1",//存放链接
   		examine:false,//审核与否
   		ifpass:false,//通过
   	}
   },
   mounted:function(){
   	  this.$nextTick(function(){
   	  	this.copyurl();
   	  })   	   
   },
   methods:{
   	    //复制链接功能
        copyurl (){
        	var _this=this;
        	var clipboard = new $.Clipboard('.copybtn',{
        		text:function(){
        			return _this.urldata;
        		}
        	});

        	clipboard.on('success', function(e) {
        		 _this.$Message.config({
					    top: 200,
					    duration: 3
					});
		         _this.$Message.success('复制成功');
		     });
        },
        //审核通过
        pass (){
        	this.examine=true;
        	this.ifpass=true;
        },
        //审核不通过
        nopass (){
        	this.examine=true;
        	this.ifpass=false;
        }
   }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.teaminvi{
	margin: 10px 20px 0;
	padding: 20px;
	background: #fff;
}
.headtip{
	height: 25px;
	line-height: 25px;
	margin: 20px 0;
	padding-left: 10px;
	font-size: 18px;
}
.one .oneurl{
    color: #476cc7; 
    font-size: 16px;   
}
.one button{
	width: 120px;
	height: 36px;
	font-size: 14px;
	margin-left: 30px;
	background-color: #475cc7;
}
.one,.two{
	margin-bottom: 50px;
	padding-bottom: 20px;
	border-bottom: 1px solid #eee;
}
.teamqr img{
	width: 120px;
	height: 120px;
	margin-right: 10px;
}
.teamqr p{
	font-size: 14px;
}
.teamqr img,.teamqr p{
	display: inline-block;
	vertical-align: middle;
}
.right{
    position: absolute;
    top:0;
    right: 0;
}
.left img{
	width: 72px;
	height: 72px;
	border-radius: 50%;
	margin-right: 10px;
}
.left img,.left div{
	display: inline-block;
	vertical-align: top;
}
.left div p{
	font-size: 14px;
	line-height: 25px;
}
li{
	position: relative;
	border-bottom:1px solid #eee;
	height: 100px;
	margin-top: 40px;
}
.pass{
	background-color: #475cc7;
	color: #fff;
}
</style>
