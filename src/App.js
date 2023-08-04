import React,{Component} from "react";

const flag=false;
const obj=[
    {id:1,content:"fd"},
    {id:2,content:"dd"},
    {id:3,content:"fdas"},
]

export default class App extends Component{
    render(){
        return(
            <div className="gridMother">
                 <div className="mainBoard">
                    三元表达式
                    <br></br>
                    {flag ?"hahah":"444"}
                    <div className="timeLine">
                    <ul>
                    循环渲染
                    {obj.map(({id,content})=>
                        (<li key={id}>
                            {id}|{content}
                        </li>)
                        )
                    }
                    </ul>
                    条件渲染
                    </div>
                 </div>
                 <div className="assistBoard">
                 </div>
            </div>
        );
    }
}