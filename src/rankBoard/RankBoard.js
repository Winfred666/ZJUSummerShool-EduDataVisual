import {Avatar,Table} from "antd";
import React from "react";


function getIconStyle(index){
    let ret={};
    const BGC="backgroundColor";
    const C="color"
    ret["fontSize"]="15px";
    ret["fontWeight"]="bold";
    switch(index){
        case 1:
            ret[C]="#ff5200";
            ret[BGC]="#fde3cf";
            break;
        case 2:
            ret[C]="#ff8d00";
            ret[BGC]="#FDF1CF";
            break;
        case 3:
            ret[C]="#e6ca00";
            ret[BGC]="#FFFDD7";
            break;
        default:
            ret[C]="#919191";
            ret[BGC]="#FFFFFF";
            break;
    }
    return ret;
}


const TableColumn=[
    {
        title:"排名",
        className:"normalText",
        dataIndex:"rank",
        render: (rank)=>{
            return (<Avatar style={getIconStyle(rank)}>{rank}</Avatar>);
        }
    },
    {
        title:"国家",
        className:"normalText",
        dataIndex:"country",
    },
    {
        title:"数据",
        className:"normalText",
        dataIndex:"value",
    }
]

export default class RankBoard extends React.Component{
    state={
        selectIndex:-1,
    }
    
    getTableData=()=>{
        //const ret=this.props.getDataSource();
        const ret=[];
        for(let q=1;q<100;q++){
            ret.push({
                key:q,
                rank:q,
                country:`Country ${q}`,
                value:999-q,
            });
        }
        return ret;
    }

    onSelect=(record,index)=>{
        const lastSelected=this.state.selectIndex;
        if(lastSelected===index){
            index=-1;
        }
        this.setState({selectIndex:index});
        console.log(record);
        this.props.onSelectChange(record.country);
    }

    selectBox=()=>{
        //checked: whether the box is selected
        //record: the dataObjectSelf
        //oriNode: the original default selectBox
        return (<div style={{position:"absolute",width:"1px"}}></div>);
    }
    //if selected, set pressed className
    getRowClassName=(record,index)=>{
        if(this.state.selectIndex===index){
            return "pressedRow";
        }
        return "normalRow";
    }

    render(){
        return (
            <div className="rankBoard">
                <div className="normalTitle" style={{borderBottom:"3px solid gray"}}>排行榜</div>
                <Table columns={TableColumn} 
                dataSource={this.getTableData()}
                pagination={false}
                
                rowClassName={this.getRowClassName}
                onRow={(record,index)=>{
                    return{
                        onClick:()=>{this.onSelect(record,index)},
                        onMouseEnter:(e)=>{
                            e.stopPropagation();
                        }
                    };
                }}
                scroll={{
                    y: 240,
                }}/>
            </div>
        );
    }
}