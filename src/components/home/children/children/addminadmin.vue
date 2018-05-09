<template>
	<div class="addminadmin">
        <div class="toptext">{{headername}}<span @click="goset" class="goset">返回</span></div>
        <div class="content">
        	 <Form :label-width="120">
	        	 <Form-item label="成员：">
	        	 	 <Input v-show="type=='add'" v-model="member" @on-focus="addmember" style="width:360px"></Input>
	        	 	 <Input v-show="type=='edit'" disabled v-model="member" style="width:360px"></Input>
	        	 </Form-item>
	        	 <Form-item label="管理范围：">
	        	 	 <Radio-group v-model="range" vertical>
				        <Radio label="0">
				            <span>全公司</span>
				        </Radio>
				        <Radio label="1">
				            <span>所在部门以及下级部门</span>
				        </Radio>
				        <Radio label="2">
				            <span>特定部门</span>
				        </Radio>
				    </Radio-group>
				    <div>
					    <Input v-if="range=='2'" v-model="dptname" @on-focus="choosedept" style="width:360px"></Input>
				    </div>
	        	 </Form-item>
	        	 <Form-item label="分配权限：">
		        	 <div class="all">
			        	 <p>(将会在以上管理范围内配置权限)</p>
			        	 <Checkbox
				            :value="checkAll"
				            @click.prevent.native="handleCheckAll" class="allright">全部权限</Checkbox>
		        	 </div>
		        	 <Checkbox-group v-model="checkdefault">
			        	 <ul>
			        	    <p class="smallhead">基础权限</p>
			        	 	<li>
				        	 	<span class="imgwrap">
				        	 	   <img :src="maillisticon" alt="" class="microimg">
					        	 	通讯录管理
				        	 	</span>
			        	 	    <Checkbox label="通讯录管理" class="righttext" disabled>全部管理权</Checkbox>
			        	 	</li>
			        	 	<li>
			        	 	<span class="imgwrap">
			        	 	    <img :src="copanyseticon" alt="" class="microimg">
				        	 	企业设置
			        	 	</span>
				        	 	<Checkbox label="企业设置" class="righttext" disabled>全部管理权</Checkbox>
			        	 	</li>
			        	 </ul>
			         </Checkbox-group>
			         <Checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange">
			        	 <ul>
			        	    <p class="smallhead">微应用权限</p>
				        	 	<li v-for="item in micro_appli">
				        	 	<span class="imgwrap">
					        	 	<img :src="baseurl+item.logoUrl" alt="" class="microimg">
					        	 	<span>{{item.name}}</span>
				        	 	</span>
			        	 	<Checkbox :label="item.mappId" class="righttext">全部管理权</Checkbox></li>
			        	 </ul>
		        	 </Checkbox-group>
	        	 </Form-item>
	        	 <Form-item>
		        	 <Button type="primary" @click="saveaddmin">保存</Button>
	        	 </Form-item>
        	 </Form>
        </div>
        <Modal v-model="addmembermodel" width="725" :closable="false" @on-ok="surminadmin" class="addmembermodel">
	        <header>选择人员</header>
	        <div class="addmembertree">
				<div class="left">
					<p>选择人员</p>
					<div class="tree">
						<Input v-model="searchcontent" icon="search" @on-change="searchkey(searchcontent)"></Input>
						<Breadcrumb separator=">">
		                    <span v-for="dtp in breaddata" :key="dtp.name" @click="nextfloor(dtp)"><Breadcrumb-item>{{dtp.name}}</Breadcrumb-item></span>
		                </Breadcrumb>
						<div class="lists">
						    <Checkbox :value="checkAll1" @click.prevent.native="handleCheckAll1">全选</Checkbox>
							<ul v-if="!searchcontent" class="dptlist">
								<li v-for="item in deptchild" :key="item.name">
									<span class="itemname"><span class="foldericon"><Icon type="folder"></Icon></span>{{item.name}}</span>
									<span class="nextfloor" @click="nextfloor(item)">下级部门</span>
								</li>
							</ul>
						    <div class="dptmember">
						        <Checkbox-group v-model="checkAllGroup1" @on-change="checkAllGroupChange1">
							    	<Checkbox v-if="!searchcontent" v-for="(peo,index) in deptpeolist" :label="peo.empId" :key="peo.empId">{{peo.name}}</Checkbox>
							    	<Checkbox v-if="searchcontent" v-for="(peo,index) in searchdataempList" :label="peo.empId" :key="index">{{peo.name}}</Checkbox>
						    	</Checkbox-group>
						    </div>
					    </div>
					</div>
				</div>
				<div class="right">
					<p>已选人员</p>
					<ul class="minadminlist">
						<li v-for="(ad,index) in adminlist" :key="ad"><span>{{ad.name}}</span><span class="closebtn" @click="detad(ad)"><Icon type="close"></Icon></span></li>
					</ul>
				</div>
			</div>     	
        </Modal>
        <Modal v-model="choosedeptmodel" width="725" :closable="false" @on-ok="surminadmindpt" class="choosedeptmodel">
            <header>选择部门</header>
	        <div class="addmembertree dpttree">
				<div class="left">
					<p>选择部门</p>
					<div class="tree">
						<Input v-model="searchcontent2" icon="search" style="width: 270px" @on-change="searchkey2(searchcontent2)"></Input>
						<Breadcrumb separator=">">
		                    <span v-for="dtp in breaddata" :key="dtp.name" @click="nextfloor(dtp)"><Breadcrumb-item>{{dtp.name}}</Breadcrumb-item></span>
		                </Breadcrumb>
						<div class="lists">
							<Checkbox :value="checkAll2" @click.prevent.native="handleCheckAll2">全选</Checkbox>
						    <div class="dptmember">
						        <Checkbox-group v-model="checkAllGroup2" @on-change="checkAllGroupChange2">
							    	<Checkbox v-if="!searchcontent2" v-for="(item,index) in deptchild" :label="item.deptId" :key="item.deptId">
								    	{{item.name}}
								    	<span v-if="!item.choosed" class="nextfloor" @click.stop.prevent="nextfloor(item)">下级部门</span>
								    	<span v-if="item.choosed" class="nonextfloor">下级部门</span>
							    	</Checkbox>
							    	<Checkbox v-if="searchcontent2" v-for="(item,index) in searchdataempList2" :label="item.deptId" :key="index">
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
						<li v-for="(ad,index) in admindptlist" :key="ad"><span>{{ad.name}}</span><span class="closebtn" @click="detad2(ad)"><Icon type="close"></Icon></span></li>
					</ul>
				</div>
			</div>
        </Modal>
	</div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import qs from 'qs'
import maillisticon from'../../../../image/maillisticon.png'
import copanyseticon from'../../../../image/copanyseticon.png'
export default {
	data (){
		return {
		   copanyseticon:copanyseticon,
		   maillisticon:maillisticon,
		   headername:'',
           member:'',
           type:'add',
           addmembermodel:false,
           choosedeptmodel:false,
           range:'',
           checkAll:false,
           checkAll1:false,
           checkAll2:false,
           checkdefault:['通讯录管理','企业设置'],
           checkAllGroup: [],
           dptname:'',
           micro_appli:[],//微应用列表
           searchcontent:'',
           searchcontent2:'',
           checkAllGroup1:[],
           checkAllGroup2:[],
           searchdataempList:[],
           searchdataempList2:[],
           adminlist:[],
           admindptlist:[],
           curadmininfo:[],
		}
	},
	created (){
	 // 从本地获取当前成员信息，转化成对象    
     var jsonstr=localStorage.getItem("curadmininfo");
     this.curadmininfo=JSON.parse(jsonstr);
   },
	mounted:function(){
   	  this.$nextTick(function(){
   	  	this.inittype();
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
		//判断点击来的是添加成员还是编辑成员
		inittype (){
			let typename=this.$route.query.type;
			console.log(typename);
			if(typename=='add'){
				this.headername='添加子管理员';
				this.type='add';
				this.member='';
				this.range=null;
				this.checkAllGroup=[];
				this.dptname='';
				this.checkAllGroup2=[];
				this.admindptlist=[];
			}else if(typename=='edit'){
				this.headername='编辑子管理员';
				this.type='edit';
				// 若是编辑，则渲染当前员工信息
				var str=localStorage.getItem('curadmininfo')
				this.curadmininfo=JSON.parse(str);
				this.member=this.curadmininfo.name;
				this.range=this.curadmininfo.managerScope;
				// 部门名渲染在input,部门id渲染到checkAllGroup2，部门总数据渲染到admindptlist
				var deptlist=this.curadmininfo.deptlist;
				var arr=[];
				var arr1=[];
	    		for(var i=0;i<this.admindptlist.length;i++){
	    			arr1.push(this.admindptlist[i].deptId)
	    		}
				for (var i=0;i<deptlist.length;i++){
                    arr.push(deptlist[i].name);
                    if(this.checkAllGroup2.indexOf(deptlist[i].deptId)<0){
                    	this.checkAllGroup2.push(deptlist[i].deptId);
                    }
                    if(arr1.indexOf(deptlist[i].deptId)<0){
                    	this.admindptlist.push(deptlist[i]);
                    }                    
				}
				this.dptname=arr.join(",");
				// 微应用渲染
				for(var i=0;i<this.curadmininfo.mappInfos.length;i++){
					this.checkAllGroup.push(this.curadmininfo.mappInfos[i].mappId)
				}
			}
			//获取微权限信息
			var parmas={
	          'entId':this.entId
	        };
	        this.axios.post(this.baseurl+'shezhi/getmapper',qs.stringify(parmas)).then((res)=>{
	        	var res=res.data;
	        	if(res.code==0){
	        		this.micro_appli=res.data;
	        		if(this.checkAllGroup.length==this.micro_appli.length){
	        			this.checkAll=true;
	        		}
	        	}else{
	        		this.$Message.error(res.msg);
	        	}
	        });
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
		},
		// 点击成员input
		addmember (){
            this.addmembermodel=true;
            var parmas={
	          'entId':this.entId
	         }
	         // 把alldpt的第一层保存vuex，用于刚开始的渲染
            this.axios.post(this.baseurl+'bas/organization/queryAllDeptOfEnt',qs.stringify(parmas)).then((res)=>{
		        var res=res.data;
		         // 获取组织架构树形数据，当前部门默认勾选
		        this.RECORD_ALLDPT(res.data);
		        this.RECORD_DEPTCHILD(this.alldpt[0].children);
		        this.RECORD_BREADDATA(this.alldpt);
		    });
		    // 把最高层对应的人员保存vuex，用于刚开始的渲染
		    var parmas1={
		      'entId':this.entId,
	          'deptId':0,
	         }
		    this.axios.post(this.baseurl+'bas/organization/selectChlidDeptAndEmpListByDeptId',qs.stringify(parmas1)).then((res)=>{
		        var res=res.data;
		        this.RECORD_DEPTPEOLIST(res.empList);
		    }) 
		},
		// 点击部门input
		choosedept (){
			var _this=this;
            this.choosedeptmodel=true;
            var parmas={
	          'entId':this.entId
	         }
		    this.axios.post(this.baseurl+'bas/organization/queryAllDeptOfEnt',qs.stringify(parmas)).then((res)=>{
		        var res=res.data;
		         // 获取组织架构树形数据，当前部门默认勾选
		        this.RECORD_ALLDPT(res.data);
		        this.RECORD_DEPTCHILD(this.alldpt[0].children);
		        this.RECORD_BREADDATA(this.alldpt);
		        // 判断checkAllGroup2有没有对应的勾选部门，有则把下级禁止点击
		        for(var i=0;i<this.deptchild.length;i++){
	             	if(this.checkAllGroup2.indexOf(this.deptchild[i].deptId)>-1){
	                   this.$set(this.deptchild[i],'choosed',true);
	             	}else{
	             		this.$set(this.deptchild[i],'choosed',false);
	             	}
	            }
		    });
		},
		//点击成员model的确定
		surminadmin (){
			 var list=[];
		     for (var i=0;i<this.adminlist.length;i++){
		     	list.push(this.adminlist[i].name)
		     }
	         this.member=list.join(",");
		},
		//点击部门model的确定
		surminadmindpt (){
			 var list=[];
		     for (var i=0;i<this.admindptlist.length;i++){
		     	list.push(this.admindptlist[i].name)
		     }
	         this.dptname=list.join(",");
		},
		goset (){
			this.$router.push("/home/setup/setminadmin");
		},
		// 点击全选全部勾上
		handleCheckAll () {
            this.checkAll = !this.checkAll;
            if (this.checkAll) {
            	for(var i=0;i<this.micro_appli.length;i++){
            		this.checkAllGroup.push(this.micro_appli[i].mappId);
            	}
            } else {
                this.checkAllGroup = [];
            }
        },
        // 点击全选全部勾上
		handleCheckAll1 () {
			var list=null;
	        if (this.searchcontent!='') {
                list=this.searchdataempList;
	        }else{
	        	list=this.deptpeolist;
	        }
	        // 先把右侧列表的员工id整出来，用来后面对比
            var arr=[];
    		for(var i=0;i<this.adminlist.length;i++){
    			arr.push(this.adminlist[i].empId)
    		}
            this.checkAll1 = !this.checkAll1;
            if (this.checkAll1) {
            	for(var i=0;i<list.length;i++){
            		if(this.checkAllGroup1.indexOf(list[i].empId)<0){
            			this.checkAllGroup1.push(list[i].empId);
            		}
            		if(arr.indexOf(list[i].empId)<0){
            			this.adminlist.push(list[i]);
            		}
            	}
            } else {
                // 当取消全选时，把当前的部门的人员全选取消，和把当前的部门人员名称从右侧列表删除
            	var arr=[];
            	var result={};
            	for(var i in this.deptpeolist){
					result[this.deptpeolist[i].empId] = this.deptpeolist[i].empId;
				}
				for(var i in this.checkAllGroup1){
					if(!result[this.checkAllGroup1[i]]){
						arr.push(this.checkAllGroup1[i]);
					  };
				}
				this.checkAllGroup1=arr;

				var arr1=[];
				var result1={};
				for(var i in this.deptpeolist){
					result1[this.deptpeolist[i].empId] = this.deptpeolist[i].empId;
				}
				for(var i in this.adminlist){
					if(!result1[this.adminlist[i].empId]){
						arr1.push(this.adminlist[i]);
					  };
				}
				this.adminlist=arr1;
            }
        },
        // 点击全选框
		handleCheckAll2 (){
			// 当有搜索字时,列表就是搜索的结果，否则就是当前部门员工所挂员工列表
			// this.admindptlist=[];
			var list=null;
	        if (this.searchcontent2!='') {
                list=this.searchdataempList2;
	        }else{
	        	list=this.deptchild;
	        }
            this.checkAll2 = !this.checkAll2;
            // 先把右侧列表的部门id整出来，用来后面对比
            var arr=[];
    		for(var i=0;i<this.admindptlist.length;i++){
    			arr.push(this.admindptlist[i].deptId)
    		}
            if (this.checkAll2) {
            	//因为下级两个字如果选择的部门，则下级不可点，故设置个参数控制
	            for(var i=0;i<list.length;i++){
	            	this.$set(list[i],'choosed',true);
	            }
            	// 全选勾上的时候，判断左侧右侧有没有和以前相同的，没有相同的就放进去，以免右侧多出重复的
	        	for(var i=0;i<list.length;i++){
	        		if(this.checkAllGroup2.indexOf(list[i].deptId)<0){
	        			this.checkAllGroup2.push(list[i].deptId);
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
				for(var i in this.checkAllGroup2){
					if(!result[this.checkAllGroup2[i]]){
						arr.push(this.checkAllGroup2[i]);
					  };
				}
				this.checkAllGroup2=arr;

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
        // 判断选择有没有选择完，全部选项勾选则全选勾上
        checkAllGroupChange (data){
            if (data.length === this.micro_appli.length) {
                this.checkAll = true;
            } else if (data.length > 0) {
                this.checkAll = false;
            } else {
                this.checkAll = false;
            }
        },
        // 判断选择有没有选择完，全部选项勾选则全选勾上
        checkAllGroupChange1 (data){
        	this.adminlist=[];
        	var list=null;
	        if (this.searchcontent!='') {
                list=this.searchdataempList;
	        }else{
	        	list=this.deptpeolist;
	        }
	        // 因为data是包含整个企业里面选中的数据，而这里需要跟当前选中部门的人员数据长度对比，故要过滤一下data
	        var arr=[];
	        for(var i=0;i<list.length;i++){
	         	if(data.indexOf(list[i].empId)>-1){
	         		arr.push(list[i])
	         	}
	        }
            if (arr.length === list.length) {
                this.checkAll1 = true;
            } else if (arr.length > 0) {
                this.checkAll1 = false;
            } else {
                this.checkAll1 = false;
            }
            for (var i=0;i<this.emplist.length;i++){
            	if(data.indexOf(this.emplist[i].empId)>-1)
            	this.adminlist.push(this.emplist[i]);
            }
        },
        //单个点击，若全部点击勾选，则全选框打钩
		// 当有搜索字时,列表就是搜索的结果，否则就是当前部门员工所挂员工列表
		checkAllGroupChange2 (data){
			this.admindptlist=[];
			var list=null;
	        if (this.searchcontent2!='') {
                list=this.searchdataempList2;
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
                this.checkAll2 = true;
            } else if (arr.length > 0) {
                this.checkAll2 = false;
            } else {
                this.checkAll2 = false;
            };
            this.admindptlist=[];
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
		        this.searchcontent2='';
		        // 点击面包屑也是此方法，所以要判断点击面包屑后当时的部门有没有选中，然后给设置相应的参数
		        for(var i=0;i<this.deptchild.length;i++){
	            	if(this.checkAllGroup2.indexOf(this.deptchild[i].deptId)>-1){
	            		this.$set(this.deptchild[i],'choosed',true);
	            	}else{
	            		this.$set(this.deptchild[i],'choosed',false);
	            	}	
		        }
		    }) 
		},
		//点击右侧删除
	    detad (item){
	    	for (var i=0;i<this.checkAllGroup1.length;i++){
	    		if(item.empId==this.checkAllGroup1[i]){
	    			this.checkAllGroup1.splice(i,1);
	    		}
	    	}
	    	for (var i=0;i<this.adminlist.length;i++){
	    		if(item.empId==this.adminlist[i].empId){
	    			this.adminlist.splice(i,1);
	    		}
	    	}
	    	this.checkAll1=false;
	    },
	    //点击右侧删除
	    detad2 (item){
	    	for (var i=0;i<this.checkAllGroup2.length;i++){
	    		if(item.deptId==this.checkAllGroup2[i]){
	    			this.checkAllGroup2.splice(i,1);
	    		}
	    	}
	    	for (var i=0;i<this.admindptlist.length;i++){
	    		if(item.deptId==this.admindptlist[i].deptId){
	    			this.admindptlist.splice(i,1);
	    		}
	    	}
	    	 //循环判断是哪个部门，然后该部门设置上级可点
	    	var list=null;
	        if (this.searchcontent2!='') {
                list=this.searchdataempList2;
	        }else{
	        	list=this.deptchild;
	        }
	        for(var i=0;i<list.length;i++){
	        	if(item.deptId==list[i].deptId){
	        	  this.$set(list[i],'choosed',false);
	        	}
	        }
	    	this.checkAll12=false;
	    },
	    //保存
        saveaddmin (){
        	var deptIdList=[];
        	var mappIdList=[];
        	var empIdList=[];
        	for(var i=0;i<this.admindptlist.length;i++){
        		deptIdList.push(this.admindptlist[i].deptId)
        	}
        	for(var i=0;i<this.adminlist.length;i++){
        		empIdList.push(this.adminlist[i].empId)
        	}
        	for(var i=0;i<this.micro_appli.length;i++){
        		if(this.checkAllGroup.indexOf(this.micro_appli[i].mappId)>-1)
        		mappIdList.push(this.micro_appli[i].mappId)
        	}
        	if(this.type=='add'){
        		var obj={};
	        	obj.deptList=deptIdList;
	        	obj.mapperList=mappIdList;
	        	obj.empList=empIdList;
	        	var str=JSON.stringify(obj);
	        	var parmas={
		          'entId':this.entId,
		          "managerScope":this.range,
		          'data':str,
		        };
        	}else if(this.type=='edit'){
        		var obj1={};
	        	obj1.deptList=deptIdList;
	        	obj1.mapperList=mappIdList;
	        	var str1=JSON.stringify(obj1);
	        	var parmas1={
		          'entId':this.entId,
		          "managerScope":this.range,
		          'empId':this.curadmininfo.empId,
		          'data':str1,
		        };
        	}        	
	        
	        if(this.type=='add'){
	        	this.axios.post(this.baseurl+'shezhi/add',qs.stringify(parmas)).then((res)=>{
		        	var res=res.data;
		        	if(res.code==0){
	                  this.$router.push('/home/setup/setminadmin')
		        	}else{
		        	  this.$Message.error(res.msg);
		        	}
		        })
	        }else if(this.type=='edit'){
	        	this.axios.post(this.baseurl+'shezhi/edit',qs.stringify(parmas1)).then((res)=>{
		        	var res=res.data;
		        	if(res.code==0){
	                  this.$router.push('/home/setup/setminadmin')
		        	}else{
		        	  this.$Message.error(res.msg);
		        	}
		        })
	        }
	        
        },
        //搜索时传值到后台，获取数组展现在列表上
	    searchkey (value){
	      if(value!=''){
	         this.axios.post(this.baseurl+'bas/organization/selectByKeyword',qs.stringify({'entId':this.entId,'keyword':value})).then((res)=>{
	            var res=res.data;
	             this.searchdataempList=res.empList;
	          })
	         }else{
	             return;
	         }       
	    },
	    //搜索时传值到后台，获取数组展现在列表上
        searchkey2 (value){
	      if(value!=''){
	         this.axios.post(this.baseurl+'bas/organization/selectByKeyword',qs.stringify({'entId':this.entId,'keyword':value})).then((res)=>{
	            var res=res.data;
	             this.searchdataempList2=res.deptList;
	             // 判断当前已勾选的项，勾选好的则用参数表明
	             for(var i=0;i<this.searchdataempList2.length;i++){
	             	if(this.checkAllGroup2.indexOf(this.searchdataempList2[i].deptId)>-1){
                       this.$set(this.searchdataempList2[i],'choosed',true);
	             	}else{
	             		this.$set(this.searchdataempList2[i],'choosed',false);
	             	}
	              }
	          })
	         }else{
	         	 // 搜索值为空的时候，就要判断当前部门有没有勾选的了
         	 for(var i=0;i<this.deptchild.length;i++){
             	if(this.checkAllGroup2.indexOf(this.deptchild[i].deptId)>-1){
                   this.$set(this.deptchild[i],'choosed',true);
             	}else{
             		this.$set(this.deptchild[i],'choosed',false);
             	}
              }
             return;
          }       
	    },
	},
	//实时获取当前路由参数
	watch:{
		'$route' (to,from){
			this.inittype();
		}
	}
}	
</script>

<style scoped>
.addminadmin{
  margin: 10px;
  background-color: #fff;
  min-height: 600px;
  padding: 20px 40px;
}
.toptext{
	font-size: 18px;
    color: #525252;
}
.goset{
    float: right;
    font-size: 14px;
    color: #475cc7;
    border-bottom: 1px solid #475cc7;
}
.all .allright,.all p{
	display: inline-block;
}
.all .allright{
	float: right;
}
.content ul li{
	height: 40px;
	line-height: 40px;
	border: 1px solid #eee;
	border-bottom:none;
	padding-left: 15px;
}
.content ul li:last-child{
	border-bottom: 1px solid #eee;
}
.righttext{
	float: right;
}
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
.microimg{
	width: 14px;
	height: 14px;
	margin-right: 7px;
}
.imgwrap span,.imgwrap img{
	display: inline-block;
	vertical-align: middle;
}
.content{
	margin-top: 40px;
}
.all{
	line-height: 40px;
}
.all p{
	font-size: 14px;
	color: #a9a9a9;
}
.smallhead{
	font-size: 14px;
	color: #525252;
	padding:20px 0;
}
button{
	width: 120px;
	height: 36px;
	background-color: #475cc7;
}
header{
	background: #475cc7;
	text-align: center;
	height: 40px;
	line-height: 40px;
	font-size: 20px;
	color: #fff;
}
.foldericon{
	margin-right: 5px;
	color: #5a5a5a;
}
.itemname{
	display: inline-block;
	width: 200px;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>