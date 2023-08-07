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
        this.setState({curDataType:dataType});
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
                    selectCountry={this.state.selectCountry}></WorldMap>

                    <TimeLine  startYear={this.state.dataSet.startYear} onYearChange={this.setCurYear} endYear={this.state.dataSet.endYear}></TimeLine>
                    <DataSelectTab onTypeChange={this.setDataType} onPercentChange={this.setDisplayTop}></DataSelectTab>
                    <RankBoard getDataSource={this.getCurYearData} onSelectChange={this.setSelectCountry}></RankBoard>
                 </ConfigProvider>
            </div>
        );
    }
}