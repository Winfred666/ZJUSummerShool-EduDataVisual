import React from "react";
import * as echarts from 'echarts';
import {MapChart} from "echarts/charts";
import worldGeo from "@surbowl/world-geo-json-zh";


echarts.use([MapChart]);

export default class WorldMap extends React.Component{
    //存储地图对象
    myMap=null;
    //存储所需数据的引用
    countryData=null;
    
    constructor(props){
        super(props);
    }

    //已经commit，使用DOM初始化地图
    componentDidMount(){
        const mapName="world";
        const MapContainer=document.getElementById("worldMapCore");
        this.myMap=echarts.init(MapContainer);
        
        echarts.registerMap(mapName,worldGeo);
        const option={
            backgroundColor: '#f7fcff',
            visualMap: {
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                  color: ['lightskyblue', 'yellow', 'orangered']
                }
              },
            geo: {
                type: 'map',
                map: mapName, //'world'
                roam: true,
                geoIndex: 1,
                zoom: 1.1,  //地图的比例
                label: {
                normal: {
                    show: true,
                    textStyle: {
                    color: '#000000'  //字体颜色
                    }
                },
                emphasis: {
                    textStyle: {
                    color: '#000000'  //选中后的字体颜色
                    }
                }
                },
                itemStyle: {
                normal: {
                    borderWidth: 1,
                    areaColor: '#EEEEEE',//区域颜色
                    borderColor: '#111111',//边框颜色
                },
                emphasis: {
                    areaColor: '#ffffff',
                }
                },
            },
        }
        this.myMap.setOption(option,true);
        window.addEventListener("resize",this.resizeWindow);
    }

    //随窗口变化做出的响应
    resizeWindow=()=>{
        const mapDOM=document.getElementById("worldMapCore");
        this.myMap.resize({width:mapDOM.width,height:mapDOM.height});
    }

    render(){
        return (<div className="worldMap">
            <div id="worldMapCore" 
            style={{width:"100%",height:"100%",position:"absolute"}}
            ></div>
            <div className="normalTitle" style={{
                position:"absolute",
                left:"50%",
                transform: "translate(-50%, 0)",
                PointerEvent:"none"}}>世界主要国家</div>
            
        </div>);
    }
}