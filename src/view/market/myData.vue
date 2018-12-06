<template>
	<div>
		<div class="page-title">我的数据</div>
		<div class="main-container">
			<div class="mar-20">
				<api-search  @search="search"></api-search>
				<div>
					<el-table border :data="list">
						<el-table-column type="index" label="序号" width="50" fixed></el-table-column>
						<el-table-column label="数据" prop="name" class-name="first-column"></el-table-column>
						<el-table-column label="购买时间" prop="boughtDate"></el-table-column>
						<el-table-column label="价格（水利币）" prop="price">
							<template slot-scope="scope">
								<span v-if="scope.row.price == 0" class="free-color">免费</span>
								<span v-if="scope.row.price != 0">{{scope.row.price}}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120">
							<template slot-scope="scope">
								<el-button type="text" @click="toDetail(scope.row)">下载</el-button>
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
	import { getDataList } from '@/api/market/index'
	import apiSearch from './search'
	export default {
		name: 'myData',
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
        getDataList(param).then((resp) => {
          this.list = resp.data.list
          this.total = resp.data.total
        })
			},
			search(form) {
        this.form = form
        this.getList()
      },
      toDetail(row) {
      	if(row.businessOrNormal == 1) {
      		this.$router.push({
            name: 'dataDetail',
            query: {
              id: row.dataId,
              businessOrNormal: 1
            }
          })
      	} else if(row.businessOrNormal == 2) {
      		this.$router.push({
            name: 'dataDetail',
            query: {
              id: row.dataId,
              businessOrNormal: 2
            }
          })

      	} else if(row.businessOrNormal == 3) {
      		this.$router.push({
            name: 'personBaseDetail',
            query: {
              id: row.dataId
            }
          })
      	}
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