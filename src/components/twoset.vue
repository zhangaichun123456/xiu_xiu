<template>
  <div class="twoset">  
    <header>
       <div class="logo">
         <img :src="logo" alt="">
         <p>咻咻管理后台</p>
       </div>
       <div class="regi" @click="goregister">
         <span class="regiicon"><Icon type="person-add"></Icon></span><span>企业注册</span>
       </div>
     </header>
     <div class="content">
       <div class="Manaveri">
          <p class="head">请确认登录管理后台的企业和管理密码</p>
          <div class="companyinfo">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(item,index) in teamInfo">
                    <div class="imgwrapper">
                      <img v-if="!item.logoUrl" :src="defaultlogo">
                      <img v-if="item.logoUrl" :src="baseurl+item.logoUrl">
                    </div>
                    <p class="companyname">{{item.name}}</p>
                  </div>
              </div>
              <!-- Add Arrows -->
              <div v-show="moreone" class="swiper-button-prev"></div>
              <div v-show="moreone" class="swiper-button-next"></div>
            </div>
          </div>
          <Form ref="manaformValidate" :model="manaformValidate" :rules="manaruleValidate" class="manapassword" v-if="!firstlogin">
            <Form-item prop="password" label="">
            <Input type="password" v-model="manaformValidate.password" icon="locked" placeholder="请输入管理密码" style="width: 100%" @on-enter="manahandleSubmit('manaformValidate')"></Input>
            </Form-item>
          </Form>
          <Button v-if="!firstlogin" type="primary" long @click="manahandleSubmit('manaformValidate')" class="manalogin">登录</Button>
          <div v-if="firstlogin" class="firsttip">你好，这是你第一次登录“<span>{{curcompany}}</span>”的钉钉管理后台，请先设置管理密码。</div>
          <div class="foot">
            <span @click="goback">返回</span>
            <Button v-if="firstlogin" type="success" long class="setmanapassword" @click="showmodal=true">设置管理密码</Button>
            <span v-if="!firstlogin" @click="showforget">忘记管理密码</span>
          </div>         
       </div>
     </div>
     <Modal v-model="showmodal" width="600" title='设置管理密码'>
         <p slot="header" class="setmapwhead">
            <span>设置管理密码</span>
         </p>
         <Form ref="setformValidate" :model="setformValidate" :rules="setruleValidate" :label-width="150" class="manapassword">
            <Form-item label="当前企业：">
              <span class="curcompany">{{curcompany}}</span>
            </Form-item>
            <Form-item prop="password" label="管理密码">
              <Input :type="showpassword" v-model="setformValidate.password" placeholder="请输入管理密码" style="width: 100%"></Input>
            </Form-item>
            <Form-item prop="againpassword" label="确认管理密码">
              <Input :type="showpassword" v-model="setformValidate.againpassword" placeholder="请再次输入管理密码" style="width: 100%" @on-enter="sethandleSubmit('setformValidate')"></Input>
            </Form-item>
         </Form>
         <div class="foot" slot="footer">
            <Button type="primary" long @click="sethandleSubmit('setformValidate')" class="setpwbtn">保存</Button>
        </div>
     </Modal>
     <Modal v-model="showforgetmodal" width="600">
        <p slot="header" class="setmapwhead">
            <span>忘记管理密码</span>
        </p>
       <Form ref="forgetValidate" :model="forgetValidate" :rules="forgetruleValidate" :label-width="150" class="manapassword">
          <Form-item label="当前企业：">
            <span class="curcompany">{{curcompany}}</span>
          </Form-item>
          <Form-item label="绑定手机号">
            <Input type="text" :placeholder="admintelnum" disabled style="width: 300px"></Input>
          </Form-item>
          <Form-item prop="VerificationCode" label="验证码">
            <Input type="text" v-model="forgetValidate.VerificationCode" placeholder="请填写验证码" style="width: 300px">>
              <Button slot="append" type="primary" v-if="getcode" @click="getcodetext" class="forgetcode">获取验证码</Button>
              <Button slot="append" type="primary" v-if="!getcode" disabled>获取验证码</Button>
            </Input>
            <Button type="ghost" v-if="!getcode" class="Times">{{Times}}秒</Button>
          </Form-item>
          <Form-item prop="password" label="新管理密码">
            <Input :type="showpassword" v-model="forgetValidate.password" placeholder="请输入新管理密码" style="width: 300px"></Input>
            <p class="pwtip">密码必须包含数字、小写字母、大写字母,长度不低于6位</p>
          </Form-item>
          <Form-item prop="againpassword" label="确认管理密码">
            <Input :type="showpassword" v-model="forgetValidate.againpassword" placeholder="请再次输入新管理密码" style="width: 300px" @on-enter="forgetSubmit('forgetValidate')"></Input>
          </Form-item>
       </Form>
       <div class="foot" slot="footer">
            <Button type="primary" @click="forgetSubmit('forgetValidate')" class="setpwbtn">保存</Button>
        </div>       
     </Modal>
     <img :src="loginbg" alt="" class="loginbg">
  </div>
</template>

<script>
import loginbg from '../image/login_bg.png'
import {mapState, mapMutations} from 'vuex'
import swiperjs from '../../static/js/swiper-3.4.2.min.js'
import swipercss from '../../static/css/swiper-3.4.2.min.css'
import logo from '../image/login.jpg'
import qs from 'qs';

export default {
  data:function(){
    // 验证管理密码的设置
      const validatePass = (rule, value, callback) => {
          if(!/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,}$/.test(value)){
              callback(new Error('新密码必须包含数字、小写字母、大写字母,长度不低于6位'));
          } else if(this.setformValidate.againpassword !== ''){
                  // 对第二个密码框单独验证
                  this.$refs.setformValidate.validateField('againpassword');
                  callback();
          }
          
      };
      const validatePassCheck = (rule, value, callback) => {
          if (value !== this.setformValidate.password) {
                callback(new Error('两次输入密码不一致!'));
            }else {
                callback();
            }
        };
      const forgetvalidatePass = (rule, value, callback) => {
          if(!/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,}$/.test(value)){
              callback(new Error('新密码必须包含数字、小写字母、大写字母,长度不低于6位'));
          }else if(this.forgetValidate.againpassword !== ''){
                  // 对第二个密码框单独验证
                  this.$refs.forgetValidate.validateField('againpassword');
                  callback();
          }
          
      }; 
      const forgetvalidatePassCheck = (rule, value, callback) => {
            if (value !== this.forgetValidate.password) {
                callback(new Error('两次输入密码不一致!'));
            }else {
                    callback();
                }
        };

    return {
      loginbg:loginbg,
      logo:logo,//存储咻咻logo
      manaformValidate: {
              password: '',
          },
      setformValidate: {
              password: '',
              againpassword:''
          },
      forgetValidate: {
              VerificationCode:'',
              password: '',
              againpassword:''
          },
      manaruleValidate:{
         password: [
             { required: true, message: '请输入管理密码', trigger: 'blur' },
         ],
      },
      setruleValidate:{
         password: [
             { required: true, message: '请输入管理密码', trigger: 'blur' },
             { validator: validatePass, trigger: 'blur' }
         ],
         againpassword: [
             { required: true, message: '请再次输入管理密码', trigger: 'blur' },
              { validator: validatePassCheck, trigger: 'blur' }
         ],
      },
      forgetruleValidate:{
        VerificationCode:[
             { required: true, message: '请输入验证码', trigger: 'blur' },
         ],
         password: [
             { required: true, message: '请输入管理密码', trigger: 'blur' },
             { validator: forgetvalidatePass, trigger: 'blur' }
         ],
         againpassword: [
              { required: true, message: '请再次输入管理密码', trigger: 'blur' },
              { validator: forgetvalidatePassCheck, trigger: 'blur' }
         ],
      },
      firstlogin:true,//判断是否第一次登录
      curcompany:"",//当前选中公司
      entId:null,//公司id
      moreone:true,//加入的公司大于1，则出现左右箭头轮播
      swipers:null,
      curindex:0,//轮播图当前活动的索引
      showmodal:false,//设置管理密码表单
      showpassword:"password",//切换管理密码表单密码可见类型
      showforgetmodal:false,//切换忘记管理密码表单密码可见类型
      getcode:true,//是否点击获取验证码
      Times:'60',//获取验证码倒计时
      vcode:null,//短信验证的用的vcodeId
    }
  },
  mounted:function(){
    this.$nextTick(function(){
      this.swiper();//图片轮播和二次验证时选择相应的公司logo和公司名
      this.ifmoreone();//管理密码验证界面查看该用户是否归属多个企业
    });
  },
  // 在组件初始化时调用，可以简单理解为页面加载时
  // 刷新的时候用户的各种公司信息，头像，名称之类的会被清空，故使用本地存储,手机号也要用到，故保存
  created (){     
     var teamdetail=JSON.parse(localStorage.getItem("teaminfo"));
     var usertel=localStorage.getItem("usertel");
     this.RECORD_TEAMINFO(teamdetail);
     this.RECORD_ADMINTEL(usertel);
  },
  computed:{
    ...mapState([
      'teamInfo',//用vuex里面渲染的公司logo，公司名,以及是否第一次登录来渲染轮播图
      'admintelnum',//忘记密码里面的绑定手机号需要从这里自动获取;
      'defaultlogo'
    ]),
  },
  methods:{
    ...mapMutations([
                'RECORD_TEAMINFO',
                'RECORD_ADMINTEL',
                'RECORD_ENTID',
            ]),
   swiper () {
       var _this=this;
       //由于一开始就展示第一个公司，所以一开始就要判断第一个公司是否第一次登录，是第一次，就展示设置密码，不是第一次就展示填写管理密码页面
       if(_this.teamInfo[0].one==0){
          _this.firstlogin=true;
          _this.curcompany=$(".swiper-slide").eq(0).text();
          _this.entId=_this.teamInfo[0].entId;
           _this.RECORD_ENTID(_this.entId);
           localStorage.setItem('entid',_this.entId);
        }else{
          _this.firstlogin=false;
          _this.entId=_this.teamInfo[0].entId;
          _this.RECORD_ENTID(_this.entId);
           localStorage.setItem('entid',_this.entId);
        }
       
       this.swipers = new Swiper('.swiper-container', {
          grabCursor: true,
          effect: 'flip',
          onlyExternal : true,//无法拖动
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          //切换结束时的回调，获取当前的公司名
          onSlideChangeEnd: function(swiper){
              //切换的时候判断切换后的公司是否第一次登录，是第一次，就展示设置密码，不是第一次就展示填写管理密码页面
              _this.curindex=swiper.activeIndex;//记录下当前活动的index
              if(!_this.teamInfo[swiper.activeIndex].one){
                _this.firstlogin=true;
                _this.curcompany=$(".swiper-slide").eq(swiper.activeIndex).text();
                _this.entId=_this.teamInfo[swiper.activeIndex].entId;
                _this.RECORD_ENTID(_this.entId);
                 localStorage.setItem('entid',_this.entId);
              }else{
                _this.firstlogin=false;
                _this.entId=_this.teamInfo[swiper.activeIndex].entId;
                _this.RECORD_ENTID(_this.entId);
                localStorage.setItem('entid',_this.entId);
              }
        }
      });
   },
   //管理密码验证界面查看该用户是否归属多个企业
   ifmoreone (){
       if($(".swiper-slide").length>1){
        this.moreone=true;
       }else{
        this.moreone=false;
       }
   },
   //打开忘记密码页面
   showforget (){
       this.showforgetmodal=true;
       //获取当前活动图的索引，找到对应公司名，展现在当前企业里面
       this.curcompany=this.teamInfo[this.swipers.activeIndex].name;
   },
   //管理密码登录
   manahandleSubmit (name) {
     //把用户输入的账号密码存在logininfo里
      var _this=this;
      var manapass={
        "telNo":this.admintelnum,
        "entId":this.teamInfo[this.curindex].entId,
        "password":this.manaformValidate.password
      }
      //前端验证上面写的规则，通过则把logininfo的信息传到后台，通过则跳转管理员验证
      this.$refs[name].validate((valid) => {
          if (valid) {
              this.axios.post(this.baseurl+'enterprise/loginConfirm',qs.stringify(manapass)).then(function(res) {
                  var res=res.data;
                  if(res.code==0){
                    // 跳转之前应该后台要返回对应公司的信息，比如组织架构的详细信息等等
                    _this.$router.push('home');

                  }else{
                    _this.$Message.error(res.msg);
                  }                  
                });
              
          } else {
              this.$Message.error('请输入账号或密码');
          }
      })
   },
   //提交设置密码表单
   sethandleSubmit (name) {
      var _this=this;
      var manapassword={
        "telNo":this.admintelnum,
        "entId":this.entId,
        "password":this.setformValidate.password,
      }
      //前端验证上面写的规则，通过则把manapassword传到后台，并跳转管理密码输入页
      this.$refs[name].validate((valid) => {
          if (valid) {
              this.axios.post(this.baseurl+'enterprise/setloginpwd',qs.stringify(manapassword)).then(function(res) {
                  var res=res.data;
                  if(res.code==0){
                    _this.showmodal=false;//成功后关闭表单
                    _this.teamInfo[_this.curindex].one=1;//VUEX里记得改下对应的fisrtlogin
                    _this.swiper();//刷新一下页面
                    _this.$Message.success(res.msg);
                  }else{
                    _this.$Message.error(res.msg);
                  }
                  
                });
          } else {
              this.$Message.error('输入有误');
          }
      })
   },
   //忘记密码表单提交
   forgetSubmit (name) {
      var _this=this;
     //把用户输入的账号密码存在logininfo里
      var findparam={
        "telNo":this.admintelnum,
        "entId":this.entId,
        "password":this.forgetValidate.password,
        "verifyCode":this.forgetValidate.VerificationCode,
        "vcodeId":this.vcode,
      }
      this.$refs[name].validate((valid) => {
          if (valid) {
              this.axios.post(this.baseurl+'enterprise/findpassword',qs.stringify(findparam)).then(function(res) {
                  var res=res.data;
                  if(res.code==0){
                    _this.showforgetmodal=false;//关闭忘记密码页面
                  }else{
                    _this.$Message.error(res.msg);
                  }
                });
              
          } else {
              this.$Message.error('输入有误');
          }
      })
   },
   goback () {
     this.$router.push('login');
   },
   //获取验证码把相关参数传给后台并开始倒计时
   getcodetext(){
      var _this=this;
      if(/^1[34578]\d{9}$/.test(this.admintelnum)){
          var findpassword={
            "telNo":this.admintelnum,
            'type':21
          }
          this.axios.post(this.baseurl+'enterprise/sendValidateCode',qs.stringify(findpassword)).then(function(res) {
              var res=res.data;
               if(res.code==0){
                _this.vcode=res.data.vcodeId;
                //开始计时
                jishi();
                function jishi(){
                    if(_this.Times==0){
                      _this.getcode=true;
                      _this.Times=60;
                      return;
                    }else{
                      _this.getcode=false;
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
                _this.$Message.error(res.msg);
               }
            
          });
      }
   },
   goregister (){
    this.$router.push({ path: 'register' })
   }
  }
}
</script>

<style scoped>
.twoset{
  height: 100%;
}
.loginbg{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: -100;
}
header{
  width: 100%;
  height: 80px;
  border-bottom: 3px solid #4056c5;
  margin: 0 auto;
  line-height: 80px;
  background: #475cc7;
  -webkit-box-sizing:border-box;
  box-sizing:border-box;
  color: #fff;
  font-size: 18px;
}
header .logo,header .regi{
    display: inline-block;   
}
header .logo{
  position: relative;
  left: 5%;
  top: 0
}
header .regi{
  float: right;
  margin-right: 20px;
}
.logo p{
  height: 40px;
  line-height: 40px;
  padding-left:15px; 
  margin-left: 15px;
  border-left: 2px solid #ccc;
}
.regiicon{
  font-size: 18px;
  margin-right: 10px;
}
.logo img,.logo p{
  display: inline-block;
  vertical-align: middle;
}
.imgwrapper{
  width: 80px;
  height: 80px;
  margin:0 auto;
  background: blue;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
}
.companyname{
  font-size: 18px;
  color: #525252;
}
.logo img{
  width: 40px;
  height: 40px;
}
.content{
  width: 100%;
  height: 600px;
}
.Manaveri{
  width: 440px;
  height: 480px;
  margin: 0 auto;
  position: relative;
  top: 150px;
  left: 0px;
  z-index: 10;
  text-align: center;
  background: #fff;
  border-radius:2px;
}
.companyinfo{
  background: #fff;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color:#000;
  margin: 0;
  padding: 0;
}

.swiper-container {
    width: 300px;
    height: 180px;
    padding: 50px;
}
.swiper-slide {
    background-position: center;
    background-size: cover;
    width: 200px;
    height: 150px;
}
.Manaveri .head{
  display: block;
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  color: #a9a9a9;
  background: #fafafa;
}
.companyinfo img{
  width: 80px;
  height: 80px;
}
.swiper-button-next, .swiper-button-prev{
  width:33px;
  height: 20px;
  top:60%;
}
.manapassword{
  width: 80%;
  margin: 20px auto 0;
}
.manalogin{
  width: 80%;
  margin-top: 35px;
  height: 44px;
  border-radius: 22px;
  background: -webkit-linear-gradient(left, #475cc7, #4f8eff);
  font-size: 18px;
}
.foot{  
  text-align: center;
}
.foot span{
  display: inline-block;
  position: relative;
  font-size: 14px;
  color: #475cc7;
}
.foot span:first-child{
  width: 30px;
  position: absolute;
  bottom:20px;
  left:10%;
}
.foot span:last-child{
  position: absolute;
  bottom:20px;
  right:10%;
}
.setmanapassword{
  margin-top: 10px;
  width: 80%;
  height: 44px;
  border-radius: 22px;
  font-size: 18px;
  background: -webkit-linear-gradient(left, #475cc7, #4f8eff);
}
.firsttip{
  margin: 30px 0;
  font-size: 14px;
  color: #a9a9a9;
  padding: 0 50px;
}
.ivu-carousel-arrow{
  width: 0 !important;
  height: 0 !important;
}
.setform{
  width: 600px;
  height: 350px;
  background: #fff;
  text-align: center;
  position: absolute;
  top: 20%;
  left: 10%;
  z-index: 10;
  border: 1px solid red;
}
.forgetfrom{
  width: 600px;
  height: 500px;
  background: #fff;
  position: absolute;
  top: 10%;
  left: 10%;
  z-index: 10;
  border: 1px solid red;
  text-align: center;
}
.setmapwhead{
  text-align: center;
  font-size: 18px;
  color: #a9a9a9;
  font-weight: 300;
}
.curcompany{
  font-size: 18px;
  color: #a9a9a9;
  display: inline-block;
  height: 40px;
  line-height: 40px;
}
.setpwbtn{
  width: 120px;
  height: 40px;
  background-color: #475cc7;
  margin-bottom: 20px;
}
.forgetcode{
  height: 40px;
  font-size:16px;
  background-color:#475cc7;
  color: #fff;
  border-radius: 0;
}
.Times{
  height: 40px;
  position: absolute;
  top: 0px;
  left: 303px;
}
.pwtip{
  font-size: 12px;
  color: #a9a9a9;
}
</style>
