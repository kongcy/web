import * as Cesium from 'cesium/Cesium'
import Axios from 'axios'

function PointInfo() {
    this.id = "";
    this.longitude = 0.0;
    this.latitude = 0.0;
    this.name = null;

    this.clone = function() {
        var info = new PointInfo();
        info.id = this.id;
        info.longitude = this.longitude;
        info.latitude = this.latitude;
        info.name = this.name;
        return info;
    }
}

function PointStyle() {
    this.imageURL = "";

    this.clone = function() {
        var style = new PointStyle();
        style.imageURL = this.imageURL;
        return style;
    }
}

function LineInfo() {
    this.id = "";
    this.longitudeStart = 0.0;
    this.latitudeStart = 0.0;
    this.longitudeEnd = 0.0;
    this.latitudeEnd = 0.0;

    this.clone = function() {
        var info = new LineInfo();
        info.id = this.id;
        info.longitudeStart = this.longitudeStart;
        info.latitudeStart = this.latitudeStart;
        info.longitudeEnd = this.longitudeEnd;
        info.latitudeEnd = this.latitudeEnd;
        return info;
    }
}

function LineStyle() {
    this.width = 1;
    this.colorR = 255;
    this.colorG = 255;
    this.colorB = 255;
    this.colorA = 255;

    this.clone = function() {
        var style = new LineStyle();
        style.width = this.width;
        style.colorR = this.colorR;
        style.colorG = this.colorG;
        style.colorB = this.colorB;
        style.colorA = this.colorA;
        return style;
    }
}

var WebGIS = {
    _viewer: null,
    _canvas: null,
    _camera: null,
    _entities: null,
    _ellipsoid: null,
    _sourceURL: null,

    _countryDataCount: -1,
    _provincialDataCount: -1,
    _cityDataCount: -1,
    //	_countyDataCount          : -1,
    _countryDataSource: null,
    _provincialDataSource: null,
    _cityDataSource: null,
    //	_countyDataSource         : null,
    _customDataSource: null,

    _isMarkState: false,
    _markPointStyle: null,
    _markCallback: null,
    _mouseClickCallback: null,
    _mouseDoubleClickCallback: null,

    _pointInfos: new Map(),
    _lineInfos: new Map(),

    _pointLongitudeLatitudeCallback: null,
    _zoomCallback: null,
    currentEntity: null,


    _loadData: function(north, east, west, south, height) {
        /*
         * level3: 19568 000
         * level4:  9784 000
         * level5:  4892 000
         * level6:  2446 000
         * level7:  1223 000
         * level8:   611 000
         * level9:   306 000
         * level10:  153 000
         * level11:   76 000
         * level12:   38 000
         * level13:   19 000
         * */
        var level = 0;
        var prefix = "";
        var dataSource = null;

        if (height > 4892000) {
            level = 0;
            prefix = "country_";
            dataSource = WebGIS._countryDataSource;
            WebGIS._countryDataSource.show = true;
            WebGIS._provincialDataSource.show = false;
            WebGIS._cityDataSource.show = false;
            if (WebGIS._countryDataCount == WebGIS._countryDataSource.entities.values.length) return;
        } else if (height >= 2446000) {
            level = 1;
            prefix = "provincial_";
            dataSource = WebGIS._provincialDataSource;
            WebGIS._countryDataSource.show = false;
            WebGIS._provincialDataSource.show = true;
            WebGIS._cityDataSource.show = false;
            if (WebGIS._provincialDataCount == WebGIS._provincialDataSource.entities.values.length) return;
        } else {
            level = 2;
            prefix = "city_";
            dataSource = WebGIS._cityDataSource;
            WebGIS._countryDataSource.show = false;
            WebGIS._provincialDataSource.show = false;
            WebGIS._cityDataSource.show = true;
            if (WebGIS._cityDataCount == WebGIS._cityDataSource.entities.values.length) return;
        }

        var url = WebGIS._sourceURL + "/DataAccess?n=" + north + "&&e=" + east + "&&w=" + west + "&&s=" + south + "&&l=" + level;
        console.log(url);
        Axios.get(url).then(obj => {
                if (!obj.data || obj.data.length == 0) return;
                if (level == 0)
                    WebGIS._countryDataCount = obj.levelCount;
                else if (level == 1)
                    WebGIS._provincialDataCount = obj.levelCount;
                else if (level == 2)
                    WebGIS._cityDataCount = obj.levelCount;

                for (var i = 0; i < obj.data.length; i++) {
                    var name = prefix + obj.data[i].gid;
                    if (dataSource.entities.getById(name) != undefined) continue;
                    dataSource.entities.add({
                        id: name,
                        name: name,
                        position: Cesium.Cartesian3.fromDegrees(obj.data[i].longitude, obj.data[i].latitude),
                        point: {
                            pixelSize: 5,
                            color: Cesium.Color.RED,
                        },
                        label: {
                            text: obj.data[i].text,
                            font: "16px sans-serif",
                            fillColor: Cesium.Color.fromBytes(255, 255, 128, 255),
                            style: Cesium.LabelStyle.FILL,
                            outlineWidth: 1.0,
                            pixelOffset: new Cesium.Cartesian2(0, -20)
                        }
                    });
                }
            },
            error => {
                console.log(error);
            })
    },

    _cameraMoveEnd: function(obj) {
        var rect = WebGIS._camera.computeViewRectangle(WebGIS._ellipsoid);
        if (rect == undefined) return;
        var north = Cesium.Math.toDegrees(rect.north); //北
        var east = Cesium.Math.toDegrees(rect.east); //东
        var west = Cesium.Math.toDegrees(rect.west); //西
        var south = Cesium.Math.toDegrees(rect.south); //南			
        var height = Math.ceil(WebGIS._camera.positionCartographic.height);
        if (WebGIS._zoomCallback) {
            let level = WebGIS._getHeightToLevel(height);
            WebGIS._zoomCallback({ level: level, height: height });
        }
        // WebGIS._loadData(north,east, west, south, height);
    },

    _canvasClick: function(obj) {
        if (WebGIS._isMarkState && WebGIS._markPointStyle != null) {
            //直角坐标
            var cartesianPosition = WebGIS._camera.pickEllipsoid(obj.position, WebGIS._ellipsoid);
            if (cartesianPosition) {
                var cartographicPosition = WebGIS._ellipsoid.cartesianToCartographic(cartesianPosition);
                var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
                var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
                WebGIS._viewer.entities.removeById("MARK_POINT");
                WebGIS._viewer.entities.add({
                    id: "MARK_POINT",
                    name: "MARK_POINT",
                    position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
                    billboard: {
                        image: WebGIS._markPointStyle.imageURL,
                        scale: 0.7,
                        rotation: 0
                    }
                });
                if (WebGIS._markCallback != null) WebGIS._markCallback(longitude, latitude);
            }
        } //end if
        else if (WebGIS._mouseClickCallback != null) {
            var position = obj.position;
            var pick = WebGIS._viewer.scene.pick(position);
            if (pick && pick.id) {
                // var cartographic = WebGIS._getCartographic(position); // 获取镜头高度
                var entity = pick.id;
                var id = entity.id;
                var temp = id.substr(0, 2);
                if (temp == "p_") { //点类型				
                    var pointInfo = WebGIS._pointInfos.get(id).clone();
                    WebGIS._mouseClickCallback(pointInfo);
                    pointInfo = null;
                } else if (temp == "l_") { //线类型
                    var lineInfo = WebGIS._lineInfos.get(id).clone();
                    WebGIS._mouseClickCallback(lineInfo);
                    lineInfo = null;
                }
            }
        } //end else if
    },

    _canvasMove: function(obj) {
        var position = obj.endPosition;
        var pick = WebGIS._viewer.scene.pick(position);
        if (Cesium.defined(pick) && pick.id) { //hover point
            WebGIS.currentEntity = pick.id;
            //WebGIS.currentEntity.billboard.scale = 1;
            WebGIS.currentEntity.label.show = true;
            document.body.style.cursor = 'pointer';
            WebGIS.currentEntity.billboard.image = WebGIS.currentEntity.pointStyle.hoverImage
            WebGIS.currentEntity.label.fillColor = WebGIS.currentEntity.pointStyle.hoverColor
        } else {
            //if (WebGIS.currentEntity && WebGIS.currentEntity.billboard.scale._value === 1) {
            if (WebGIS.currentEntity) {
                //WebGIS.currentEntity.billboard.scale = 0.8;
                WebGIS.currentEntity.label.show = false;
                WebGIS.currentEntity.billboard.image = WebGIS.currentEntity.pointStyle.defaultImage
                WebGIS.currentEntity.label.fillColor = WebGIS.currentEntity.pointStyle.defaultColor
            }
            document.body.style.cursor = 'default';
        }
    },

    init: function(divID, sourceURL, defaultLongitude, defaultLatitude, defaultHeight) {
        document.getElementById(divID).className = "cesiumContainer";
        WebGIS._sourceURL = sourceURL;
        WebGIS._viewer = new Cesium.Viewer(divID, {
            animation: false, // 隐藏时钟
            baseLayerPicker: false, // 隐藏图层管理
            fullscreenButton: false, // 隐藏全屏
            vrButton: false,
            geocoder: false, // 隐藏搜索
            homeButton: false, // 隐藏主页
            infoBox: false, // 隐藏点击entity 信息框
            scenceModePicker: false, // 隐藏二三维切换
            selectionIndicator: false,
            timeline: false, // 隐藏时间轴
            navigationHelpButton: false, // 隐藏帮助按钮
            navigationInstructionsInitiallyVisible: false,
            scene3DOnly: false,
            // sceneMode : Cesium.SceneMode.SCENE2D,//初始场景模式 为二维
        });
        WebGIS._viewer._cesiumWidget._creditContainer.style.display = 'none'; // 去除版权信息
        WebGIS._viewer.imageryLayers.removeAll();
        WebGIS._viewer.imageryLayers.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
            url: sourceURL,
            credit: "Hello world..."
        }));
        WebGIS._canvas = WebGIS._viewer.canvas;
        WebGIS._camera = WebGIS._viewer.scene.camera;
        WebGIS._entities = WebGIS._viewer.entities;
        WebGIS._ellipsoid = WebGIS._viewer.scene.globe.ellipsoid;
        //117, 40.3, 18000000.0
        WebGIS._camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(defaultLongitude, defaultLatitude, defaultHeight),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0),
                roll: 0
            }
        });

        WebGIS._countryDataSource = new Cesium.CustomDataSource("country");
        WebGIS._viewer.dataSources.add(WebGIS._countryDataSource);
        WebGIS._countryDataSource.show = false;
        WebGIS._provincialDataSource = new Cesium.CustomDataSource("provincial");
        WebGIS._viewer.dataSources.add(WebGIS._provincialDataSource);
        WebGIS._provincialDataSource.show = false;
        WebGIS._cityDataSource = new Cesium.CustomDataSource("city");
        WebGIS._viewer.dataSources.add(WebGIS._cityDataSource);
        WebGIS._cityDataSource.show = false;
        WebGIS._customDataSource = new Cesium.CustomDataSource("XTXK");
        WebGIS._viewer.dataSources.add(WebGIS._customDataSource);
        //镜头移动事件
        WebGIS._camera.moveEnd.addEventListener(WebGIS._cameraMoveEnd);
        //		WebGIS._camera.changed.addEventListener(function(obj){
        //			console.log("changed");
        //			var height = Math.ceil(WebGIS._camera.positionCartographic.height);
        //			console.log(height);
        //		});		
        //画布操作时间
        var handler = new Cesium.ScreenSpaceEventHandler(WebGIS._canvas);
        handler.setInputAction(WebGIS._canvasClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(WebGIS._canvasMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    },

    drawPoint: function(pointInfo, pointStyle, pointHoverStyle) {
        if(!WebGIS._customDataSource) return;
        var key = "p_" + pointInfo.id;
        WebGIS._customDataSource.entities.add({
            id: key,
            name: pointInfo.name,
            position: Cesium.Cartesian3.fromDegrees(pointInfo.longitude, pointInfo.latitude),
            billboard: {
                image: pointStyle.imageURL,
                scale: 0.8,
                rotation: 0
            },
            label: {
                text: pointInfo.name,
                font: '12pt',
                //fillColor: Cesium.Color.fromBytes(255, 255, 128, 255),
                fillColor: Cesium.Color.fromBytes(0, 245, 235, 255),
                pixelOffset: new Cesium.Cartesian2(0, -20),
                show: false
            },
            pointStyle: {
                defaultColor: Cesium.Color.fromBytes(0, 245, 235, 255),
                hoverColor: Cesium.Color.fromBytes(255, 213, 0, 255),
                defaultImage: pointStyle.imageURL,
                hoverImage: pointHoverStyle.imageURL
            },
        });
        //保存标注点信息
        WebGIS._pointInfos.set(key, pointInfo.clone());
    },

    drawLine: function(lineInfo, lineStyle) {
        if(!WebGIS._customDataSource) return;
        var key = "l_" + lineInfo.id;
        WebGIS._customDataSource.entities.add({
            id: key,
            name: key,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([lineInfo.longitudeStart, lineInfo.latitudeStart, lineInfo.longitudeEnd, lineInfo.latitudeEnd]),
                width: lineStyle.width,
                material: Cesium.Color.fromBytes(lineStyle.colorR, lineStyle.colorG, lineStyle.colorB, lineStyle.colorA)
            }
        });
        //保存标注线信息
        WebGIS._lineInfos.set(key, lineInfo);
    },

    changePointStyle: function(pointId, pointStyle) {
        if(!WebGIS._customDataSource) return;
        var key = "p_" + pointId;
        var entity = WebGIS._customDataSource.entities.getById(key);
        if (entity == undefined) return;
        entity.billboard.image = pointStyle.imageURL;
        //0613 dj 鼠标hover后移开 显示
        entity.pointStyle.defaultImage = pointStyle.imageURL;
    },

    changeLineStyle: function(lineId, lineStyle) {
        if(!WebGIS._customDataSource) return;
        var key = "l_" + lineId;
        var entity = WebGIS._customDataSource.entities.getById(key);
        if (entity == undefined) return;
        entity.polyline.width = lineStyle.width;
        entity.polyline.material = Cesium.Color.fromBytes(lineStyle.colorR, lineStyle.colorG, lineStyle.colorB, lineStyle.colorA);
    },

    setMarkStyle: function(pointStyle) {
        WebGIS._markPointStyle = pointStyle.clone();
    },

    setMarkEvent: function(callback) {
        WebGIS._markCallback = callback;
    },

    beginMark: function() {
        WebGIS._isMarkState = true;
        WebGIS._viewer.entities.removeById("MARK_POINT");
    },

    endMark: function() {
        WebGIS._isMarkState = false;
        WebGIS._viewer.entities.removeById("MARK_POINT");
    },

    removePointById: function(pointId) {
        var key = "p_" + pointId;
        var pointInfo = WebGIS._pointInfos.get(key);
        if (pointInfo != undefined) {
            WebGIS._customDataSource.entities.removeById(key);
            WebGIS._pointInfos.remove(key);
        } //end if
    },

    removeLineById: function(lineId) {
        var key = "l_" + pointId;
        var lineInfo = WebGIS._lineInfos.get(key);
        if (lineInfo != undefined) {
            WebGIS._customDataSource.entities.removeById(key);
            WebGIS._lineInfos.remove(key);
        } //end if
    },

    removeAll: function() {
        WebGIS._customDataSource.entities.removeAll();
        WebGIS._pointInfos.clear();
        WebGIS._lineInfos.clear();
    },

    //	setMouseHoverEvent : function(callback){ },

    setMouseClickEvent: function(callback) {
        WebGIS._mouseClickCallback = callback;
    },

    // setPointLongitudeLatitudeEvent: function(callback) {
    // 	WebGIS._pointLongitudeLatitudeCallback = callback;
    // },

    //	setMouseDoubleClickEvent : function(callback){
    //		WebGIS._mouseDoubleClickCallback = callback;
    //	},

    flyTo: function(longitude, latitude) {
        var height = Math.ceil(WebGIS._camera.positionCartographic.height);
        WebGIS._camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
            duration: 1,
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0),
                roll: 0
            }
        });
    },
    /* 将镜头高度转为级别
     * level3: 19568 000
     * level4:  9784 000
     * level5:  4892 000
     * level6:  2446 000
     * level7:  1223 000
     * level8:   611 000
     * level9:   306 000
     * level10:  153 000
     * level11:   76 000
     * level12:   38 000
     * level13:   19 000
     * */
    _getHeightToLevel: function(height) {
        if (height > 4892000) {
            return 0;
        } else if (height >= 2446000) {
            return 1;
        } else if (height >= 1223000) {
            return 2;
        } else if (height >= 611000) {
            return 3;
        } else if (height >= 306000) {
            return 4;
        } else if (height >= 153000) {
            return 5;
        } else {
            return 6;
        }
    },
    _getLevelToHeight(level) {
        switch (level) {
            case 0:
                return 4892000;
            case 1:
                return 2446000;
            case 2:
                return 1223000;
            case 3:
                return 611000;
            case 4:
                return 306000;
            case 5:
                return 153000;
            case 6:
                return 76000;
        }
    },
    // 获取经纬度
    _getCartographic: function(position) {
        let cartographic = WebGIS._viewer.scene.globe.ellipsoid.cartesianToCartographic(position);
        let point = { longitude: Cesium.Math.toDegrees(cartographic.longitude), latitude: Cesium.Math.toDegrees(cartographic.latitude), height: cartographic.height };
        return point;
    },
    // 地图缩放级别反馈
    setZoomCallback: function(callback) {
        WebGIS._zoomCallback = callback;
    },
    setZoom: function(level) {
        let height = WebGIS._getLevelToHeight(level);
        let position = WebGIS._camera.position;
        let point = WebGIS._getCartographic(position);
        WebGIS._camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, height),
            duration: 1.0
        });
    },
    flyToCartographic: function(cartographic) {
        WebGIS._camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(cartographic.longitude, cartographic.latitude, cartographic.height),
            duration: 1.0
        });
    }
}
export { WebGIS, PointInfo, PointStyle, LineInfo, LineStyle }