<template>
  <div class="xiuload">
    <header>
       <div class="logo">
         <img :src="logo" alt="">
         <p @click="gohome">咻咻管理后台</p>
       </div>
       <div class="regi">
         <span @click="gologin"><span class="regiicon"><Icon type="person"></Icon></span><span>企业登录</span></span>
         <span @click="goregister" class="regi1"><span class="regiicon"><Icon type="person"></Icon></span><span>企业注册</span></span>
       </div>
     </header>
    <div class="clientadr">
    	<h2>立即下载</h2>
    	<ul>
    		<li><img :src="logo" alt=""><p>扫描二维码</p><p>下载PC客户端</p></li>
    		<li><img :src="logo" alt=""><p>扫描二维码</p><p>下载andriod端</p></li>
        <li><img :src="logo" alt=""><p>扫描二维码</p><p>下载iphone端</p></li>
    	</ul>
    </div>
    <div class="Updatelog">
    	<h2>更新日志</h2>
    	<div>
    		<h3>咻咻1.1 <span>2017年4月19日</span></h3>
    		<p><span>【新增群运动】</span><span>为你管理的内部群开启群运动，群内成员相互PK，共享运动快乐，提升凝聚力；</span></p>
        <p><span>【撤回群消息】</span><span>群主可撤回群内成员的聊天消息，保障群内信息安全；</span></p>
    	</div>
    </div>
  </div>
</template>

<script>
import logo from '../image/login.jpg'
export default {
  data (){
  	return {
  		logo:logo,
  	}
  },
  methods:{
    goregister (){
       this.$router.push({ path: 'register' })
    },
     gologin (){
      this.$router.push('login');
    },
    gohome (){
      this.$router.push('/home');
     }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.xiuload{
  height: 100%;
  background: #fff;
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
  position: relative;
  left: 68%;
  top: 0
}
header .regi1{
  margin-left: 40px;
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
h2{
	text-align: center;
}
.clientadr{
  padding: 40px 0 70px 0;
  min-width: 800px;
}
.Updatelog{
  padding: 60px 100px;
}
.clientadr{
  border-bottom: 1px solid #cecece;
}
.clientadr h2{
  margin-bottom: 80px;
  font-size: 30px;
  color: #525252;
  font-weight: 300;
}
.Updatelog h2{
  margin-bottom: 60px;
  font-size: 30px;
  color: #525252;
  font-weight: 300;
}
.Updatelog h3{
  font-size: 24px;
  color: #525252;
  font-weight: 300;
  margin-bottom: 20px;
  padding-left: 5px;
}
.Updatelog h3 span{
  color: #a9a9a9;
  margin-left: 20px;
}
.Updatelog p{
  font-size: 14px;
  color: #525252;
  line-height: 25px;
}
.clientadr ul{
	width: 100%;
	font-size: 0;
}
.clientadr ul li{
	display: inline-block;
	width: 33.3333%;
	text-align:center;
	font-size: 16px;
}
.clientadr ul li img{
  width: 180px;
  height: 180px;
  margin-bottom: 45px;
}
.clientadr ul li p{
  color: #9a9a9a;
  font-size: 18px;
}

</style>
