import {Select } from "antd";
import React from "react";
import { DataTypeEnum, TagAndUnitOfData } from "./dataStorage";


const dataTag=[];
for(let type=0;type<TagAndUnitOfData.length;type++){
    dataTag.push({
        value:type,
        label:(<div className="normalText">{TagAndUnitOfData[type].tag}</div>),
    })
}


export default class DataSelectTab extends React.Component{
    render(){
        return (
            <div className="dataSelectTab">
                 <Select className="normalText buttonBorder" size="large"
                  onChange={this.props.onTypeChange}
                  defaultValue={DataTypeEnum.GoodUni}
                  options={dataTag}/>
            </div>
        )
    }
}