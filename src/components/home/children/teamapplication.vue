<template>
  <div class="teamapplication">
      <p class="opened">已开通应用<Button type="primary" class="addbtn" @click="addmodel=true">新增微应用</Button></p>
      <div class="used">
         <p>已启用应用</p>
	      <ul>
	      	<li>
		      	<div class="imgwrapper">
			      	<img :src="rizhi" alt="">
			      	<div class="mask">
			      		<p @click="goreport">进入</p>
			      		<p>设置</p>
			      		<p>停用</p>
			      	</div>
		      	</div>
		      	<p>日志</p>
	      	</li>
	      	<li>
		      	<div class="imgwrapper">
			      	<img :src="gonggao" alt="">
			      	<div class="mask">
			      		<p @click="gonotice">进入</p>
			      		<p>设置</p>
			      		<p>停用</p>
			      	</div>
		      	</div>
		      	<p>公告</p>
	      	</li>
	      	<li>
		      	<div class="imgwrapper">
			      	<img :src="kaoqin" alt="">
			      	<div class="mask">
			      		<p @click="gokaoqin">进入</p>
			      		<p>设置</p>
			      		<p>停用</p>
			      	</div>
		      	</div>
		      	<p>考勤打卡</p>
	      	</li>
	      	<li>
		      	<div class="imgwrapper">
			      	<img :src="shenpi" alt="">
			      	<div class="mask">
			      		<p>进入</p>
			      		<p>设置</p>
			      		<p>停用</p>
			      	</div>
		      	</div>
		      	<p>审批</p>
	      	</li>
	      	<li>
		      	<div class="imgwrapper">
			      	<img :src="yunpan" alt="">
			      	<div class="mask">
			      		<p>进入</p>
			      		<p>设置</p>
			      		<p>停用</p>
			      	</div>
		      	</div>
		      	<p>云盘</p>
	      	</li>
	      </ul>
	   </div>
	   <div class="stoped">
          <p>已停用应用</p>
	      <ul>
	      	<li>
		      	<div class="imgwrapper">
			      	<img :src="kaoqin" alt="">
			      	<div class="mask">
			      		<p>进入</p>
			      		<p>设置</p>
			      		<p>停用</p>
			      	</div>
		      	</div>
		      	<p>考勤打卡</p>
	      	</li>
	      </ul>
	   </div>
	   <Modal v-model="addmodel" width="720" :closable="false" class="addsmallappli">
	     <header>新增微应用<span class="closebtn" @click="addmodel=false"><Icon type="close"></Icon></span></header>
         <Form :label-width="170" class="depinfoform">
             <Form-item label="应用logo：">
	             <div class="logoimg">
	             	<img :src="smallapplilogo" alt="">
	             </div>
	             <input type="file" class="uplogo" @change="changelogo" id="files">
	             <p class="imgtip">建议上传图片尺寸为640*640，大小不超过1M</p>
	             <span class="formstar formstar1"><Icon type="asterisk"></Icon></span>
             </Form-item>
	         <Form-item label="应用名称：">
	            <Input type="text" style="width: 400px" placeholder='10个字以内' :maxlength="10"></Input>
	            <span class="formstar"><Icon type="asterisk"></Icon></span>
	         </Form-item>
	         <Form-item label="功能介绍：">
	            <Input type="text" style="width: 400px" placeholder='20个字以内' :maxlength="20"></Input>
	            <span class="formstar"><Icon type="asterisk"></Icon></span>
	         </Form-item>
	         <Form-item label="后台地址：">
	            <Input type="text" style="width: 400px" placeholder='在咻咻后台点击该应用跳转的地址'></Input>
	            <span class="formstar"><Icon type="asterisk"></Icon></span>
	         </Form-item>
	         <Form-item label="首页地址：">
	            <Input type="text" style="width: 400px" placeholder='在微应用首页点击该应用跳转的地址'></Input>
	            <span class="formstar"><Icon type="asterisk"></Icon></span>
	         </Form-item>
	         <Form-item label="PC版首页地址：">
	            <Input type="text" style="width: 400px" placeholder='在微应用首页点击该应用跳转的地址'></Input>
	            <p class="pcinputtip">请确保该域名和首页的可信域名相同</p>
	         </Form-item>
	         <Form-item label="可见范围：">
	            <Input type="text" style="width: 400px" placeholder='选择部门、成员'></Input>
	            <p class="pcinputtip">不选时，默认为所有人员可见</p>
	         </Form-item>
         </Form>
        <div slot="footer">
            <Button type="primary" size="large">提交</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import gonggao from '../../../image/gonggao.jpg'
import kaoqin from '../../../image/kaoqin.jpg'
import rizhi from '../../../image/rizhi.jpg'
import yunpan from '../../../image/yunpan.png'
import shenpi from '../../../image/shenpi.png'
import smallapplilogo from '../../../image/smallapplilogo.png'
export default {
   data (){
   	return {
   		yunpan:yunpan,
   		shenpi:shenpi,
   		kaoqin:kaoqin,
   		rizhi:rizhi,
   		gonggao:gonggao,
   		smallapplilogo:smallapplilogo,
   		addmodel:false,
   	}
   },
   mounted:function(){
     
   },
   methods:{
       changelogo (){
       	   var $_file = document.getElementById("files");
           var file = $_file.files[0];
           if(file.size>1024*1024){
    		 	this.$Message.error('请选择小于1M的图片进行上传');
    		 }else{
    		 	var windowURL = window.URL || window.webkitURL;
	            var dataURL = windowURL.createObjectURL(file);
	            this.smallapplilogo=dataURL;
    		 }    
       },
       goreport (){
       	this.$router.push('/home/report');
       },
       gonotice (){
       	this.$router.push('/home/notice');
       },
       gokaoqin (){
       	window.location=this.baseurl+'attend/attendGroup/manager';
       }
   }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.teamapplication{
    background: #eee;
}
.opened{
	margin: 10px;
	background-color: #fff;
	height: 60px;
	line-height: 60px;
	padding: 0 25px;
	font-size: 18px;
	color: #525252;
}
.addbtn{
	float: right;
	width: 120px;
	height: 36px;
	font-size: 14px;
	background-color: #475cc7;
	position: relative;
	top: 10px;
}
.used,.stoped{
	margin: 10px;
	background-color: #fff;
	padding: 0 25px 60px;	
}
.used p,.stoped p{
	font-size: 18px;
	color: #525252;
	padding-top: 20px;
}
ul{
	margin-top: 50px;
}
ul li{
	display: inline-block;
	margin:0 15px;
	text-align: center;
}
ul li img{
	width: 90px;
	height: 90px;
}
.used ul li p,.stoped ul li p{
	font-size: 14px;
	color: #525252;
} 
.imgwrapper{
	position: relative;
}
.imgwrapper div{
	width: 90px;
	height: 90px;
	position: absolute;
	top: 0;
	left: 0;
	background: rgba(0,0,0,0.75);
}
.imgwrapper div p{
	line-height: 30px;
	padding-top: 0;
	color: #fff!important;
}
.mask{
	display: none;
}
.mask p:hover{
	background: #ccc;
}
.imgwrapper:hover .mask{
	display: block;
}
header{
	background: #475cc7;
	text-align: center;
	height: 40px;
	line-height: 40px;
	font-size: 20px;
	color: #fff;
}
.addsmallappli form{
	margin: 30px 0;
}
.formstar{
  color: #e41d14;
}
.uplogo{
	width: 80px;
	height: 80px;
	position: absolute;
	top: 0px;
	opacity: 0;
}
.imgtip{
	font-size: 14px;
	color: #a9a9a9;
	position: absolute;
	top: 0px;
	left:100px;
}
.logoimg img{
	width: 80px;
	height: 80px;
}
.formstar1{
	position: absolute;
	top: 30px;
	left: 100px;
}
.pcinputtip{
	padding: 10px 0 0 10px;
	color: #a9a9a9;
}
.closebtn{
	position: absolute;
	right: 20px;
}

</style>
