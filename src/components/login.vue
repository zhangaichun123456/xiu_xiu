<template>
  <div class="login">  
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
       <div class="logoinfo">
         <ul class="loginmode">
           <li @click="togglelogin1" :class="{'active':scancodelogin==true}">扫码登录</li>
           <li @click="togglelogin2" :class="{'active':passwordlogin==true}">咻咻账号登录</li>
         </ul>
         <div class="scancodelogin" v-if="scancodelogin">
            <img :src='qrimg' alt="二维码">
            <p class="tipqrlogin">请使用咻咻扫描二维码登录</p>
            <div class="refr">
              <p><Icon type="ios-refresh-outline"></Icon></p>
              <p @click="refreshqr">刷新</p>
            </div>
         </div>
         <div class="passwordlogin" v-if="passwordlogin">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" class="loginform">
            <Form-item prop="account">
            <Input type="text" v-model="formValidate.account" icon="person" placeholder="请输入手机号" style="width: 100%"></Input>
            </Form-item>
            <Form-item prop="password">
            <Input type="password" v-model="formValidate.password" icon="locked" placeholder="请输入咻咻登录密码" style="width: 100%" @on-enter="accountSubmit('formValidate')"></Input>
            </Form-item>
            <Form-item>
            <Button type="primary" long @click="accountSubmit('formValidate')" class="submitbtn">登录</Button>
             </Form-item>
          </Form>
         </div>
       </div>
     </div>
     <img :src="loginbg" alt="" class="loginbg">
  </div>
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import loginbg from '../image/login_bg.png'
import logo from '../image/login.jpg'
import qs from 'qs';

export default {
  data:function(){
    // 账号是否是手机号
      const checktelnum = (rule, value, callback) => {
         if (!/^1[34578]\d{9}$/.test(value)) {
              callback(new Error('请输入正确的手机号'));
          } else{
               callback();
          }
        };
    return {
      loginbg:loginbg,
      logo:logo,//存储咻咻logo
      qrimgcode:null,
      qrimg:null,
      timer:null,//保存计时器
      qrimg:null,//存储二维码
      qrkey:'',//存储二维码uuid
      scancodelogin:true,//扫码登录
      passwordlogin:false,//账号密码登录
      formValidate: {
              account: '',
              password: '',
          },
      ruleValidate:{
         account: [
             { required: true, message: '请输入账号或密码', trigger: 'blur' },
             { validator: checktelnum, trigger: 'blur' }
         ],
         password: [
             { required: true, message: '请输入账号或密码', trigger: 'blur' },    
         ],
      },
    }
  },
  mounted:function(){
    this.$nextTick(function(){
      // 清空本地存储数据
      this.clearlocalStorage();
      this.initqrcode();//初始化获取二维码
      this.checkScan();//每隔1s查询一次是否有被扫描
    });
  },
  methods:{
    ...mapMutations([
                'RECORD_TEAMINFO',
                'RECORD_ADMINTEL'
            ]),
    //初始化获取二维码图片以及并保存uuid
    clearlocalStorage (){
      localStorage.clear();
    },
    //获取二维码code值和图片
    initqrcode (){
      this.axios.post(this.baseurl+'login/getLoginCode').then((res)=>{
         var res=res.data; 
         this.qrimgcode=res;
          if(this.qrimgcode!=null){
          this.qrimg=this.baseurl+'login/getQrcode?code='+this.qrimgcode;
         }         
      })
    },
    //点击刷新二维码
    refreshqr (){
      this.initqrcode();
    },
    //每隔一秒发一次请求查看该二维码是否被扫描
    checkScan (){
      this.timer = setInterval(this.checkScan1, 3000);//每隔1s执行一次checkScan1
    },
    //传uuid到后台，检查用户是否扫码，并根据返回结果判断,若有用户扫描了该uuid，应停止对checkScanServlet的轮询,若不具备管理员权限的账户扫码提示：您不具备管理员权限，若具备管理员权限的账户扫码成功，提示：验证成功，跳转管理员密码输入页面
    checkScan1 (){
      var params={
        "code":this.qrimgcode,
      }
      this.axios.post(this.baseurl+'login/checkCode',qs.stringify(params)).then((res)=>{
         var res=res.data;
         if(res.code==0){
            if(res.data.type==1){
              this.$Message.info({
                  content: '扫码成功，请在APP上确认登录',
                  duration: 5
              });
            }else if(res.data.type==2){
              localStorage.setItem("teaminfo",JSON.stringify(res.data.entList));
              localStorage.setItem("usertel",res.data.telNo);
              this.$router.push('twoset');
              clearTimeout(this.timer);
            }else if(res.data.type==-1){
              this.$Message.error({
                  content: '二维码已失效,请刷新重新获取二维码',
                  duration: 60
              });
              clearTimeout(this.timer);
            }
         }else{
            this.$Message.error(res.msg);
         }
      })
    },
    //扫码登录
    togglelogin1:function(){
      this.scancodelogin=true;      
      this.passwordlogin=false;
    },
    //账号登录
    togglelogin2:function(){
      this.scancodelogin=false;
      this.passwordlogin=true;
    },
    //账号密码提交登录
    accountSubmit (name) {
        clearTimeout(this.timer);
        var _this=this;
       //把企业用户输入的账号密码存在logininfo里
        var logininfo={
          'telNo':this.formValidate.account,
          'password':this.formValidate.password
        }
        //前端验证上面写的规则，通过则把logininfo的信息传到后台，通过则跳转管理员验证
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.axios.post(this.baseurl+'enterprise/login',qs.stringify(logininfo)).then(function(res) {
                  var res=res.data;
                  if(res.code==0){
                    _this.RECORD_ADMINTEL(_this.formValidate.account);//把管理员的账号手机号存在vuex
                    _this.RECORD_TEAMINFO(res.data);//把企业用户信息存在vuex,至少包含所有加入过的公司名以及对应的logo，和对应是否第一次登录
                    localStorage.setItem("teaminfo",JSON.stringify(res.data));
                    localStorage.setItem("usertel",_this.formValidate.account)
                    _this.$router.push('twoset');
                  }else{
                    _this.$Message.error(res.msg);
                  }
                  
                });
          
            } else {
                this.$Message.error('请输入账号或密码');
            }
        })
    },
     goregister (){
      this.$router.push({ path: 'register' })
    },
  }
}
</script>

<style scoped>
.login{
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
  min-width: 960px;
  height: 80px;
  border-bottom: 3px solid #4056c5;
  margin: 0 auto;
  line-height: 80px;
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
.regiicon{
  font-size: 18px;
  margin-right: 10px;
}
.logo img,.logo p{
  display: inline-block;
  vertical-align: middle;
}
.logo p{
  height: 40px;
  line-height: 40px;
  padding-left:15px; 
  margin-left: 15px;
  border-left: 2px solid #ccc;
}
.logo img{
  width: 40px;
  height: 40px;
}
.content{
  width: 100%;
  height: 600px;
  /*background: #475cc7;*/
}
.logoinfo,.Manaveri{
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
.loginmode{
  width: 100%;
  height: 65px;
  font-size: 0;
}
.loginmode li{
  display: inline-block;
  width: 50%;
  text-align: center;
  line-height: 65px;
  font-size: 18px;
  color: #a9a9a9;
}
.scancodelogin{
  margin-top: 60px;
  text-align: center;
}
.scancodelogin img{
  width: 180px;
  height: 180px;
}
.scancodelogin .tipqrlogin{
 font-size: 18px;
 color: #cecece;
 margin:40px 0 20px 0;
}
.refr p{
  display: inline-block;
  font-size: 18px;
  color: #475cc7;
}
.passwordlogin .loginform{
  width: 340px;
  margin: 0 auto;
  margin-top: 100px;
}
.loginmode .active{
  border-bottom: 2px solid #475cc7;
  color: #525252;
}
.submitbtn{
  margin-top: 60px;
  height: 44px;
  border-radius: 22px;
  background: -webkit-linear-gradient(left, #475cc7, #4f8eff);
  font-size: 18px;
}
</style>
