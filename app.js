const csv = require('csv-parser');
const fs = require('fs');
var database = '[LEGAL]';
var list = {};
var output = "";
fs.createReadStream('list.csv')
    .pipe(csv())
    .on('data', (row) => {
        const offender = row['Offending Value'];
        const sid = row['Object Identifier'];
        const doc = row['Object Name'];
        if (typeof list[doc] === 'undefined') {
            console.log('Adding ' + doc);
            list[doc] = sid;
            output = output + "DELETE FROM " + database + ".[MHGROUP].[DOC_NVPS] WHERE [SID] = " + sid + "; \r\n";
        }
    })
    .on('end', () => {
        fs.stat('queries.sql', function (err, stats) {
            if (err) {
                outputData();
            }
            fs.unlink('queries.sql', function (err) {
                if (err) return console.log(err);
                outputData();
            });
        });
    });
function outputData() {
    fs.appendFile('queries.sql', output, err => {
        if (err) {
            console.error(err);
        }
    });
}