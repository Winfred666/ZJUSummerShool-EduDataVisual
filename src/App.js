import React,{Component} from "react";
import DataSelectTab from "./dataSelectTab/DataSelectTab";
import RankBoard from "./rankBoard/RankBoard";
import TimeLine from "./timeLine/TimeLine";
import WorldMap from "./worldMap/WorldMap";

import "antd/dist/reset.css";
import { ConfigProvider,theme} from "antd";
import DataStorage, { DataTypeEnum } from "./dataSelectTab/dataStorage";



//App中具有dataStorage
//作为父组件，给四大板块组件分发data
//接收四大板块的更改信息
export default class App extends Component{
    state=null
    constructor(props){
        super(props);
        //初始化数据
        const dataSet=new DataStorage(this.renewDataSet);
        this.state={
            dataSet:dataSet,
            curDataType:DataTypeEnum.GoodUni,
            curYear:dataSet.startYear,
            displayTop:100,
            selectCountry:null,
        }
    }
    renewDataSet=(newDataSet)=>{
        this.setState({dataSet:newDataSet});
    }

    getCurYearData=()=>{
        return this.state.dataSet.getDataByYear(
            this.state.curYear,this.state.curDataType
        );
    }
    
    setCurYear=(year)=>{
        this.setState({curYear:year});
    }

    setDisplayTop=(percent)=>{
        this.setState({displayTop:percent});
    }

    //if country===null, then go back to WorldMap mode, else ZoneIn to that country.
    setSelectCountry=(country)=>{
        this.setState({selectCountry:country});
    }

    setDataType=(dataType)=>{
        const dataSet=this.state.dataSet;
        switch(dataType){
            case DataTypeEnum.GoodUni1k:
                dataSet.startYear=2014;
                dataSet.endYear=2023;
                if(this.state.curYear<2014){
                    this.setState({curYear:2014});
                }
                break;
            case DataTypeEnum.GoodUni:
                dataSet.startYear=2012;
                dataSet.endYear=2023;
                break;
            default:
                dataSet.startYear=2012;
                dataSet.endYear=2022;
                break;
        };
        this.setState({curDataType:dataType,dataSet:dataSet});
    }

    render(){
        return(
            <div className="gridMother">
                 <ConfigProvider
                 theme={{
                    algorithm:theme.compactAlgorithm,
                    token:{
                        colorPrimary:"#007fcc",
                    },
                 }}>
                    <WorldMap getDataSource={this.getCurYearData}
                    getDataByCountry={this.state.dataSet.getDataByCountry}
                    curYear={this.state.curYear}
                    setSelectCountry={this.setSelectCountry}
                    selectCountry={this.state.selectCountry}
                    getCountryPackage={this.state.dataSet.getCountryPackage}></WorldMap>

                    <TimeLine  startYear={this.state.dataSet.startYear} onYearChange={this.setCurYear} endYear={this.state.dataSet.endYear}></TimeLine>
                    <DataSelectTab onTypeChange={this.setDataType} onPercentChange={this.setDisplayTop}></DataSelectTab>
                    <RankBoard getDataSource={this.getCurYearData} setSelectCountry={this.setSelectCountry}></RankBoard>
                 </ConfigProvider>
            </div>
        );
    }
}