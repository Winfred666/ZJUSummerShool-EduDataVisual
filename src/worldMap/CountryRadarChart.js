import React from "react"
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { DataTypeEnum } from "../dataSelectTab/dataStorage"


echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer])

export default class CountryRadarChart extends React.Component {
  myMap = null;

  countryData = [0, 0, 0, 35000, 0, 18000];

  mapOptions = {
    title: {
      left: 10,
      top: 0,
      text: '国家经济教育状况',
      textStyle: {
        color: "rgba(144, 70, 70, 1)",
        fontSize: 16,
        fontWeight: "normal",
        fontFamily: "Arial"
      }
    },
    tooltip: {},
    legend: {
      data: ['country data']
    },
    radar: {
      indicator: [
        { name: 'GDP' },
        { name: 'top100大学' },
        { name: 'top1000大学' },
        { name: '人均教育支出', max: 30000 },
        { name: '入学率' },
        { name: '毛入学率', max: 52000 }
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
      this.countryData[1] = countryData[2020].dataList[DataTypeEnum.GoodUni].data
      this.countryData[2] = countryData[2020].dataList[DataTypeEnum.GoodUni1k].data
      this.countryData[4] = countryData[2020].dataList[DataTypeEnum.Enroll].data
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