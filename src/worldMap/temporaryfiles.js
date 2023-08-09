import React from "react"
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition])

export default class AllYearsUniChart extends React.Component {
  myMap = null;

  mapOptions = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ],
  };

  componentDidMount () {
    const container = document.getElementById("AllYearsUniChart")
    this.myMap = echarts.init(container)
    this.myMap.setOption(this.mapOptions)
  }

  render () {
    return (<div style={{ opacity: ((this.props.shouldDisplay) ? 1 : 1) }}
      className="hoverChart hoverTopLeftChart" id="AllYearsUniChart">
    </div>)
  }
}








// tooltip: {
//   trigger: 'axis',
//   axisPointer: { type: 'cross' }
// },
// legend: {},
// title: {
//   left: 40,
//   bottom: 15,
//   text: '国家各年GDP与优质高校资源变化图',
//   textStyle: {
//     color: "rgba(144, 70, 70, 1)",
//     fontSize: 16,
//     fontWeight: "normal",
//     fontFamily: "Arial"
//   }
// },
// xAxis: [
//   {
//     type: 'category',
//     axisTick: {
//       alignWithLabel: true
//     },
//     data: [
//       '2012',
//       '2013',
//       '2014',
//       '2015',
//       '2016',
//       '2017',
//       '2018',
//       '2019',
//       '2020',
//       '2021',
//       '2022',
//     ]
//   }
// ],
// yAxis: [
//   {
//     type: 'value',
//     name: '上榜大学数',
//     min: 0,
//     position: 'right',
//   },
//   {
//     type: 'value',
//     name: 'GDP',
//     min: 0,
//     position: 'left',
//   }
// ],
// series: [
//   {
//     name: '上榜大学数',
//     type: 'line',
//     yAxisIndex: 0,
//     data: this.allYearGoodUniData,
//   },
//   {
//     name: 'GDP',
//     type: 'line',
//     smooth: true,
//     yAxisIndex: 1,
//     data: this.allYearGDPData,
//   }
// ]