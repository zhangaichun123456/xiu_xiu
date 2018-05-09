<template>
  <div class="register">
    <header>
       <div class="logo">
         <img :src="logo" alt="">
         <p>咻咻企业注册</p>
       </div>
       <div class="regi" @click="gologin">
         <span class="regiicon"><Icon type="person-add"></Icon></span><span>返回登录页</span>
       </div>
    </header>
    <div class="content">
      <div class="regiback">
        <div class="Stepbar">
           <Steps :current="current" size="small">
              <Step title="填写手机号"></Step>
              <Step title="信息完善"></Step>
              <Step title="注册成功"></Step>
           </Steps>
        </div>
        <div class="Partingline"></div>
        <div class="telregi">
          <div v-if="stepnum===1">
            <Form ref="regiValidate" :model="regiValidate" :rules="regiruleValidate" :label-width="120" class="manapassword">
              <Form-item prop="telnum" label="手机号码:">
                <Input type="text" v-model="regiValidate.telnum" style="width: 360px" placeholder="请输入注册手机号"></Input>
                <Button type="primary" v-if="getcode" @click="gettelcode('regiValidate')" class="getcode">获取验证码</Button>
                <Button type="primary" v-if="!getcode" disabled class="getcode1">获取验证码</Button>
                <Button type="ghost" v-if="!getcode" class="Times">{{Times}}秒</Button>
              </Form-item>
              <Form-item prop="imgvali" label="图片验证码:">
                <Input type="text" v-model="regiValidate.imgvali" style="width: 360px" placeholder="请填写验证码"></Input>
                <img :src="yzmurl" class="imgvali" alt="">
               <!--  < img id="captcha" alt="验证码" src="${path }/captcha.jpg" class="verifyImg" data-src="${path }/captcha.jpg?t="> -->
                <p class="changetip" @click="initimg">换一张</p>
              </Form-item>
              <Form-item prop="VerificationCode" label="短信验证码:">
                <Input type="text" v-model="regiValidate.VerificationCode" placeholder="请填写短信验证码" style="width: 360px" @on-enter="regiSubmit('regiValidate')"></Input>
              </Form-item>
              <Form-item>
                <Button type="primary" @click="regiSubmit('regiValidate')" class="manalogin">下一步</Button>
              </Form-item>
            </Form>
          </div>
          <div v-if="stepnum===2" class="registep2">
            <Form ref="step2" :model="registep2" :rules="rulestep2" :label-width="150">
              <Form-item prop="teamname" label="企业(团队)名称:">
                <Input type="text" v-model="registep2.teamname" style="width: 400px" placeholder="请输入企业(团队)名称"></Input>
              </Form-item>
              <Form-item label="所在地:" class="address">
                 <Row>
                   <Col span="8">
                     <Form-item prop="province">
                       <Select v-model="registep2.province" style="width:200px" placeholder="请选择所在省" @on-change="choiceprovince">
                          <Option v-for="item in provinceList" :value="item.value" :key="item">{{ item.label }}</Option>
                       </Select>
                     </Form-item>
                   </Col>
                   <Col span="8">
                     <Form-item prop="city">
                       <Select v-model="registep2.city" style="width:200px" placeholder="请选择所在市" @on-change="choicecity">
                          <Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
                       </Select>
                     </Form-item>
                   </Col>
                   <Col span="8">
                     <Form-item prop="region">
                       <Select v-model="registep2.region" style="width:200px" placeholder="请选择所在区" @on-change="choiceregion">
                          <Option v-for="item in regionList" :value="item.value" :key="item">{{ item.label }}</Option>
                       </Select>
                     </Form-item>
                   </Col>
                </Row>
              </Form-item>
              <Form-item prop="detailadress" label="详细地址:">
                <Input type="text" v-model="registep2.detailadress" style="width: 400px" placeholder="请输入详细地址"></Input>
              </Form-item>
              <Form-item prop="industry" label="行业类型:">
                <Select v-model="registep2.industry" style="width:400px" placeholder="请选择行业类型">
                    <Option v-for="item in industryList" :value="item.value" :key="item">{{ item.label }}</Option>
                </Select>
              </Form-item>
              <Form-item prop="password" label="管理密码:">
                <Input :type="passwordtype" v-model="registep2.password" style="width: 400px" placeholder="请输入管理密码"></Input>
                <p class="pwtip">密码必须包含数字、小写字母、大写字母,长度不低于6位</p>
              </Form-item>
              <Form-item prop="username" label="联系人姓名:">
                <Input type="text" v-model="registep2.username" style="width: 400px" placeholder="请填写身份证上的姓名"></Input>
              </Form-item>
              <Form-item prop="email" label="邮箱:">
                <Input type="text" v-model="registep2.email" style="width: 400px" placeholder="请填写邮箱"></Input>
              </Form-item>
              <Form-item>
                <Checkbox v-model="checkread" class="Checkboxtips">已阅读<span>&lt;咻咻服务协议&gt;</span></Checkbox>
              </Form-item>
              <Form-item>
                <Button v-if="!checkread" type="primary" class="step2btn1" disabled>注册</Button>
                <Button v-if="checkread" type="primary" class="step2btn" @click="step2submit('step2')">注册</Button>
              </Form-item>
            </Form>
          </div>
          <div v-if="stepnum===3" class="regisucess">
            <p class="happyface"><Icon type="happy-outline"></Icon></p>
            <p class="happytip">恭喜你，您的企业：{{this.registep2.teamname}}注册成功</p>
            <div><a class="uploadtip" @click="xiuload">下载手机端咻咻同步管理你的企业</a></div>
            <Button type="primary" class="gohome" @click="home">重新登录</Button>
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
import logo from '../image/login.jpg'
import {mapState, mapMutations} from 'vuex'
import qs from 'qs';
export default {
  data () {
    const telnumvalidate=(rule, value, callback) => {
      if (!/^1[34578]\d{9}$/.test(value)) {
              callback(new Error('请输入正确的手机号'));
          } else{
               callback();
          }
        };
    const setpasswordCheck = (rule, value, callback) => {
          if(!/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,}$/.test(value)){
              callback(new Error('请填写符合格式的管理密码'));
          } else if(value===this.regiValidate.telnum){
              callback(new Error('不能与账号相同'));
          } else{
              callback();
          }
        };
    const chinanameCheck= (rule, value, callback) => {
          if(!/^[\u4E00-\u9FA5]+$/.test(value)){
              callback(new Error('请填写中文'));
          } else{
              callback();
          }
        };
    const emailCheck= (rule, value, callback) => {
          if(!/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value)){
              callback(new Error('请输入正确的邮箱格式'));
          } else{
              callback();
          }
        };
    return {
      logo:logo,
      current:0,//步骤条当前进行到第几步
      regiValidate: {
              telnum: '',
              VerificationCode:'',
              imgvali:''
          },
      registep2:{
              teamname:'',
              industry:'',
              password:'',
              username:'',
              email:'',
              province:'',
              city:'',
              region:'',
              detailadress:''
      },
      regiruleValidate:{
              telnum: [
                   { required: true, message: '请输入手机号', trigger: 'blur' },
                   { validator: telnumvalidate, trigger: 'blur' }
               ],
              imgvali:[
                   { required: true, message: '请输入图片验证码', trigger: 'blur' },
               ],
              VerificationCode:[
                   { required: true, message: '请输入短信验证码', trigger: 'blur' },
               ],               
      },
      rulestep2:{
              teamname:[
                   { required: true, message: '请填写企业(团队)名称', trigger: 'blur' },
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
              industry:[
                   { required: true, message: '请选择行业类型', trigger: 'change' },
              ],
              password:[
                   { required: true, message: '请填写符合要求的管理密码', trigger: 'blur' },
                   { validator: setpasswordCheck, trigger: 'blur' }
              ],
              username:[
                   { required: true, message: '请填写身份证上的姓名', trigger: 'blur' },
                   { validator: chinanameCheck, trigger: 'blur' }
              ],
              email:[
                   { required: true, message: '请填写邮箱', trigger: 'blur' },
                   { validator: emailCheck, trigger: 'blur' }
              ],
              detailadress:[
                   { required: true, message: '请详细地址', trigger: 'blur' },
              ],
      },
      getcode:true,//获取验证码button的状态
      Times:'60',//获取验证码倒计时
      stepnum:1,//目前正在第几步
      checkread:false,//判断是否阅读服务协议
      passwordtype:"password",//管理密码类型，password不可见，text可见
      provinceList:[],//省列表
      cityList: [],//市列表
      regionList:[],//区列表
      industryList:[],//行业类型模拟，从后台获取
      vcode:null,//短信验证的用的vcodeId
      provincecode:'',//第二步注册发给后台的省编码
      citycode:'',//第二步注册发给后台的市编码
      regioncode:'',//第二步注册发给后台的区编码
      yzmurl:this.baseurl+"captcha.jpg",
    }
  },
  computed:{
    
  },
  mounted:function(){
    this.$nextTick(function(){
      
    })
  },
  methods:{
    ...mapMutations([
              'RECORD_ENTID',
              'RECORD_ADMINTEL',
          ]),
    //获取验证码图片
    initimg (){
       var newdata=new Date().getTime();
       this.yzmurl=this.baseurl+"captcha.jpg?t="+newdata;
    },
    gologin (){
      this.$router.push('login');
    },
    //填写手机获取验证码
    gettelcode (){
       //发送验证码
        var _this=this;        
        if(/^1[34578]\d{9}$/.test(this.regiValidate.telnum)){
          var telphone=qs.stringify({'telNo':this.regiValidate.telnum,'type':20});
          this.axios.post(this.baseurl+'enterprise/sendValidateCode',telphone).then(function(res){
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
        }else if(this.regiValidate.telnum==''){
          this.$Message.error('请输入手机号码')
        }  
    },
    //第一步注册
    regiSubmit (name) {
       var _this=this;
       //把用户输入的账号密码存在logininfo里
        var setpass={
          "telNo":this.regiValidate.telnum,
          "captcha":this.regiValidate.imgvali,
          "verifyCode":this.regiValidate.VerificationCode,
          "vcodeId":this.vcode
        };
        //前端验证上面写的规则，通过则把setpass的信息传到后台，通过进入下一步信息完善
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.axios.post(this.baseurl+'enterprise/verify',qs.stringify(setpass)).then(function(res){
                  var res=res.data;
                  if(res.code==0){
                    if(_this.current==3){
                        _this.current=0;
                      }else{
                        _this.current+=1;
                      }
                      _this.stepnum=2;
                      _this.provinceList=res.data.areacodeList;
                      _this.industryList=res.data.industryList;

                  }else{
                     _this.$Message.error(res.msg);
                  }
                })
            }
        })
     },   
    //第二步注册
    step2submit (name) {
       var _this=this;
       //把用户输入的账号密码存在logininfo里
        var userinfo={
          "telno":this.regiValidate.telnum,
          "name":this.registep2.teamname,
          "provinceCode":this.provincecode,
          "cityCode":this.citycode,
          "areaCode":this.regioncode,
          "indName":this.registep2.industry,
          "password":this.registep2.password,
          "contactName":this.registep2.username,
          "email":this.registep2.email,
          "address":this.registep2.detailadress
        }
        //前端验证上面写的规则，通过则把setpass的信息传到后台，通过进入下一步信息完善
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.axios.post(this.baseurl+'enterprise/regist',qs.stringify(userinfo)).then(function(res){
                   var res=res.data;
                   if(res.code==0){//成功跳转下一步
                    localStorage.setItem("entid",JSON.stringify(res.data.entId));
                    localStorage.setItem("usertel",_this.regiValidate.telnum);
                    if(_this.current==3){
                        _this.current=0;
                      }else{
                        _this.current+=1;
                      }
                      _this.stepnum=3;
                   }else if(res.code==999){
                      _this.$Message.error(res.msg);
                      _this.$router.push('/login');
                   }else{
                     _this.$Message.error(res.msg);
                   }
                })                
            }
        })
     },
    // 选择省
    choiceprovince (value){
      var _this=this;
      // 选择的时候先清空下一级们的数据
      this.registep2.city='';
      this.registep2.region='';
      this.provincecode=value;
      var params=qs.stringify({"areaCode":value});
      this.axios.post(this.baseurl+'arealist',params).then(function(res) {
           var res=res.data;
           console.log(res);
           if(res.code==0){
              _this.cityList=res.data.arealist;
           }else if(res.code==999){
              _this.$Message.error(res.msg);
              _this.$router.push('/login');
           }else{
              _this.$Message.error(res.msg);
            }            
      })
    },
    // 选择市
    choicecity (value){
      var _this=this;
      // 选择的时候先清空下一级们的数据
      this.registep2.region='';
      this.citycode=value;
      var params=qs.stringify({"areaCode":value});
      this.axios.post(this.baseurl+'arealist',params).then(function(res) {
           var res=res.data;
           if(res.code==0){
            _this.regionList=res.data.arealist;
           }else if(res.code==999){
              _this.$Message.error(res.msg);
              _this.$router.push('/login');
           }else{
              _this.$Message.error(res.msg);
           }          
      })
    },
    //选择区域
    choiceregion (value){
      this.regioncode=value;
    },
    //跳转咻咻下载页
    xiuload (){
      this.$router.push('xiuload');
    },
    //进入首页钱必须重新登录
    home (){
      this.$router.push('/login');
    }
 }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.Partingline{
  /*width: 1100px;*/
  height: 1px;
  background: #eee;
  margin-bottom: 40px;
  position: relative;
  right: 120px;
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
}
.register{
  background: #fff;
  height: 100%;
}
.regiback{
  width: 960px;
  background: #fff;
  margin:0 auto;
  padding-left: 100px;
}
.Stepbar{
  /*width: 1100px;*/
  margin:20px auto;
  padding: 40px 0;
}
.imgvali{
  width: 120px;
  height: 36px;
  margin-left: 20px;
  position: absolute;
  top: 2px;
  left: 363px;
}
.changetip{
  position: absolute;
  top: 40px;
  left: 420px;
  font-size: 18px;
  border-bottom: 1px solid #ccc;
}
.telregi{
  width: 800px;
  margin:0 auto;
}
.regisucess{
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
}
.getcode{
  margin-left: 20px;
  height: 36px;
  background-color: #475cc7;
  font-size: 14px;
  width: 120px;
}
.getcode1,.Times{
  margin-left: 20px;
  height: 36px;
  font-size: 14px;
  width: 120px;
}
.step2btn{
  width: 120px;
  height: 36px;
  background-color: #475cc7;
  font-size: 14px;
}
.step2btn1{
  width: 120px;
  height: 36px;
  font-size: 14px;
}
.manalogin{
  width: 120px;
  height: 36px;
  background-color: #475cc7;
}
.pwtip{
  font-size: 14px;
  color: #a9a9a9;
}
.Checkboxtips{
  font-size: 18px;
  color: #a9a9a9;
}
.Checkboxtips span{
  font-size: 18px;
  color: #475cc7;
}
.happyface{
  font-size: 100px;
  color: #475cc7;
}
.happytip{
  font-size: 24px;
  color: #a9a9a9;
  line-height: 60px;
}
.uploadtip{
  display: inline-block;
  color: #475cc7;
  font-size: 18px;
  border-bottom: 1px solid #475cc7;
  margin: 30px 0;
  width: 300px;
}
.gohome{
  width: 180px;
  height: 36px;
  margin-top: 70px;
  background-color:#475cc7; 
}
.regisucess div{
  text-align: center;
  margin: 0 auto;
}
</style>
