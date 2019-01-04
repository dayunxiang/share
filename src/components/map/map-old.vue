<template>  
<div style="position:relative">
    <div id="viewDiv"></div>  
   <span class="point" id="point">
       <i class="el-icon-plus"></i>
   </span>
</div>
</template>  
<script>  
import esriLoader from 'esri-loader'  
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
            url: 'http://192.168.5.190:8001/init.js'  
        })  
    } else{  
        this.createMap(); //已加载esriLoader则调用  
    }  
  }, //我们需要在该组件装载之后做的事情都放在该方法里  
   methods: {  
    createMap() {  
      esriLoader.dojoRequire([  
          'esri/layers/TileLayer',
        'esri/layers/MapImageLayer',
        'esri/layers/GraphicsLayer',
        'esri/Map',
        'esri/Basemap',
        'esri/views/MapView',
        'esri/tasks/GeometryService',
        'esri/tasks/support/ProjectParameters',
        'esri/geometry/SpatialReference',
        'esri/Graphic',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',

        'dojo/domReady!'
      ], (TileLayer,
        MapImageLayer,
        GraphicsLayer,
        EsriMap,
        Basemap,
        MapView,
        GeometryService,
        ProjectParameters,
        SpatialReference,
        Graphic,
        Point,
        SimpleMarkerSymbol) => { 
        //江西省碎片图  
        let layer = new TileLayer({
            url: 'https://map.jxwrd.gov.cn/arcgis/rest/services/EsriBaseMap/MapServer',
        });
        //
        var basemap = new Basemap({
            baseLayers: [layer] 
        });


        //
        var map = new EsriMap({
            basemap: basemap
        });
        //
        var view = new MapView({
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


        //添加水利图层
        var lakeLayer = new MapImageLayer({
            url: 'https://map.jxwrd.gov.cn/arcgis/rest/services/zhuanti/Feature_LAKE_28/MapServer'
        });
        map.add(lakeLayer);

        //添加点
        var highlightLayer = new GraphicsLayer({
          id: 'highlightLayer'
        });
        map.add(highlightLayer);

        // var point = new Point({
        //   longitude: 115.69,
        //   latitude: 27.46,
        //   spatialReference: new SpatialReference({
        //     wkid: 4326
        //   }) // 如果 此处坐标系为4490则不需要下面的坐标转换操作，直接添加点到highlightLayer
        // });
        var point1 = new Point({
          longitude: 115.79213249943894,
          latitude: 27.956506550245365,
        });
        var point2 = new Point({
          longitude: 117.79213249943894,
          latitude: 27.956506550245365,
        });
        var point3 = new Point({
          longitude: 115.79213249943894,
          latitude: 28.956506550245365,
        });

        var geomSer = new GeometryService({
          url:
            'https://map.jxwrd.gov.cn/arcgis/rest/services/Utilities/Geometry/GeometryServer'
        });
        var params = new ProjectParameters({
          geometries: [point1, point2, point3],
          outSpatialReference: new SpatialReference({
            wkid: 4490
          })
        });

        geomSer.project(params).then(function (response) {
          //var point2 = response[0];

          var markerSymbol = new SimpleMarkerSymbol({
            color: [226, 119, 40],
            outline: {
              color: [255, 255, 255],
              width: 2
            }
          });

          var pointGraphic1 = new Graphic({
            attributes: {},
            geometry: response[0],
            popupTemplate: {},
            symbol: markerSymbol
          });
          var pointGraphic2 = new Graphic({
            attributes: {},
            geometry: response[1],
            popupTemplate: {},
            symbol: markerSymbol
          });
          var pointGraphic3 = new Graphic({
            attributes: {},
            geometry: response[2],
            popupTemplate: {},
            symbol: markerSymbol
          });
          highlightLayer.removeAll();
          highlightLayer.add(pointGraphic1);
          highlightLayer.add(pointGraphic2);
          highlightLayer.add(pointGraphic3);
        });

      })  
    },
    
  } 
}  
</script>  
<style scoped>  
@import url('http://192.168.5.190:8001/esri/css/main.css');  
 
#viewDiv {  
  height:  600px;  
  width:  100%;  
}  
.point {
    position: absolute;
    right: 15px;
    top: 15px;
    display: inline-block;
    width: 30px;
    height: 30px;
    background: #fff;
    box-shadow: 0 1px 5px #666;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
}
</style>  