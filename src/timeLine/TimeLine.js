import { Slider } from "antd";
import React from "react";

export default class TimeLine extends React.Component{
    //受控组件
    state={
        selectYear: 2012,
        startYear: 2012,
        endYear:2022,
    }

    constructor(props){
        super(props);
        this.state.selectYear=this.state.startYear=props.startYear;
        this.state.endYear=props.endYear;
    }

    getSliderMark=()=>{
        let ret={};
        for(let q=this.state.startYear;q<=this.state.endYear;q++){
            const label=q.toString();
            ret[label]=(<div className="normalText">{q.toString()}</div>);
        }
        return ret;
    }

    sliderChange=(value)=>{
        this.setState({selectYear:value});
        //调用父组件的传入函数，实现子传父
        this.props.onYearChange(value);
    }

    //受控组件，用react获取表单组件状态,并绑定change
    render(){
        return (
            <div className="timeLine">
                <div className="timeBlock">
                <div className="normalTitle">时间轴</div>
                <Slider 
                marks={this.getSliderMark()} 
                step={1} min={this.state.startYear} max={this.state.endYear}
                dots={true} value={this.state.selectYear}
                onChange={this.sliderChange}
                ></Slider>
                </div>
            </div>
        )
    }
}