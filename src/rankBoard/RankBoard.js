import { Avatar, Table } from "antd"
import React from "react"
import { TagAndUnitOfData } from "../dataSelectTab/dataStorage"
import SummaryPie from "./SummaryBelow"


function getIconClass (index) {
    let ret = "normalIcon"
    index = parseInt(index)
    switch (index) {
        case 1:
            ret = "firstPlaceIcon"
            break
        case 2:
            ret = "secondPlaceIcon"
            break
        case 3:
            ret = "thirdPlaceIcon"
            break
        default:
            break
    }
    return ret
}


const TableColumn = [
    {
        title: "排名",
        className: "normalText",
        dataIndex: "rank",
        render: (rank) => {
            return (<Avatar className={getIconClass(rank)}>{rank}</Avatar>)
        }
    },
    {
        title: "国家",
        className: "normalText",
        dataIndex: "name",
    },
    {
        title: "数据(单位:所)",
        className: "normalText",
        dataIndex: "value",
    }
]

export default class RankBoard extends React.Component {
    state = {
        selectIndex: -1,
    }
    dataSource = null;

    getTableData = () => {
        const ret = this.props.getDataSource()
        this.dataSource = ret
        return ret
    }

    //positively select record
    onSelect = (record, index) => {
        const lastSelected = this.state.selectIndex
        console.log(record)
        if (lastSelected === index) {
            this.props.setSelectCountry(null)
        } else {
            this.props.setSelectCountry(record.country)
        }
    }

    getIndexByCountry = (country) => {
        let index = -1
        if (country === null) return index
        //find the record of select country.
        const recordSet = this.dataSource
        const recordSetLen = recordSet.length
        for (let q = 0; q < recordSetLen; q++) {
            if (!recordSet[q]) continue
            if (recordSet[q].country === country) {
                //index equals to key-1, key equals to rank.
                index = recordSet[q].key - 1
                break
            }
        }
        return index
    }

    //set state when select country change.
    scrollToIndex = (index) => {
        //not found, can't scroll to there.
        if (index === -1) return
        //scroll to that country.
        const box = document.getElementById("rankAntTable")
        const v = box.getElementsByClassName("ant-table-body")[0]
        const oriScrollTop = v.scrollTop
        const destScrollTop = v.scrollHeight * (index / this.dataSource.length)
        const totalStep = 15
        let nowStep = 0
        let inter = setInterval(() => {
            nowStep++
            const toDest = 1 - nowStep / totalStep
            v.scrollTop = oriScrollTop + (destScrollTop - oriScrollTop) * (1 - toDest * toDest * toDest)
            if (nowStep >= totalStep) clearInterval(inter)
        }, 50)
    }


    //passitive or positive change will make table scroll.
    componentDidUpdate () {
        const newIndex = this.getIndexByCountry(this.props.selectCountry)
        if (newIndex !== this.state.selectIndex) {
            this.scrollToIndex(newIndex)
            this.setState({ selectIndex: newIndex })
        }
    }


    selectBox = () => {
        //checked: whether the box is selected
        //record: the dataObjectSelf
        //oriNode: the original default selectBox
        return (<div style={{ position: "absolute", width: "1px" }}></div>)
    }
    //if selected, set pressed className
    getRowClassName = (record, index) => {
        if (this.state.selectIndex === index) {
            return "pressedRow"
        }
        return "normalRow"
    }

    render () {
        TableColumn[2].title = "数据/" + TagAndUnitOfData[this.props.dataType].unit
        return (
            <>
                <div className="normalTitle rankBoardTitle" style={{ borderBottom: "2px solid rgb(146, 207, 216)" }}>排行榜</div>
                <div className="rankBoard">
                    <Table id="rankAntTable"
                        columns={TableColumn}
                        dataSource={this.getTableData()}
                        pagination={false}
                        rowClassName={this.getRowClassName}
                        onRow={(record, index) => {
                            return {
                                onClick: () => { this.onSelect(record, index) },
                                onMouseEnter: (e) => {
                                    e.stopPropagation()
                                }
                            }
                        }}
                        scroll={{
                            y: 300,
                        }} />
                    <SummaryPie getDataByYear={this.props.getDataSource}></SummaryPie>
                </div>
            </>
        )
    }
}