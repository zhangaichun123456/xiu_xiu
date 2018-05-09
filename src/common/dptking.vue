<template>
	<div class="dptking">
		<header>选择主管</header>
		<div class="content">
			<div class="left">
				<p>选择人员</p>
				<div class="candidate">
                    <Input v-model="searchcontent" icon="search"></Input>
                    <Checkbox v-model="allchoose" @on-change="allChoose($event)">全选</Checkbox>
				    <Checkbox v-for="item in filtercandidate" :key="item.name" v-model="item.xuanzhong" @on-change="changeking(item,$event)">{{item.name}}</Checkbox>
				</div>
			</div>
			<div class="right">
				<p>已选人员</p>
				<ul class="chooseking">
					<li v-for="item in directorList1">
					    {{item.name}}
						<span @click="delking(item)" class="delkingicon"><Icon type="close"></Icon></span>		
					</li>
				</ul>
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
			allchoose:false,
			hehe:[1,2,3],
		}
	},
	
	mounted:function(){
		this.$nextTick(function(){
			
		})
	},
	computed:{
    ...mapState([
    	'deptpeolist',
    	'directorList1',
    ]),
    //搜索过滤的渲染数据
    filtercandidate:function(){
    	var searchcontent=this.searchcontent;
    	if(searchcontent){
    		return this.deptpeolist.filter(function(item){
    			return Object.keys(item).some(function(key){
    				return String(item[key]).toLowerCase().indexOf(searchcontent)>-1
    			})
    		})
    	}
    	return this.deptpeolist;
    }
  },
	methods:{
		...mapMutations([
			'RECORD_DIRECTORNAME1'
	    ]),
	   // 右侧删除一项，把主管列表对应删除，也把左右勾选项对应设置未勾选
		delking (item){
			for(var i=0;i<this.directorList1.length;i++){
				if(this.directorList1[i].name==item.name){
					this.directorList1.splice(i,1)
				}
			};
            for(var i=0;i<this.deptpeolist.length;i++){
				if(this.deptpeolist[i].name==item.name){
					this.$set(this.deptpeolist[i],'xuanzhong',false);
				}
			};
			//点击选项框，若选中的长度不够全体长度，则全选框不勾选，反之;
			if(this.directorList1.length==this.filtercandidate.length){
				this.allchoose=true;
			}else{
				this.allchoose=false;
			}
		},
		// 左侧选项改变时把当前的选中的项保存到vuex，方便右侧显示
		changeking (item,e){
			if(e==true){
				if(this.directorList1.indexOf(item)<0){
					this.directorList1.push(item);
				}else{
					return;
				}
			}else{
				for(var i=0;i<this.directorList1.length;i++){
					if(this.directorList1[i].name==item.name){
						this.directorList1.splice(i,1);
						break;
					}
				}
			}
			//点击选项框，若选中的长度不够全体长度，则全选框不勾选，反之;
			if(this.directorList1.length==this.filtercandidate.length){
				this.allchoose=true;
			}else{
				this.allchoose=false;
			}
		},
		allChoose (e){
			var _this=this;
			if(e==true){
				this.RECORD_DIRECTORNAME1([]);
				resetdata(this.filtercandidate);
				function resetdata(arr){
					for(var i=0;i<arr.length;i++){
						_this.$set(arr[i],'xuanzhong',true)
					   _this.directorList1.push(arr[i]);			
				   }

				}
				
			}else{
				this.RECORD_DIRECTORNAME1([]);
				resetdata1(this.filtercandidate);
				function resetdata1(arr){
					for(var i=0;i<arr.length;i++){
						_this.$set(arr[i],'xuanzhong',false)			
				   }

				}
			}
		},
		emptychoose (){
		   this.allchoose=false;
		},
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
	margin-right: 20px;
	/*overflow: auto;
	white-space: nowrap;*/
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.right .chooseking{
	border: 1px solid #eee;
	width: 330px;
	height: 330px;
}
.right .chooseking li{
	width: 280px;
	height: 36px;
	line-height: 36px;
	background-color: #dadef4;
	margin: 10px 0 10px 20px;
	font-size: 14px;
	color: #5a5a5a;
	padding:0 20px 0 10px;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	position: relative;
}
.delkingicon{
	position: absolute;
	right: 10px;
	top: 0;
	color: #fff;
}
</style>