import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

let dataBuffer = fs.readFileSync('Resume_Vansh.pdf');

pdf(dataBuffer).then(data => {
    console.log("--- RESUME CONTENT ---");
    console.log(data.text);
    console.log("--- END CONTENT ---");
}).catch(e => console.error("Extract error:", e));
