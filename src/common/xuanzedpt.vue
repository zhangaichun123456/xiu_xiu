<template>
<div class="xuanzedpt">
	<header>选择部门</header>
    <div class="addmembertree dpttree">
		<div class="left">
			<p>选择部门</p>
			<div class="tree">
				<Input v-model="searchcontent" icon="search" style="width: 270px" @on-change="searchkey(searchcontent)"></Input>
				<Breadcrumb separator=">">
                    <span v-for="dtp in breaddata" :key="dtp.name" @click="nextfloor(dtp)"><Breadcrumb-item>{{dtp.name}}</Breadcrumb-item></span>
                </Breadcrumb>
				<div class="lists">
					<Checkbox :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
				    <div class="dptmember">
				        <Checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange">
					    	<Checkbox v-if="!searchcontent" v-for="(item,index) in deptchild" :label="item.deptId" :key="item.deptId">
						    	{{item.name}}
						    	<span v-if="!item.choosed" class="nextfloor" @click.stop.prevent="nextfloor(item)">下级部门</span>
						    	<span v-if="item.choosed" class="nonextfloor">下级部门</span>
					    	</Checkbox>
					    	<Checkbox v-if="searchcontent" v-for="(item,index) in searchdataempList" :label="item.deptId" :key="index">
						    	{{item.name}}
						    	<span v-if="!item.choosed" class="nextfloor" @click.stop.prevent="nextfloor(item)">下级部门</span>
						    	<span v-if="item.choosed" class="nonextfloor">下级部门</span>
					    	</Checkbox>
				    	</Checkbox-group>
				    </div>
			    </div>
			</div>
		</div>
		<div class="right">
			<p>已选部门</p>
			<ul class="minadminlist">
				<li v-for="(ad,index) in admindptlist" :key="ad"><span>{{ad.name}}</span><span class="closebtn" @click="detad(ad)"><Icon type="close"></Icon></span></li>
			</ul>
		</div>
	</div>
</div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import qs from 'qs'
export default{
	data (){
		return{
           searchcontent:'',
           searchdataempList:'',
           admindptlist:[],
           checkAll:false,
           checkAllGroup:[],
		}
	},
	mounted:function(){
   	  this.$nextTick(function(){
   	  	 //获取公司所有部门和人员信息
	        var parmas={
	          'entId':this.entId
	        };
	        this.axios.post(this.baseurl+'shezhi/getemolist',qs.stringify(parmas)).then((res)=>{
	        	var res=res.data;
	        	if(res.code==0){
	        		this.record_deptlist(res.data.deptlist);
	        		this.record_emplist(res.data.emplist)
	        	}
	        })
   	  })   	   
    },
	computed:{
	    ...mapState([
	    	'entId',
	    	'alldpt',
	    	'deptchild',
	    	'breaddata',
	    	'deptpeolist',
	    	'deptlist',
		    'emplist',
		    'adminpeolist',
	    ]),
   },
   methods:{
   	...mapMutations([
        'RECORD_ALLDPT',
        'RECORD_DEPTPEOLIST',
        'RECORD_DEPTCHILD',
        'RECORD_BREADDATA',
        'record_adminlist',
        'record_deptlist',
        'record_emplist'
    ]),
   	searchkey (value){
	      if(value!=''){
	         this.axios.post(this.baseurl+'bas/organization/selectByKeyword',qs.stringify({'entId':this.entId,'keyword':value})).then((res)=>{
	            var res=res.data;
	            console.log(res);
	             this.searchdataempList=res.deptList;
	             // 判断当前已勾选的项，勾选好的则用参数表明
	             for(var i=0;i<this.searchdataempList.length;i++){
	             	if(this.checkAllGroup2.indexOf(this.searchdataempList[i].deptId)>-1){
                       this.$set(this.searchdataempList[i],'choosed',true);
	             	}else{
	             		this.$set(this.searchdataempList[i],'choosed',false);
	             	}
	              }
	          })
	         }else{
	         	 // 搜索值为空的时候，就要判断当前部门有没有勾选的了
	         	 for(var i=0;i<this.deptchild.length;i++){
	             	if(this.checkAllGroup.indexOf(this.deptchild[i].deptId)>-1){
                       this.$set(this.deptchild[i],'choosed',true);
	             	}else{
	             		this.$set(this.deptchild[i],'choosed',false);
	             	}
	              }
	             return;
	         }       
	    },
    //点击下一级
        nextfloor (item){
           var parmas={
		      'entId':this.entId,
	          'deptId':item.deptId,
	         }
		    this.axios.post(this.baseurl+'bas/organization/selectChlidDeptAndEmpListByDeptId',qs.stringify(parmas)).then((res)=>{
		        var res=res.data;
		        this.RECORD_DEPTCHILD(res.deptList);
		        this.RECORD_DEPTPEOLIST(res.empList);
		        this.RECORD_BREADDATA(res.parentDeptList);
		        // 部门选择也是用此方法，在有搜选关键字列表下的下一级，点击的时候记得把关键字清空
		        this.searchcontent='';
		        // 点击面包屑也是此方法，所以要判断点击面包屑后当时的部门有没有选中，然后给设置相应的参数
		        for(var i=0;i<this.deptchild.length;i++){
            	if(this.checkAllGroup.indexOf(this.deptchild[i].deptId)>-1){
            		this.$set(this.deptchild[i],'choosed',true);
            	}else{
            		this.$set(this.deptchild[i],'choosed',false);
            	}
            	
            }
		    }) 
		},
    //单个点击，若全部点击勾选，则全选框打钩
		// 当有搜索字时,列表就是搜索的结果，否则就是当前部门员工所挂员工列表
		checkAllGroupChange (data){
			var list=null;
	        if (this.searchcontent!='') {
                list=this.searchdataempList;
	        }else{
	        	list=this.deptchild;
	        }
	         // 因为data是包含整个企业里面选中的数据，而这里需要跟当前选中的数据长度对比，故要过滤一下data
	         var arr=[];
	         for(var i=0;i<list.length;i++){
	         	if(data.indexOf(list[i].deptId)>-1){
	         		arr.push(list[i])
	         	}
	         }
            if (arr.length === list.length) {
                this.checkAll = true;
            } else if (arr.length > 0) {
                this.checkAll = false;
            } else {
                this.checkAll = false;
            };
            this.admindptlist=[];
            console.log(data);
            console.log(this.deptlist);
            for (var i=0;i<this.deptlist.length;i++){
            	if(data.indexOf(this.deptlist[i].deptId)>-1)
            	this.admindptlist.push(this.deptlist[i]);
            }
            //因为下级两个字如果选择的部门，则下级不可点，故设置个参数控制
            for(var i=0;i<list.length;i++){
            	if(data.indexOf(list[i].deptId)>-1){
            		this.$set(list[i],'choosed',true);
            	}else{
            		this.$set(list[i],'choosed',false);
            	}
            	
            }
		},
    handleCheckAll (){
       // 当有搜索字时,列表就是搜索的结果，否则就是当前部门员工所挂员工列表
			// this.admindptlist=[];
			var list=null;
	        if (this.searchcontent!='') {
                list=this.searchdataempList;
	        }else{
	        	list=this.deptchild;
	        }
            this.checkAll = !this.checkAll;
            // 先把右侧列表的部门id整出来，用来后面对比
            var arr=[];
    		for(var i=0;i<this.admindptlist.length;i++){
    			arr.push(this.admindptlist[i].deptId)
    		}
            if (this.checkAll) {
            	//因为下级两个字如果选择的部门，则下级不可点，故设置个参数控制
	            for(var i=0;i<list.length;i++){
	            	this.$set(list[i],'choosed',true);
	            }
            	// 全选勾上的时候，判断左侧右侧有没有和以前相同的，没有相同的就放进去，以免右侧多出重复的
	        	for(var i=0;i<list.length;i++){
	        		if(this.checkAllGroup.indexOf(list[i].deptId)<0){
	        			this.checkAllGroup.push(list[i].deptId);
	        		}

	        		if(arr.indexOf(list[i].deptId)<0){
	        			 this.admindptlist.push(list[i]);
	        		}               
	        	 }
            } else {
            	//因为下级两个字如果选择的部门，则下级不可点，故设置个参数控制
	            for(var i=0;i<list.length;i++){
	            	this.$set(list[i],'choosed',false);
	            }
            	// 当取消全选时，把当前的部门的全选取消，和把当前的部门名称从右侧列表删除
            	var arr=[];
            	var result={};
            	for(var i in this.deptchild){
					result[this.deptchild[i].deptId] = this.deptchild[i].deptId;
				}
				for(var i in this.checkAllGroup){
					if(!result[this.checkAllGroup[i]]){
						arr.push(this.checkAllGroup[i]);
					  };
				}
				this.checkAllGroup=arr;

				var arr1=[];
				var result1={};
				for(var i in this.deptchild){
					result1[this.deptchild[i].deptId] = this.deptchild[i].deptId;
				}
				for(var i in this.admindptlist){
					if(!result1[this.admindptlist[i].deptId]){
						arr1.push(this.admindptlist[i]);
					  };
				}
				this.admindptlist=arr1;
            }
    },
   //点击右侧删除
    detad (item){
    	for (var i=0;i<this.checkAllGroup.length;i++){
    		if(item.deptId==this.checkAllGroup[i]){
    			this.checkAllGroup.splice(i,1);
    		}
    	}
    	for (var i=0;i<this.admindptlist.length;i++){
    		if(item.deptId==this.admindptlist[i].deptId){
    			this.admindptlist.splice(i,1);
    		}
    	}
    	 //循环判断是哪个部门，然后该部门设置上级可点
    	var list=null;
        if (this.searchcontent!='') {
            list=this.searchdataempList;
        }else{
        	list=this.deptchild;
        }
        for(var i=0;i<list.length;i++){
        	if(item.deptId==list[i].deptId){
        	  this.$set(list[i],'choosed',false);
        	}
        }
    	this.checkAll1=false;
    },
   }

}
</script>

<style scoped>
.addmembertree{
	padding: 20px 0 0 20px;
}
.addmembertree p{
	font-size: 18px;
	color: #a9a9a9;
	padding-bottom: 20px;
}
.addmembertree .left,.addmembertree .right{
	display: inline-block;
	vertical-align: top;
	overflow: auto;
}
.tree{
	border: 1px solid #eee;
	width: 330px;
	height: 330px;
	margin-right: 20px;
	overflow: auto;
}
.minadminlist{
	border: 1px solid #eee;
	width: 330px;
	height: 330px;
}

.addmembertree .right li{
  border-bottom: none;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.addmembertree .lists{
	padding: 0 10px 10px 20px;
}
.addmembertree .dptlist li {
	height: 35px;
	line-height: 35px;
	font-size: 14px;
	border-bottom: none;
}
.addmembertree .dptlist li:hover{
	background: #eee;
}
.nextfloor{
	float: right;
	color: #475cc7;
	width: 60px;
    text-align: right;
}
.nonextfloor{
	float: right;
	color: #ccc;
	width: 60px;
    text-align: right;
}
.addmembertree .minadminlist li{
	width: 290px;
	height: 36px;
	line-height: 36px;
	background-color: #dadef4;
	margin: 10px 0 10px 20px;
	font-size: 14px;
	color: #5a5a5a;
	padding: 0 20px 0 10px;
	position: relative;
}
.addmembertree .closebtn{
	position: absolute;
	right: 10px;
	top: 0;
	color: #fff;
}	
</style>