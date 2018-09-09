/**
 * Observe ipfs upload task 
 */

/* read modules */
const ut = require(__dirname+'/lib/util.js');
const ipfs = require(__dirname+'/lib/ipfs.js');

const hashes = [];
const timeout = 3000;
const ipfsUrl = 'https://ipfs.io/ipfs/';
const hashListFile = __dirname+'/output/hash-list.txt'

// Record hash info to file
async function recordHash(line) {
	try {

		// Check wether path exist
		const _exist = await ut.pathExist(hashListFile);

		const _hashList = _exist ? await ut.readFile(hashListFile) : "";

	  let _hasHash = false;

	  for (let _line of _hashList.split('\n')) {
	  	if (line == _line) {
	  		_hasHash = true;
	  		break;
	  	}
	  }

	  if (!_hasHash) { 
	  	console.log(line);
	  	await ut.appendFile(hashListFile, line+'\n');
	  }

	  return;

  } catch(e) { throw e; }
}

// Recurcively access to ipfs server
async function recursiveAccess() {
	try {

		let _uploaded = false;
		
    for (let hash of hashes) {

			_uploaded = await ut.canAccessUrl(ipfsUrl + hash, timeout); 

	  	if (!_uploaded) break;
	  }

	  if (!_uploaded) return false;
	  else return true;

	} catch(e) { throw e; }
}

// Check whether upload task finish
async function checkUpload() {
	try {

		let _cycle = 0;

		const _recursiveAccessChecker = setInterval(async function() { 
			try {
				_cycle++;
				console.log("Cycle: " + _cycle);

				let canAccess = await recursiveAccess();

				if (canAccess) { _stopChecker("Upload Completed!"); }

			} catch (e) { _stopChecker(e); }

		}, timeout * hashes.length + 1000);

		const _stopChecker = (msg) => {
			console.log(msg);
			clearInterval(_recursiveAccessChecker); 
			ipfs.daemonKill();
		}


	} catch(e) { throw e; }
}

async function mainTask() {
	try {

		// Path is not specified
		if (process.argv[2] === undefined) { console.log('missing argument.'); return; }

		await ipfs.daemonStart();

		const _stdout = await ipfs.add(process.argv[2]);

		// Create hash list
	  for (let _line of _stdout.split('\n')) {
	  	let _hash = _line.split(' ')[1];
	  	if (_hash) { hashes.push(_hash); await recordHash(_line); }
	  }

	  await checkUpload();

	} catch(e) { console.log(e); }
}

mainTask();
