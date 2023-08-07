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
        max: 250,
        position: 'right',
      },
      {
        type: 'value',
        name: 'GDP',
        min: 0,
        max: 1800,
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
    this.myMap.setOption(this.mapOptions)
  }

  componentDidUpdate () {
    const countryData = this.props.getDataByCountry()
    for (let q = 2012; q <= 2022; q++) {

      this.allYearGoodUniData[q - 2012] = countryData[q].dataList[DataTypeEnum.GoodUni]

    }
  }

  render () {
    return (<div style={{ opacity: ((this.props.shouldDisplay) ? 1 : 0) }}
      className="hoverChart" id="AllYearsGDPChart">
    </div>)
  }
}