import React from "react";
import * as echarts from 'echarts';
import {MapChart} from "echarts/charts";
import worldGeo from "@surbowl/world-geo-json-zh";
import AllYearsUniChart from "./AllYearsUniChart";


echarts.use([MapChart]);

const mapName="world";

export default class WorldMap extends React.Component{
    //存储地图对象
    myMap=null;
    //存储所需数据的引用
    countryData=null;
    
    //存储地图状态，非受控组件
    mapOptions={
        backgroundColor: '#f7fcff',
        visualMap: {
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
              color: ['lightskyblue', 'yellow', 'orangered']
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params)=>{
                if(params.data!==undefined){
                    return `${params.name}<br /> 第${params.data.rank}名 `
                }
                return `${params.name} <br /> 未上榜`;
            }
        },
        itemStyle: {
        normal: {
            borderWidth: 0.3,
            areaColor: '#EEEEEE',//区域颜色
            borderColor: '#666666',//边框颜色
        },
        emphasis: {
            areaColor: '#ffffff',
        }
        },
        toolbox:{

        },
        series:[{
                type: 'map',
                map: mapName, //'world'
                mapType: "world",
                roam: false,
                geoIndex: 1,
                zoom: 1.1,  //地图的比例
                label:{
                    show:false
                },
                data: [],
            }
        ],
    };

    //已经commit，使用DOM初始化地图
    componentDidMount(){
        const MapContainer=document.getElementById("worldMapCore");
        this.myMap=echarts.init(MapContainer);
        echarts.registerMap(mapName,worldGeo);
        
        this.mapOptions.series[0].data=this.props.getDataSource();
        this.myMap.setOption(this.mapOptions,false,false);

        window.addEventListener("resize",this.resizeWindow);
    }
    
    componentDidUpdate(){
        //更新数据
        this.mapOptions.series[0].data=this.props.getDataSource();
        this.myMap.setOption(this.mapOptions,false,false);
    }

    //随窗口变化做出的响应
    resizeWindow=()=>{
        const mapDOM=document.getElementById("worldMapCore");
        this.myMap.resize({width:mapDOM.width,height:mapDOM.height});
    }

    //国家点击响应
    clickHandler=(country)=>{
        
    }

    getHoverMapDisplay=()=>{
        return (this.props.curYear===null)?false : true;
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
                PointerEvent:"none"}}>
                世界主要国家
            </div>
            <AllYearsUniChart shouldDisplay={this.getHoverMapDisplay}>
                
            </AllYearsUniChart>
        </div>);
    }
}