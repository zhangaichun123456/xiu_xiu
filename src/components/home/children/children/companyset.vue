<template>
	<div class="companyset">
		<p class="head">企业名称与logo设置</p>
		<Form :label-width="150" enctype="multipart/form-data" method="post" name="fileallinfo">
			<Form-item label="企业名称：">
	            <Input v-model="companyinfo.name" placeholder="请输入" :maxlength="25" style="width: 360px"></Input>
	            <span class="formstar"><Icon type="asterisk"></Icon></span>
	        </Form-item>
	        <Form-item label="企业简介：">
	            <Input v-model="companyinfo.introduce" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入..." :maxlength="500" style="width: 360px"></Input>
            </Form-item>
            <input type="hidden" :value='companyinfo.logoUrl'>
            <Form-item class="submitbtn">
               <Button type="primary" @click="savecompanyinfo">保存</Button>
            </Form-item>
		</Form>
		<Form :label-width="150" class="uplogo" enctype="multipart/form-data" method="post" name="fileinfo">
		    <Form-item label="企业logo上传：" class="imglogo">
		        <div>
			        <img v-if="companyinfo.logoUrl" :src="baseurl+companyinfo.logoUrl" alt="" class="logoimg">
		            <img v-if="!companyinfo.logoUrl" :src="smallapplilogo" alt="" class="logoimg">
		        </div>
                <input type="file" name="file" class="files" id="files" @change="chooseimg">
	            <p class="imgtip">建议上传图片尺寸为640*640，大小不超过1M</p>
            </Form-item>
		</Form>		
	</div>
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import qs from 'qs';
import smallapplilogo from '../../../../image/smallapplilogo.png'
export default{
	data (){
		return {
			companyname:'',
			companyintro:'',
			smallapplilogo:smallapplilogo,
			logourl:'',
		}
	},
	 mounted:function(){
   	  this.$nextTick(function(){
   	  })   	   
   },
	computed:{
    ...mapState([
      'entId',
      'zuzhijiagou',
      'companyinfo',
      'manager',
    ]),
  },
   methods:{
    	chooseimg (){
    		 var file = document.getElementById('files').files[0];
    		 if(file.size>1024*1024){
    		 	this.$Message.error('上传失败：请选择小于1M的图片进行上传');
    		 }else{
                var oData = new FormData(document.forms.namedItem("fileinfo"));
	    		 this.axios.post(this.baseurl+'shezhi/photoUpload',oData).then((res)=>{
	    		 	var res=res.data;
	    		 	console.log(res);
	    		 	this.logourl=res.data.path;
	    		 	this.companyinfo.logoUrl=res.data.path;
	    		 })
    		 }
    	},
    	savecompanyinfo (){
    		var pramas={
    			entId:this.entId,
    			name:this.companyinfo.name,
    			introduce:this.companyinfo.introduce,
    			logoUrl:this.logourl,
    		}
    		if(this.companyinfo.name==''){
    			this.$Message.error('企业名称必填');
    		}else{
    			this.axios.post(this.baseurl+'shezhi/save',qs.stringify(pramas)).then((res)=>{
    			var res=res.data;
    			if(res.code==0){
    				this.$Message.success('保存成功');
    			}
    		  })
    		}
    		
    	}
    }
}	
</script>
<style scoped>
.companyset{
	margin: 10px;
	background-color: #fff;
	min-height: 600px;
}
.companyset .head{
	font-size: 18px;
	color: #525252;
	padding: 20px 0 30px 20px;
}
.files{
	position:absolute;
	top: 0px;
	left: 0px;
	width: 80px;
	height: 80px;
	opacity: 0;
}
.imglogo img,.imglogo p{
	display: inline-block;
	vertical-align: middle;
}
.logoimg{
	width: 80px;
	height: 80px;
}
.submitbtn{
	position: relative;
	top: 150px;
}
button{
	width: 120px;
	height: 36px;
	font-size: 14px;
	background-color: #475cc7;
}
.uplogo{
	position: relative;
	top:-50px;
}
form{
	padding-left: 20px;
}
.imgtip{
	font-size: 14px;
	color: #a9a9a9;
	position: absolute;
	top: 0px;
	left:100px;
}
.formstar{
  color: #e41d14;
}
</style>