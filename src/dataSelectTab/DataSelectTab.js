import {Button, Select } from "antd";
import React from "react";
import { DataTypeEnum } from "./dataStorage";


const dataType=[{
    value:DataTypeEnum.GoodUni,
    label:(<div className="normalText">优质大学资源(前100)</div>),
},
{
    value:DataTypeEnum.GoodUni1k,
    label:(<div className="normalText">优质大学资源(前1k)</div>),
},
{
    value:DataTypeEnum.GDP,
    label:(<div className="normalText">GDP</div>),
},{
    value:DataTypeEnum.Enroll,
    label:(<div className="normalText">入学率</div>),
}];


export default class DataSelectTab extends React.Component{
    render(){
        return (
            <div className="dataSelectTab">
                 <Select className="normalText buttonBorder" size="large"
                  onChange={this.props.onTypeChange}
                  defaultValue={DataTypeEnum.GoodUni}
                  options={dataType}/>
            </div>
        )
    }
}