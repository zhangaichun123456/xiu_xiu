<template>
	<div class="individual">
		<p class="headtip">有营业执照的企业及分支机构</p>
		<Form ref="teamValidate" :model="formItem" :label-width="190" :rules="ruleCustom">
			<Form-item prop="Certifitype" label="证件类型：">
	            <Radio-group v-model="formItem.Certifitype" vertical>
			        <Radio label="multicard">
			        	<span class="Certifitype">多证合一营业执照<span class="Certifitypetip">(原"注册号"字样,调整为18位的"统一社会信用代码"</span></span>
			        </Radio>
			        <Radio label="ordinary">
			        	<span class="Certifitype">普通营业执照<span class="Certifitypetip">(仍然标识为15位的"注册号")</span></span>
			        </Radio>
			    </Radio-group>
	        </Form-item>
	        <Form-item label="营业执照：">
		        <div class="demo-finished">
		            <!-- 多证合一范本 -->
		            <img v-show="formItem.Certifitype=='multicard'" :src="licenseurl" class="cardsmall">
		            <p v-show="formItem.Certifitype=='multicard'" @click="visible=true">查看模板</p>
		            <!-- 普通执照范本 -->
		            <img v-show="formItem.Certifitype=='ordinary'" :src="licenseurl1" class="cardsmall">
	                <p v-show="formItem.Certifitype=='ordinary'" @click="visible1=true">查看模板</p>
			    </div>
			    <div class="uploadcard">
			    	<p>上传：营业执照图片；</p>
					<p>照片所有信息需清晰可见，内容真实有效，不得做任何修改。</p>
					<p>照片支持.jpg .jpeg .bmp .gif .png格式，大小不超过8M。</p>
					<div v-show="formItem.Certifitype=='multicard'">
					    <Button type="primary">选择文件</Button>
					    <input type="file" id="files" @change="changeyyzz">
					    <Modal title="查看图片" v-model="visible">
					        <img :src="logo" style="width: 100%">
					    </Modal>
					</div>
				    <div v-show="formItem.Certifitype=='ordinary'">
				        <Button type="primary">选择文件</Button>
					    <input type="file" id="files1" @change="changeyyzz1">
					    <Modal title="查看图片" v-model="visible1">
					        <img :src="logo" style="width: 100%">
					    </Modal>
				    </div>
			    </div>
		    </Form-item>
		    <Form-item prop="creditcode" v-show="formItem.Certifitype=='multicard'" label="统一社会信用代码：">
		    	 <Input v-model="formItem.creditcode" placeholder="请输入18位的统一社会信用代码" style="width: 400px"></Input>
		    </Form-item>
		     <Form-item prop="Reginumber" v-show="formItem.Certifitype=='ordinary'" label="注册号：">
		    	 <Input v-model="formItem.Reginumber" placeholder="请输入15位工商注册号" style="width: 400px"></Input>
		    </Form-item>
		     <Form-item prop="teamname" label="企业名称：">
		    	 <Input v-model="formItem.teamname" placeholder="请填写营业执照上的名称" style="width: 400px"></Input>
		    </Form-item>
		     <Form-item prop="legalname" label="法人代表：">
		    	 <Input v-model="formItem.legalname" placeholder="" style="width: 400px"></Input>
		    </Form-item>
		     <Form-item label="所在地：" class="address">
               <Row>
                 <Col span="6">
                   <Form-item prop="province">
                     <Select v-model="formItem.province" style="width:150px" placeholder="请选择所在省" @on-change="choiceprovince">
                        <Option v-for="item in provinceList" :value="item.value" :key="item">{{ item.label }}</Option>
                     </Select>
                   </Form-item>
                 </Col>
                 <Col span="6">
                   <Form-item prop="city">
                     <Select v-model="formItem.city" style="width:150px" placeholder="请选择所在市" @on-change="choicecity">
                        <Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
                     </Select>
                   </Form-item>
                 </Col>
                 <Col span="6">
                   <Form-item prop="region">
                     <Select v-model="formItem.region" style="width:150px" placeholder="请选择所在区" @on-change="choiceregion">
                        <Option v-for="item in regionList" :value="item.value" :key="item">{{ item.label }}</Option>
                     </Select>
                   </Form-item>
                 </Col>
              </Row>
            </Form-item>
		     <Form-item prop="detailaddress" label="详细地址：">
		    	 <Input v-model="formItem.detailaddress" placeholder="请输入详细地址（请检查与证件上地址严格一致）" style="width: 400px"></Input>
		    </Form-item>
		    <Form-item label="管理员在职证明：">
		    	<div class="demo-finished">
		            <img :src="adminproveurl" class="cardsmall">
	                <p @click="adminvisible=true">查看模板</p>
			    </div>
			    <div class="uploadcard">
			    	<p class="uploadcardtip">请下载<span>《在职证明.doc》</span>,按要求填写,并手写仅用于咻咻认证字样,并加盖企业公章或人事章</p>
			    	<Button class="uploadbtn" type="primary" @click="loadjobprove">立即下载</Button>
					<p>照片所有信息需清晰可见，内容真实有效，不得做任何修改。</p>
					<p>照片支持.jpg .jpeg .bmp .gif .png格式，大小不超过8M。</p>
					<Button class="choosebtn" type="primary">选择文件</Button>
				    <input type="file" id="files2" @change="changezzzz">
				    <Modal title="查看图片" v-model="adminvisible">
				        <img :src="logos" style="width: 100%">
				    </Modal>
			    </div>
		    </Form-item>
		    <Form-item>
		    	<p class="suregy"><Checkbox v-model="formItem.checkread">已阅读并同意<span class="xiuxiugy">《咻咻公约》</span></Checkbox></p>
		    </Form-item>
		    <Form-item>
		    	<Button v-if="formItem.checkread" type="primary" @click="teamSubmit('teamValidate')">提交审核</Button>
		        <Button v-if="!formItem.checkread" type="primary" disabled>提交审核</Button>
		    </Form-item>
		</Form>
	</div>
</template>
<script>
import logo from '../../../../image/login.jpg'
import logos from '../../../../image/banner2.jpg'
import {mapState, mapMutations, mapActions} from 'vuex'
import qs from 'qs';
export default{
	data (){
		const creditcodePass=(rule, value, callback)=>{
			 if (!/^([A-Za-z0-9]{18})$/.test(value)) {
                    callback(new Error('格式错误'));
                } else {
                    callback();
                }
            };
        const ReginumberPass=(rule, value, callback)=>{
		 if (!/^([A-Za-z0-9]{15})$/.test(value)) {
                callback(new Error('格式错误'));
            } else {
                callback();
            }
        };
            
        const legalnamePass=(rule, value, callback)=>{
			  if(!/^[\u4E00-\u9FA5]+$/.test(value)){
	              callback(new Error('请填写中文'));
	          } else{
	              callback();
	          }
        };
            
		return {
			logo:logo,
			licenseurl:logo,//多证缩略图
			licenseurl1:logos,//普通缩略图
			adminproveurl:logos,
			logos:logos,
			formItem:{
				 Certifitype:'multicard',//证件类型
				 creditcode:'',//统一信用代码
				 Reginumber:'',//注册号
				 teamname:'',//企业名称
				 legalname:'',//法人代表
				 province:'',
				 city:'',
				 region:'',
				 detailaddress:'',//详细地址
				 checkread:true,//默认同意公约
				},
			ruleCustom:{
				 Certifitype:[
				     { required: true, message: '请选择证件类型', trigger: 'change' }
				 ],
                 creditcode:[	                 
                     { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
                      { validator: creditcodePass, trigger: 'blur' } ,
                 ],
                 Reginumber:[	                 
                     { required: true, message: '注册号不能为空', trigger: 'blur' },
                      { validator: ReginumberPass, trigger: 'blur' } ,
                 ],
                 teamname:[
                     { required: true, message: '企业名称不能为空', trigger: 'blur' },
                 ],
                 legalname:[
                     { required: true, message: '企业名称不能为空', trigger: 'blur' },
                      { validator: legalnamePass, trigger: 'blur' } ,
                 ],
                 province:[
		                   { required: true, message: '请选择所在省', trigger: 'change' },
		              ],
	             city:[
	                   { required: true, message: '请选择所在市', trigger: 'change' },
	              ],
	             region:[
	                   { required: true, message: '请选择所在区域', trigger: 'change' },
	              ],
                 detailaddress:[
                     { required: true, message: '详细地址不能为空', trigger: 'blur' },
                 ],

			},
            visible: false,
            visible1: false,
            adminvisible: false,
            provinceList: [],//省列表
		    cityList: [],//市列表
		    regionList:[],//区列表
            
		}
	},
	computed:{
        
	},
	mounted:function(){
    this.$nextTick(function(){
      this.init();
    })
  },
	methods:{
		// 初始化省数据
		init (){

		},
		// 营业执照用户点击改变的时候把对应的图片渲染到左侧缩略图,多证
		changeyyzz (){
           var $_file = document.getElementById("files");
           var file = $_file.files[0];
           var windowURL = window.URL || window.webkitURL;
           var dataURL = windowURL.createObjectURL(file);
           this.licenseurl=dataURL;
		},
		 // 营业执照用户点击改变的时候把对应的图片渲染到左侧缩略图,普通
		changeyyzz1 (){
           var $_file = document.getElementById("files1");
           var file = $_file.files[0];
           var windowURL = window.URL || window.webkitURL;
           var dataURL = windowURL.createObjectURL(file);
           this.licenseurl1=dataURL;
		},
		// 管理员证明点击改变的时候把对应的图片渲染到左侧缩略图
		changezzzz (){
           var $_file = document.getElementById("files2");
           var file = $_file.files[0];
           var windowURL = window.URL || window.webkitURL;
           var dataURL = windowURL.createObjectURL(file);
           this.adminproveurl=dataURL;
		},
		// //点击下载在职证明
		loadjobprove (){

		},
		// 选择省
	    choiceprovince (value){
	      var _this=this;
	      // 选择的时候先清空下一级们的数据
	      this.formItem.city='';
	      this.formItem.region='';
	      this.provincecode=value;
	      var params=qs.stringify({"areaCode":value});
	      this.axios.post(this.baseurl+'arealist',params).then(function(res) {
	           var res=res.data;
	           if(res.code==0){
	           	_this.cityList=res.data.arealist;
	           }else{
	           	 this.$Message.error(res.msg);
	           }
	           
	      })
	    },
	    // 选择市
	    choicecity (value){
	      var _this=this;
	      // 选择的时候先清空下一级们的数据
	      this.formItem.region='';
	      this.citycode=value;
	      var params=qs.stringify({"areaCode":value});
	      this.axios.post(this.baseurl+'arealist',params).then(function(res) {
	           var res=res.data;
	           if(res.code==0){
	           	_this.regionList=res.data.arealist;
	           }else{
	           	this.$Message.error(res.msg);
	           }
	           
	      })
	    },
	    //选择区域
	    choiceregion (value){
	      this.regioncode=value;
	    },
		teamSubmit (name){
			 this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('提交成功!');
                    this.$router.push('/home/examine')
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
		}
	}

}
</script>
<style scoped>
.headtip{
   height: 30px;
   line-height: 30px;
   background: #eceef9;
   color: #475cc7;
   margin: 20px 0 30px;
   padding-left: 10px;
   font-size: 14px;
}
.cardsmall{
	width: 90px;
	height: 120px;
}
.demo-finished,.uploadcard{
	display: inline-block;
	vertical-align: top;
	margin-right: 20px;
}
.demo-finished p{
	font-size: 14px;
    color: #475cc7;
    border-bottom: 1px solid #475cc7;
    line-height: 15px;
    text-align: center;
    width: 60px;
    margin: 0 auto;
}
.uploadcard p{
	font-size: 12px;
	color: #a9a9a9;
	line-height: 25px;
}
.choosefile{
	background: blue;
	color: #fff;
	width: 100px;
	text-align: center;
}
form{
	width: 900px;
	margin: 0 auto;
}
.Certifitype{
	font-size: 14px;
	color: #525252;
}
.Certifitypetip{
	color: #a9a9a9;
}
.uploadcard .uploadcardtip{
	font-size: 14px;
	color: #525252;
}
.uploadcard .uploadcardtip span{
	color: #475cc7;
}
.uploadbtn{
	margin: 10px 0;
}
.xiuxiugy{
	color: #475cc7;
}
#files,#files1{
	opacity: 0;
	position: relative;
	top: 0;
	right: 80px;
}
#files2{
	opacity: 0;
	position: relative;
	top: -45px;
	left: 225px;
}
button{
	width: 120px;
	height: 36px;
	background-color: #475cc7;
}
.uploadcard .choosebtn{
	position: relative;
	top: -45px;
	left: 350px;
}
</style>