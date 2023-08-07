import Papa from 'papaparse';


//数据标识字符
const FolderName=Object.freeze({
    TopUni:"TopUniversity",
    GDP:"GDP",
    Enroll:"EnrollRate",
});
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

    //name, equals to country in Chinese.Used in World Map.
    name="";

    //在榜高校数目,国家实力,入学率,一个数组，用enum获取
    dataList=null;

    centerX=undefined;
    centerY=undefined;

    constructor(country,name,year){
        this.country=country;
        this.name=name;
        this.year=year;
        this.dataList=[Object.create(Unitdata)
            ,Object.create(Unitdata),
            Object.create(Unitdata)];
    }

    setCenter(centerX,centerY){
        this.centerX=centerX;
        this.centerY=centerY;
    }

    setData(dataType,rank,data){
        this.dataList[dataType].rank=rank;
        this.dataList[dataType].data=data;
    }
    getData(dataType){
        return this.dataList[dataType];
    }
    getCountry(){
        return this.country;
    }

    //change dynamically:
    value=0;
    rank=200;
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
    endYear=2022;

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
            const TopUniCSV=await fetchCsvData(`/${FolderName.TopUni}/${year}.csv`);
            const TopGDPCSV=await fetchCsvData(`/${FolderName.GDP}/${year}.csv`);
            console.log(TopUniCSV);
            
            for(let one of TopUniCSV){
                //get TransLatePackage used to link more data about one country.
                let translation=this.getCountryPackage(one.country);
                if(translation===undefined || translation===null) continue;
                const piece=new DataPerCPerY(one.country,translation.Chinese,year);
                piece.setCenter(translation.centerX,translation.centerY);
                
                piece.setData(DataTypeEnum.GoodUni,one.rank,one.data);
                //piece.setData(DataTypeEnum.GDP,);
                //piece.setData(DataTypeEnum.Enroll,);
                dataPerY.push(piece);
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

        if(this.rankedData[year]!==undefined && this.rankedData[year][dataType]!==undefined){
            const ranked=this.rankedData[year][dataType];
            for(let one of ranked){
                const piece=one.getData(dataType);
                one.value=piece.data;
                one.rank=piece.rank;
                one.key=piece.rank;
            }
            return this.rankedData[year][dataType];
        }

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
            one.value=piece.data;
            one.rank=piece.rank;
            one.key=piece.rank;
            dataListInOrder[piece.rank-1]=one;
        }
        this.rankedData[year][dataType]=dataListInOrder;
        return this.rankedData[year][dataType];
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