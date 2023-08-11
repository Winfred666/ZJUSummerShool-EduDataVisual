import Papa from 'papaparse'


const CountryTransName = "ChiEngcountry"

async function fetchCsvData (fileName) {
    //fetch相对目录下的csv文件，/../../public/XXX.csv
    //但在生产环境中，为绝对路径，需要publicPath
    //await 同步，等结果。
    const res = await fetch(process.env.PUBLIC_URL+"/"+fileName)
    let tableObj = null
    if (res.ok) {
        const strSCV = await res.text()
        tableObj = Papa.parse(strSCV, { header: true })
    } else {
        //throw `Cannot find csv file from ${filePath}.\nAn Error Occured! Code:${res.status}`;
        console.error(`Cannot find csv file from ${fileName}.\nAn Error Occured! Code:${res.status}`)
        return []
    }
    //keyword replace to suit for api:
    return tableObj.data
}


export const FaultRank = 300

//数据的最小形式
const Unitdata = {
    rank: FaultRank,
    data: 0,
}

//数据类型的枚举，在未拓展之前，暂且不使用代理。
export const DataTypeEnum = Object.freeze({
    GoodUni: 0,
    EduOfGDP: 1,
    CollegeEnroll: 2,
    GoodUni1k: 3,
    MiddleEnroll: 4,
    GDP: 5,
})

//数据表名称
const FileName = Object.freeze([
    "Top100University",
    "EduExpenseOfGDP",
    "CollegeEnrollRate",
    "Top1000University",
    "MiddleEnrollRate",
    "GDP",
])

//开始时间和结束时间
export const BoundaryYear = Object.freeze([
    { startYear: 2012, endYear: 2023 },
    { startYear: 2012, endYear: 2020 },
    { startYear: 2012, endYear: 2020 },
    { startYear: 2014, endYear: 2023 },
    { startYear: 2012, endYear: 2020 },
    { startYear: 2012, endYear: 2020 },
])
//数据单位
export const TagAndUnitOfData = Object.freeze([
    { tag: "优质大学(前100)", unit: "所" },
    { tag: "教育支出占GDP比重", unit: "%" },
    { tag: "大学毛入学率", unit: "%" },
    { tag: "优质大学(前1k)", unit: "所" },
    { tag: "中学毛入学率", unit: "%" },
    { tag: "GDP", unit: "亿美元" },
])

//一个国家，一个时间点的数据
class DataPerCPerY {
    //country, now equals to Country Code.
    country = "";
    year = 2012;

    //name, equals to country in Chinese.Used in World Map.
    name = "";

    //在榜高校数目,国家实力,入学率,一个数组，用enum获取
    dataList = null;

    constructor(country, name, year) {
        this.country = country
        this.name = name
        this.year = year
        this.dataList = [Object.create(Unitdata)
            , Object.create(Unitdata),
        Object.create(Unitdata),
        Object.create(Unitdata),
        Object.create(Unitdata),
        Object.create(Unitdata)]
    }

    setData (dataType, rank, data) {
        const r = parseInt(rank)
        this.dataList[dataType].rank = parseInt(r)
        this.rank = r
        if (typeof data === "string") data = parseFloat(data)
        data = data.toFixed(2)
        this.dataList[dataType].data = parseFloat(data)
    }

    getData (dataType) {
        return this.dataList[dataType]
    }
    getCountry () {
        return this.country
    }

    //change dynamically:
    value = 0;
    rank = FaultRank;
}

//使用papaLoader读入数据
export default class DataStorage {
    /*{[year:number]:    
        [
            oneSegment:DataPerCPerY,
            oneSegment:DataPerCPerY,
            ...
        ],
        ...
    }
    */
    allData = {};

    //real Chinese to English Dictionary.
    dictionary = null;

    renewDataSet = null;
    startYear = 2012;
    endYear = 2023;

    constructor(renewDataSet) {
        this.init()
        this.renewDataSet = renewDataSet
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
    rankedData = {};

    async init () {
        //open the English-Chinese Dictionary for search.
        this.dictionary = await fetchCsvData(`${CountryTransName}.csv`)

        for (let ty = 0; ty < FileName.length; ty++) {
            const CSV = await fetchCsvData(FileName[ty] + ".csv")
            for (let country of CSV) {
                const bound = BoundaryYear[ty]
                for (let year = bound.startYear; year <= bound.endYear; year++) {
                    //do not have dataset of specifit year, create one.
                    if (this.allData[year] === undefined) this.allData[year] = []
                    const index = this.allData[year].findIndex((value) => { return (value.country === country.Code) })
                    //do not have data piece of that country in specifit year,create one.
                    if (index === -1) {
                        const translation = this.getCountryPackage(country.Code)
                        if (translation === null) continue
                        const curPiece = new DataPerCPerY(country.Code, translation.Chinese, year)
                        curPiece.setData(ty, country[year.toString() + "Rank"], country[year])
                        this.allData[year].push(curPiece)
                    } else {
                        this.allData[year][index].setData(ty, country[year.toString() + "Rank"], country[year])
                    }
                }
            }
        }
        //uncapture the change of DataStorage, call APP to setState and update.
        this.renewDataSet(this)
    }

    getCountryPackage = (code) => {
        for (let one of this.dictionary) {
            if (one.Code === code) {
                return one
            }
        }
        return null
    }

    //main function of get data used in worldMap and rankBoard,need a rank operation.
    getDataByYear = (year, dataType) => {
        console.log("try to get data by year!")
        //wait the render of allData.
        if (this.allData[year] === undefined) return []

        let sameRankNum = new Map()
        function addRankNum (rank) {
            let num = sameRankNum.get(rank)
            if (num === undefined) num = 0
            else num++
            sameRankNum.set(rank, num)
            return num
        }

        //if rankedData has been generated
        if (this.rankedData[year] !== undefined && this.rankedData[year][dataType] !== undefined) {
            const ranked = this.rankedData[year][dataType]
            //renew value ,rank and key of this dataType
            for (let one of ranked) {
                if (!one) continue
                const piece = one.getData(dataType)
                one.value = piece.data
                const num = addRankNum(piece.rank)
                one.rank = piece.rank
                one.key = parseInt(piece.rank) + num
            }
            return this.rankedData[year][dataType]
        }

        //if rankedData of this year wasn't been generate.
        if (this.rankedData[year] === undefined) {
            this.rankedData[year] = []
        }
        const dataListInOrder = []
        //one:DataPerCPerY
        const dataPerY = this.allData[year]

        for (let one of dataPerY) {
            //piece:DataUnit
            const piece = one.getData(dataType)
            //not so elegant to add property into data object,
            //but benefit worldMap and rankBoard get the data they want quickly.
            //anyway, follow the principle not change the source data, no error occured:)
            //all we need: value=data in dataList, rank=rank in dataList.
            if (piece.rank === FaultRank) continue
            const num = addRankNum(piece.rank)
            one.value = piece.data
            one.rank = piece.rank
            one.key = parseInt(piece.rank) + num
            dataListInOrder[one.key - 1] = one
        }
        this.rankedData[year][dataType] = dataListInOrder
        return this.rankedData[year][dataType]
    }

    //find country data of all years, all dataType, mainly used in ZoneIn map.
    getDataByCountry = (country) => {
        country = country.toUpperCase()
        const ret = {}
        //whether this country has data.
        let flag = false
        for (let year = this.startYear; year <= this.endYear; year++) {
            //one:DataPerCPerY
            for (let one of this.allData[year]) {
                //match country English name
                if (one.getCountry().toUpperCase() === country) {
                    flag = true
                    ret[year] = one
                    break
                }
            }
            if (!flag) {
                //set default value
                ret[year] = null
            }
        }
        return ret
    }
}