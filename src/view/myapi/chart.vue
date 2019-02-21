<template>
    <div style="width:94%;height:100%;margin: 0 3%;">
        <div class="titleDiv">
            <span class="fw-600">{{this.name}} </span><span class="lines"> | </span>
            <span class="ml6">今日请求总次数：</span><span class="mycolor"> {{this.todayTotal}} </span><span>次</span>
            <span>历史请求总次数</span><span class="mycolor"> {{this.historyTotal}} </span><span>次</span>
        </div>
        <div style="width:100%;height:100%;" id="data_source_con" >
            <div  v-show="countData.length == 0">
                暂无数据
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: 'dataSourcePie',
    props: {
        data: Array,
        xAxis: Array,
        todayTotal: Number,
        historyTotal: Number,
        name: String
    },
    data () {
        return {
            countData: [],
            xAxisArray: []
        };
    },
    watch: {
        xAxis (newVal) {
            this.xAxisArray = newVal
        },
        data (newVal) {
            this.countData = newVal
            this.setChart()
        }
    },
    mounted () {
        
    }, 
    methods: {
        setChart() {
            this.$nextTick(() => {
            var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
            const option = {
                color: '#009dec',
                title: {
                    show: false
                    // text: this.name + ' | ' + '今日请求总次数：' + this.todayTotal + '  历史请求总次数:' + this.historyTotal,
                    // x: 'right',
                    // y: 'top',
                    // textStyle: {
                    //     fontSize: '18px',
                    //     fontWeight: '100'
                    // }
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        //mark : {show: true},
                        //dataView : {show: true, readOnly: false},
                        //magicType : {show: true, type: ['line', 'bar']},
                        //restore : {show: true},
                        // saveAsImage : {
                        //     show: true,
                        //     title: '下载'
                        // }
                    },
                    x: '75%'
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.xAxisArray
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value}次'
                        }
                    }
                ],
                series : [
                    {
                        name:'调用次数',
                        type:'line',
                        data: this.countData
                    }
                ]
            };
                    
            dataSourcePie.setOption(option);
            window.addEventListener('resize', function () {
                dataSourcePie.resize();
            });
        });
        }
    }
};
</script>
<style>
    .titleDiv {
        text-align: right;
        margin-right: 110px;
    }
    .fw-600 {
        display: inline-block;
        margin-right: 6px;
        font-weight: 600;
    }
    .mycolor {
        color: #009dec;
        font-weight: 600;
    }
    .ml6 {
        margin-left: 6px;
    }
    .lines {
        color: #ccc;
    }
</style>
