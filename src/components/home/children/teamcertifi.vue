<template>
	<div class="teamcertifi">
		<div class="realname" v-if="!finishreal">
		    <p class="head">第一步，申请人实名认证</p>
		    <p class="headtip">个人实名认证未完成，请在手机上进行个人实名认证！</p>
			<img :src="logo" alt="">
			<div class="steps">
				<p>1.请打开手机咻咻，扫描下方二维码进行个人实名认证</p>
				<p>2.或者打开手机钉钉，找到“我的”，点击个人头像，进入“个人实名认证”</p>
			</div>
		</div>
		<div class="teaminfo">
			 <p class="head">第二步，填写企业信息<span>(请选择企业、政府/事业单位、或其他组织，并按照对应的类别进行信息登记)</span></p>
			 <ul>
			 	<router-link tag="li" to='/home/teamcertifi/company'>企业</router-link>
			 	<router-link tag="li" to='/home/teamcertifi/government'>政府/事业单位</router-link>
			 	<router-link tag="li" to='/home/teamcertifi/individual'>个体工商户</router-link>
			 	<router-link tag="li" to='/home/teamcertifi/otherorg'>其他组织</router-link>
			 </ul>
			 <keep-alive>
		      <router-view></router-view>
		     </keep-alive>
		</div>
	</div>
</template>

<script>
import logo from '../../../image/login.jpg'
export default{
	data () {
		return {
			logo:logo,
			finishreal:false,//判断是否有实名认证，默认没完成
		}
	}

}
</script>

<style scoped>
.teamcertifi{
    background: #eee;
}
.realname{
	font-size: 0;
	margin:10px;
	padding: 20px;
	background-color: #fff;
}
.head{
	font-size: 18px;
	color: #525252;
}
.head span{
	font-size: 14px;
	color: #a9a9a9;
	margin-left: 30px;
}
.realname .headtip{
   height: 30px;
   line-height: 30px;
   background: #eceef9;
   color: #475cc7;
   margin: 20px 0 30px;
   padding-left: 10px;
   font-size: 14px;
}
.realname img{
	width: 120px;
	height: 120px;
	margin-right: 30px;
}
.realname div{
	font-size: 14px;
	color: #525252;
}
.realname div p{
	line-height: 30px;
}
.realname img,.realname div{
	display: inline-block;
	vertical-align: middle;
	line-height: 20px;	
}
h2{
	font-size: 18px;
}
.teaminfo{
	background-color: #fff;
	padding: 20px;
}
.teaminfo ul{
	margin: 30px 0;
	font-size: 0;
	height: 60px;
    line-height: 60px;
    background-color: #f8f8f8;
}
.teaminfo ul li{
	padding: 0 30px;
	height: 60px;
	line-height: 60px;
	display: inline-block;
	font-size: 18px;
	color: #a9a9a9;
	text-align: center;
}
.teaminfo ul .router-link-active{
	background: #fff;
	color: #475cc7;
    border-top: 4px solid #475cc7;
}
</style>