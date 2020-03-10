'use strict';
const express = require('express')
const sqlFormatter = require('sql-formatter');
const app = express();
const bodyParser = require('body-parser');
const chromeLauncher = require('chrome-launcher');
const PORT = process.env.PORT || 9999;
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, function(err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Server started in port: ' + PORT);
    
    chromeLauncher.launch({
        startingUrl: 'http://localhost:'+PORT+'/autocomplete.html'
    }).then(chrome => {
        console.log(`Chrome debugging port running on ${chrome.port}`);
    });
})

app.post('/sql/build', function (req, res) {
    let data = req.body;
    let start = data.start;
    let end = data.end;
    let indent = data.indent;
    let contentReq = data.content;
    let sqlFomat = formatSql(contentReq, indent);

    let sqlResult = '';
    let lines = sqlFomat.split('\n');
    for(let idxLine = 0; idxLine < lines.length; idxLine++) {
        sqlResult += start + lines[idxLine] + end + '\n';
    }

    let result = {
        code: 0,
        content: sqlResult
    }

    res.send(result);
});

app.post('/code/search', function (req, res) {
    let data = req.body;
    let text = data.text;

    let results = {
        id: 1,
        lable: "asdasd",
        value: 1245
    }

    res.send(results);
});

function formatSql(sql, indent) {
    let numberSpace = '';
    for(let idx = 0; idx < parseInt(indent); idx++) {
        numberSpace += ' ';
    }

    return sqlFormatter.format(sql, {
        language: 'n1ql',
        indent: numberSpace
    })
}