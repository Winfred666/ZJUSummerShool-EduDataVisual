import React from "react"
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { DataTypeEnum } from "../dataSelectTab/dataStorage"

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition])

export default class AllYearsGDPChart extends React.Component {
  myMap = null;

  allYearGDPData = [];
  allYearGoodUniData = [];

  mapOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {},
    title: {
      left: 40,
      bottom: 15,
      text: '国家各年GDP与优质高校资源变化图',
      textStyle: {
        color: "rgba(144, 70, 70, 1)",
        fontSize: 16,
        fontWeight: "normal",
        fontFamily: "Arial"
      }
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: [
          '2012',
          '2013',
          '2014',
          '2015',
          '2016',
          '2017',
          '2018',
          '2019',
          '2020',
          '2021',
          '2022',
        ]
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '上榜大学数',
        min: 0,
        position: 'right',
      },
      {
        type: 'value',
        name: 'GDP',
        min: 0,
        position: 'left',
      }
    ],
    series: [
      {
        name: '上榜大学数',
        type: 'line',
        yAxisIndex: 0,
        data: this.allYearGoodUniData,
      },
      {
        name: 'GDP',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: this.allYearGDPData,
      }
    ]
  };

  componentDidMount () {

    const container = document.getElementById("AllYearsGDPChart")
    this.myMap = echarts.init(container)
    this.myMap.setOption(this.mapOptions, true)
  }

  componentDidUpdate () {
    const countryData = this.props.getDataByCountry()
    if (countryData === null) {
      return
    }
    for (let q = 2012; q <= 2022; q++) {
      if (countryData[q] === null || countryData[q] === undefined || countryData[q].dataList === null) {
        this.allYearGoodUniData[q - 2012] = 0
        this.allYearGDPData[q - 2012] = 0
      } else {
        this.allYearGoodUniData[q - 2012] = countryData[q].dataList[DataTypeEnum.GoodUni].data
        this.allYearGDPData[q - 2012] = countryData[q].dataList[DataTypeEnum.GDP].data
      }
    }

    this.myMap.setOption(this.mapOptions, true)
  }

  getStyleClass = () => {
    return "hoverChart hoverTopLeftChart" + ((this.props.shouldDisplay()) ? " hoverChartActive" : "")
  }
  render () {
    return (<div className={this.getStyleClass()} id="AllYearsGDPChart">
    </div>)
  }
}