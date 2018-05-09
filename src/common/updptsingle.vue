<template>
  <li class="choosedepttree">
    <span @click="togglename" class="curname1" :class="{'active':activename==model.name}">
      <span @click.stop="toggle" class="arrow" :class="{'active':activename==model.name}">
        <Icon type="arrow-down-b" v-show="isFolder&&open"></Icon>
        <Icon type="arrow-right-b" v-show="isFolder&&!open"></Icon> 
      </span>
      <span class="curname" :class="{'active':activename==model.name}">
      {{ model.name}}
      </span>
    </span>
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
      'activename'
    ]),
    isFolder: function() {
      return this.model.children && this.model.children.length
    }
  },
  methods: {
    ...mapMutations([
                'UPDPT1',//上级部门
            ]),
    toggle: function() {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
    // 
    togglename (){
      this.UPDPT1(this.model);
    }
  },
  
}
</script>

<style scoped>
ul {
  font-size: 14px;
  padding-left: 12px;
  color: #5a5a5a;
}
li{
  list-style: none;
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
.tree-menu {
  line-height: 30px;
}
.curname{
  color: #a9a9b4;
}
.curname1{
  display: inline-block;
  width: 100%;
}
.curname1:hover{
  background-color: #eee;
}
.active{
  color: #fff;
  background-color: #090c2f;
}
</style>