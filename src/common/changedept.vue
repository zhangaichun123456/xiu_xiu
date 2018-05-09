<template>
	<div class="changedept">
	    <header>选择部门</header>
		<div class="content">
			<div class="left">
				<p>选择部门</p>
				<div class="candidate">
				    <span class="allChoose"><Checkbox v-model="allchoose" @on-change="allChoose($event)">全选</Checkbox></span>
					<ul v-for="item in alldpt" :key="item.name">
					   <changedepttree :model="item"></changedepttree>
					</ul>
				</div>
			</div>
			<div class="right">
				<p>已选部门</p>
				<div class="choosekdpt">
					<ul>
						<li v-for="dpt in this.changedeptlist">{{dpt.name}}</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import changedepttree from './changedepttree.vue'

export default{
	data (){
		return {
			'allchoose':false,
			'ceshi':false,
		}
	},
	 components: {
       changedepttree,
   },
	mounted:function(){
		this.$nextTick(function(){
		})
	},
	computed:{
    ...mapState([
    	'changedeptlist',
    	'alldpt',
    ]),
    
    },
	methods:{
		 ...mapMutations([
                'RECORD_changedeptlist'
            ]),
		allChoose (e){
			var _this=this;
			if(e==true){
				this.RECORD_changedeptlist([]);
				resetdata(this.alldpt);
				function resetdata(arr){
					for(var i=0;i<arr.length;i++){
						_this.$set(arr[i],'gouxuan',true)
					   _this.changedeptlist.push(arr[i]);
						if(arr[i].children){
							resetdata(arr[i].children);
						}				
				   }

				}
				
			}else{
				this.RECORD_changedeptlist([]);
				resetdata1(this.alldpt);
				function resetdata1(arr){
					for(var i=0;i<arr.length;i++){
						_this.$set(arr[i],'gouxuan',false)
						if(arr[i].children){
							resetdata1(arr[i].children);
						}				
				   }

				}
			}
		},
		emptychoose (){
		   this.allchoose=false;
		}
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
    text-overflow: ellipsis;
    padding: 10px 0 0 10px;
}
.left .candidate ul{
	margin-top: 10px;
}
.right .choosekdpt{
	border: 1px solid #eee;
	width: 330px;
	height: 330px;
	overflow-y: auto;
}
.right .choosekdpt li{
	width: 280px;
	height: 36px;
	overflow-x: hidden;
	line-height: 36px;
	background-color: #dadef4;
	margin: 10px 10px 10px 20px;
	font-size: 14px;
	color: #5a5a5a;
	padding-left: 10px;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.allChoose{
	font-size: 14px;
	margin: 0 0 0 10px;
}
</style>