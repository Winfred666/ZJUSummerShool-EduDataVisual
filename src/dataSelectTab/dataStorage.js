import Papa from 'papaparse';


async function fetchCsvData(filePath) {
    return await fetch(filePath)
      .then(res => res.text())
      .then(res => Papa.parse(res, { header: true }).data)
      .catch(e => console.error(e));
}

//数据的最小形式
const Unitdata={
    rank:300,
    data:0,
};

//数据类型的枚举，在未拓展之前，暂且不使用代理。
export const DataTypeEnum=Object.freeze({
    GoodUni:0,
    GDP:1,
    Enroll:2,
});

//一个国家，一个时间点的数据
class DataPerCPerY{
    country="";
    year=2012;

    //在榜高校数目,国家实力,入学率,一个数组，用enum获取
    dataList=[Object.create(Unitdata)
        ,Object.create(Unitdata),
        Object.create(Unitdata)]

    constructor(country,year){
        this.country=country;
        this.year=year;
    }

    setData(dataType,rank,data){
        this.dataList[DataTypeEnum[dataType]].rank=rank;
        this.dataList[DataTypeEnum[dataType]].data=data;
    }
    getData(dataType){
        return this.dataList[DataTypeEnum[dataType]];
    }
    getCountry(){
        return this.country;
    }

    //name, equals to country.Used in World Map.
    get name(){
        return this.country;
    }

    //change dynamically:
    value=0;
    rank=200;
}

//使用papaLoader读入数据
export default class DataStorage{
    constructor(){
        this.init();
    }
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
    
    startYear=2012;
    endYear=2022;
    
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
        //fetchCsvData("");
        const oneYearData=[];
        for(let year=DataStorage.startYear;year<DataStorage.endYear;year++){
            let dataPerY=[];
            for(let one of oneYearData){
                const piece=new DataPerCPerY(one.country,one.year);
                piece.setData(DataTypeEnum.GoodUni,);
                piece.setData(DataTypeEnum.GDP,);
                piece.setData(DataTypeEnum.Enroll,);
                dataPerY.push(piece);
            }
            DataStorage.allData[year]=dataPerY;
        }
    }


    //main function of get data used in worldMap and rankBoard,need a rank operation.
    getDataByYear=(year,dataType)=>{
        const TypeIndex=DataTypeEnum[dataType];
        if(this.rankedData[year]!==undefined && this.rankedData[year][TypeIndex]!==undefined){
            return this.rankedData[year][TypeIndex];
        }
        if(this.rankedData[year]===undefined){
            this.rankedData[year]=[];
        }
        const dataListInOrder=[];
        //one:DataPerCPerY
        for(let one of this.allData[year]){
            //piece:DataUnit
            const piece=one.getData(dataType);
            //not so elegant to add property into data object,
            //but benefit worldMap and rankBoard get the data they want quickly.
            //anyway, follow the principle not change the source data, no error occured:)
            //all we need: value=data in dataList, rank=rank in dataList.
            one.value=piece.data;
            one.rank=piece.rank;
            dataListInOrder[piece.rank]=one;
        }
        this.rankedData[year][TypeIndex]=dataListInOrder;
        return this.rankedData[year][TypeIndex];
    }

    //find country data of all years, all dataType, mainly used in ZoneIn map.
    getDataByCountry=(country)=>{
        country=country.toUpperCase();
        const ret={};
        for(let year=this.startYear;year<=this.endYear;year++){
            //one:DataPerCPerY
            for(let one of this.allData[year]){
                //匹配到国家
                if(one.getCountry().toUpperCase()===country){
                    ret[year]=one;
                    break;
                }
            }
        }
        return ret;
    }
}