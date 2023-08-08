import React from "react"
import * as echarts from 'echarts'
import { MapChart } from "echarts/charts"
import worldGeo from "@surbowl/world-geo-json-zh"
import { FaultRank } from "../dataSelectTab/dataStorage"
import UniDataChart from "./UniDataChart"
import CountryRadarChart from "./CountryRadarChart"



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

    //地图是否在加载
    isLoading = false;

    //存储地图状态，非受控组件
    mapOptions = {
        backgroundColor: '#f7fcff',
        animation: true,
        visualMap: {
            text: ['High', 'Low'],
            realtime: true,
            calculable: true,
            min: 0,
            max: 200,
            inRange: {
                color: ['lightskyblue', 'yellow', 'orangered']
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                if (params.data !== undefined) {
                    return `国家:${params.name} <br />英文:${params.data.country} <br />
                    第${params.data.rank}名`
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
        const dataSource = this.props.getDataSource()
        this.mapOptions.series[0].data = dataSource
        this.myMap.setOption(this.mapOptions, false, false)

        //显示加载动画
        if (dataSource === null || dataSource.length === 0) {
            this.myMap.showLoading({
                text: "正在加载地图",
            })
            this.isLoading = true
        }

        //添加窗口调整、点击的侦听器
        window.addEventListener("resize", this.resizeWindow)
        this.myMap.on("click", this.clickHandler)
    }


    getVisualMapMax (max) {
        if (max < 100) return 100
        if (max >= 100 && max < 300) return 300
        else return 1000
    }

    componentDidUpdate () {
        //获取当年数据
        this.mapOptions.series[0].data = this.props.getDataSource()
        //在数据未完善时挂上loading，取消更新
        if (this.mapOptions.series[0].data[0] === undefined ||
            this.mapOptions.series[0].data[0].rank === FaultRank) {
            this.myMap.showLoading({
                text: "正在加载地图",
            })
            this.isLoading = true
            return
        }

        //判断取消loading
        if (this.isLoading) {
            this.myMap.hideLoading()
            this.isLoading = false
        }
        //调整最大值为向上进位
        this.mapOptions.visualMap.max = this.getVisualMapMax(
            parseFloat(this.mapOptions.series[0].data[0].value) + 2
        )

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
                this.mapOptions.series[0].zoom = "9"
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
        if (this.props.selectCountry === null) {
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

            <UniDataChart shouldDisplay={this.getHoverMapDisplay} getDataByCountry={this.getSelectedCountryData}>
            </UniDataChart>
            <CountryRadarChart shouldDisplay={this.getHoverMapDisplay} getDataByCountry={this.getSelectedCountryData}>
            </CountryRadarChart>
        </div>)
    }
}