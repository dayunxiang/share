<template>
	<ul class="pu-dialog-detail">
    <li class="el-row--flex"><span class="th">单位名称：</span><span class="td">{{row.unit}}</span></li>
    <li class="el-row--flex"><span class="th">单位地址：</span><span class="td">{{row.address}}</span></li>
    <li class="el-row--flex"><span class="th">联系电话：</span><span class="td">{{row.tel}}</span></li>
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

