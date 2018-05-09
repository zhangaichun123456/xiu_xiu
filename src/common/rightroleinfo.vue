<template>
	<div class="rightroleinfo">
		<p class="roletop"><Icon type="person"></Icon>主管理员(1人)<Button v-show="!defaultrole" type="primary">编辑</Button><Button v-show="defaultrole" type="primary" disabled>编辑</Button><span class="userole">去审批流程里使用角色<Icon type="chevron-right"></Icon></span></p>
        <p style="background:yellow;margin:10px 0;" class="roletip" v-show="defaultrole">“主管理员”为默认角色，无法编辑，请到“管理后台－设置－更改主管理员”，设置完成后自动同步</p>
        <p v-show="!defaultrole"><Button type="primary">添加成员</Button><Button type="primary">批量移除</Button></p>
        <Table :columns="roletablehead"></Table>
	</div>
</template>
<script>
export default{
	data (){
		return{
			defaultrole:false,
			roletablehead:[//点击角色出来属于此角色的所有成员
                      {
                          title: '姓名',
                          key: 'name'
                      },
                      {
                          title: '部门',
                          key: 'jobPosition'
                      },
                      {
                          title: '工号',
                          key: 'empNo'
                      },
                  ],
		}
	}
}
</script>
<style scoped>
	
</style>