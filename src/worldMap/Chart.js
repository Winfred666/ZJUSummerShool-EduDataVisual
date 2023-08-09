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