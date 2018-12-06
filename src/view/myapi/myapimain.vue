<template>
  <div>
    <div class="page-title">我的API</div>
    <div class="my-api main-container">
      <div class="page-tab">
        <span class="tabs" :class="tabType == 0 ? 'active' : ''" @click="changeTab(0)">全部</span>
        <span class="tabs" :class="tabType == 1 ? 'active' : ''" @click="changeTab(1)">待付款</span>
        <span class="tabs" :class="tabType == 2 ? 'active' : ''" @click="changeTab(2)">已付款</span>
        <!-- <span class="desc">我的API订阅列表</span> -->
      </div>
      <div class="pu-toolbar">
        <div>
          <el-row class="searchBar">
            <div>
              <el-row :gutter="15">
                <el-col :span="8">
                  <span class="form-label">API名称</span>
                  <el-input v-model="form.selectParam" size="mini" class="form-input" placeholder="请输入API名称"></el-input>
                </el-col>
                <el-col :span="8">
                  <span class="form-label">申请时间</span>
                  <el-date-picker
                    v-model="createTime"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeTime"
                    value-format="yyyy-MM-dd" size="mini"
                    class="form-input">
                  </el-date-picker>
                </el-col>
                <el-col :span="8">
                  <span class="form-label">类型</span>
                    <el-select v-model="form.apiMainType" size="mini" class="form-input">
                      <el-option v-for="(item, index) in typeArray" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
              </el-row>
            </div>
            <div class="box right-btn-box search-box">
              <el-button type="primary" size="mini" @click="search" >查询</el-button>
              <el-button size="mini" @click="reset" >重置</el-button>
            </div> 
          </el-row>
          <div class=" box left-btn-box search-box" >
              <el-button class="operateBtn" size="mini" v-if="tabType == 0 ||  tabType == 1" @click="pay('pay')"><i class="iconfont icon-fukuan_huaban"></i> 付款</el-button>
              <el-button class="operateBtn" size="mini" v-if="tabType == 1" @click="changeStatus(3, '确认关闭？', '关闭成功','请选择订单后操作关闭订单')"><i class="iconfont icon-guanbidingdan_huaban"></i> 关闭</el-button>
              <el-button class="operateBtn" size="mini" v-if="tabType == 1" @click="changeStatus(1, '确认重启？', '重启成功','请选择已关闭订单后操作订单重启')"><i class="iconfont icon-zhongqidingdan_huaban"></i> 重启</el-button>
              <el-button class="operateBtn" size="mini" v-if="tabType == 2" @click="eval"><i class="iconfont icon-pingjia_huaban"></i> 评价</el-button>
              <el-button class="operateBtn" size="mini" v-if="tabType == 2" @click="pay('renew')"><i class="el-icon-news size-14"></i> 续费</el-button>
              <el-button class="operateBtn" size="mini" v-if="tabType == 2 ||  tabType == 1" @click="changeStatus(4, '确认删除？', '删除成功','请选择订单后操作删除')"><i class="iconfont icon-shanchu_huaban"></i> 删除</el-button> 
            </div>
        </div>
      </div>
      <div class="api-lists-wapper">
          <div class="api-lists-header">
            <el-row  :style="{textAlign:'center',fontWeight:'900'}">
               <el-col :span="1" >
                 <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
               </el-col>
               <el-col :span="8" >
                API名称
               </el-col>
               <el-col :span="5" >
                 申请时间
               </el-col>
               <el-col :span="2" >
                 订阅次数
               </el-col>
               <el-col :span="2" >
                 剩余次数
               </el-col>
               <el-col :span="2" >
                 购买状态
               </el-col>
               <el-col :span="4" >
                 操作
               </el-col>
            </el-row>
          </div>
          <div class="api-lists-body" :style="{lineHeight:'28px'}">
              <el-row class="my-empty" v-if="tableData.length == 0">
                暂无数据
              </el-row>
            <div class="api-list" v-for="(item, index) in tableData" :key="index" :class="{'terminated-list':item.apiStatus == 0}">
              <el-row :class="['api-list-header']" >
                <el-col :span="18" :style="{paddingLeft:'20px'}">
                  <el-form label-position="left" inline class="api-list-header-form">
                    <el-form-item label="授权码 :" size="mini" class="basicimg-parent">
                      <span style="">{{ item.apiAuthorizeCode }}</span>
                      <span class="api-flag" v-if="item.apiMainType == '基础非管理员创建接口'"><img class="basic-fontimg" :src="basicUrl" /></span>
                    </el-form-item>
                  </el-form>
                    <el-popover
                      placement="left"
                      width="200"
                      trigger="hover">
                      <div>{{item.flag}}</div>
                      <!-- <span class="api-flag"  > -->
                        <img slot="reference" class="mark-fontimg" :src="markUrl" v-if="item.apiMainType == '基础非管理员创建接口' && item.flag.length > 0"/>
                      <!-- </span> -->
                    </el-popover>
                  
                </el-col>
                <el-col :span="2" :offset="4" v-if="item.isEvaluation">
                  <el-button size="mini" type="text" :style="{color:'#606266'}" @click="apiEvalDetail(item)">查看评价</el-button>
                </el-col>
              </el-row>
              <el-row :style="{textAlign:'center'}" :class="['api-list-body']">
               <el-col :span="1" >
                 <el-checkbox  v-model="item.isselected" @change="handleListChange(item,$event)" :disabled="item.apiBuyStatus != '待付款' && tabType == 0"></el-checkbox>
               </el-col>
               <el-col :span="8" >
                {{item.apiName}}
               </el-col>
               <el-col :span="5" >
                 {{item.apiApplyTime}}
               </el-col>
               <el-col :span="2" >
                 <span v-if="item.apiBookedTimes">{{item.apiBookedTimes}}次</span>
                 <span v-if="!item.apiBookedTimes">-</span>
               </el-col>
               <el-col :span="2" >
                 <span v-if="item.apiRestTimes">{{item.apiRestTimes}}次</span>
                 <span v-if="!item.apiRestTimes">-</span>
               </el-col>
               <el-col :span="2" :class="{'text-danger':item.apiBuyStatus==='待付款','text-success':item.apiBuyStatus==='已付款','text-warning':item.apiBuyStatus==='已关闭','text-info':item.apiBuyStatus==='已删除'}">
                 <span v-if="item.apiBuyStatus">{{item.apiBuyStatus}}</span>
                 <span v-if="!item.apiBuyStatus">-</span>
               </el-col>
               <el-col :span="4" :class="['crud-btns','split-before']">
                 <a class="operCell"  @click="detail(item)">接口<span class="btn-space"></span></a>
                 <a class="operCell" v-if="item.apiBuyStatus != '待付款' && item.apiBuyStatus != '已关闭'" @click="statistics(item)">统计<span class="btn-space"></span></a>
                 <a class="operCell" @click="testApi(item)">测试</a><template v-if="item.apiMainType == '基础非管理员创建接口'"><span class="btn-space"></span><a class="operCell" @click="addNameApi(item)">标注</a></template>
               </el-col>
              </el-row>
            <el-row  :class="['terminated-warper']" v-if="item.apiStatus == '已停用'"></el-row>
            </div>
          </div>
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

      <el-dialog :title="payTitle" :visible="showPay"  :append-to-body="true" @close="cancel" width="500px" class="no-padding">
        <div class="pay-outer">
          <div v-for="(item, index) in collection" class="block" :key="index">
            <div class="choose">
              <el-checkbox v-model="item.checked" @change="choosePay(item,$event)"></el-checkbox>
            </div>
            <div class="detail-outer">
              <span class="img-out">
                <img :src="payUrl"/>
              </span>
              <div class="detail">
                <span class="title">{{item.apiName}}</span>
                <span class="count">
                  购买数量：
                  <input type="text" class="small-input" v-model="item.apiBookedTimes" @keyup="changePrice(item, index)" />
                  次
                </span>
                <span class="price"> 
                  付款金额： 
                  <span class="red">{{item.price}}</span>
                  水利币
                </span>
              </div>
            </div>
          </div>
        </div>
        <span class="button-con-right pay-footer">
          <el-checkbox v-model="checkAllApi" class="check" :indeterminate="isChcekAllPrice" @change="checkAllPrice">全选</el-checkbox>
          <span class="total">
            <img :src="priceUrl"/>
            {{totalPrice}}
          </span>
          <el-button type="primary" @click="doPay" size="small" class="pay-btn">{{payTitle}}</el-button>
        </span>
      </el-dialog>

      <template v-if="showEval">
      <el-dialog title="评价" :visible="showEval"  :append-to-body="true" @close="cancel" width="700px" class="no-padding">
        <div class="pay-outer">
          <div v-for="(item, index) in collection" class="block width-100p" :key="index">
            <div class="eval-outer">
              <span class="img-out">
                <img :src="payUrl"/>
                <span class="title">{{item.apiName}}</span>
              </span>
              <div class="detail">
                <span class="eval">评分</span>
                <img :src="starUrl2" v-for="(star2, m) in starArray" class="img" v-show="m < item.show" :key="'key2' + index + m" @mouseover="changeStar(item, m, index)" @click="setStar(item, m, index)"/>
                <img :src="starUrl" v-for="(star, i) in starArray2" class="img" v-show="i >= item.show" :key="'key' + index + i" @mouseover="changeStar(item, i, index)" @click="setStar(item, i, index)"/>
                <span class="score">{{item.show ? item.show : 0}}分</span>
                <el-input type="textarea" size="small" v-model="item.productReview" class="eval-text" placeholder="请输入您的评价"></el-input>
              </div>
            </div>
          </div>
        </div>
        <span class="button-con-right eval-btn">
          <el-button type="primary" @click="doEval" size="small" >提交</el-button>
        </span>
      </el-dialog>
      </template>
      <template v-if="showEvalDetail">
      <el-dialog title="评价详情" :visible="showEvalDetail"  :append-to-body="true" @close="cancel" width="700px" class="no-padding">
        <div class="pay-outer">
          <div  class="block width-100p">
            <div class="eval-outer">
              <span class="img-out">
                <img :src="payUrl"/>
                <span class="title">{{evalDetail.apiName}}</span>
              </span>
              <div class="detail">
                <span class="eval">评分</span>
                <img :src="starUrl2" v-for="(star2, m) in starArray" class="img" v-show="m < evalDetail.star" :key="'key2' + m"  />
                <img :src="starUrl" v-for="(star, i) in starArray2" class="img" v-show="i >= evalDetail.star" :key="'key' + i"  />
                <span class="score">{{evalDetail.star ? evalDetail.star : 0}}分</span>
                <el-input type="textarea" size="small" v-model="evalDetail.productReview" readonly class="eval-text" placeholder="请输入您的评价"></el-input>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </template>
    <el-dialog title="标注" width="500px" :visible="markVisible" :append-to-body="true" @close="cancel">
      <el-form label-width="80px" @submit.native.prevent :rules="markRule" :model="markForm">
        <el-form-item label="标注：" prop="markContent">
          <el-input type="textarea" size="small" v-model="markForm.markContent" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入您的标注" max-length="100"></el-input>
        </el-form-item>
        <div class="rightPage">
          <el-button type="primary" size="mini" @click="saveApiName">确定</el-button>
          <el-button size="mini" @click="cancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getDataList, changeApiStatus, payApi, saveEval, getEvalDetail, mark} from '@/api/myapi/index';
  export default {
    components: {
    },
    props: {
    },
    watch: {
    },
    created() {
      this.getList()
    },
    mounted() {
    },
    data() {
      return {
        markVisible: false,//标注标识
        createTime: [],
        showPay: false,
        showEval: false,
        showEvalDetail: false,
        evalDetail: {},
        collection: [],
        initCount: 100,
        totalPrice: 0,
        payType: 'pay',
        payTitle: '付款',
        isChcekAllPrice: false,
        payUrl: require('@/assets/images/pay.png'),
        priceUrl: require('@/assets/images/price2.png'),
        starUrl: require('@/assets/images/star.png'),
        starUrl2: require('@/assets/images/star3.png'),
        basicUrl: require('@/assets/images/myapi/basic.png'),
        markUrl: require('@/assets/images/myapi/mark.png'),
        starArray: [{show: true},{show: true},{show: true},{show: true},{show: true}],
        starArray2: [{show: false},{show: false},{show: false},{show: false},{show: false}],
        form: {
          tabFlag: 0,
          selectParam: '',
          apiMainType: ''
        },
        markForm: {
          markContent: ''
        },
        markRule: {
          markContent: [{ validator: this.validatePass }]
        },
        choosePayList: [],
        page: {
          page: 1,
          size: 10
        },
        total: 0,
        tabType: 0,
        rangeTime:'',
        checkAllApi: false,
        tableData : [],
        isIndeterminate: false,
        checkAll:false,
        typeArray: [
          {value: '0', label: '全部'},
          {value: '1', label: '基础接口'},
          {value: '2', label: '业务接口'}
        ],
        markId: -1
      }
    },
    computed: {
      
    },
    methods: {
      changeTab(tab) {
        this.tabType = tab
        //this.form.tabFlag = tab
        this.form = {
          tabFlag: tab,
          selectParam: '',
          apiMainType: ''
        }
        this.createTime = []
        this.collection = []
        this.tableData.forEach(v => {
          v.isselected = false
        })
        this.isIndeterminate = false
        this.checkAll = false
        this.getList()
      },
      changeTime() {
        if (this.createTime instanceof Array && this.createTime.length > 0) {
          this.form.beginApplyDate = this.createTime[0]
          this.form.endApplyDate   = this.createTime[1]
        } else {
          this.form.beginApplyDate = ''
          this.form.endApplyDate   = ''
        }
      },
      search() {
        this.getList()
      },
      reset() {
        this.form = {
          tabFlag: 0,
          selectParam: '',
          apiMainType: ''
        }
      },
      pay(type) {
        if (this.collection.length == 0) {
          this.$message({
            type: 'warning',
            message: type == 'pay' ? '请选择订单后操作付款' : '请选择订单后操作续费'
          })
        } else {
          this.showPay = true
          this.payType = type
          this.payTitle = this.payType == 'pay' ? '付款' : '续费'
        }
      },
      doPay() {
        if (this.choosePayList.length == 0) {
          this.$message({
            type: 'warning',
            message: '请勾选API'
          })
          return false
        }
        let param = {
          myApiPayDtos: []
        }
        this.choosePayList.forEach(v => {
          let data = {
            id: v.id,
            apiBookedTimes: v.apiBookedTimes
          }
          param.myApiPayDtos.push(data)
        })
        payApi(param).then(resp => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: this.payTitle + '成功'
            })
            this.showPay = false
            this.checkAllApi = false
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      },
      doEval() {
        let result = false
        this.collection.forEach(v => {
          if (v.productReview == '' || v.productReview == null || v.productReview == undefined) {
            result = true
          }
        })
        if (result) {
          this.$message({
            type: 'warning',
            message: '评价内容不能为空！'
          })
          return false
        }
        let param = {
          list: this.collection.map(v => {
            return {
              productReview: v.productReview,
              id: v.id,
              star: v.show
            }
          })
        }
        saveEval(param).then(resp => {
          if (resp.code == 200) {
            this.$message({
              type: 'success',
              message: '评价成功'
            })
            this.showEval = false
          } else {
            this.$message({
              type: 'error',
              message: resp.message
            })
          }
        })
      },
      cancel() {
        this.showPay = false
        this.showEval = false
        this.showEvalDetail = false
        this.markVisible = false
        this.collection.forEach( v => {
          v.productReview = ''
        })
      },
      handleView(index, row) {
        console.log(index, row);
      },
      handleSta(index, row) {
        console.log(index, row);
      },
      handleTest(index, row) {
        console.log(index, row);
      },
      handleCheckAllChange(value) {
        this.tableData.forEach((val)=>{
          if (this.tabType == 0) {
            if (val.apiBuyStatus == '待付款') {
              val.isselected = value;
            }
          } else {
            val.isselected = value;
          }
        })
        
        if (value) {
          if (this.tabType == 0) {
            this.collection = this.tableData.filter(v => {
              return v.isselected
            })
          } else {
            this.collection = JSON.parse(JSON.stringify(this.tableData))
          }
        } else {
          this.collection = []
        }

        this.checkisIndeterminate();
      },
      handleListChange(item,e){
        item.isselected = e;
        this.checkisIndeterminate();  
        if (e) {
          item.price = item.payStandard * item.apiBookedTimes
          this.collection.push(item)   
        } else {
          this.collection.splice(this.collection.indexOf(item), 1)        
        }
      },
      changePrice(item, index) {
        item.price = Number((item.apiBookedTimes * item.payStandard).toFixed(2))
        let data = JSON.parse(JSON.stringify(item))
        this.$nextTick(() => {
          this.collection.splice(index, 1, data)
        }, 1)
        if (item.checked) {
          let total = 0
          //console.log(this.choosePayList)
          this.choosePayList.forEach(v => {
            total += parseInt(v.price)
          })
          this.totalPrice = total
        }
      },
      choosePay(item, e) {
        if (e) {
          this.choosePayList.push(item)
        } else {
          this.choosePayList.splice(this.choosePayList.indexOf(item), 1)
        }
        if (this.choosePayList.length == this.collection.length) {
          this.checkAllApi = true
          this.isChcekAllPrice = false
        } else if (this.choosePayList == 0 ){
          this.checkAllApi = false
          this.isChcekAllPrice = false
        } else {
          this.checkAllApi = false
          this.isChcekAllPrice = true
        }
        let total = 0
        this.choosePayList.forEach(v => {
          total += parseInt(v.price)
        })
        this.totalPrice = total
      },
      eval() {
        if (this.collection.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择订单后操作评价'
          })
        } else {
          this.collection.forEach((v) => {
            v.show = 0
          })
          this.showEval = true
        }
      },
      changeStatus(status, message, successMsg, info) {
        if (this.collection.length == 0) {
          this.$message({
            type: 'warning',
            message: info
          })
        } else {
          let param = {
            myApiStatusDtos: []
          }
          let deleteFlag = false
          this.collection.forEach((v) => {
            let data = {
              apiBuyStatus: status,
              id: v.id
            }
            if (v.apiRestTimes > 0) {
              deleteFlag = true
            }
            param.myApiStatusDtos.push(data)
          })
          if (status == 4 && deleteFlag) {
            message = 'API剩余使用次数不为0，是否确认删除？'
          }
          this.$confirm(message, '确认').then(() => {
            changeApiStatus(param).then((resp) => {
              if (resp.code == 200) {
                this.$message({
                  type: 'success',
                  message: successMsg
                })
                this.getList()
              } else {
                this.$message({
                  type: 'error',
                  message: resp.message
                })
              }
            })
          })
        }
      },
      changeStar(item, index, i) {
        item.show = index + 1
        let data = JSON.parse(JSON.stringify(item))
        this.collection.splice(i, 1)
        let _this = this
        this.$nextTick(() => {
          _this.collection.splice(i, 0, data)
        }, 1)
      },
      setStar(item, index, i) {
        item.show = index + 1
        let data = JSON.parse(JSON.stringify(item))
        this.collection.splice(i, 1)
        let _this = this
        this.$nextTick(() => {
          _this.collection.splice(i, 0, data)
        }, 1)
      },
      checkAllPrice(e) {
        this.collection.forEach((v) => {
          v.checked = e
        })
        this.choosePayList = JSON.parse(JSON.stringify(this.collection))
        if (e) {
          let total = 0
          this.choosePayList.forEach(v => {
            total += parseInt(v.price)
          })
          this.totalPrice = total
        } else {
          this.totalPrice = 0
        }
      },
      checkisIndeterminate(){
        this.isIndeterminate = false;
        let resultArr = [];
        resultArr = this.tableData.filter((val,i,arr)=>{
          return !!val.isselected;
        });
        if (resultArr.length == 0) {
          this.checkAll = false ;
        } else if (resultArr.length == this.tableData.length) {
           this.checkAll = true ;
        } else {
          if (this.tabType == 0) {
            let arr = this.tableData.filter(v => {
              return v.apiBuyStatus == '待付款'
            })
            if (resultArr.length == arr.length) {
              this.checkAll = true ;
            } else {
              this.isIndeterminate = true;
            }
          } else {
            this.isIndeterminate = true;
          }
        }
      },
      getList(Opt = this.form){
        let param ={...this.page, ...Opt}
        getDataList(param).then((resp) => {
          this.tableData = resp.data.list
          this.total = resp.data.total
          this.tableData.forEach(v => {
            v.isselected = false
          })
          this.checkAll = false
          this.isIndeterminate = false
          this.collection = []
        })
      },
      detail(data) {
        if (data.apiMainType == '业务接口') {
          this.$router.push({
            name: 'apiDetail',
            query: {
              id: data.apiId
            }
          })
        } else {
          this.$router.push({
            name: 'basicDetail',
            query: {
              id: data.apiId
            }
          })
        }
      },
      apiEvalDetail(data) {
        getEvalDetail({
          id: data.id
        }).then(resp => {
          if (resp.code == 200) {
            this.showEvalDetail = true
            this.evalDetail = resp.data
            this.evalDetail.apiName = data.apiName
          }
        })
      },
      statistics(item) {
        this.$router.push({
          name: 'apiStatistics',
          params: {
            code: item.apiAuthorizeCode,
            name: item.apiName
          }
        })
      },
      addNameApi(item) {
        this.markId = item.id
        this.markVisible = true
        this.markForm.markContent = item.flag
      },
      saveApiName() {
        mark({
          id: this.markId,
          flag: this.markForm.markContent
        }).then(res => {
          if(res.code == 200) {
            this.markVisible = false
            this.$message({
              type: 'success',
              message: '标注成功'
            })
            this.getList()
          } else {
            this.$message({
              type: 'success',
              message: res.message
            })
          }
        })
      },

      handleCurrentChange(page) {
        this.page.page = page
        this.getList()
      },
      testApi(data) {
        this.$router.push({
          name: 'apiTest',
          params: {
            id: data.apiId
          }
        })
      }
    },
    filters: {
      dataFormat:function (value, fmt) {
        let getDate = new Date(Number(value));
        let o = {
          'M+': getDate.getMonth() + 1,
          'd+': getDate.getDate(),
          'h+': getDate.getHours(),
          'm+': getDate.getMinutes(),
          's+': getDate.getSeconds(),
          'q+': Math.floor((getDate.getMonth() + 3) / 3),
          'S': getDate.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (let k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt;
      }
    }
  }
</script>

<style scoped>
  .search-box .el-button--mini{
      margin-left: 0;
      padding: inherit 10px;
  }
  .api-lists-header{
    background-color: #f4f7f9;
    padding: 7px;
    border: 1px solid #ccc;
  }
  .api-list{
    margin-top: 7px;
    border: 1px solid #ccc;
    position: relative;
  }
  .api-list-header{
    background-color: #f6f6f6;
  }
  .api-list-header-form .el-form-item {
    margin-bottom: 0
  }
  .api-list-body{
    padding: 7px;
  }
  .split-before{
    position: relative;
  }
  .split-before::after{
    content: '';
    display: block;
    position:absolute;
    top: 0;
    left:0;
    width: 1px;
    height: 100%;
    background-color: #DCDFE6;
  }
  .terminated-list{
    opacity: .5;
  }
  .terminated-warper{
    position: absolute;
    width: 100%;height: 100%;
    top:0;left:0;
    cursor: no-drop;
    background: url('../../assets/images/myapi/yitingyong.png') no-repeat 95% center;
    background-color: rgba(255,255,255,0.6);
  }
  .operCell {
    color: #009dec;
  }
  .operCell:hover {
    color: #19d1f2;
    text-decoration: underline;
  }
  .operCell .btn-space {
    display: inline-block;
    height: 12px;
    width: 2px;
    border-right: 1px solid #ccc;
    margin: 0 3px 0 6px;
  }
  .size-14 {
    font-size: 14px;
  }
  .basicimg-parent{
    position: relative;
  }
  .basic-fontimg {
    position: absolute;
    top: 0;
    right: -36px;
  }
  .mark-fontimg {
    position: absolute;
    top: 5px;
    right: 20px;
  }
  .mark-fontimg:hover {
    cursor: pointer;
  }
</style>


