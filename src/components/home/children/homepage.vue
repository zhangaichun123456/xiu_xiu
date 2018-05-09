<template>
  <div class="homepage">
      <div class="wrap">
		  <div class="left">
		      <div class="logowrap">
		        <img v-if="companyinfo.logoUrl" :src="baseurl+companyinfo.logoUrl" alt="" class="logo">
			  	<img v-if="!companyinfo.logoUrl" :src="logo" alt="" class="logo">
			  	<p>{{companyinfo.name}}</p>
		  	  </div>
			  <div class="peoplenum">
			  	<ul>
			  		<li>
			  		   <span>企业人数:</span>
			  		   <span>{{empcount}}人</span>
			  		</li>
			  		<li>
			  		   <span>部门数:</span>
			  		   <span>{{deptcount}}个</span>
			  		</li>
			  		<li>
			  		   <span>昨日使用人数:</span>
			  		   <span>{{logincount}}人</span>
			  		</li>
			  	</ul>
			  </div>
			  <div class="medianum">
			  	<ul>
			  		<li>
			  		   <span>音视频通话:</span>
			  		   <span>余0分钟</span>
			  		</li>
			  		<li>
			  		   <span>咻咻:</span>
			  		   <span>余0条</span>
			  		</li>
			  	</ul>
			  </div>
			  <div class="certification">
			    <h3>企业认证</h3>
			  	<ul>
			  		<li><p><span class="youshi"><Icon type="ios-paper-outline"></Icon></span><span class="youshitext">认证优势</span></p></li>
			  		<li><p><span class="youshi"><Icon type="ios-paper-outline"></Icon></span><span class="youshitext">认证优势</span></p></li>
			  		<li><p><span class="youshi"><Icon type="ios-paper-outline"></Icon></span><span class="youshitext">认证优势</span></p></li>
			  		<li><p><span class="youshi"><Icon type="ios-paper-outline"></Icon></span><span class="youshitext">认证优势</span></p></li>
			  	</ul>
			  	<div class="certifi_btn" @click="teamcertifi">申请企业认证</div>
			  </div>
		  </div>
		  <div class="right">
		  	<div class="banner">
		  		<div class="swiper-container">
			        <div class="swiper-wrapper">
			            <div class="swiper-slide">
				            <router-link to='/xiuload'><img :src="loadxiu" alt=""></router-link>
			            </div>
			            <div class="swiper-slide">
				            <router-link to='/home/maillist'><img :src="maillistimg" alt=""></router-link>
			            </div>
			            <div class="swiper-slide">
				            <router-link to='/home/teamapplication'><img :src="appliimg" alt=""></router-link>
			            </div>
			        </div>
			        <!-- Add Pagination -->
			        <div class="swiper-pagination"></div>
			    </div>
		  	</div>
		  	<div class="quick_enter">
		  		<h3>快捷入口</h3>
		  		<div class="enterlist">
		  			<ul>
		  			    <router-link tag="li" to='/home/maillist'><img :src="maillist" alt=""><p>通讯录管理</p></router-link>
		  			    <router-link tag="li" to='/home/teamapplication'><img :src="application " alt=""><p>应用管理</p></router-link>
		  			    <router-link tag="li" to='/home/setup'><img :src="setup" alt=""><p>企业设置</p></router-link>
		  			</ul>
		  		</div>
		  	</div>
		  	<footer @click="goloadxiuxiu">下载咻咻客户端</footer>
		  </div>
	  </div>
  </div>
</template>

<script>
import logo from '../../../image/login.jpg'
import loadxiu from '../../../image/001.jpg'
import maillistimg from '../../../image/002.jpg'
import appliimg from '../../../image/003.jpg'
import maillist from '../../../image/maillist.png'
import application from '../../../image/application.png'
import setup from '../../../image/setup.png'
import swiperjs from '../../../../static/js/swiper-3.4.2.min.js'
import swipercss from '../../../../static/css/swiper-3.4.2.min.css'
import {mapState, mapMutations, mapActions} from 'vuex'
import qs from 'qs';

export default {
   data (){
   	return {
   		logo:logo,
   		loadxiu:loadxiu,
   		maillistimg:maillistimg,
   		appliimg:appliimg,
   		maillist:maillist,
   		application:application,
   		setup:setup,
   		deptcount:null,
   		empcount:null,
   		logincount:null,
   	}
   },
   mounted:function(){
     this.$nextTick(function(){
     	this.initteaminfo();//初始化该公司的详细信息
     	this.initbanner();//首页轮播
     })
   },
   computed:{
        ...mapState([
            'entId',
            'companyinfo',
            'admintelnum',
        ]),
    },
   methods:{
   	...mapMutations([
            'record_companyinfo',
            'record_manager',
        ]),
   	 initbanner (){
         var swiper = new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        paginationClickable: true,
		        autoplay:1000,
		    });
   	 },
   	 teamcertifi (){
   	 	 // 先判断是否正在认证中，认证中点击跳转到审核中页面，否则跳转到认证页面
   	 	 // this.$router.push('/home/examine');
         this.$router.push('/home/teamcertifi');
   	 },
   	 initteaminfo (){
   	 	var params={
          'entId':this.entId,
          'telNo':this.admintelnum,
        };
        this.axios.post(this.baseurl+'enterprise/index',qs.stringify(params)).then((res)=>{
            var res=res.data;
            if (res.code==0){
            	this.deptcount=res.data.deptcount;
	            this.empcount=res.data.empcount;
	            this.logincount=res.data.logincount;
	            this.record_companyinfo(res.data.entinfo);
	            this.record_manager(res.data.manager);
	            localStorage.setItem("manager",JSON.stringify(res.data.manager));
            }else if(res.code==999){
            	this.$Message.error(res.msg);
            	this.$router.push('/login');
            }else{
            	this.$Message.error(res.msg);
            }            
                     
        })
     },
     goloadxiuxiu (){
     	this.$router.push('/xiuload');
     }
   }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.homepage{
	width: 100%;
	min-width: 960px;
	height: calc(100% - 80px);
	background: #fff;
	position: relative;
}
.wrap{
	height: 100%;
	position: relative;
	overflow-x:auto;
	overflow-y:hidden;
}
.left{
	position: absolute;
	top: 0;
	left: 0;
	width: 320px;
	height:100%;
	background-color: #475cc7;
	overflow: auto;
}
.right{
	float: right;
	width: calc(100% - 320px);
	min-width: 600px;
	overflow: auto;
	height: 100%;
	background-color: #eee;
}
.logowrap{
	height: 173px;
	text-align: center;
	font-size: 14px;
	background-color: #5e86dd;
	color: #fff;
}
.logowrap img{
	width: 72px;
	height: 72px;
	border-radius: 50%;
	margin: 30px 0;
}
.peoplenum{
	height: 150px;
	border-bottom: 1px solid #7486e2;
}
.medianum{
	height: 106px;
}
.peoplenum,.medianum{
	padding: 30px;
	background: #5c71dd;
}
.peoplenum li,.medianum li{
	height: 35px;
	line-height: 35px;
}
.peoplenum li span:first-child,.medianum li span:first-child{
	font-size: 14px;
	color: #acb3e2;
}
.peoplenum li span:last-child,.medianum li span:last-child{
	float: right;
	font-size: 14px;
	color: #fff;
}
.certification{
	background-color: #475cc7;
	color: #fff;
	padding: 30px;
}
.certification h3{
	text-align: center;
	font-size: 18px;
	font-weight: 300;
}
.certification li{
	margin: 20px 0;
}
.certifi_btn{
	text-align: center;
	border:1px solid #fff;
	width: 120px;
	height: 36px;
	line-height: 36px;
	border-radius: 18px;
	color: #fff;
	margin: 50px auto 0;
}
.banner{
	margin: 10px 0px 0 10px;
	width: calc(100% - 20px);
}
.right .enterlist{
	padding: 60px 0;
}
.quick_enter{
	background-color: #fff;
	margin: 10px 0 0 10px;
	width: calc(100% - 20px);
}
.quick_enter h3{
	font-size: 18px;
	color: #525252;
	margin: 0 10px 0 10px;
	padding: 20px 0 20px 10px;
	font-weight: 300;
	border-bottom: 1px solid #cecece;
}
.enterlist ul{
	width: 600px;
	font-size: 0;
	margin: 0 auto;
}
.enterlist ul li{
	display: inline-block;
	width: 100px;
	line-height: 50px;
	margin: 0 50px;
	text-align: center;
	font-size: 18px;
	color: #525252;
}
.youshi{
	font-size: 16px;
	margin-right: 30px;
}
.youshitext{
	font-size: 14px;
	color: #acb3e2;
}
footer{
	margin: 10px 0 0 10px;
	width: calc(100% - 20px);
	height: 85px;
	line-height: 85px;
	text-align: center;
	background-color: #fff;
	font-size: 24px;
	color: #475cc7;
}
.swiper-wrapper{
	width: 860px;
}
.swiper-wrapper img{
	width: 100%;
}
</style>
