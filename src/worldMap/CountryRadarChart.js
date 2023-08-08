import React from "react"
import * as echarts from 'echarts/core'
import { TitleComponent, LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer])

export default class CountryRadarChart extends React.Component {
  myMap = null;

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
        { name: 'GDP', max: 6500 },
        { name: '优质大学资源', max: 16000 },
        { name: '人均教育支出', max: 30000 },
        { name: '入学率', max: 38000 },
        { name: '毛入学率', max: 52000 },
        { name: '不知道', max: 25000 }
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
            value: [4200, 3000, 20000, 35000, 50000, 18000],
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

  getStyleClass = () => {
    return "hoverChart hoverRatarChart" + ((this.props.shouldDisplay()) ? " hoverChartActive" : "")
  }
  render () {
    return (<div className={this.getStyleClass()} id="CountryRadarChart">
    </div>)
  }
}