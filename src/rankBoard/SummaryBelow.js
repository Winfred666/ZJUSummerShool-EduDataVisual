import React from "react"
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { DataTypeEnum, TagAndUnitOfData } from "../dataSelectTab/dataStorage";
import { getVisualMapMax } from "../worldMap/WorldMap";

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

const ListOfFive=["美国","中国","俄罗斯","英国","法国"];
const ChartTypeEnum=Object.freeze({
  Pie:true,
  Bar:false,
});

export default class SummaryPie extends React.Component {
  myMap = null;
  curOptions=ChartTypeEnum.Pie;
  lastDataType=DataTypeEnum.GoodUni;
  mapOptions = {
    title: {
      text: '联合国五常数据概览',
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
      orient:"horizontal",
      bottom: 0,
      itemGap: 8,
      itemWidth:18,
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
        data: [],
        universalTransition:{
          enabled:true,
        }
      }
    ]
  };

  barOptions={
    xAxis: {
      type: 'category',
      data: ListOfFive,
      axisLabel:{
        show:true,
        interval:0,
      },
      inverse: false,
      animationDuration: 500,
      animationDurationUpdate: 300,
    },
    grid:{
      x:60,
    },

    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: {
      type:"value",
      nameTextStyle:{
        color: '#004c78',
        fontWeight: 'normal',
        fontSize: 16,
        height: 20,
        align:"left",
      }
    },
    series: [
      {
        realtimeSort: true,
        type: 'bar',
        id: 'total',
        data: [],
        universalTransition: {
          enabled: true,
        },
      }
    ],
    animationDuration: 500,
    animationDurationUpdate: 300,
    animationEasing: 'backOut',
    animationEasingUpdate: 'quintOut'
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
      if(!one) continue;
      if(["CHN","USA","GBR","RUS","FRA"].includes(one.country)){
        data.push(one);
        if(data.length>=5) break;
      }
    }

    let finalOptions=null;
    if([DataTypeEnum.GoodUni,DataTypeEnum.GoodUni1k].includes(this.props.dataType)){
      finalOptions=this.mapOptions;
      finalOptions.series[0].data = data;
      this.curOptions=ChartTypeEnum.Pie;
      this.myMap.setOption(finalOptions,true)
    }else{
      finalOptions=this.barOptions;
      finalOptions.yAxis.name=TagAndUnitOfData[this.props.dataType].tag+"/"+TagAndUnitOfData[this.props.dataType].unit;
      if(this.props.dataType===DataTypeEnum.GDP) finalOptions.yAxis.max=210000;
      else finalOptions.yAxis.max=getVisualMapMax(data[0].value);
      //transform data source.
      let tempArr=[];
      for(let chi of ListOfFive){
        const index=data.findIndex((piece)=>{return piece.name===chi});
        if(index===-1) tempArr.push(0);
        else tempArr.push(data[index].value);
      }
      finalOptions.series[0].data = tempArr;

      //如果已经是柱状图并且是同一类数据，则部分更新数据，实现动态排名
      if(this.curOptions===ChartTypeEnum.Bar && this.lastDataType===this.props.dataType)
        this.myMap.setOption({
          series:finalOptions.series
        },false);
      else
        this.myMap.setOption(finalOptions,true);
      this.curOptions=ChartTypeEnum.Bar;
    }
    this.lastDataType=this.props.dataType;
  }

  render () {
    return (<div className='SummaryPie' id="SummaryPie">
    </div>)
  }
}