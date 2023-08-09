import React from "react"
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { DataTypeEnum } from "../dataSelectTab/dataStorage"

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition])

export default class UniDataChart extends React.Component {
  myMap = null;

  top1000UniData = [];
  top100UniData = [];

  mapOptions = {
    title: {
      left: 80,
      bottom: 15,
      text: '国家优秀大学数目变化图',
      textStyle: {
        color: "rgba(144, 70, 70, 1)",
        fontSize: 16,
        fontWeight: "normal",
        fontFamily: "Arial"
      }
    },
    legend: {
      data: ['top100大学', 'top1000大学'],
      right: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      textStyle: {
        align: 'left'
      }
    },
    toolbox: {
      show: true,
      orient: 'horizontal',
      left: 0,
      top: 0,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
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
        name: 'top100大学',
        min: 0,
        position: 'right',
      },
      {
        type: 'value',
        name: 'top1000大学',
        min: 0,
        position: 'left',
      }
    ],
    series: [
      {
        name: 'top100大学',
        type: 'line',
        barGap: 0,
        yAxisIndex: 0,
        emphasis: {
          focus: 'series'
        },
        data: this.top100UniData,
      },
      {
        name: 'top1000大学',
        type: 'line',
        yAxisIndex: 1,
        emphasis: {
          focus: 'series'
        },
        data: this.top1000UniData,
      }
    ]
  };

  componentDidMount () {

    const container = document.getElementById("UniDataChart")
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
        this.top100UniData[q - 2012] = 0
        this.top1000UniData[q - 2012] = 0
      } else {
        this.top100UniData[q - 2012] = countryData[q].dataList[DataTypeEnum.GoodUni].data
        this.top1000UniData[q - 2012] = countryData[q].dataList[DataTypeEnum.GoodUni1k].data
      }
    }

    this.myMap.setOption(this.mapOptions, true)
  }

  getStyleClass = () => {
    return "hoverChart hoverTopLeftChart" + ((this.props.shouldDisplay()) ? " hoverChartActive" : "")
  }
  render () {
    return (<div className={this.getStyleClass()} id="UniDataChart">
    </div>)
  }
}