const SolFile = require('../../../bin/caching/SolFile.js');
const contents = require('../../helpers/data/solFileContents.js');

describe('SolFile constructor', function() {
	
	it('for empty should have empty array import', function() {
 		const sol = new SolFile({}, contents['Empty.sol'], 'Empty.sol');
		expect(sol.importFileNames.length).toBe(0);
	});
	
	it('for not empty should have exactly one element in imports array', function() {
		const sol = new SolFile({}, contents['NotEmpty.sol'], 'NotEmpty.sol');
		expect(sol.importFileNames.length).toBe(1);
		expect(sol.importFileNames[0]).toBe('Empty.sol');
	});
	
	
	
});

describe('SolFile getReplaceImportStubsPromise', function() {
	
	let registry;
	
	class FakeRegistry {
		constructor(obj) {
			this.files = {};
			for(let fileName in obj) {
				let content = obj[fileName];
				this.files[fileName] = new SolFile(this, content, fileName); 
			}
		}
		
		getSolFilePromise(fileName, i) {
			const self = this;
			
			return new Promise(function(resolve, reject) {
				if(fileName in self.files) {
					resolve(self.files[fileName]);
				} else {
					reject();
				}
			});
		}
	}
	
	beforeEach(function() {
		registry = new FakeRegistry(contents);
	});
	
	it('works', function() {
		const sol = new SolFile(registry, contents['Empty.sol'], 'Empty.sol');
		sol.importStubs = ['Recur1.sol', 'Recur2.sol'];
		
		return sol.getReplaceImportStubsPromise().then(function() {
			expect(sol.imports).toBeDefined();
			expect(sol.imports.length).toBe(2); 
		});
	});
});

describe('SolFile getContentWithoutImportsAndPragmas', function() {
	
	it('works', function() {
		const sol = new SolFile({}, contents['NotEmpty.sol'], 'NotEmpty.sol');
		const newContent = sol.getContentWithoutImportsAndPragmas();
		
 		expect(newContent.split("\n").length).toBe(2);
	});
	
});
 
describe('SolFile getPragmaSolidity', function() {
	
	it('works', function() {
		const sol = new SolFile({}, contents['NotEmpty.sol'], 'NotEmpty.sol');
		const newContent = sol.getPragmaSolidity();
		
 		expect(newContent).toBe("pragma solidity ^0.4;");
	});
	
});
