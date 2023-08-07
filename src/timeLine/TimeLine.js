import { Slider } from "antd";
import React from "react";

export default class TimeLine extends React.Component{
    //受控组件
    state={
        selectYear: 2014,
    }

    getSliderMark=()=>{
        let ret={};
        for(let q=this.props.startYear;q<=this.props.endYear;q++){
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
                step={1} min={this.props.startYear} max={this.props.endYear}
                dots={true} value={this.state.selectYear}
                onChange={this.sliderChange}
                ></Slider>
                </div>
            </div>
        )
    }
}