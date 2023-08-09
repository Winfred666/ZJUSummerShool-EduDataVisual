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

function conversion (rank) {
  return round((65 - rank) / 65, 3)
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
        { name: 'GDP', max: 250000 },
        { name: 'top100大学', max: 1 },
        { name: 'top1000大学', max: 1 },
        { name: '人均教育支出(%)', max: 15 },
        { name: '中学入学率(%)', max: 120 },
        { name: '大学入学率(%)', max: 120 }
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
      this.countryData[0] = countryData[2020].dataList[DataTypeEnum.GDP].data
      this.countryData[1] = countryData[2020].dataList[DataTypeEnum.GoodUni].rank > 65 ? 0 : conversion(countryData[2020].dataList[DataTypeEnum.GoodUni].rank)
      this.countryData[2] = countryData[2020].dataList[DataTypeEnum.GoodUni1k].rank > 65 ? 0 : conversion(countryData[2020].dataList[DataTypeEnum.GoodUni1k].rank)
      this.countryData[3] = countryData[2020].dataList[DataTypeEnum.EduOfGDP].data > 15 ? 15 : countryData[2020].dataList[DataTypeEnum.EduOfGDP].data
      this.countryData[4] = countryData[2020].dataList[DataTypeEnum.MiddleEnroll].data
      this.countryData[5] = countryData[2020].dataList[DataTypeEnum.CollegeEnroll].data
    }

    this.myMap.setOption(this.mapOptions, true)
  }

  getStyleClass = () => {
    return "hoverChart hoverRatarChart" + ((this.props.shouldDisplay()) ? " hoverChartActive" : "")
  }
  render () {
    return (<div className={this.getStyleClass()} id="CountryRadarChart">
    </div>)
  }
}