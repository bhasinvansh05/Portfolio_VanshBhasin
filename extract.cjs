const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('Resume_Vansh.pdf');
let parse = typeof pdf === "function" ? pdf : pdf.default;

if (typeof parse !== "function") {
    console.error("Failed to load pdf-parse function. Type is:", typeof parse);
    process.exit(1);
}

parse(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(function(error) {
    console.error("Error reading PDF:", error);
});
