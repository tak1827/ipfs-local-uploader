/**
 * Util functions
 */
 
/* read modules */
const fs = require('fs');
const https = require('https');

module.exports = {

    writeFile : function(file, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(file, data, 'utf8', function(err) {
                if (err) { reject(err); }
                else { resolve(data); }
            });
        });
    },

    appendFile : function(file, data) {
        return new Promise((resolve, reject) => {
             fs.appendFile(file, data, 'utf8', function(err) {
                if (err) { reject(err); }
                else { resolve(data); }
             });
         });
     },

    readFile : function(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', function(err, data) {
                if (err) { reject(err); }
                else { resolve(data); }
            });
        });
    },

    pathExist : function(path) {
        return new Promise((resolve, reject) => {
            fs.access(path, fs.constants.F_OK, function(err) {
                if (err && err.errno === -2) resolve(false);
                else if (err) reject(err);
                else resolve(true);
            });
        });
    },

    isFile : function(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, function (err, stats) {
                if (err) eject(err);
                if (stats.isFile()) resolve(true);
                else resolve(false);
            });
        });
    },

    canAccessUrl : function(url, timeout) {
        return new Promise((resolve, reject) => {
            let _success = false;
            const _req = https.get(url, (res) => {
                _req.abort();
                console.log("Succced to access: " + url);
                _success = true;
                if (res.statusCode !== 200) reject(res.statusMessage);
                else resolve(true);
            });

            _req.on('error', (e) => {
              reject(e);
            });

            setTimeout(function() {
                if (_success) return;
                _req.abort();
                console.log("Failed to access: " + url);
                resolve(false);
            },timeout);
        });
    },

    sleep : function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },


}
