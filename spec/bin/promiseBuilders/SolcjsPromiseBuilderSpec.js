const SolcjsPromiseBuilder = require('../../../bin/promiseBuilders/SolcjsPromiseBuilder.js');
const FakeCommandExecutor = require('../../helpers/FakeCommandExecutor.js');
const FakeFileMover = require('../../helpers/FakeFileMover.js');
const FakeFileRemover = require('../../helpers/FakeFileRemover.js');
const FakeDirectoryReader = require('../../helpers/FakeDirectoryReader.js');
const FakeDirectoryCreator = require('../../helpers/FakeDirectoryCreator.js');

describe('SolcjsPromiseBuilder', function() {
	
	let cmdExecutor;
	let fileMover;
	let fileRemover;
	let dirReader;
	let dirCreator;
	let builder;
	
	beforeAll(function() {
		dirReader = new FakeDirectoryReader({
			'/tmp': [
				'_home_solidity_code_bin____cache_PublicTrade_sol_DestroyableTrade.abi',
				'_home_solidity_code_bin____cache_PublicTrade_sol_IDestroyableContract.abi',
				'_home_solidity_code_bin____cache_PublicTrade_sol_PublicTrade.abi',
				'_home_solidity_code_bin____cache_PublicTrade_sol_Trade.abi'
			]
		}); 
	});
	
	beforeEach(function() {
		fileMover = new FakeFileMover();
		fileRemover = new FakeFileRemover();
		cmdExecutor = new FakeCommandExecutor();
		dirCreator = new FakeDirectoryCreator();
		
		builder = new SolcjsPromiseBuilder(cmdExecutor, dirReader, fileMover, fileRemover, dirCreator, 'abi', "Contract1.sol", '');
	});
	
	it('works with only compile', function() {
		return builder.build().then(function() {
			expect(cmdExecutor.cmds.length).toBe(1);
			expect(cmdExecutor.cmds[0]).toMatch(/solcjs .* --abi --optimize -o .*/);
		});
	});
	
	it('works with only compile and remove dir', function() {
		return builder.setRemoveBuildDirectoryFirst(true)
						.build().then(function() {
							
			expect(cmdExecutor.cmds.length).toBe(1);
			expect(cmdExecutor.cmds[0]).toMatch(/solcjs .* --abi --optimize -o .*/);
			expect(fileRemover.files.length).toBe(1);
			expect(dirCreator.directories.length).toBe(1);
			expect(dirCreator.directories[0]).toBe(fileRemover.files[0]);
		});
	});
	
	it('works with only move file', function() {
		return builder
				.setChangeFilenames(true)
				.build().then(function() {
					
			expect(cmdExecutor.cmds.length).toBe(1);
			expect(cmdExecutor.cmds[0]).toMatch(/solcjs .* --abi --optimize -o .*/);
			for(let fileName of dirReader.data['/tmp']) {
				expect(fileMover.getDestinationsForSource("/tmp/"+fileName).length).toBe(1);
				
				let newPath = fileMover.getDestinationsForSource("/tmp/"+fileName)[0];
				expect(fileMover.getDestinationsForSource(newPath).length).toBe(1); 
				expect(fileMover.getDestinationsForSource(newPath)[0]).toMatch(/\/..\//);
				
				let destFileName = fileMover.getDestinationsForSource(newPath)[0].split('/').reverse()[0];
				expect(destFileName).toMatch(/Contract1_sol_.*\.abi/);
			}
		});
	});
	
	it('works with move file and remove temporary directory', function() {
		return builder
				.setChangeFilenames(true)
				.setDeleteTemporaryDirAfterUse(true)
				.build().then(function(arg) {
					
			expect(cmdExecutor.cmds.length).toBe(1);
			expect(cmdExecutor.cmds[0]).toMatch(/solcjs .* --abi --optimize -o .*/);
			for(let fileName of dirReader.data['/tmp']) {
				expect(fileMover.getDestinationsForSource("/tmp/"+fileName).length).toBe(1);
				
				let newPath = fileMover.getDestinationsForSource("/tmp/"+fileName)[0];
				expect(fileMover.getDestinationsForSource(newPath).length).toBe(1); 
				expect(fileMover.getDestinationsForSource(newPath)[0]).toMatch(/\/..\//);
				
				let destFileName = fileMover.getDestinationsForSource(newPath)[0].split('/').reverse()[0];
				expect(destFileName).toMatch(/Contract1_sol_.*\.abi/);
			}
			
			expect(fileRemover.files.length).toBe(1);
			expect(arg).toBeUndefined();
		});
	});
	
	it('works with move file and remove temporary directory', function() {
		return builder
				.setChangeFilenames(true)
				.setDeleteTemporaryDirAfterUse(true)
				.setReturnCreatedFilenames(true)
				.build().then(function(arg) {
					
			expect(cmdExecutor.cmds.length).toBe(1);
			expect(cmdExecutor.cmds[0]).toMatch(/solcjs .* --abi --optimize -o .*/);
			for(let fileName of dirReader.data['/tmp']) {
				expect(fileMover.getDestinationsForSource("/tmp/"+fileName).length).toBe(1);
				
				let newPath = fileMover.getDestinationsForSource("/tmp/"+fileName)[0];
				expect(fileMover.getDestinationsForSource(newPath).length).toBe(1); 
				expect(fileMover.getDestinationsForSource(newPath)[0]).toMatch(/\/..\//);
				
				let destFileName = fileMover.getDestinationsForSource(newPath)[0].split('/').reverse()[0];
				expect(destFileName).toMatch(/Contract1_sol_.*\.abi/);
			}
			
			expect(fileRemover.files.length).toBe(1);
			
			expect(arg).toBeDefined();
			expect(arg.length).toBe(4);
		});
	});
	
});