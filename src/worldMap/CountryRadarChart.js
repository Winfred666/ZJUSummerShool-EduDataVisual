import React from "react"
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { DataTypeEnum } from "../dataSelectTab/dataStorage"

echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer])

function round (number, precision) {
  return Math.round(+number + "e" + precision) / Math.pow(10, precision)
}

function Rankconversion (rank, range) {
  return round((range - rank) / range * 10, 2)
}

function conversion (data, range) {
  return round(data / range * 10, 2)
}

export default class CountryRadarChart extends React.Component {
  myMap = null;

  countryData = [0, 0, 0, 0, 18000, 18000];

  mapOptions = {
    title: {
      left: -6,
      top: 13,
      text: '2020国家经济教育状况',
      textStyle: {
        color: "rgba(144, 70, 70, 1)",
        fontSize: 16,
        fontWeight: "normal",
        fontFamily: "Arial"
      }
    },
    tooltip: {
      trigger: 'item',
      position: [230, 10],
      textStyle: {
        align: 'left'
      }
    },
    legend: {
      data: ['country data']
    },
    radar: {
      indicator: [
        { name: 'GDP', min: -3, max: 10 },
        { name: 'top100大学', min: -3, max: 10 },
        { name: 'top1000大学', min: -3, max: 10 },
        { name: '人均教育支出(%)', min: -3, max: 10 },
        { name: '中学毛入学率(%)', min: -3, max: 10 },
        { name: '大学毛入学率(%)', min: -3, max: 10 }
      ],
      axisName: {
        color: "rgba(27, 26, 26, 1)"
      }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: this.countryData
          },
        ]
      }
    ]
  };

  componentDidMount () {
    const container = document.getElementById("CountryRadarChart")
    this.myMap = echarts.init(container)
    this.myMap.setOption(this.mapOptions, true)
  }

  componentDidUpdate () {
    const countryData = this.props.getDataByCountry()

    if (countryData === null) {
      return
    }
    if (countryData[2020] === null || countryData[2020] === undefined || countryData[2020].dataList === null) {
      this.countryData[1] = 0
      this.countryData[2] = 0
    } else {
      this.countryData[0] = countryData[2020].dataList[DataTypeEnum.GDP].data > 50000 ? 10 : conversion(countryData[2020].dataList[DataTypeEnum.GDP].data, 50000)
      this.countryData[1] = countryData[2020].dataList[DataTypeEnum.GoodUni].rank > 65 ? 0.5 : Rankconversion(countryData[2020].dataList[DataTypeEnum.GoodUni].rank, 65)
      this.countryData[2] = countryData[2020].dataList[DataTypeEnum.GoodUni1k].rank > 65 ? 0.5 : Rankconversion(countryData[2020].dataList[DataTypeEnum.GoodUni1k].rank, 65)
      this.countryData[3] = countryData[2020].dataList[DataTypeEnum.EduOfGDP].data > 15 ? 10 : conversion(countryData[2020].dataList[DataTypeEnum.EduOfGDP].data, 15)
      this.countryData[4] = conversion(countryData[2020].dataList[DataTypeEnum.MiddleEnroll].data, 160)
      this.countryData[5] = conversion(countryData[2020].dataList[DataTypeEnum.CollegeEnroll].data, 160)
    }

    this.myMap.setOption(this.mapOptions, true)
  }

  getStyleClass = () => {
    return "hoverChart hoverRadarChart" + ((this.props.shouldDisplay()) ? " hoverChartActive" : "")
  }
  render () {
    return (<div className={this.getStyleClass()} id="CountryRadarChart">
    </div>)
  }
}