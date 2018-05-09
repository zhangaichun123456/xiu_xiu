<template>
	<div class="destroycompany">
		<div class="warn">
      <img :src="destroyicon" alt="">  
    </div>
		<p>解散后，你的后台管理帐号和通讯录将会删除；如有需要，请先<span class="exportbtn" @click="exportfile">导出通讯录</span></p>
		<p>该操作不可撤销，请谨慎操作。同时删除的包括钉盘文件，应用数据（公告，考勤，审批等），请做好相应的备份。</p>
		<div class="foot"><Button type="primary" @click="destorymodel=true">解散该企业</Button></div>
		<Modal v-model="destorymodel" width="720" class="destorymodel" :closable="false">
			<Form :label-width="170">
				 <Form-item label="手机号码：">
					 <Input type="text" v-model="admintelnum" style="width: 360px" disabled></Input>
					 <Button v-show="!sendCode" @click="getcode" type="primary">获取验证码</Button>
					 <Button v-show="sendCode" disabled type="primary">{{Times}}s</Button>
           <span class="formstar"><Icon type="asterisk"></Icon></span>
				 </Form-item>
				 <Form-item label="短信验证码：">
				  	<Input type="text" v-model="VeriCode" style="width: 360px"></Input>
            <span class="formstar"><Icon type="asterisk"></Icon></span>
				 </Form-item>
				 <Form-item>
             <Button type="primary" @click="surecode">解散</Button>
             <Button type="primary" @click="destorymodel=false">取消</Button>
          </Form-item>
			</Form>
      <div slot="footer" class="footer">
          <Button></Button>
      </div>
		</Modal>
      <Modal v-model="surepro" width="720" class="surepro" :closable="false">
          <header>提示</header>
          <p>确认解散该企业？</p>
          <div slot="footer">
              <Button type="warning" @click="suredestory">解散</Button>
              <Button type="ghost" @click="cancel">取消</Button>
          </div>
      </Modal>
	</div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import qs from 'qs';
import destroyicon from '../../../../image/destroyicon.png'
export default {
	data (){
		return {
           destroyicon:destroyicon,
           destorymodel:false,
           Times:60,
           sendCode:false,
           VeriCode:'',
           vcode:'',
           surepro:false,
		}
	},
	 computed:{
    ...mapState([
	      'entId',
	      'admintelnum',
	    ]),
	  },
	methods:{
    		exportfile (){
    			this.$router.push('/home/inout');
    		},
        getcode (){
            var _this=this;
            var params={
              'type':44,
              'telNo':this.admintelnum,
            };
            this.axios.post(this.baseurl+'enterprise/sendValidateCode',qs.stringify(params)).then((res)=>{
                var res=res.data;
                console.log(res);
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
        // 点击验证
        surecode (){
            var params={
              'entId':this.entId,
              'vcode':this.VeriCode,
              'vcodeId':this.vcode,
            };
            this.axios.post(this.baseurl+'shezhi/check',qs.stringify(params)).then((res)=>{
                var res=res.data;
                console.log(res);
                if(res.code==0){
                    this.surepro=true;
                    this.destorymodel=false;
                }else{
                    this.$Message.error(res.msg);
                }
            })
        },
        cancel (){
            this.surepro=false;
        },
        suredestory (){
            var params={
              'entId':this.entId,
            };
            this.axios.post(this.baseurl+'shezhi/destroy',qs.stringify(params)).then((res)=>{
                var res=res.data;
                console.log(res);
                if(res.code==0){
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
.destroycompany{
  margin:10px;
  background: #fff;
  min-height: 600px;
}
.warn{
  text-align: center;
}
.warn img{
	font-size: 50px;
	margin: 40px auto 60px;	
}
p{
  font-size: 14px;
  color: #a9a9a9;
	text-align: center;
	margin: 20px 0;
}
.exportbtn{
  font-size: 18px;
  color: #475cc7;
  border-bottom: 1px solid #475cc7;
}
.foot{
	text-align: center;
	margin-top: 20px;
}
button{
  width: 120px;
  height: 36px;
  font-size: 14px;
}
.foot button{
  width: 120px;
  height: 36px;
  font-size: 14px;
  background: #475cc7;
}
form{
  padding-top: 40px;
}
.formstar{
  color: #e41d14;
}
.surepro button{
  width: 120px;
  height: 36px;
}
.surepro button:first-child{
  background: #475cc7;
  border-color: #475cc7;
}
header{
  background: #475cc7;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  color: #fff;
}
.surepro p{
  font-size: 20px;
  color: #525252;
}
.destorymodel button{
  width: 120px;
  height: 36px;
  background: #475cc7;
}
.footer button{
   opacity: 0;
   position: absolute;
   top: 0;
   left: 0;
}
</style>
