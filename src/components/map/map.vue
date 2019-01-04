<template>  
<div style="position:relative">
    <div class="table-position" v-if="showTable">
        <span class="close-btn" @click="closeTable"><i class="el-icon-close"></i></span>
        <el-table :data="data" height="200px">
            <el-table-column :label="item.label" :prop="item.column" v-for="item in columns" :key="item.column" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
    </div>
    <div id="viewDiv"></div>  
    <!--画线-->
   <!-- <span class="point" id="point">
       <i class="el-icon-plus"></i>
   </span> -->
    <!--画矩形-->
   <span class="map-icon" id="point3">
   </span>
   <!--画面-->
   <!-- <span class="point2" id="point2">
       <i class="el-icon-minus"></i>
   </span> -->
   <!--画圆-->
    <!-- <span class="point2" id="point4">
       <i class="el-icon-minus"></i>
   </span> -->
</div>
</template>  
<script>  
import esriLoader from 'esri-loader'  
import axios from 'axios'
export default {  
  mounted() {  
    if (!esriLoader.isLoaded()) {//判断是否加载  
        esriLoader.bootstrap((err) => {//加载esriloader  
            if (err) {  
                console.error(err)  
            }else{  
                this.createMap(); //加载esriLoader没有错误则调用  
            }  
        }, {  
            url: 'http://10.136.6.54:8001/init.js'  
        })  
    } else{  
        this.createMap(); //已加载esriLoader则调用  
    }  
   }, //我们需要在该组件装载之后做的事情都放在该方法里  
   data() {
       return {
           showTable: false,//显示框选数据
           data: [],
           columns:[ ],
           mapImageLayer: {},
           map: {},
           view: {},
           imgObj: {},
           highlightLayer: {},
           lastType: '',
           serviceUrl: '',
           identifyTask: {},//ideftiy
           params: {}//ideftiy
       }
   },
   methods: {  
    createMap() {  
      esriLoader.dojoRequire([  
         'esri/layers/TileLayer',
        'esri/layers/MapImageLayer',
        'esri/layers/GraphicsLayer',
        'esri/Map',
        'esri/Basemap',
        "dojo/on",
        "dojo/query",
        "dojo/_base/array",
        'esri/views/MapView',
        'esri/tasks/GeometryService',
        'esri/tasks/support/ProjectParameters',
        'esri/geometry/SpatialReference',
        'esri/Graphic',
        'esri/geometry/Point',
        "esri/geometry/Polyline",
        "esri/geometry/Circle",
        "esri/geometry/Polygon",
        'esri/symbols/SimpleMarkerSymbol',
        "esri/tasks/IdentifyTask",
        "esri/tasks/QueryTask", 
        "esri/tasks/support/Query",
        "esri/tasks/support/IdentifyParameters",
        "esri/views/2d/draw/Draw",
        'dojo/domReady!'
      ], ( TileLayer,
        MapImageLayer,
        GraphicsLayer,
        EsriMap,
        Basemap,
        on,
        query,
        arrayUtils,
        MapView,
        GeometryService,
        ProjectParameters,
        SpatialReference,
        Graphic,
        Point,
        Polyline,
        Circle,
        Polygon,
        SimpleMarkerSymbol,
        IdentifyTask,
        QueryTask,
        supportQuery,
        IdentifyParameters,
        Draw) => { 
        //江西省碎片图  
        let layer = new TileLayer({
            url: 'https://map.jxwrd.gov.cn/arcgis/rest/services/EsriBaseMap/MapServer',
        });
        //
        let basemap = new Basemap({
            baseLayers: [layer] 
        });
        //
        let map = new EsriMap({
            basemap: basemap
        });
        //
        let view = new MapView({
            map: map,
            container: 'viewDiv',
            zoom: 2
        });
        //倍数
        view.constraints = {
            maxZoom: 8,  
            minZoom: 2
        };
        //中心点
        view.when(function(){           
            layer.fullExtent.xmax = 120.79213249943894
            layer.fullExtent.xmin = 111.21113113656108
            layer.fullExtent.ymax = 30.956506550245365
            layer.fullExtent.ymin = 23.32570492960322
            view.goTo(layer.fullExtent)
        })

        //标注点
        let geomSer = new GeometryService({
          url:
            'https://map.jxwrd.gov.cn/arcgis/rest/services/Utilities/Geometry/GeometryServer'
        });
        let highlightLayer = new GraphicsLayer({
          id: 'highlightLayer'
        });
        map.add(highlightLayer);

        //按钮点击事件
        let iconQuery = query('#point')
        let iconQuery2 = query('#point2')
        let iconQuery3 = query('#point3')
        let iconQuery4 = query('#point4')
        iconQuery.on('click', event => {
            this.initDrawLine(event, view, Graphic, Polyline, Draw)
        })

        iconQuery2.on('click', event => {
            this.initDrawPolygon(event, Draw, view, Graphic, Polygon)
        })

        iconQuery3.on('click', event => {
             //清除之前绘制
            view.graphics.removeAll()
            this.showTable = false
            this.initDrawRectangle(event, Draw, view, Graphic, Polygon, QueryTask, supportQuery)
        })

        iconQuery4.on('click', event => {
            this.initDrawCircle(event,  Draw, view, Graphic, Point, Circle)
        })

        //点击事件
        // on(view, 'click', event => {
        //     this.clickView(event, view, Point, ProjectParameters, SpatialReference, SimpleMarkerSymbol, Graphic, highlightLayer, geomSer)
        // })

        //空间查询
        view.on('load', this.initIdentify(view, IdentifyParameters))
        //点击
        view.on('click', event => {
            if (!this.lastType) {
                return false
            }
            this.executeIdentifyTask2(event, view, arrayUtils, Graphic, Polyline, Polygon)
            //this.excuteQueryTask(event, QueryTask, supportQuery)
        })

        this.map = map
        this.view = view
        this.mapImageLayer = MapImageLayer
        this.highlightLayer = highlightLayer
      })  
    },
    initDrawCircle(event, Draw, view, Graphic, Point, Circle) {
        let draw = new Draw({
            view: view
        });
        let action = draw.create("circle", {
            mode: "click"//点击方式加点
        });
        // 获取焦点
        view.focus();
        action.on("cursor-update",  (evt) => {
            this.drawCircle(evt.vertices, view, Graphic, Point, Circle)
        });
        action.on("draw-complete",  (evt) => {
            this.drawCircle(evt.vertices, view, Graphic, Point, Circle)
        });
        action.on("vertex-remove",  (evt) => {
            this.drawCircle(evt.vertices, view, Graphic, Point, Circle)
        });
    },
    initDrawRectangle(event, Draw, view, Graphic, Polygon, QueryTask, supportQuery) {
        let draw = new Draw({
            view: view
        });
        let action = draw.create("rectangle", {
            mode: "click"//点击方式加点
        });
        // 获取焦点
        view.focus();
        action.on("cursor-update",  (evt) => {
            this.drawRectangle(evt.vertices, view, Graphic, Polygon)
        });
        action.on("draw-complete",  (evt) => {
            //this.drawRectangle(evt.vertices, view, Graphic, Polygon)
            this.excuteQueryTask2(evt.vertices)
        });
        action.on("vertex-remove",  (evt) => {
            this.drawRectangle(evt.vertices, view, Graphic, Polygon)
        });
    },
    initDrawLine(event, view, Graphic, Polyline, Draw) {//初始化画线
        let draw = new Draw({
            view: view
        });
        let action = draw.create("polyline", {
            mode: "click"//点击方式加点
        });
        // 获取焦点
        view.focus();

        action.on("vertex-add",  (evt) => {
            this.drawLine(evt.vertices, view, Graphic, Polyline)
        });
        action.on("cursor-update",  (evt) => {
            this.drawLine(evt.vertices, view, Graphic, Polyline)
        });
        action.on("draw-complete",  (evt) => {
            this.drawLine(evt.vertices, view, Graphic, Polyline)
        });
        action.on("vertex-remove",  (evt) => {
            this.drawLine(evt.vertices, view, Graphic, Polyline)
        });
    },
    initDrawPolygon(event, Draw, view, Graphic, Polygon) {//初始化画面
        let draw = new Draw({
            view: view
        });
        let action = draw.create("polygon", {
            mode: "click"//点击方式加点
        });
        // 获取焦点
        view.focus();
        action.on("vertex-add",  (evt) => {
            this.drawPolygon(evt.vertices, view, Graphic, Polygon)
        });
        action.on("cursor-update",  (evt) => {
            this.drawPolygon(evt.vertices, view, Graphic, Polygon)
        });
        action.on("draw-complete",  (evt) => {
            this.drawPolygon(evt.vertices, view, Graphic, Polygon)
        });
        action.on("vertex-remove",  (evt) => {
             this.drawPolygon(evt.vertices, view, Graphic, Polygon)
        });
    },
    drawCircle(vertices, view, Graphic, Point, Circle) {
        //少于一个点无法展示圆
        if(vertices.length<2){
            return
        }
        //清除之前绘制
        view.graphics.removeAll();
        //生成绘制的图形,两点画圆
        let center=new Point({
            hasZ: false,
            hasM: false,
            x:vertices[0][0],
            y:vertices[0][1],
            spatialReference: view.spatialReference
        });
        let dis=center.distance(new Point({
            hasZ: false,
            hasM: false,
            x:vertices[1][0],
            y:vertices[1][1],
            spatialReference: view.spatialReference
        }));
        let graphic = new Graphic({
            geometry: new Circle({
                hasZ: false,
                hasM: false,
                center:center,
                radius:dis,
                spatialReference: view.spatialReference
            }),
            symbol: {
                type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                color: [ 51,51, 204, 0.9 ],
                style: "solid",
                outline: {  // autocasts as new SimpleLineSymbol()
                    color: "blue",
                    width: 1
                }
            }
        });

        view.graphics.add(graphic);
    },
    drawRectangle(vertices, view, Graphic, Polygon) {
        //清除之前绘制
        view.graphics.removeAll();

        //两点画矩形
        if(vertices.length<2){
            return
        }

        // 生成绘制的图形
        let graphic = new Graphic({
            geometry: new Polygon({
                hasZ: false,
                hasM: false,
                rings: [vertices],
                spatialReference: view.spatialReference
            }),
            symbol: {
                type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                color: [ 32, 170, 240, 0.5 ],
                style: "solid",
                outline: {  // autocasts as new SimpleLineSymbol()
                    color: "blue",
                    width: 1
                }
            }
        });
        view.graphics.add(graphic);
    },
    drawPolygon(vertices, view, Graphic, Polygon) {//画面
         view.graphics.removeAll();
         let graphic = new Graphic({
            geometry: new Polygon({
                hasZ: false,
                hasM: false,
                rings: [vertices],
                spatialReference: view.spatialReference
            }),
            symbol: {
                type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                color: [ 51,51, 204, 0.9 ],
                style: "solid",
                outline: {  // autocasts as new SimpleLineSymbol()
                    color: "blue",
                    width: 1
                }
            }
         })
         view.graphics.add(graphic);
    },
    drawLine(vertices, view, Graphic, Polyline) {//画线
        view.graphics.removeAll();

        let graphic = new Graphic({
            geometry: new Polyline({
                paths: vertices,
                spatialReference: view.spatialReference
            }),
            symbol: {
                type: "simple-line", // autocasts as new SimpleFillSymbol
                color: [4, 90, 141],
                width: 4,
                cap: "round",
                join: "round"
            }
         })
        view.graphics.add(graphic);
    },
    initIdentify(view, IdentifyParameters) {//初始化identify
        
        this.params = new IdentifyParameters();
        this.params.tolerance = 3;
        this.params.layerIds = [0, 1, 2];
        this.params.layerOption = "top";
        this.params.width = view.width;
        this.params.height = view.height;
    },
    excuteQueryTask(event, QueryTask, Query) {//
        let queryTask = new QueryTask({
            url: 'https://map.jxwrd.gov.cn:18443/geosearch/dataQuery/spatialQuery/IntersectsQuery'
        });
        let query = new Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.where = "POP &gt; 1000000";
        queryTask.execute(query).then(results => {
            console.log(results.features);
        });

        queryTask.executeForCount(query).then( results => {
            console.log(results)
        });
    },
    excuteQueryTask2(event) {
        event[4] = event[0]
        let rings = {
            rings: [event],
            spatialReference: {
                wkid: 4490,
                latestWkid: 4490
            }
        }
        let layer = this.getLayers()
        if (!layer) {
            return false
        }
        let param = {
            layers: layer,
            geometryType: 'arcgis',
            outField: '*',
            start: 0,
            rows: 10,
            facetField: 'LAYER',
            geometryJson: JSON.stringify(rings)
        }
        let params = this.toParam(param)
        axios({
            url: 'https://map.jxwrd.gov.cn:18443/geosearch/dataQuery/spatialQuery/IntersectsQuery',
            method: 'post',
            data: params
        }).then(resp => {
            this.showTable = true
            this.data = resp.data.docList
            let type = this.lastType.substring(4)
            //根据类型设置表头
            switch(type) {
                case 'CWS': this.columns = [
                                {column: 'NAME', label: '名称'},
                                {column: 'PRO_TYPE', label: '工程类型'},
                                {column: 'WINT_WS_TY', label: '取水水源类型'},
                                {column: 'WSUP_TPYE', label: '供水方式'},
                                {column: 'OBJ_CODE', label: '编码'},
                                {column: 'BUID_TIME_', label: '建成时间'}
                            ]
                            break
                case 'RV': this.columns = [
                                {column: 'NAME', label: '河流名称'},
                                {column: 'CEN_BAS_AR', label: '上一级河流名称'},
                                {column: 'CEN_BAS_AR', label: '流域面积(km²)'},
                                {column: 'RV_TYPE', label: '河流类型'},
                                {column: 'RV_CODE', label: '河流编码'},
                                {column: 'RV_LEN', label: '河流长度(km)'},
                                {column: 'CROS_BOUN_', label: '跨界类型'}
                            ]
                            break
                case 'LK': this.columns = [
                                {column: 'NAME', label: '湖泊名称'},
                                {column: 'BAS_NAME', label: '所在流域名称'},
                                {column: 'RV_NAME', label: '所在水系名称'},
                                {column: 'ASL_FRE_AT', label: '咸淡水属性'},
                                {column: 'OBJ_CODE', label: '湖泊编码'},
                                {column: 'CROS_BOUN_', label: '跨界类型'},
                                {column: 'LAKE_CAP', label: '湖泊容积(万km²)'}
                            ]
                            break
                case 'DIKE': this.columns = [
                                {column: 'NAME', label: '堤防名称'},
                                {column: 'DIKE_GRAD', label: '工程规模'},
                                {column: 'DIKE_LEN', label: '堤防长度(m)'},
                                {column: 'DES_STAG', label: '设计水位'},
                                {column: 'OBJ_CODE', label: '堤防编码'},
                                {column: 'GATA_NUM', label: '水闸数量(个)'},
                                {column: 'BUID_TIME_', label: '建成时间'}
                            ]
                            break
                case 'RES': this.columns = [
                                {column: 'NAME', label: '水库名称'},
                                {column: 'ENG_SCAL', label: '工程规模'},
                                {column: 'COR_SUR', label: '正常蓄水位(m)'},
                                {column: 'DES_FL_STA', label: '设计洪水位(m)'},
                                {column: 'OBJ_CODE', label: '水库编码'},
                                {column: 'TOT_CAP', label: '总库容(万m³)'},
                                {column: 'DES_WSUP', label: '设计年供水量(万m³)'},
                                {column: 'RS_TYPE', label: '水库类型'},
                                {column: 'BUID_TIME_', label: '建成时间'}
                            ]
                            break
                case 'IRR': this.columns = [
                                {column: 'NAME', label: '名称'},
                                {column: 'CUL_AREA', label: '耕地面积(亩)'},
                                {column: 'DES_IRR_AR', label: '设计灌溉面积(万亩)'},
                                {column: 'IRR_AREA_T', label: '总灌溉面积(亩)'},
                                {column: 'IRR_ADM_NA', label: '管理单位'},
                                {column: 'OBJ_CODE', label: '编码'}
                            ]
                            break
                case 'HYST': this.columns = [
                                {column: 'NAME', label: '水电站名称'},
                                {column: 'ENG_GRAD', label: '工程级别'},
                                {column: 'INS_CAP', label: '装机容量(kW)'},
                                {column: 'ENS_POW', label: '保证出力(kW)'},
                                {column: 'HYPO_TYPE', label: '水电站类型'},
                                {column: 'OBJ_CODE', label: '水电站编码'},
                                {column: 'BUID_TIME_', label: '建成时间'},
                            ]
                            break
                case 'RUDA': this.columns = [
                                {column: 'NAME', label: '橡胶坝名称'},
                                {column: 'RUB_DAM__1', label: '管理单位'},
                                {column: 'RUB_DAM_HI', label: '坝高(m)'},
                                {column: 'RUB_DAM_LE', label: '坝长(m)'},
                                {column: 'OBJ_CODE', label: '橡胶坝编码'},
                                {column: 'RUB_DAM_CR', label: '坝顶高程(m)'},
                                {column: 'RUB_DAM_EL', label: '高程系统'},
                                {column: 'BUID_TIME_', label: '建成时间'},
                            ]
                            break
                case 'WAGA': this.columns = [
                                {column: 'NAME', label: '水闸名称'},
                                {column: 'ENG_SCAL', label: '龚恒级别'},
                                {column: 'GATE_TYPE', label: '水闸类型'},
                                {column: 'GATE_ADM_N', label: '管理单位名称'},
                                {column: 'OBJ_CODE', label: '水闸编码'},
                                {column: 'GATE_FLOW', label: '过闸流量(m³/s)'},
                                {column: 'LOC_RV_NAM', label: '所在河流名称'},
                                {column: 'BUID_TIME_', label: '建成时间'},
                            ]
                            break
                case 'PUST': this.columns = [
                                {column: 'NAME', label: '泵站名称'},
                                {column: 'ENG_SCAL', label: '工程级别'},
                                {column: 'LOCATION_X', label: '泵站位置'},
                                {column: 'PUMP_ADM_N', label: '管理单位'},
                                {column: 'OBJ_CODE', label: '泵站编码'},
                                {column: 'PUMP_NUM', label: '水泵数量(台)'},
                                {column: 'LOC_RV_NAM', label: '所在河流名称'},
                                {column: 'ENG_TASK', label: '泵站类型'},
                                {column: 'BUID_TIME_', label: '建成时间'},
                            ]
                            break
                case 'WADI': this.columns = [
                                {column: 'NAME', label: '名称'},
                                {column: 'ENG_GRAD', label: '工程级别'},
                                {column: 'WINT_WS_TY', label: '取水水源类型'},
                                {column: 'WINT_SOUR1', label: '取水水源名称'},
                                {column: 'FROM_BAS_N', label: '调入流域名称'},
                                {column: 'OBJ_CODE', label: '编码'},
                                {column: 'DITR_TRAN_', label: '引调水方式'},
                                {column: 'INT_AREA', label: '工程范围受水区'},
                                {column: 'BUID_TIME_', label: '建成时间'}
                            ]
                            break
                case 'CHAN': this.columns = [
                                {column: 'NAME', label: '名称'},
                                {column: 'IRR_NAME', label: '所在灌区'},
                                {column: 'UP_CH_CODE', label: '上级渠道名称'},
                                {column: 'CH_CAT', label: '渠道类别'},
                                {column: 'CH_LEN', label: '渠道长度'},
                                {column: 'OBJ_CODE', label: '编码'},
                                {column: 'DES_FLOW', label: '设计流量'},
                                {column: 'ACT_FLOW', label: '实际流量'}
                            ]
                            break
                case 'WELL': this.columns = [
                                {column: 'NAME', label: '水井名称'},
                                {column: 'PUMP_TYPE', label: '水泵型号'},
                                {column: 'WELL_DEP', label: '井深(m)'},
                                {column: 'WELL_IN_DI', label: '井口井管内径(mm)'},
                                {column: 'TOP_LOC', label: '具体位置'},
                                {column: 'WELL_ADM_N', label: '管理单位'}
                            ]
                            break
                case 'DAM': this.columns = [
                                {column: 'NAME', label: '水库名称'},
                                {column: 'OBJ_CODE', label: '编码'},
                                {column: 'BUID_TIME_', label: '建成时间'}
                            ]
                            break
                case 'WAIN': this.columns = [
                                {column: 'NAME', label: '名称'},
                                {column: 'WINT_POS', label: '取水口位置'},
                                {column: 'WINT_TYPE', label: '取水方式'},
                                {column: 'WS_NAME', label: '水闸名称'},
                                {column: 'WS_TYPE', label: '水源类型'},
                                {column: 'RV_NAME', label: '所在水系名称'},
                                {column: 'ADM_NAME', label: '单位名称(个人)'},
                                {column: 'OBJ_CODE', label: '测站编码'}
                            ]
                            break
                case 'SWHS': this.columns = [
                                {column: 'NAME', label: '名称'},
                                {column: 'WINT_WS_TY', label: '取水水源类型'},
                                {column: 'WQUA_TARG', label: '水质目标'},
                                {column: 'WQUA_CAT', label: '水源地现状水质类别'},
                                {column: 'MAIN_WUSE', label: '主要供水用途'},
                                {column: 'INS_NAME', label: '单位名称'},
                                {column: 'OBJ_CODE', label: '测站编码'}
                            ]
                            break
                case 'BRID': this.columns = [
                                {column: 'NAME', label: '名称'}
                            ]
                            break
                case 'ST': this.columns = [
                                {column: 'NAME', label: '名称'},
                                {column: 'RV_NAME', label: '河流名称'},
                                {column: 'ST_LOC', label: '测站地点'},
                                {column: 'OBJ_CODE', label: '测站编码'},
                                {column: 'EST_ST_YEA', label: '建成时间'}
                            ]
                            break
                default: break;
            }
        })
    },
    executeIdentifyTask(event, view, arrayUtils, IdentifyTask, Point, ProjectParameters, SpatialReference, SimpleMarkerSymbol, Graphic, highlightLayer, geomSer) {
        if (!this.serviceUrl) {//判断是否加载对应图层
            return false
        }
        let screenPoint = {
            x: event.x,
            y: event.y
        };
        view.hitTest(screenPoint).then(resp => {//检查是否已添加标注点
            let result = resp.results[0]
            if (!result) {//未添加标注点
                let identifyTask = new IdentifyTask(this.serviceUrl);
                this.params.geometry = event.mapPoint;
                this.params.mapExtent = view.extent;
                identifyTask.execute(this.params).then(resp => {//判断当前区域是否有图层
                    let results = resp.results
                    // if (results && results.length > 0) {//添加标注点
                    //     this.clickView(event, view, Point, ProjectParameters, SpatialReference, SimpleMarkerSymbol, Graphic, highlightLayer, geomSer)
                    // }
                    return arrayUtils.map(results, function(result) {
        
                        let feature = result.feature;
                        let layerName = result.layerName;
                        feature.attributes.layerName = layerName;
                        feature.popupTemplate = {
                            title: layerName,
                            content: '<p>'+ feature.attributes['河流名称'] +'</p>'
                        }
                        return feature;
                    });
                }).then((response) => {
                    if (response.length > 0) {
                         view.popup.open({
                            features: response.slice(0, 1),
                            location: event.mapPoint
                        });
                    }
                })
            }
        })
    },
    executeIdentifyTask2(event, view, arrayUtils, Graphic, Polyline, Polygon) {
        let x = event.mapPoint.x
        let y = event.mapPoint.y
        let zoom = view.zoom
        if (zoom < 3) {
            zoom = 1
        } else if (zoom >= 3 && zoom < 5) {
            zoom = 3
        } else if (zoom >= 5 && zoom < 7) {
            zoom = view.zoom
        } else {
            zoom = view.zoom + 2
        }
        let deviation = 0.05 / zoom //查询区域误差
        let extent = [[x - deviation, y - deviation], [x - deviation, y + deviation], [x + deviation, y + deviation], [x + deviation, y - deviation], [x - deviation, y -deviation]]
        let rings = {
            rings: [extent],
            spatialReference: {
                wkid: 4490,
                latestWkid: 4490
            }
        }
        let param = {
            layers: this.getLayers(),
            geometryType: 'arcgis',
            outField: '*',
            start: 0,
            rows: 10,
            facetField: 'LAYER',
            geometryJson: JSON.stringify(rings)
        }
        let params = this.toParam(param)
        let _this = this
        axios({
            url: 'https://map.jxwrd.gov.cn:18443/geosearch/dataQuery/spatialQuery/IntersectsQuery',
            method: 'post',
            data: params
        }).then(resp => {
            let results = resp.data.docList
            let response = arrayUtils.map(results, function(result) {
                let feature = {};
                feature.attributes = result;
                feature.attributes.layerName = result.NAME;
                let content = _this.getContent(result)
                feature.popupTemplate = {
                    title: result.LAYER_ZH,
                    content: content
                }
                return feature;
            })
            if (response.length > 0) {
                view.popup.open({
                    features: response.slice(0, 1),
                    location: event.mapPoint
                });
            }

            //高亮
            let type = this.lastType.substring(4)
            if (type == 'RV' || type == 'CHAN' || type == 'WADI') {
                this.highLightLine(results[0].SHAPE,  view, Graphic, Polyline)
            } else if (type == 'LK' || type == 'IRR' ) {
                this.highLightPolygon(results[0].SHAPE,  view, Graphic, Polygon)
            }
        })
    },
    highLightPolygon(path, view, Graphic, Polygon) {//图层高亮-面
        view.graphics.removeAll();
        let graphic = new Graphic({
            geometry: new Polygon({
                hasZ: false,
                hasM: false,
                rings: [path.rings ? path.rings[0] : path.paths[0]],
                spatialReference: view.spatialReference
            }),
            symbol: {
                type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                color: [238, 222, 40, .7],
                style: "solid",
                outline: {  // autocasts as new SimpleLineSymbol()
                    color: "red",
                    width: 1
                }
            }
         })
         view.graphics.add(graphic);
    },
    highLightLine(path, view, Graphic, Polyline) {//图层高亮-线
        view.graphics.removeAll();
        let graphic = new Graphic({
            geometry: new Polyline({
                paths: path.rings ? path.rings : path.paths,
                spatialReference: view.spatialReference
            }),
            symbol: {
                type: "simple-line", // autocasts as new SimpleFillSymbol
                color: [246, 40, 40],
                width: 2,
                cap: "round",
                join: "round"
            }
         })
        view.graphics.add(graphic);
    },
    getContent(result) {
        let type = this.lastType.substring(4)
        let content = ''
        switch(type) {
            case 'CWS': content = '<p class="point-detail"><span>名称：</span><span>' + result.NAME + '</span></p>' +
                               '<p class="point-detail"><span>工程类型：</span><span>' + result.PRO_TYPE + '</span></p>' +   
                               '<p class="point-detail"><span>取水水源类型：</span><span>' + result.WINT_WS_TY + '</span></p>' +   
                               '<p class="point-detail"><span>供水方式：</span><span>' + result.WSUP_TPYE + '</span></p>' +   
                               '<p class="point-detail"><span>编码：</span><span>' + result.OBJ_CODE + '</span></p>' +   
                               '<p class="point-detail"><span>取水许可证编号：</span><span>' + result.TAKE_LIC_C + '</span></p>' +   
                               '<p class="point-detail"><span>卫生许可证编号：</span><span>' + result.SAN_LIC_CO + '</span></p>' +   
                               '<p class="point-detail"><span>入户前管网长度(km)：</span><span>' + result.PIPE_LEN + '</span></p>' +   
                               '<p class="point-detail"><span>配套功率(kw)：</span><span>' + result.MAT_POW + '</span></p>' +   
                               '<p class="point-detail"><span>设计供水规模(m³/d)：</span><span>' + result.DES_WSUP_S + '</span></p>' +   
                               '<p class="point-detail"><span>设计供水人口(人)：</span><span>' + result.DES_WSUP_P + '</span></p>' +   
                               '<p class="point-detail"><span>建成时间：</span><span>' + result.BUID_TIME_ + '</span></p>'
                        break
            case 'RV': content = '<p class="point-detail"><span>河流名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>河流级别：</span><span>' + result.RV_GRAD + '</span></p>' +
                                 '<p class="point-detail"><span>上一级河流名称：</span><span>' + result.UP_RV_NAME + '</span></p>' +
                                 '<p class="point-detail"><span>流域面积(km²)：</span><span>' + result.CEN_BAS_AR + '</span></p>' +
                                 '<p class="point-detail"><span>河流类型：</span><span>' + result.RV_TYPE + '</span></p>' +
                                 '<p class="point-detail"><span>河流编码：</span><span>' + result.RV_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>上一级河流编码：</span><span>' + result.UP_RV_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>河流长度(km)：</span><span>' + result.RV_LEN + '</span></p>' +
                                 '<p class="point-detail"><span>跨界类型：</span><span>' + result.CROS_BOUN_ + '</span></p>'
                                 break
            case 'LK': content = '<p class="point-detail"><span>湖泊名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>所在流域名称：</span><span>' + result.BAS_NAME + '</span></p>' +
                                 '<p class="point-detail"><span>所在水系名称：</span><span>' + result.RV_NAME + '</span></p>' +
                                 '<p class="point-detail"><span>咸淡水属性：</span><span>' + result.ASL_FRE_AT + '</span></p>' +
                                 '<p class="point-detail"><span>湖泊编码：</span><span>' + result.OBJ_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>跨界类型：</span><span>' + result.CROS_BOUN_ + '</span></p>' +
                                 '<p class="point-detail"><span>湖泊容积(万km²)：</span><span>' + result.LAKE_CAP + '</span></p>'
                                 break
            case 'DIKE': content = '<p class="point-detail"><span>堤防名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>工程规模：</span><span>' + result.DIKE_GRAD + '</span></p>' +
                                 '<p class="point-detail"><span>堤防长度(m)：</span><span>' + result.DIKE_LEN + '</span></p>' +
                                 '<p class="point-detail"><span>设计水位：</span><span>' + result.DES_STAG + '</span></p>' +
                                 '<p class="point-detail"><span>堤防编码：</span><span>' + result.OBJ_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>水闸数量(个)：</span><span>' + result.GATA_NUM + '</span></p>' +
                                 '<p class="point-detail"><span>建成时间：</span><span>' + result.BUID_TIME_ + '</span></p>'
                                 break
            case 'RES': content = '<p class="point-detail"><span>水库名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>工程规模：</span><span>' + result.ENG_SCAL + '</span></p>' +
                                 '<p class="point-detail"><span>正常蓄水位(m)：</span><span>' + result.COR_SUR + '</span></p>' +
                                 '<p class="point-detail"><span>死水位：</span><span>' + result.DEAD_STAG + '</span></p>' +
                                 '<p class="point-detail"><span>设计洪水位(m)：</span><span>' + result.DES_FL_STA + '</span></p>' +
                                 '<p class="point-detail"><span>水库编码：</span><span>' + result.GATA_NUM + '</span></p>' +
                                 '<p class="point-detail"><span>总库容(万m³)：</span><span>' + result.TOT_CAP + '</span></p>'+
                                 '<p class="point-detail"><span>兴利库容(万m³)：</span><span>' + result.AVA_STOR + '</span></p>' +
                                 '<p class="point-detail"><span>设计年供水量(万m³)：</span><span>' + result.DES_WSUP + '</span></p>' +
                                 '<p class="point-detail"><span>设计灌溉面积(万亩)：</span><span>' + result.DES_IRR_AR + '</span></p>' +
                                 '<p class="point-detail"><span>水库类型：</span><span>' + result.RS_TYPE + '</span></p>' +
                                 '<p class="point-detail"><span>建成时间：</span><span>' + result.BUID_TIME_ + '</span></p>'
                                 break
            case 'IRR': content = '<p class="point-detail"><span>名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>耕地面积(亩)：</span><span>' + result.CUL_AREA + '</span></p>' +
                                 '<p class="point-detail"><span>设计灌溉面积(万亩)：</span><span>' + result.DES_IRR_AR + '</span></p>' +
                                 '<p class="point-detail"><span>总灌溉面积(亩)：</span><span>' + result.IRR_AREA_T + '</span></p>' +
                                 '<p class="point-detail"><span>管理单位：</span><span>' + result.IRR_ADM_NA + '</span></p>' +
                                 '<p class="point-detail"><span>编码：</span><span>' + result.OBJ_CODE + '</span></p>'
                                 break
            case 'HYST': content = '<p class="point-detail"><span>水电站名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>工程级别：</span><span>' + result.ENG_GRAD + '</span></p>' +
                                 '<p class="point-detail"><span>装机容量(kW)：</span><span>' + result.INS_CAP + '</span></p>' +
                                 '<p class="point-detail"><span>多年平均发电量(万kW·h)：</span><span>' + result.MUL_AVER_E + '</span></p>' +
                                 '<p class="point-detail"><span>水电站编码：</span><span>' + result.OBJ_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>保证出力(kW)：</span><span>' + result.ENS_POW + '</span></p>' +
                                 '<p class="point-detail"><span>额定水头(m)：</span><span>' + result.RAT_HEAD + '</span></p>' +
                                 '<p class="point-detail"><span>所在河流名称：</span><span>' + result.LOC_RV_NAM + '</span></p>' +
                                 '<p class="point-detail"><span>是否利用水库发电：</span><span>' + result.IF_RS_POW + '</span></p>' +
                                 '<p class="point-detail"><span>水电站类型：</span><span>' + result.HYPO_TYPE + '</span></p>' +
                                 '<p class="point-detail"><span>建成时间：</span><span>' + result.BUID_TIME_ + '</span></p>'
                                 break
            case 'RUDA': content = '<p class="point-detail"><span>橡胶坝名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>管理单位：</span><span>' + result.RUB_DAM__1 + '</span></p>' +
                                 '<p class="point-detail"><span>坝高(m)：</span><span>' + result.RUB_DAM_HI + '</span></p>' +
                                 '<p class="point-detail"><span>坝长(m)：</span><span>' + result.RUB_DAM_LE + '</span></p>' +
                                 '<p class="point-detail"><span>橡胶坝编码：</span><span>' + result.OBJ_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>坝顶高程(m)：</span><span>' + result.RUB_DAM_CR + '</span></p>' +
                                 '<p class="point-detail"><span>高程系统：</span><span>' + result.RUB_DAM_EL + '</span></p>' +
                                 '<p class="point-detail"><span>建成时间：</span><span>' + result.BUID_TIME_ + '</span></p>'
                                 break
            case 'WAGA': content = '<p class="point-detail"><span>水闸名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>龚恒级别：</span><span>' + result.ENG_SCAL + '</span></p>' +
                                 '<p class="point-detail"><span>水闸类型：</span><span>' + result.GATE_TYPE + '</span></p>' +
                                 '<p class="point-detail"><span>管理单位名称：</span><span>' + result.GATE_ADM_N + '</span></p>' +
                                 '<p class="point-detail"><span>所在地_乡：</span><span>' + result.LOCATION_X + '</span></p>' +
                                 '<p class="point-detail"><span>水闸编码：</span><span>' + result.OBJ_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>闸孔总净宽^(m)：</span><span>' + result.HOLE_WID + '</span></p>' +
                                 '<p class="point-detail"><span>引(进)水闸过闸流量(m³/s)：</span><span>' + result.INT_GATE_F + '</span></p>' +
                                 '<p class="point-detail"><span>排(退)水闸过闸流量(m³/s)：</span><span>' + result.DRA_GATE_F + '</span></p>' +
                                 '<p class="point-detail"><span>过闸流量(m³/s)：</span><span>' + result.GATE_FLOW + '</span></p>' +
                                 '<p class="point-detail"><span>工程位置：</span><span>' + result.LOCATION_X + '</span></p>' +
                                 '<p class="point-detail"><span>所在河流名称：</span><span>' + result.LOC_RV_NAM + '</span></p>' +
                                 '<p class="point-detail"><span>建成时间：</span><span>' + result.BUID_TIME_ + '</span></p>'
                                 break
            case 'PUST': content = '<p class="point-detail"><span>泵站名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>工程级别：</span><span>' + result.ENG_SCAL + '</span></p>' +
                                 '<p class="point-detail"><span>泵站位置：</span><span>' + result.LOCATION_X + '</span></p>' +
                                 '<p class="point-detail"><span>管理单位：</span><span>' + result.PUMP_ADM_N + '</span></p>' +
                                 '<p class="point-detail"><span>泵站编码：</span><span>' + result.OBJ_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>水泵数量(台)：</span><span>' + result.PUMP_NUM + '</span></p>' +
                                 '<p class="point-detail"><span>装机功率(kW)：</span><span>' + result.INS_POW + '</span></p>' +
                                 '<p class="point-detail"><span>设计扬程^(m)：</span><span>' + result.DES_HEAD + '</span></p>' +
                                 '<p class="point-detail"><span>所在河流名称：</span><span>' + result.LOC_RV_NAM + '</span></p>' +
                                 '<p class="point-detail"><span>泵站类型：</span><span>' + result.ENG_TASK + '</span></p>' +
                                 '<p class="point-detail"><span>建成时间：</span><span>' + result.BUID_TIME_ + '</span></p>'
                                 break
            case 'WADI': content = '<p class="point-detail"><span>名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>工程级别：</span><span>' + result.ENG_GRAD + '</span></p>' +
                                 '<p class="point-detail"><span>取水水源类型：</span><span>' + result.WINT_WS_TY + '</span></p>' +
                                 '<p class="point-detail"><span>取水水源名称：</span><span>' + result.WINT_SOUR1 + '</span></p>' +
                                 '<p class="point-detail"><span>调入流域名称：</span><span>' + result.FROM_BAS_N + '</span></p>' +
                                 '<p class="point-detail"><span>编码：</span><span>' + result.OBJ_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>引调水方式：</span><span>' + result.DITR_TRAN_ + '</span></p>' +
                                 '<p class="point-detail"><span>工程范围输水线路区：</span><span>' + result.LINE_AREA + '</span></p>' +
                                 '<p class="point-detail"><span>工程范围受水区：</span><span>' + result.INT_AREA + '</span></p>' +
                                 '<p class="point-detail"><span>建成时间：</span><span>' + result.BUID_TIME_ + '</span></p>'
                                 break
            case 'CHAN': content = '<p class="point-detail"><span>名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>所在灌区：</span><span>' + result.IRR_NAME + '</span></p>' +
                                 '<p class="point-detail"><span>上级渠道名称：</span><span>' + result.UP_CH_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>渠道类别：</span><span>' + result.CH_CAT + '</span></p>' +
                                 '<p class="point-detail"><span>渠道长度：</span><span>' + result.CH_LEN + '</span></p>' +
                                 '<p class="point-detail"><span>编码：</span><span>' + result.OBJ_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>设计流量：</span><span>' + result.DES_FLOW + '</span></p>' +
                                 '<p class="point-detail"><span>实际流量：</span><span>' + result.ACT_FLOW + '</span></p>'
                                 break
            case 'WELL': content = '<p class="point-detail"><span>水井名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>水泵型号：</span><span>' + result.PUMP_TYPE + '</span></p>' +
                                 '<p class="point-detail"><span>井深(m)：</span><span>' + result.WELL_DEP + '</span></p>' +
                                 '<p class="point-detail"><span>井口井管内径(mm)：</span><span>' + result.WELL_IN_DI + '</span></p>' +
                                 '<p class="point-detail"><span>具体位置：</span><span>' + result.TOP_LOC + '</span></p>' +
                                 '<p class="point-detail"><span>管理单位：</span><span>' + result.WELL_ADM_N + '</span></p>'
                                 break
            case 'DAM': content = '<p class="point-detail"><span>水库名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>编码：</span><span>' + result.OBJ_CODE + '</span></p>' +
                                 '<p class="point-detail"><span>建成时间：</span><span>' + result.BUID_TIME_ + '</span></p>'
                                 break
            case 'WAIN': content = '<p class="point-detail"><span>名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>取水口位置：</span><span>' + result.WINT_POS + '</span></p>' +
                                 '<p class="point-detail"><span>取水方式：</span><span>' + result.WINT_TYPE + '</span></p>' +
                                 '<p class="point-detail"><span>水闸名称：</span><span>' + result.WS_NAME + '</span></p>' +
                                 '<p class="point-detail"><span>水源类型：</span><span>' + result.WS_TYPE + '</span></p>' +
                                 '<p class="point-detail"><span>所在水系名称：</span><span>' + result.RV_NAME + '</span></p>' +
                                 '<p class="point-detail"><span>单位名称(个人)：</span><span>' + result.ADM_NAME + '</span></p>' +
                                 '<p class="point-detail"><span>测站编码：</span><span>' + result.OBJ_CODE + '</span></p>'
                                 break
            case 'SWHS': content = '<p class="point-detail"><span>名称：</span><span>' + result.NAME + '</span></p>' +
                                 '<p class="point-detail"><span>取水水源类型：</span><span>' + result.WINT_WS_TY + '</span></p>' +
                                 '<p class="point-detail"><span>水质目标：</span><span>' + result.WQUA_TARG + '</span></p>' +
                                 '<p class="point-detail"><span>水源地现状水质类别：</span><span>' + result.WQUA_CAT + '</span></p>' +
                                 '<p class="point-detail"><span>主要供水用途：</span><span>' + result.MAIN_WUSE + '</span></p>' +
                                 '<p class="point-detail"><span>单位名称：</span><span>' + result.INS_NAME + '</span></p>' +
                                 '<p class="point-detail"><span>编码：</span><span>' + result.OBJ_CODE + '</span></p>'
                                 break
            case 'BRID': content = '<p class="point-detail"><span>名称：</span><span>' + result.NAME + '</span></p>' 
                                 break
            case 'ST': content = '<p class="point-detail"><span>名称：</span><span>' + result.NAME + '</span></p>' +
                                '<p class="point-detail"><span>河流名称：</span><span>' + result.RV_NAME + '</span></p>' +
                                '<p class="point-detail"><span>测站地点：</span><span>' + result.ST_LOC + '</span></p>' +
                                '<p class="point-detail"><span>测站编码：</span><span>' + result.OBJ_CODE + '</span></p>' +
                                '<p class="point-detail"><span>建成时间：</span><span>' + result.EST_ST_YEA + '</span></p>'
                                 break
            default: break
        }   
        return content 
    },
    toParam(param) {
        let result = []
        for (let key in param) {
            let arr = key + '=' + param[key]
            result.push(arr)
        }
        return result.join('&')
    },
    getLayers() {
        let type = this.lastType.substring(4)
        let result = ''
        switch(type) {
            case 'CWS': result = 'CWS'; break;//农村供水
            case 'LK': result = 'LAKE'; break;//湖泊
            case 'RV': result = 'River,River_Polygon'; break;//河流
            case 'DIKE': result = 'DIKE'; break;//提防
            case 'RES': result = 'RSWB'; break;//水库
            case 'IRR': result = 'IRR'; break;//灌区
            case 'HYST': result = 'HYPO'; break;//水电站
            case 'RUDA': result = 'RUB'; break;//橡胶坝
            case 'WAGA': result = 'GATE'; break;//水闸
            case 'PUST': result = 'PUMP'; break;//泵站
            case 'WADI': result = 'DITR'; break;//引调水
            case 'CHAN': result = 'CH'; break;//渠道
            case 'WELL': result = 'WELL'; break;//取水井
            case 'DAM': result = 'DAM'; break;//大坝
            case 'WAIN': result = 'WINT'; break;//取水口
            case 'SWHS': result = 'SUWS'; break;//地表水
            case 'BRID': result = 'BRIDGE'; break;//地表水
            case 'ST': result = 'OBS'; break;//测站-水文站
        }
        return result
    },
    showPopup(e, view) {
     
    },
    closeTable() {
        this.showTable = false
        this.view.graphics.removeAll();
    },
    //点击地图，新增标注点；
    clickView(e, view, Point, ProjectParameters, SpatialReference, SimpleMarkerSymbol, Graphic, highlightLayer, geomSer) {

        let point = new Point({
            longitude: e.mapPoint.x,
            latitude: e.mapPoint.y
        });

        let params = new ProjectParameters({
            geometries: [point],
            outSpatialReference: new SpatialReference({
                wkid: 4490
            })
        });
        //添加标注点
        geomSer.project(params).then(response => {
            let point2 = response[0];

            let markerSymbol = new SimpleMarkerSymbol({
                color: [226, 119, 40],
                outline: {
                color: [255, 255, 255],
                width: 2
                }
            });

            let pointGraphic = new Graphic({
                attributes: { },
                geometry: point2,
                popupTemplate: {
                    title: '标题',
                    content: '<p>内容测试</p><p>内容测试</p>'
                },
                symbol: markerSymbol
            });
            highlightLayer.removeAll();
            highlightLayer.add(pointGraphic);
        });
        
    },
    addLayer(type, isAdd) {//添加、移除图层
        this.highlightLayer.removeAll();//移除标注点
        this.view.graphics.removeAll();//移除绘制图形
        this.view.popup.close();//移除弹窗
        this.showTable = false
        if (!isAdd) {//移除图层
            this.map.remove(this.imgObj[this.lastType])
            this.lastType = ''
        } else {//新增
            //移除上一个选项
            if (this.lastType) {
                this.map.remove(this.imgObj[this.lastType])
            }
            let id = 'img_' + type
            this.lastType = id
            let url = ''
            switch(type) {
                case 'CWS': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_CWS_8/MapServer'; break;//农村供水
                case 'DAM': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_DAM_20/MapServer'; break;//大坝
                case 'DIKE': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_DIKE_22/MapServer'; break;//堤防
                case 'WELL': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_WELL_17/MapServer'; break;//水井
                case 'RV': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_RIVER_Polygon_29/MapServer'; break;//河流
                case 'LK': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_LAKE_28/MapServer'; break;//湖泊
                case 'RES': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_RSWB_26/MapServer'; break;//水库
                case 'IRR': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_IRR_27/MapServer'; break;//灌区
                //case 'PDO': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_PDO_19/MapServer'; break;//入河排污口
                case 'HYST': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_HYPO_6/MapServer'; break;//水电站
                case 'RUDA': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_RUB_15/MapServer'; break;//橡胶坝
                case 'WAGA': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_GATE_14/MapServer'; break;//水闸
                case 'PUST': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_PUMP_7/MapServer'; break;//泵站
                case 'WADI': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_DITR_23/MapServer'; break;//引调水
                case 'CHAN': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_CH_21/MapServer'; break;//渠道
                case 'WAIN': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_WINT_10/MapServer'; break;//取水口
                case 'SWHS': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_SUWS_18/MapServer'; break;//地表水
                case 'BRID': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_BRIDGE_33/MapServer'; break;//桥梁
                case 'ST': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_OBS_9/MapServer'; break;//测站
               // case 'GWHS': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/ST_STBPRP_B_ZG/MapServer'; break;//地下水水源地
                //case 'AD': url = 'https://map.jxwrd.gov.cn/arcgis/rest/services/Image/XZQH/MapServer'; break;//行政区划
                default:  break;
            }
            //缓存service
            this.serviceUrl = url
            //添加图层
            this.imgObj[id] = new this.mapImageLayer({
                url: url
            });
            this.map.add(this.imgObj[id]);

        }
    }
    
  } 
}  
</script>  
<style scoped >  
@import url('http://10.136.6.54:8001/esri/css/main.css');  
 
#viewDiv {  
  height:  600px;  
  width:  100%;  
}  

.point2 {
    position: absolute;
    right: 15px;
    top: 55px;
    display: inline-block;
    width: 30px;
    height: 30px;
    background: #fff;
    box-shadow: 0 1px 5px #666;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
}
.close-btn {
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
    z-index: 12;
}


</style>  