<template>
  <li class="edtimemeberdpttree">
    <span @click="toggle" class="arrow">
      <Icon type="arrow-down-b" v-show="isFolder&&open"></Icon>
      <Icon type="arrow-right-b" v-show="isFolder&&!open"></Icon>  
    </span>
    <Checkbox @on-change="getdptname($event)" v-model="model.gouxuan">{{ model.name}}</Checkbox> 
    <ul v-show="open" v-if="isFolder">
      <dpttree v-for="(item,index) in model.children" :model="item" :key="item.name"></dpttree>
    </ul>
  </li>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import Vue from 'vue'
export default {
  name: 'dpttree',
  props: ['model'],
  data() {
    return {
      open: true,
      arr:[],
      
    }
  },
  mounted:function(){
    this.$nextTick(function(){
    })
   },
  computed: {
    ...mapState([
      "editchoosedpt1",//选中的部门
    ]),
    isFolder: function() {
      return this.model.children && this.model.children.length
    }
  },
  methods: {
    ...mapMutations([
            ]),
    toggle: function() {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
    // 若是选中，把当前对象加在arr里面，若是取消，则在arr里面删除，arrdpt为全局变量，写在mian.js里，保存arr在vuex，用来传递给父组件渲染右侧
    getdptname (e){
      if(e==true){
        if(this.editchoosedpt1.indexOf(this.model)<0){
          this.editchoosedpt1.push(this.model);
        }else{
          return;
        }        
      }else{
        for(var i=0;i<this.editchoosedpt1.length;i++){
          if(this.editchoosedpt1[i].name==this.model.name){
            this.editchoosedpt1.splice(i,1);
            break;
          }
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
}
li{
  list-style: none;
}
ul:first-child {
    padding-left: 0 !important
  }
.arrow{
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-left:10px;
  font-size: 16px; 
  color: #a9a9b4;
}
i.icon {
  display: inline-block;
  width: 15px;
  height: 15px;
  background-repeat: no-repeat;
  vertical-align: middle;
}
.active{
  background: blue;
  color: #fff;
}
</style>