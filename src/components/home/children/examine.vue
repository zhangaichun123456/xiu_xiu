<template>
	<div class="examine">
		 <p class="head">审核进度</p>
		 <div class="content">
		 	<img :src="shjd" alt="">
		 	<p>正在审核中，请耐心等待</p>
		 </div>
		 <Button type="primary" @click="gohome">返回</Button>
	</div>
</template>
<script>
import shjd from '../../../image/shjd.png'
export default{
   data () {
            return {
                shjd:shjd,
            }
        },
   methods:{
      gohome (){
      	this.$router.push('/home')
      }
   }
}
</script>
<style scoped>
.examine{
	text-align: center;
}
.head{
  font-size: 30px;
  color: #525252;
  margin: 60px 0 100px;
}
img{
  margin-bottom: 60px;
}
.content p{
  font-size: 24px;
  color: #a9a9a9;
}
button{
  width: 120px;
  height: 36px;
  font-size: 14px;
  background-color: #475cc7;
  margin-top: 100px;
}
</style>