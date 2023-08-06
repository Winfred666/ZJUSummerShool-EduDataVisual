import {Button, Select } from "antd";
import React from "react";
import { DataTypeEnum } from "./dataStorage";


const dataType=[{
    value:DataTypeEnum.GoodUni,
    label:(<div className="normalText">优质大学资源</div>),
},
{
    value:DataTypeEnum.GDP,
    label:(<div className="normalText">GDP</div>),
},{
    value:DataTypeEnum.Enroll,
    label:(<div className="normalText">入学率</div>),
}];

const dataPercentage=[
    {
        value:10,
        label:(<div className="normalText">前10</div>),
    },
    {
        value:20,
        label:(<div className="normalText">前20</div>),
    },{
        value:100,
        label:(<div className="normalText">全部</div>),
    }
]

export default class DataSelectTab extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="dataSelectTab">
                 <Select className="normalText buttonBorder" size="large"
                  onChange={this.props.onTypeChange}
                  defaultValue={DataTypeEnum.GoodUni}
                  options={dataType}/>
                  <Select className="normalText buttonBorder" size="large"
                  onChange={this.props.onPercentChange}
                  defaultValue={10}
                  options={dataPercentage}/>
            </div>
        )
    }
}