const fs = require('fs');
const path = require('path');

module.export = app => {
    fs
        .readdirSync(__dirname)
        .filter(file => ((file.indexOf('.')) !== 0 && (file !=="index.js")))
        .forEach(file => require(path.resolve(__dirname, file))(app))
}