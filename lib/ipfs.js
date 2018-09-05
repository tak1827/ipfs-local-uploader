/**
 * IPFS util functions
 */
 
/* read modules */
const { spawn } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const ut = require(__dirname+'/util.js');

let daemon;
const daemonReadyTxt = "Daemon is ready";




module.exports = {

    daemonStart : function(path) {
        return new Promise(async (resolve, reject) => {
            daemon = spawn('ipfs', ['daemon']);

            daemon.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
              if (data.includes(daemonReadyTxt)) resolve(true);
            });

            daemon.stderr.on('data', (data) => {
              console.log(`stderr: ${data}`);
              reject(data);
            });

            daemon.on('close', (code) => {
              console.log(`child process exited with code ${code}`);
            });
        });
    },


    daemonKill : function() {
        return new Promise(async (resolve, reject) => {
            daemon.kill('SIGHUP');
            resolve(true);
        });
    },

    add : function(path) {
        return new Promise(async (resolve, reject) => {
            try {

                // Check wether path exist
                const _exist = await ut.pathExist(path);

                if (!_exist) reject("no such file or directory");

                // Check whether file or dir
                const _isFile = await ut.isFile(path);
                
                // Execute add command
                const _cmd  = _isFile ? 'ipfs add '+ _path : 'ipfs add -r ' + path;
                const { stdout } = await exec(_cmd);

                resolve(stdout);

            } catch(e) { reject(e); }
        });
    },


}
