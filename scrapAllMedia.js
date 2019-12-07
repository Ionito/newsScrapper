const runAll = require("npm-run-all");

runAll(["getpag12","getminuto1","getclarin"], {parallel: false})
    .then(() => {
        console.log("done!");
    })
    .catch(err => {
        console.log(err);
    });