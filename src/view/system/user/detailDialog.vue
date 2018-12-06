<template>
	<ul class="pu-dialog-detail">
		<li class="el-row--flex"><span class="th">用户名称：</span><span class="td">{{row.name}}</span></li>
    <li class="el-row--flex"><span class="th">登录名称：</span><span class="td">{{row.loginName}}</span></li>
    <li class="el-row--flex"><span class="th">部门名称：</span><span class="td">{{row.officeName}}</span></li>
    <li class="el-row--flex"><span class="th">邮箱：</span><span class="td">{{row.email}}</span></li>
    <li class="el-row--flex"><span class="th">手机：</span><span class="td">{{row.mobile}}</span></li>
  </ul>
</template>

<script>
	export default {
		props: {
			row: {
				required: true,
				type: Object
			}
		}
	}
</script>

