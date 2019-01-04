<template>
	<div>
		<div class="page-title">我的文档</div>
		<div class="main-container pt-twoline">
			<div class="mar-20">
				<api-search  @search="search"></api-search>
				<div>
					<el-table border :data="list">
						<el-table-column type="index" label="序号" fixed width="50"></el-table-column>
						<el-table-column label="文档名称" prop="name"></el-table-column>
						<el-table-column label="购买时间" prop="bougthTime"></el-table-column>
						<el-table-column label="价格（水利币）" prop="payStander">
							<template slot-scope="scope">
								<span v-if="scope.row.isFree == 2" class="free-color">免费</span>
								<span v-if="scope.row.isFree != 2">{{scope.row.payStander}}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120">
							<template slot-scope="scope">
								<a  @click="toDetail(scope.row)">下载</a>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="footerPage">
	        <div class="rightPage">
	          <el-pagination
	            background
	            @current-change="handleCurrentChange"
	            :current-page.sync="page.page"
	            :page-size="page.size"
	            layout="total, prev, pager, next, jumper"
	            :total="total">
	          </el-pagination>
	        </div>
	      </div>
			</div>
		</div>
	</div>
</template>

<script>
	import { getMyDocList, getDocId } from '@/api/doc/index'
	import apiSearch from './search'
	export default {
		name: 'myDoc',
		components: {
      apiSearch
    },
		data() {
			return {
				form: {},
				page: {
					page: 1,
					size: 10
				},
				total: 0,
				list: []
			}
		},
		created() {
			this.getList()
		},
		methods: {
			getList() {
				let param = Object.assign(this.page, this.form)
        getMyDocList(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
			},
			search(form) {
        this.form = form
        this.getList()
      },
      toDetail(row) {
				let param = {
          id: row.documentId
        }
        getDocId(param).then(resp => {
          if (resp.code == 200) {
          	window.location.href = '/manage/attachment/' + resp.data.attachmentId + '?name=' + resp.data.name
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      },
      handleCurrentChange(page) {
      	this.page.page = page
        this.getList()
      }
		}
	}
</script>

<style lang="less">
  @import '../../assets/scss/self.less';
</style>