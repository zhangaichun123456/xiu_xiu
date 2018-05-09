<template>
	<div class="groupkingz1">
		<header>选择群主</header>
		<div class="content">
			<div class="left">
				<p>选择人员</p>
				<div class="candidate">
                    <Input v-model="searchcontent" icon="search" style="width: 200px"></Input>
					<ul>
						<li v-for="item in filtercandidate" @click="choose(item)">{{item.nickname}}</li>
					</ul>
				</div>
			</div>
			<div class="right">
				<p>已选人员</p>
				<div class="chooseking">
					<p v-if="dptgrounking.nickname">{{dptgrounking.nickname}}</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default{
	data (){
		return {
			searchcontent:'',
		}
	},
	mounted:function(){
		this.$nextTick(function(){
		})
	},
	computed:{
    ...mapState([
    	'groupkinglist1',//当前部门的群主候选人
    	'dptgrounking',
    ]),
    //搜索过滤的渲染数据
    filtercandidate:function(){
    	var searchcontent=this.searchcontent;
    	if(searchcontent){
    		return this.groupkinglist1.filter(function(item){
    			return Object.keys(item).some(function(key){
    				return String(item[key]).toLowerCase().indexOf(searchcontent)>-1
    			})
    		})
    	}
    	return this.groupkinglist1;
    }
  },
	methods:{
		...mapMutations([
            "RECORD_DPTGROUNPKING"
        ]),
		choose (item){
			this.dptgrounking=item;
			this.RECORD_DPTGROUNPKING(item);
		}
	}
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
	margin-right: 20px;;
	overflow: auto;
}
.left .candidate li{
	padding-left: 22px;
	height: 40px;
	line-height: 40px;
    font-size: 14px;
    color: #5a5a5a;
}
.left .candidate li:hover{
	background-color: #eee;
}
.right .chooseking{
	border: 1px solid #eee;
	width: 330px;
	height: 330px;
}
.right .chooseking p{
	width: 290px;
	height: 36px;
	line-height: 36px;
	background-color: #dadef4;
	margin: 10px 0 10px 20px;
	font-size: 14px;
	color: #5a5a5a;
	padding-left: 10px;
}
</style>