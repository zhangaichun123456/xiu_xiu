<template>
  <li class="treeli">
    <span @click="ifactive(model)" class="curname1" :class="{'active':deptId==model.deptId}">
      <span @click.stop="toggle" class="arrow" :class="{'active':deptId==model.deptId}">
        <Icon type="arrow-down-b" v-show="isFolder&&open"></Icon>
        <Icon type="arrow-right-b" v-show="isFolder&&!open"></Icon>
      </span>
      <span class="curname" :class="{'active':deptId==model.deptId}">
      {{ model.name}}
      </span>
      <span class="curname" :class="{'active':deptId==model.deptId}">({{model.empCount}}人)</span>
    </span> 
    <ul v-show="open" v-if="isFolder">
      <tree-menu v-for="(item,index) in model.children" :model="item" :key="item.name"></tree-menu>
    </ul>
  </li>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import Vue from 'vue'
import qs from 'qs';
export default {
  name: 'treeMenu',
  props: ['model'],
  data() {
    return {
      open: true,
      
    }
  },
  mounted:function(){
    this.$nextTick(function(){
    })
   },
  computed: {
    ...mapState([
      'entId',
      'zuzhijiagou',//
      'activename',
      'breaddata',
      'zuzhijiagou',
      'isfirst',
      'deptId',
      'departdata'
    ]),
    isFolder: function() {
      return this.model.children && this.model.children.length
    }
  },
  methods: {
    ...mapMutations([
                'CHANGEACTIVE',//点击高亮存放的对应的节点名称
                'CHANGEIFROOT',
                'RECORD_DEPTCHILD',
                'RECORD_BREADDATA',//面包屑数据
                'RECORD_DEPTPEOLIST',
                'RECORD_ISFIRST',
                'RECORD_DEPTID',
                'RECORD_DEPARTDATA',
                'RECORD_memebercheckeddata',
            ]),
    toggle () {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
    ifactive (mode){
      this.RECORD_memebercheckeddata([]);
      this.RECORD_DEPARTDATA(mode);
      this.RECORD_DEPTID(mode.deptId);
      var parmas={
        'entId':this.entId,
        'deptId':this.deptId,
       }
      // 点击过后把对应的参数传给后台，res为对应部门名称已经子部门，以及部门人员，存放到vuex里，再让父组件引用渲染,并调出面包屑所需要的数据
      this.axios.post(this.baseurl+'bas/organization/selectChlidDeptAndEmpListByDeptId',qs.stringify(parmas)).then((res)=>{
        var res=res.data;
        this.RECORD_BREADDATA(res.parentDeptList)
        this.RECORD_DEPTCHILD(res.deptList);
        this.filterdata(res.empList);
        this.RECORD_DEPTPEOLIST(res.empList);
        // 判断点中的是否是企业名称，(最高的一层),不是选中企业，则出现面包屑导航组件 和显示设置或者部门编辑
        if(this.breaddata[this.breaddata.length-1].deptId==this.zuzhijiagou[0].deptId){
          this.RECORD_ISFIRST(true);
          this.CHANGEIFROOT(true);
        }else{
          this.RECORD_ISFIRST(false);
          this.CHANGEIFROOT(false);
        }
      });
      //把当前点击的公司名称保存在vuex里
      this.CHANGEACTIVE(mode.name);                    
    },
    //根据人员的state来判断在职状态
     filterdata (arr){
        for(var i=0;i<arr.length;i++){
            if(arr[i].state==0){
              this.$set(arr[i],'copystate','邀请中');
            }else if(arr[i].state==1){
              this.$set(arr[i],'copystate','邀请失败');
            }else if(arr[i].state==2){
              this.$set(arr[i],'copystate','在职');
            }else if(arr[i].state==3){
              this.$set(arr[i],'copystate','离职');
            }
          }
      },
  },
  
}
</script>

<style scoped>
ul {
  font-size: 14px;
  padding-left: 12px;
  color: #a9a9a9;
}
.arrow{
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-left:10px;
  font-size: 16px; 
  color: #a9a9b4;
}
.curname{
  color: #a9a9b4;
}
i.icon {
  display: inline-block;
  width: 15px;
  height: 15px;
  background-repeat: no-repeat;
  vertical-align: middle;
}
.tree-menu {
  line-height: 30px;
  color: red;
}
.curname1{
  display: inline-block;
  width: 100%;
  height: 42px;
  line-height: 42px;
}
.active{
  color: #fff;
  background-color: #090c2f;
}
</style>