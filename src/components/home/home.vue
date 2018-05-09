<template>
  <div class="home">
    <header>
      <div class="stagename">
        <img :src="logo" alt="">
        <p @click="gohome">咻咻管理后台</p>
      </div>
      <div class="menu">
        <ul>
          <router-link tag="li" to='/home/homepage'>首页</router-link>
          <router-link tag="li" to='/home/maillist'>通讯录</router-link>
          <router-link tag="li" to='/home/teamapplication'>企业应用</router-link>
          <router-link tag="li" to='/home/setup' @click.native="togglepath(manager)">设置</router-link>
        </ul>
      </div>      
      <div class="exit" @click="exit"><span class="regiicon"><Icon type="power"></Icon></span><span>退出</span></div>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import logo from '../../image/login.jpg'

export default {
   data (){
    return {
       logo:logo,
       shownum:1,
    }

   },
  // 在组件初始化时调用，可以简单理解为页面加载时
  // 刷新的时候用户的各种公司信息，头像，名称之类的会被清空，故使用本地存储,公司entid也要用到，故保存
  created (){     
     var entid=localStorage.getItem("entid");
     var telno=localStorage.getItem("usertel");
     this.RECORD_ENTID(entid);
     this.RECORD_ADMINTEL(telno);
     var manager=localStorage.getItem("manager");
     this.record_manager(manager);
  },
   mounted:function(){
   },
   computed:{
    ...mapState([
      'teamInfo',
      'manager',
    ]),
   },
   methods:{
     ...mapMutations([
      'RECORD_ENTID',
      'RECORD_ADMINTEL',
      'record_manager',
      ]),
    exit (){
       this.axios.post(this.baseurl+'logout').then((res)=>{
        var res=res.data;
        if(res.code==0){
          this.$router.push('/login');
        }
       })
    },
    togglepath (n){
      if(n==2){
        this.$router.push('/home/setup/companyset');
      }else{
        this.$router.push('/home/setup/modifyadminpw');
      }
    },
    gohome (){
      this.$router.push('/home');
     }
   }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home{
  height: 100%;
  background: #fff;
}
header{
  width: 100%;
 /* min-width: 960px;*/
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
.stagename{
  font-size: 18px;
  position: relative;
  left: 5%;
  top: -3px;
}
.stagename p{
  height: 40px;
  line-height: 40px;
  padding-left:15px; 
  border-left: 2px solid #ccc;
  margin: 0 100px 0 15px;
}
.stagename img{
  width: 40px;
  height: 40px;
}
header .exit{
  font-size: 18px;
  float: right;
  margin-right: 40px;
}
header div{
  display: inline-block;
  font-size: 0
}

.regiicon{
  font-size: 18px;
  margin-right: 10px;
}
.stagename img,.stagename p{
  display: inline-block;
  vertical-align: middle;
}
.menu{
  margin-left: 80px;
}
.menu ul li{
  display: inline-block;
  font-size: 18px;
  padding: 0 15px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  color: #acb3e2;
}
.menu ul .router-link-active{
  border-bottom: 2px solid #fff;
  color: #fff;
}  
</style>
