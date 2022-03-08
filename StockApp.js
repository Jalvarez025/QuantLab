// fs is a Node standard library package for reading and writing files
const fs = require('fs');

fs.readFile('test.csv', 'utf8', (error, data) =>
error ? console.error(error) : createOutput(data)
);

function createOutput(inputString){

    //divide test.csv and create ordered list
    inputString = inputString.split(',')

    //iterate through elements
    for(let i = 0; i < inputString.length; i++){
        console.log(inputString[i])
    }


}


