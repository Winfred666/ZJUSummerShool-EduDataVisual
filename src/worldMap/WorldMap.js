import React from "react"
import * as echarts from 'echarts'
import { MapChart } from "echarts/charts"
import worldGeo from "@surbowl/world-geo-json-zh"
import AllYearsUniChart from "./AllYearsUniChart"
import AllYearsGDPChart from "./AllYearsGDPChart"



echarts.use([MapChart])

const mapName = "world"

export default class WorldMap extends React.Component {
    //只用作本组件判断当前是否缩放，用于侦听改动。
    state = {
        selectCountry: null,
    }
    //存储地图对象
    myMap = null;
    //存储所需数据的引用
    countryData = null;

    //存储地图状态，非受控组件
    mapOptions = {
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
            formatter: (params) => {
                if (params.data !== undefined) {
                    return `${params.name}<br /> 第${params.data.rank}名 `
                }
                return `${params.name} <br /> 未上榜`
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
        toolbox: {

        },
        series: [{
            type: 'map',
            map: mapName, //'world'
            mapType: "world",
            roam: false,
            geoIndex: 1,
            zoom: 1.1,  //地图的比例
            label: {
                show: false
            },
            data: [],
        }
        ],
    };

    //已经commit，使用DOM初始化地图
    componentDidMount () {
        const MapContainer = document.getElementById("worldMapCore")
        this.myMap = echarts.init(MapContainer)
        echarts.registerMap(mapName, worldGeo)

        this.mapOptions.series[0].data = this.props.getDataSource()
        this.myMap.setOption(this.mapOptions, false, false)
        //添加窗口调整、点击的侦听器
        window.addEventListener("resize", this.resizeWindow)
        this.myMap.on("click", this.clickHandler)
    }

    componentDidUpdate () {
        //更新数据
        this.mapOptions.series[0].data = this.props.getDataSource()
        this.myMap.setOption(this.mapOptions, false, false)

        //检测是否需要更新国家聚焦
        if (this.props.selectCountry !== this.state.selectCountry) {
            //更新当前状态
            this.setState({ selectCountry: this.props.selectCountry })
            if (this.props.selectCountry === null) {
                //取消聚焦,变回原来世界地图大小
                this.mapOptions.series[0].center = undefined
                this.mapOptions.series[0].layoutCenter = undefined
                this.mapOptions.series[0].zoom = "1.1"
            } else {
                //实现聚焦,缩放至特定国家大小,模糊化,需要获取国家经纬度/中心点
                const pack = this.props.getCountryPackage(this.props.selectCountry)
                this.mapOptions.series[0].center = [pack.centerX, pack.centerY]
                this.mapOptions.series[0].layoutCenter = ["50%", "50%"]
                this.mapOptions.series[0].zoom = "8"
            }
            this.myMap.setOption(this.mapOptions, false, false)
        }
    }

    //随窗口变化做出的响应
    resizeWindow = () => {
        const mapDOM = document.getElementById("worldMapCore")
        this.myMap.resize({ width: mapDOM.width, height: mapDOM.height })
    }

    //国家点击响应
    clickHandler = (params) => {
        if (params.data !== undefined && this.props.selectCountry !== params.data.country) {
            this.props.setSelectCountry(params.data.country)
        } else {
            this.props.setSelectCountry(null)
        }
    }

    getHoverMapDisplay = () => {
        return (this.props.selectCountry === null) ? false : true
    }

    //将选中国家的全年数据传给子组件
    getSelectedCountryData = () => {
        if (!this.getHoverMapDisplay()) {
            return null
        } else {
            return (this.props.getDataByCountry(this.props.selectCountry))
        }
    }

    render () {
        return (<div className="worldMap">
            <div id="worldMapCore" className={(this.getHoverMapDisplay()) ? "fadedWorldMap" : ""}
                style={{ width: "100%", height: "100%", position: "absolute" }}
            ></div>
            <div className="normalTitle" style={{
                position: "absolute",
                left: "50%",
                transform: "translate(-50%, 0)",
                PointerEvent: "none"
            }}>
                世界主要国家
            </div>
            <AllYearsUniChart shouldDisplay={this.getHoverMapDisplay} getDataByCountry={this.getSelectedCountryData}>
            </AllYearsUniChart>
            <AllYearsGDPChart shouldDisplay={this.getHoverMapDisplay} getDataByCountry={this.props.getDataByCountry}>
            </AllYearsGDPChart>
        </div>)
    }
}