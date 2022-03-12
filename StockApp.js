const { time } = require('console');
const fs = require('fs');

fs.readFile('test.csv', 'utf8', (error, data) =>
error ? console.error(error) : createOutput(data)
);

function createOutput(inputString){
    // <TimeStamp>,<Symbol>,<Quantity>,<Price>
    var Stock = function(timeStamp, symbol, quantity, price) {
        this.timeStamp = timeStamp
        this.symbol = symbol
        this.quantity = quantity
        this.price = price
    }

    //divide test.csv and create ordered list
    inputString = inputString.replace('﻿','').replaceAll('\n',',').replaceAll('\r','')
    inputString = inputString.split(',')

    const stockArray = []

    //iterate through elements
    for (let i = 0; i < inputString.length; i += 4) {
        var stk = new Stock(
            parseInt(inputString[i]),
            inputString[i + 1],
            parseInt(inputString[i + 2]),
            parseInt(inputString[i + 3])
        )
        stockArray.push(stk)
    }

    // <symbol>,<MaxTimeGap>,<Volume>,<WeightedAveragePrice>,<MaxPrice>
    var StockOutput = function(symbol, maxTimeGap, volume, weightedAveragePrice, maxPrice) {

        this.symbol = symbol
        this.maxTimeGap = maxTimeGap
        this.volume = volume
        this.weightedAveragePrice = weightedAveragePrice
        this.maxPrice = maxPrice
    }

    var stockOutputArray = []

    stockArray.sort(function (a, b) {
        if (a.symbol < b.symbol) {
            return -1;
        }
        if (a.symbol > b.symbol) {
            return 1;
        }
        return 0;
    })

    for (let i = 0; i < stockArray.length; i++) {
        for(let j = i+1; j < stockArray.length; j++){
            if(!stkOtpt){
                var stkOtpt = new StockOutput(stockArray[i].symbol)
                stockOutputArray.push(stkOtpt)
            }else if(stockOutputArray[i].symbol != stockArray[j].symbol && stkOtpt.symbol != stockArray[j].symbol){
                var stkOtpt = new StockOutput(stockArray[j].symbol)
                stockOutputArray.push(stkOtpt)
            }
        }
        break
    }

    var maxTime = function(symbol, timeGap){
        this.symbol = symbol,
        this.timeGap = timeGap
    }

    var maxTimeArray = []

    for(let i = 0; i < stockArray.length; i++){
        let count = 0
        for(let j = i+1; j < stockArray.length; j++){  
            if(stockArray[i] != stockArray[j] && stockArray[i].symbol == stockArray[j].symbol){
                let temp = new maxTime(stockArray[i].symbol,stockArray[j].timeStamp - stockArray[i].timeStamp)
                maxTimeArray.push(temp)
                maxTimeArray.sort(function (a, b) {
                    if (a.symbol == b.symbol) {
                        return b.timeGap - a.timeGap;
                    }
                });
                count++
                i++
                if (count > 1) {
                    maxTimeArray.pop()
                }
            }
        }
    }

    let symbolTemp
    let quantityTemp
    var volume = function(symbol, vol){
        this.symbol = symbol,
        this.vol = vol
    }
    var volumeArray = []

    for(let e of stockArray){
        //console.log(temp,quantityTemp)
        if(!symbolTemp && !quantityTemp){
            //console.log(temp,quantityTemp)
            symbolTemp = e.symbol
            quantityTemp = e.quantity
            //console.log(temp,quantityTemp)
        }else if(symbolTemp == e.symbol){
            //console.log(temp,quantityTemp)
            quantityTemp += e.quantity
            //console.log(temp,quantityTemp)
        }else if(symbolTemp != e.symbol){
            //console.log(temp,quantityTemp)
            let volTemp = new volume(symbolTemp, quantityTemp)
            volumeArray.push(volTemp)
            symbolTemp = e.symbol
            quantityTemp = e.quantity
            //console.log(temp,quantityTemp)
        }
        //console.log(temp,quantityTemp)
    }
    let volTemp = new volume(symbolTemp, quantityTemp)
    volumeArray.push(volTemp)

    let symbolTemp1
    let totalPrice
    var weightedAvgPrice = function (symbol, weighAvgPrice) {
        this.symbol = symbol,
        this.weighAvgPrice = weighAvgPrice
    }
    var weightedAvgPriceArray =[]

    for(let e of stockArray){
        if(!symbolTemp1 && !totalPrice){
            symbolTemp1 = e.symbol
            totalPrice = e.quantity * e.price
        }else if(symbolTemp1 == e.symbol){
            totalPrice += e.quantity * e.price
        }else if(symbolTemp1 != e.symbol){
            let wapTemp = new weightedAvgPrice(symbolTemp1, totalPrice)
            weightedAvgPriceArray.push(wapTemp)
            symbolTemp1 = e.symbol
            totalPrice = e.quantity * e.price
        }
    }
    let wapTemp = new weightedAvgPrice(symbolTemp1, totalPrice)
    weightedAvgPriceArray.push(wapTemp)
    //console.log(weightedAvgPriceArray)

    for(let i = 0; i < stockOutputArray.length; i++){
        stockOutputArray[i].maxTimeGap = maxTimeArray[i].timeGap
        stockOutputArray[i].volume = volumeArray[i].vol
        stockOutputArray[i].weightedAveragePrice = weightedAvgPriceArray[i].weighAvgPrice
    }
    

    console.log(stockOutputArray)
}
