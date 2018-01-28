const SolFileRegistry = require('../../../bin/caching/SolFileRegistry.js');
const SolFile = require('../../../bin/caching/SolFile.js');
const contents = require('../../helpers/data/solFileContents.js');
const FakeFileReader = require('../../helpers/FakeFileReader.js');

describe('SolFileRegistry', function() {
	
	let fileReader,
		registry;
	
	beforeEach(function() { 
		fileReader = new FakeFileReader(contents); 
		registry = new SolFileRegistry('', fileReader);
	});
	
	it('sol files from getSolFilePromise have proper imports attribute for empty', function() {
		return registry.getSolFilePromise('Empty.sol').then(function(emptySol) {
			expect(emptySol.imports).toBeDefined();
			expect(emptySol.imports.length).toBe(0);
		});
	});
	
	it('sol files from getSolFilePromise have proper imports attribute for nonEmpty', function() {
		return registry.getSolFilePromise('NotEmpty.sol').then(function(sol) {
			expect(sol.imports).toBeDefined();
			expect(sol.imports.length).toBe(1);
		});
	});
	
	it('sol files from getSolFilePromise have proper imports attribute for Recur1', function() {
		return registry.getSolFilePromise('Recur1.sol').then(function(sol) {
			expect(sol.imports).toBeDefined();
			expect(sol.imports.length).toBe(1);
			
			expect(sol.imports[0].imports).toBeDefined();
			expect(sol.imports[0].imports.length).toBe(1);
			expect(sol.imports[0].importStubs).toBeDefined();
			expect(sol.imports[0].importStubs.length).toBe(1);
		});
	});
	
	it('sol files from getSolFilePromise have proper imports attribute for Recur2', function() {
		return registry.getSolFilePromise('Recur2.sol').then(function(sol) {
			expect(sol.imports).toBeDefined();
			expect(sol.imports.length).toBe(2);
		});
	});
	
	it('sol files from getEntrySolFilePromise have proper imports attribute for Recur1', function() {
		return registry.getEntrySolFilePromise('Recur1.sol').then(function(sol) {
			expect(sol.imports).toBeDefined();
			expect(sol.imports.length).toBe(1);
			
			expect(sol.imports[0].imports).toBeDefined();
			expect(sol.imports[0].imports.length).toBe(2);
			expect(sol.imports[0].importStubs).toBeUndefined();
		});
	});
	
});
