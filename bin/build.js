const fs = require('fs-extra');
const exec = require('child_process').exec;
const FileReader = require('./caching/FileReader.js');
const FileWriter = require('./caching/FileWriter.js');
const CacheBuilder = require('./caching/CacheBuilder.js');
const SolFileRegistry = require('./caching/SolFileRegistry.js');

const SolcjsPromiseBuilder = require('./promiseBuilders/SolcjsPromiseBuilder.js');
const CommandExecutor = require('./promiseBuilders/CommandExecutor.js');
const DirectoryReader = require('./promiseBuilders/DirectoryReader.js');
const FileRemover = require('./promiseBuilders/FileRemover.js');
const FileMover = require('./promiseBuilders/FileMover.js');
const DirectoryCreator = require('./promiseBuilders/DirectoryCreator.js');

const contractsDir = __dirname+'/../contracts';
const cacheDir = __dirname+'/../cache'; 
const buildDir = __dirname+'/../build'; 

(function() {
	
	const buildABIDir = buildDir+"/abi";
	const buildBINDir = buildDir+"/bin";
	
	const fReader = new FileReader();
	const fWriter = new FileWriter();
	const cmdExecutor = new CommandExecutor();
	const dirReader = new DirectoryReader();
	const fMover = new FileMover();
	const fRemover = new FileRemover();
	const dirCreator = new DirectoryCreator();
	
	const cacheBuilder = new CacheBuilder(cacheDir, fWriter); 
	
	const entryPoints = ['PublicTrade.sol', 'TradeBuyerStorage.sol', 'SubaccountsOnlyTrade.sol'];
	let promiseChain = Promise.resolve();
	
	const dirsWhichMustExist = [buildDir, cacheDir, buildABIDir, buildBINDir];
	
	for(let dir of dirsWhichMustExist) {
		if(!fs.existsSync(dir)) {
			fs.mkdirSync(dir); 
		}
	}
	
	for(let i = 0; i < entryPoints.length; i++) {
		const file = entryPoints[i];
		const registry = new SolFileRegistry(contractsDir, fReader);
		const isFirstFile = (i===0);
		
		promiseChain = promiseChain.then(function() {
			return registry.getEntrySolFilePromise(file);
		}).then(function(solFile) {
			return cacheBuilder.buildCachePromise(solFile);
		}).then(function(cacheFileName) {
			const builder = new SolcjsPromiseBuilder(cmdExecutor, dirReader, fMover, fRemover, dirCreator, 'abi', cacheFileName, buildABIDir);
			
			builder.setChangeFilenames(true)
					.setDeleteTemporaryDirAfterUse(true)
					.setReturnCreatedFilenames(true)
					.setRemoveBuildDirectoryFirst(isFirstFile);
			
			return builder.build().then(function(createdFiles) {
				return {
					cacheFileName: cacheFileName,
					createdFiles: createdFiles
				};
			});
		}).then(function(obj) {
			const builder = new SolcjsPromiseBuilder(cmdExecutor, dirReader, fMover, fRemover, dirCreator, 'bin', obj.cacheFileName, buildBINDir);
			
			builder.setChangeFilenames(true)
					.setDeleteTemporaryDirAfterUse(true)
					.setReturnCreatedFilenames(true)
					.setRemoveBuildDirectoryFirst(isFirstFile);
			
			return builder.build().then(function(createdFiles) {
				return createdFiles.concat(obj.createdFiles);
			});
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
