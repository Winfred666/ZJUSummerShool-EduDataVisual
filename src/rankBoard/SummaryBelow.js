import React from "react"
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

export default class SummaryPie extends React.Component {
  myMap = null;

  mapOptions = {
    title: {
      text: '联合国五常数据汇总图',
      left: 'center',
      textStyle: {
        color: '#004c78',
        fontWeight: 'normal',
        fontSize: 16,
        height: 20,
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'left'
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: []
      }
    ]
  };

  componentDidMount () {
    const container = document.getElementById("SummaryPie");
    this.myMap = echarts.init(container);
    this.myMap.setOption(this.mapOptions,true);
  }

  componentDidUpdate () {
    const countryData = this.props.getDataByYear();
    let data =[];
    for(let one of countryData){
      if(["CHN","USA","GBR","RUS","FRA"].includes(one.country)){
        data.push(one);
        if(data.length>=5) break;
      }
    }
    this.mapOptions.series[0].data = data;
    this.myMap.setOption(this.mapOptions,true)
  }

  render () {
    return (<div className='SummaryPie' id="SummaryPie">
    </div>)
  }
}