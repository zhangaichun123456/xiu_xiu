<template>
	<div class="chooseupdpt">
	    <header>选择上级部门</header>
		<div class="content">
			<div class="left">
				<p>选择部门</p>
				<div class="candidate">
					<ul v-for="item in alldpt" :key="item.name">
					   <updptsingle :model="item"></updptsingle>
					</ul>
				</div>
			</div>
			<div class="right">
				<p>已选部门</p>
				<div class="choosekdpt">
					<ul>
						<li>{{updpt1.name}}</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import updptsingle from './updptsingle.vue'

export default{
	data (){
		return {
			updptlist:[],//候选人列表数据
		}
	},
	 components: {
       updptsingle,
   },
	mounted:function(){
		this.$nextTick(function(){
		})
	},
	computed:{
    ...mapState([
    	'alldpt',
    	'updpt1',
    ]),
    
    },
	methods:{
		...mapMutations([
            ]),
		
	},
}	
</script>
<style scoped>
header{
	background: #475cc7;
	text-align: center;
	height: 40px;
	line-height: 40px;
	font-size: 20px;
	color: #fff;
}
.content{
	padding: 20px 0 0 20px;
}
.content p{
	font-size: 18px;
	color: #a9a9a9;
	padding-bottom: 20px;
}
.content .left,.content .right{
	display: inline-block;
	vertical-align: top;
	overflow: auto;
}
.left .candidate{
	border: 1px solid #eee;
	width: 330px;
	height: 330px;
	margin-right: 20px;
	overflow: auto;
    white-space: nowrap;
    padding: 10px 0 0 10px;
}
.left .candidate ul{
	font-size: 14px;
	color: #5a5a5a;
}
.left .candidate ul li{
	height: 40px;
	line-height: 40px;
}
.right .choosekdpt{
	border: 1px solid #eee;
	width: 330px;
	height: 330px;
}
.right .choosekdpt li{
	width: 280px;
	height: 36px;
	line-height: 36px;
	background-color: #dadef4;
	margin: 10px 0 10px 20px;
	font-size: 14px;
	color: #5a5a5a;
	padding-left: 10px;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>