<template>
    <div class="setup">
        <div class="wrap">
            <div class="left">
                <ul>
                    <router-link v-show="manager==2" tag="li" to='/home/setup/companyset'>企业设置</router-link>
                    <router-link tag="li" to='/home/setup/modifyadminpw'>修改管理员密码</router-link>
                    <router-link v-show="manager==2" tag="li" to='/home/setup/replacemainadmin'>更换主管理员</router-link>
                    <router-link v-show="manager==2" tag="li" to='/home/setup/setminadmin'>设置子管理员</router-link>
                    <router-link v-show="manager==2" tag="li" to='/home/setup/destroycompany'>解散企业</router-link>
                </ul>
            </div>
            <div class="right">
                <div class="wrapper">
                      <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import qs from 'qs';
export default {
    data () {
        return {
        }
    },
    created (){     
     var usertel=localStorage.getItem("usertel");
     this.RECORD_ADMINTEL(usertel);
    },
    mounted:function(){
        this.$nextTick(function(){
           this.initdata();
        })     
    },
     computed:{
        ...mapState([
            'entId',
            'manager',
            'admintelnum'
        ]),
    },
    methods:{
       ...mapMutations([
            'record_companyinfo',
            'record_manager',
            'RECORD_ADMINTEL',
        ]),
      initdata (){
        var params={
          'entId':this.entId,
          'telNo':this.admintelnum,
        };
        this.axios.post(this.baseurl+'shezhi/getentInfo',qs.stringify(params)).then((res)=>{
            var res=res.data;
            console.log(res);
            this.record_companyinfo(res);
            if(res.code==999){
                this.$Message.error(res.msg);
                this.$router.push('/login');
            }     
        })
      }
    },
}
</script>
<style scoped>
.setup{
    width: 100%;
    min-width: 960px;
    height: calc(100% - 80px);
    background: #fff;
    position: relative;
}
.wrap{
    height: 100%;
    position: relative;
    overflow-x:auto;
    overflow-y:hidden;
}
.left{
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    height:100%;
    background-color: #1e214a;
    overflow: auto;   
}
.right{
    float: right;
    height: 100%;
    background-color: #eee;
    width: calc(100% - 300px);
    min-width: 600px;
    overflow: auto;
}
.setup ul li{
    text-align: center;
    color: #a9a9b4;
    font-size: 18px;
    line-height: 40px;
    margin: 20px 0;
}
.setup ul .router-link-active{
  color: #fff;
  border-right: 4px solid #dd3e19;
  box-sizing:border-box;
}
/*.wrapper{
    height: 100%;
    min-height: 250px;
    overflow:auto;
}*/
</style>
