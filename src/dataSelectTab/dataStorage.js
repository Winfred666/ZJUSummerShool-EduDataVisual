import Papa from 'papaparse';


const CountryTransName="ChiEngcountry";

async function fetchCsvData(filePath) {
    //fetch相对目录下的csv文件，/../../public/XXX.csv
    //await 同步，等结果。
    const res=await fetch(filePath);
    let tableObj=null;
    if(res.ok){
        const strSCV=await res.text();
        tableObj=Papa.parse(strSCV,{header:true});
    }else{
        //throw `Cannot find csv file from ${filePath}.\nAn Error Occured! Code:${res.status}`;
        console.error(`Cannot find csv file from ${filePath}.\nAn Error Occured! Code:${res.status}`);
        return [];
    }
    //keyword replace to suit for api:
    return tableObj.data;
}


export const FaultRank=300;

//数据的最小形式
const Unitdata={
    rank:FaultRank,
    data:0,
};

//数据类型的枚举，在未拓展之前，暂且不使用代理。
export const DataTypeEnum=Object.freeze({
    GoodUni:0,
    GDP:1,
    Enroll:2,
    GoodUni1k:3
});

//数据标识字符
const FolderName=Object.freeze({
    0:"TopUniversity",
    1:"GDP",
    2:"EnrollRate",
    3:"Top1000University",
});

//一个国家，一个时间点的数据
class DataPerCPerY{
    country="";
    year=2014;

    //name, equals to country in Chinese.Used in World Map.
    name="";

    //在榜高校数目,国家实力,入学率,一个数组，用enum获取
    dataList=null;

    constructor(country,name,year){
        this.country=country;
        this.name=name;
        this.year=year;
        this.dataList=[Object.create(Unitdata)
            ,Object.create(Unitdata),
            Object.create(Unitdata),
            Object.create(Unitdata)];
    }

    setData(dataType,rank,data){
        this.dataList[dataType].rank=parseInt(rank);
        this.dataList[dataType].data=parseFloat(data);
    }

    getData(dataType){
        return this.dataList[dataType];
    }
    getCountry(){
        return this.country;
    }

    //change dynamically:
    value=0;
    rank=FaultRank;
}

//使用papaLoader读入数据
export default class DataStorage{
    /*{[year:number]:    
        [
            oneSegment:DataPerCPerY,
            oneSegment:DataPerCPerY,
            ...
        ],
        ...
    }
    */
    allData={};

    //real Chinese to English Dictionary.
    dictionary=null;

    renewDataSet=null;
    startYear=2012;
    endYear=2023;

    constructor(renewDataSet){
        this.init();
        this.renewDataSet=renewDataSet;
    }
    
    //rank only when needed.
    /*
    {   [year:number]:      //indicate the certain year.
            [               //one year data in rank order.
                [
                            //index 0,GoodUniversity data in rank order
                ],
                [
                            //index 1,GDP data in rank order
                ],
                [
                            //index 2,Enroll data in rank order
                ]
            ],
        ...
    }
    */
    rankedData={};

    async init(){
        //open the English-Chinese Country map for search.
        this.dictionary=await fetchCsvData(`/${CountryTransName}.csv`);
        
        for(let year=this.startYear;year<=this.endYear;year++){
            let dataPerY=[];
            //open data csv of different year.
            for(let typeKey in DataTypeEnum){
                const dataType=DataTypeEnum[typeKey];
                const CSV=await fetchCsvData(`/${FolderName[dataType]}/${year}.csv`);
                for(let oneSeg of CSV){
                    if(oneSeg.data===undefined) continue;
                    //if DataPerCPerY of this country exists,set new data on it, else create new one.
                    const index=dataPerY.findIndex((value)=>{return (value.getCountry()===oneSeg.country)});
                    if(index===-1){
                        //get TransLatePackage used to link more data about one country.
                        let translation=this.getCountryPackage(oneSeg.country);
                        //do not have translation, discard this country.
                        if(translation===undefined || translation===null) continue;
                        let curPiece=new DataPerCPerY(oneSeg.country,translation.Chinese,year);
                        curPiece.setData(dataType, oneSeg.rank , oneSeg.data);
                        dataPerY.push(curPiece);
                    }else dataPerY[index].setData(dataType,oneSeg.rank,oneSeg.data);
                }
            }
            this.allData[year]=dataPerY;
        }
        //uncapture the change of DataStorage, call APP to setState and update.
        this.renewDataSet(this);
    }

    getCountryPackage=(english)=>{
        for(let one of this.dictionary){
            if(one.English===english){
                return one;
            }
        }
        return null;
    }

    //main function of get data used in worldMap and rankBoard,need a rank operation.
    getDataByYear=(year,dataType)=>{
        console.log("try to get data by year!");
        //wait the render of allData.
        if(this.allData[year]===undefined) return [];

        let sameRankNum=new Map();
        function addRankNum(rank){
            let num=sameRankNum.get(rank);
            if(num===undefined) num=0;
            else num++;
            sameRankNum.set(rank,num);
            return num;
        }

        //if rankedData has been generated
        if(this.rankedData[year]!==undefined && this.rankedData[year][dataType]!==undefined){
            const ranked=this.rankedData[year][dataType];
            //renew value ,rank and key of this dataType
            for(let one of ranked){
                if(!one) continue;
                const piece=one.getData(dataType);
                one.value=piece.data;
                const num=addRankNum(piece.rank);
                one.rank=piece.rank;
                one.key=parseInt(piece.rank)+num;
            }
            return this.rankedData[year][dataType];
        }

        //if rankedData of this year wasn't been generate.
        if(this.rankedData[year]===undefined){
            this.rankedData[year]=[];
        }
        const dataListInOrder=[];
        //one:DataPerCPerY
        const dataPerY=this.allData[year];
        
        for(let one of dataPerY){
            //piece:DataUnit
            const piece=one.getData(dataType);
            //not so elegant to add property into data object,
            //but benefit worldMap and rankBoard get the data they want quickly.
            //anyway, follow the principle not change the source data, no error occured:)
            //all we need: value=data in dataList, rank=rank in dataList.
            if(piece.rank===FaultRank) continue;
            const num=addRankNum(piece.rank);
            one.value=piece.data;
            one.rank=piece.rank;
            one.key=parseInt(piece.rank)+num;
            dataListInOrder[one.key-1]=one;
        }
        this.rankedData[year][dataType]=dataListInOrder;
        return this.rankedData[year][dataType];
    }

    //find country data of all years, all dataType, mainly used in ZoneIn map.
    getDataByCountry=(country)=>{
        country=country.toUpperCase();
        const ret={};
        //whether this country has data.
        let flag=false;
        for(let year=this.startYear;year<=this.endYear;year++){
            //one:DataPerCPerY
            for(let one of this.allData[year]){
                //match country English name
                if(one.getCountry().toUpperCase()===country){
                    flag=true;
                    ret[year]=one;
                    break;
                }
            }
            if(!flag){
                //set default value
                ret[year]=null;
            }
        }
        return ret;
    }
}