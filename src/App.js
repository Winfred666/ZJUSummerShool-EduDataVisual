import React,{Component} from "react";
import DataSelectTab from "./dataSelectTab/DataSelectTab";
import RankBoard from "./rankBoard/RankBoard";
import TimeLine from "./timeLine/TimeLine";
import WorldMap from "./worldMap/WorldMap";

import "antd/dist/reset.css";
import { ConfigProvider,theme} from "antd";
import DataStorage, { BoundaryYear, DataTypeEnum } from "./dataSelectTab/dataStorage";



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
            mapTitle:"世界地图",
        }
    }

    animateController=null;
    //是否在聚焦时强制关闭了动画，用于在取消聚焦时恢复动画。
    hasForceCloseAnimate=false;

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

    //如果 country===null, 则返回世界地图, 否则聚焦到某一国家.
    setSelectCountry=(country)=>{
        //聚焦时需要关闭时间轴动画,返回地图时重启动画。
        let mapTitle="世界地图";
        if(country===null){
            if(this.animateController!==null && this.hasForceCloseAnimate){
                this.animateController(true);
                this.hasForceCloseAnimate=false;
            }
        }else{
            if(this.animateController!==null) this.hasForceCloseAnimate=this.animateController(false);
            let curshion=this.state.dataSet.getCountryPackage(country);
            if(curshion!==null) mapTitle=curshion.Chinese;
        }
        this.setState({selectCountry:country,mapTitle:mapTitle});
    }

    setDataType=(dataType)=>{
        const dataSet=this.state.dataSet;
        dataSet.startYear=BoundaryYear[dataType].startYear;
        dataSet.endYear=BoundaryYear[dataType].endYear;
        let redirectCurYear=this.state.curYear;
        if(this.state.curYear<dataSet.startYear) redirectCurYear=dataSet.startYear;
        if(this.state.curYear>dataSet.endYear) redirectCurYear=dataSet.endYear; 
        this.setState({curDataType:dataType,dataSet:dataSet,curYear:redirectCurYear});
    }

    registerAnimateSwitch=(controller)=>{
        this.animateController=controller;
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
                    getCountryPackage={this.state.dataSet.getCountryPackage}
                    mapTitle={this.state.mapTitle}
                    dataType={this.state.curDataType}></WorldMap>

                    <TimeLine startYear={this.state.dataSet.startYear} 
                    onYearChange={this.setCurYear} endYear={this.state.dataSet.endYear}
                    registerAnimateSwitch={this.registerAnimateSwitch}></TimeLine>

                    <DataSelectTab onTypeChange={this.setDataType} onPercentChange={this.setDisplayTop}></DataSelectTab>
                    
                    <RankBoard getDataSource={this.getCurYearData} 
                    setSelectCountry={this.setSelectCountry}
                    selectCountry={this.state.selectCountry}
                    dataType={this.state.curDataType}></RankBoard>

                 </ConfigProvider>
            </div>
        );
    }
}