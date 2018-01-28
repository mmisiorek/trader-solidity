const fs = require('fs-extra');
const exec = require('child_process').exec;
const FileReader = require('./caching/FileReader.js');
const FileWriter = require('./caching/FileWriter.js');
const CacheBuilder = require('./caching/CacheBuilder.js');
const SolFileRegistry = require('./caching/SolFileRegistry.js');

const contractsDir = __dirname+'/../contracts';
const cacheDir = __dirname+'/../cache'; 
const buildDir = __dirname+'/../build'; 

function createAbiPromise(file, outputDir) {
	return new Promise(function(resolve, reject) {
		const cmd = 'solcjs '+file+" --abi --optimize -o "+outputDir+"/tmp";
		
		console.log("Executing: "+cmd );
		exec(cmd, function(err, stdout, stderr) {
			if(err) {
				reject(err); 
			}
			
			resolve({stdout: stdout, stderr: stderr});
		});
	})/*.then(function(obj) {
		
		return new Promise(function(resolve, reject) {
			fs.readDir(outputDir+"/tmp", function(err, files) {
				if(err) {
					reject(err);
				}
				
				
			});
			
			return obj;
		});
		
	});*/
}

function createBinPromise(file, outputDir) {
	return new Promise(function(resolve, reject) {
		const cmd = 'solcjs '+file+' --bin --optimize -o '+outputDir;
		
		console.log("Executing: "+cmd); 
		exec(cmd, function(err, stdout, stderr) {
			if(err) {
				reject(err);
			}
			
			resolve({stdout: stdout, stderr: stderr});
		});
	});
}



function createCacheFile(files) {
	
}

(function() {
	
	const buildABIDir = buildDir+"/abi";
	const buildBINDir = buildDir+"/bin";
	
	const fReader = new FileReader();
	const fWriter = new FileWriter();
	
	const cacheBuilder = new CacheBuilder(cacheDir, fWriter); 
	
	const entryPoints = ['PublicTrade.sol', 'TradeBuyerStorage.sol', 'SubaccountsOnlyTrade.sol'];
	let promiseChain = Promise.resolve();
	
	const dirsWhichMustExist = [buildDir, cacheDir, buildABIDir, buildBINDir];
	
	for(let dir of dirsWhichMustExist) {
		if(!fs.existsSync(dir)) {
			fs.mkdirSync(dir); 
		}
	}
	
	for(let file of entryPoints) {
		const registry = new SolFileRegistry(contractsDir, fReader);
		
		promiseChain = promiseChain.then(function() {
			return registry.getEntrySolFilePromise(file);
		}).then(function(solFile) {
			return cacheBuilder.buildCachePromise(solFile);
		}).then(function(cacheFileName) {
			return createAbiPromise(cacheFileName, buildABIDir).then(function() {
				return cacheFileName;
			});
		}).then(function(cacheFileName) {
			return createBinPromise(cacheFileName, buildBINDir);
		});
	}
	
	promiseChain.then(function() {
		console.log('The build was successful');
	}, function(err) {
		console.log('Error: ', err); 
	}).then(function() {
		
		fs.removeSync(cacheDir);
		
	});
	
})();
