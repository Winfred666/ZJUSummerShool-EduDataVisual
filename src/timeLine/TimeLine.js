import { Slider, Switch } from "antd";
import React from "react";

export default class TimeLine extends React.Component{
    //受控组件
    state={
        selectYear: 2014,
        animateInterval: 1000,
        isAnimate:false,
    }

    animater=null;

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

    //在父组件注册动画控制器，用于聚焦时强制关闭动画。
    componentDidMount(){
        this.props.registerAnimateSwitch(this.setAnimate);
    }

    //设置是否启用动画，采用计时器，返回boolean:是否改变了动画状态
    setAnimate=(isPlay)=>{
        if(isPlay){
            //已经有动画器
            if(this.animater!==null) return false;
            this.animater=setInterval(()=>{
                if(this.state.selectYear>=this.props.endYear){
                    this.sliderChange(this.props.startYear);
                }else{
                    this.sliderChange(this.state.selectYear+1);
                }
            },this.state.animateInterval);
        }else{
            //关闭动画。
            if(this.animater===null) return false;
            clearInterval(this.animater);
            this.animater=null;
        }
        this.setState({isAnimate:isPlay});
        return true;
    }

    //受控组件，用react获取表单组件状态,并绑定change
    render(){
        return (
            <div className="timeLine">
                <div className="timeBlock">
                <div style={{position:"relative"}}>
                    <div className="normalTitle">时间轴 </div>
                    <div className="animateSwitch">
                        <div className="normalText animateInline">启用动画</div>
                        <Switch checked={this.state.isAnimate} className="animateInline" onChange={this.setAnimate}></Switch>
                    </div>
                </div>
                <Slider 
                marks={this.getSliderMark()} 
                step={1} min={this.props.startYear} max={this.props.endYear}
                value={this.state.selectYear}
                
                onChange={this.sliderChange}
                ></Slider>
                </div>
            </div>
        )
    }
}