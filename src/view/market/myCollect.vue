<template>
  <div>
    <div class="page-title">我的收藏</div>
    <div class="center-outer main-container height-100vh">
      <el-row :gutter="30" class="collect-outer">
        <template>
          <el-col  :lg="6" :md="8" v-if="collectList.length > 0" v-for="(item, index) in collectList" :key="index">
            <div class="api" @click="apiDetail(item)" :title="item.name">
              <img :src="defaultUrl" v-if="!item.filePath"/>
              <img :src="item.filfilePath" v-if="item.filePath"/>
              <div class="detail">
                <p v-if="item.price" class="mb20"><span class="price">{{item.price}} </span>水利币/次</p>
                <p v-if="!item.price" class="mb20"><span class="status-success">免费</span></p>
                <p class="title">{{item.name}}</p>
              </div>
              <div class="btn-out" @click.stop="cancel(item)">
                <span>取消收藏</span>
              </div>
            </div>
          </el-col>
        </template>
        <template v-if="collectList.length == 0">
          <div>你还没有收藏任何数据呢，<span class="color" @click="toData">去看看吧！</span></div>
        </template>
      </el-row>
      <div class="footerPage" v-if="collectList.length > 0">
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
</template>

<script>
  import {getCollect, cancelCollect} from '@/api/market/index'
  export default {
    name: 'myCollect',
    components: {
    },
    mounted() {
      this.getList()
    },
    data() {
      return {
        total: 0,
        priceUrl: require('@/assets/images/price2.png'),
        defaultUrl: require('@/assets/images/default.png'),
        collectList: [],
        form: {

        },
        page: {
          page: 1,
          size: 20
        }
      }
    },
    computed: {
      elements() {
        return this.$store.state.user.elements
      }
    },
    methods: {
      getList() {
        let param = Object.assign(this.page, this.form)
        getCollect(param).then((resp) => {
          this.collectList = resp.data.list
          this.total = resp.data.total
        })
      },
      apiDetail(row) {
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
      cancel(data) {
        let param = {
          id: data.dataId
        }
        cancelCollect(param.id).then(resp => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: '取消成功'
            })
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      },
      toData() {
        this.$router.push({
          path: '/data'
        })
      },
      handleCurrentChange(page) {//分页
        this.page.page = page
        this.getList()
      },
    }
  }
</script>

<style scoped>
  .puTableHeader {
    border: 1px solid #ccc;
    border-bottom: none;
    text-align: center;
    margin: 0;
  }
  .color {
    color: #009dec;
    cursor: pointer;
  }
</style>


