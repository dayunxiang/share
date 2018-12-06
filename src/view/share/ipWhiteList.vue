<template>
  <div>
    <div class="page-title">IP白名单</div>
    <div class="ip-outer">
      <!-- <p class="title">数据选择</p> -->
      <div class="data-wrap">
        <div class="checkDiv"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" >全选</el-checkbox></div>
        <div class="data-container">
            <el-checkbox-group v-model="chooseData" @change="handleCheckedChange">
              <el-checkbox class="data-checkbox"  v-for="(item, index) in dataList" :key="index" :checked="item.checked" :label="item.apiId">{{item.apiName}}</el-checkbox>
            </el-checkbox-group>  
        </div>
      </div>
      <div class="data-wrap">
        <p class="mb10"><span class="red">* </span>IP白名单设置</p>
        <div class="width-50 fl">
          <textarea class="data-textarea el-textarea__inner" v-model="ipList"></textarea>
          <div class="textRight">
            <el-button type="primary" size="mini" class="data-btn" @click="saveIpList">确定</el-button>
          </div>
        </div>
        
        <div class="width-40 fr">
          <p class="blod-font">格式说明：</p>
          <p>一行写一个IP地址，如：</p>
          <p>192.168.1.124</p>
          <p>192.168.1.246</p>
          <p>如需取消接口白名单限制，<span class="red-font">只需取消对应数据的选择</span>即可</p>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
  import {getDataList, saveIpWhiteList} from '@/api/share/index'
  export default {
    components: {
    },
    mounted() {
      this.getList()
    },
    data() {
      return {
        total: 0,
        dataList: [],
        dataListId: [],
        chooseData: [],
        apiData: [],
        ipList: '',
        isIndeterminate: false,
        checkAll: false
      }
    },
    computed: {
      elements() {
        return this.$store.state.user.elements
      }
    },
    methods: {
      getList() {
        getDataList().then((resp) => {
          this.dataList = resp[0].data
          this.dataListId = this.dataList.map ( v => {
            return v.apiId
          })


          this.apiData = resp[1].data[0]
          if(resp[1].data.length > 0) {
            this.ipList = this.apiData.ips.replace(/[,]/g, '\n')
            let idArray = this.apiData.apiIds ? this.apiData.apiIds.split(',') : []
            
            if(idArray.length == this.dataList.length) {
              this.checkAll = true
            }
            this.dataList.forEach((v, index) => {
              if (idArray.indexOf(v.apiId + '') > -1) {
                this.$set(this.dataList[index], 'checked', true)
              }
            })
          }

        })
      },
      handleCheckAllChange(val) {
        //全选
        this.chooseData = val ? this.dataListId : [];
        this.isIndeterminate = false;
      },
      handleCheckedChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.dataListId.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataListId.length;
      },
      saveIpList() {
        let ips = this.ipList.replace(/\n/g, ',')
        let apiIds = this.chooseData.join()
        let param = {
            ips: ips,
            apiIds: apiIds
        }
        saveIpWhiteList(param).then(resp => {
            if (resp.code == 200) {
                this.$message({
                    type: 'success',
                    message: '保存成功'
                })
            } else {
                this.$message({
                    type: 'error',
                    message: resp.message
                })
            }
        })
      }
    }
  }
</script>

<style scoped>
  .mb10 {
    margin-bottom: 10px;
  }
  .textRight {
    text-align: right;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .width-50 {
    width: 50%;
  }
  .width-40 {
    width: 40%;
  }
  .data-wrap {
    overflow: hidden;
  }
  .checkDiv {
    background: #f4f7f9;
    height: 36px;
    line-height: 36px;
    padding-left: 20px;
    border: 1px solid #ddd;
    border-bottom: 0;
  }
  .red-font {
    color: #ee3323;
  }
  .blod-font {
    font-weight: bold;
  }
  .red {
    color: #f56c6c;
  }
</style>


