<template>
    <div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: 'dataSourcePie',
    props: {
        data: Array
    },
    data () {
        return {
            countData: []
        };
    },
    watch: {
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
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
               
                series: [
                    {
                        name: '数量统计',
                        type: 'pie',
                        radius: '66%',
                        center: ['50%', '50%'],
                        data: this.countData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
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
