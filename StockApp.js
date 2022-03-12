// This problem will require you to write an application that will read an input file ('input.csv') and write out a new file calculated from the inputs. Please use C++.

// We are looking for an easily extendable solution with a strong emphasis on readability, even though it may not seem required for this application. We will evaluate your submission based on the following criteria:
// •             Readability, Design, and Construction
// •             Tests
// •             Use of modern C++14/17 Idioms
// •             Use of C++ TMP where appropriate
// •             Correctness

// We are big fans of test driven development (TDD) and SOLID design principles. Please aim to spend about an 1-2 hours to complete this exercise. Send your source code and output.csv in a zipped git repo back for evaluation when complete. Include the amount of time you spent working on the solution.

// Tips:
// -              Use the 2 hour limit as a guiding constraint. 
// -              Expect that your code will be extended in the future.
// -              Send us code you would put in production.

// -enjoy!
// --Quantlab


// _______________________________________________________________________________

// Input:
// The input file represents a very simplified stream of trades on an exchange.  
// Each row represents a trade.  If you don't know what that means don't worry.  
// The data can be thought of as a time series of values in columns: 

// <TimeStamp>,<Symbol>,<Quantity>,<Price>

// Although the provided input file is small, the solution should be able to handle 
// a source dataset well beyond the amount memory and hard disk space on your machine.

// Definitions
// - TimeStamp is value indicating the microseconds since midnight.
// - Symbol is the 3 character unique identifier for a financial 
//   instrument (Stock, future etc.)
// - Quantity is the amount traded
// - Price is the price of the trade for that financial instrument.

// Safe Assumptions:
// - TimeStamp is always for the same day and won't roll over midnight.
// - TimeStamp is increasing or same as previous tick (time gap will never be < 0).
// - Price - our currency is an integer based currency.  No decimal points.
// - Price - Price is always > 0.

// Example: here is a row for a trade of 10 shares of aaa stock at a price of 12 
// 1234567,aaa,10,12

// Problem:
// Find the following on a per symbol basis:
// - Maximum time gap
//   (time gap = Amount of time that passes between consecutive trades of a symbol)
//   if only 1 trade is in the file then the gap is 0.
// - Total Volume traded (Sum of the quantity for all trades in a symbol).
// - Max Trade Price.
// - Weighted Average Price.  Average price per unit traded not per trade.
//   Result should be truncated to whole numbers.

//   Example: the following trades
// 	20 shares of aaa @ 18
// 	5 shares of aaa @ 7
// 	Weighted Average Price = ((20 * 18) + (5 * 7)) / (20 + 5) = 15

// Output:
// Your solution should produce a file called 'output.csv'.
// file should be a comma separate file with this format:
// <symbol>,<MaxTimeGap>,<Volume>,<WeightedAveragePrice>,<MaxPrice>

// The output should be sorted by symbol ascending ('aaa' should be first).

// Sample Input:
// 52924702,aaa,13,1136
// 52924702,aac,20,477
// 52925641,aab,31,907
// 52927350,aab,29,724
// 52927783,aac,21,638
// 52930489,aaa,18,1222
// 52931654,aaa,9,1077
// 52933453,aab,9,756

// Sample Output:
// aaa,5787,40,1161,1222
// aab,6103,69,810,907
// aac,3081,41,559,638

// Send your source code and output.csv in a zipped git repo back for evaluation when complete.
// Include the amount of time you spent working on the solution.

// fs is a Node standard library package for reading and writing files
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

    console.log(maxTimeArray)

    

}
