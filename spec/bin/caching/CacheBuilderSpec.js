const CacheBuilder = require('../../../bin/caching/CacheBuilder.js');
const SolFileRegistry = require('../../../bin/caching/SolFileRegistry.js');
const data = require('../../helpers/data/solFileContents.js');
const FakeFileReader = require('../../helpers/FakeFileReader.js');
const FakeFileWriter = require('../../helpers/FakeFileWriter.js');

describe('CacheBuilder', function() {
	
	let builder,
		fakeReader, 
		fakeWriter,
		registry;
	
	beforeAll(function() {
		fakeReader = new FakeFileReader(data);
	});
	
	beforeEach(function() {
		fakeWriter = new FakeFileWriter();
		builder = new CacheBuilder('', fakeWriter);
		registry = new SolFileRegistry('', fakeReader);
	});
	
	it('generates proper cache for empty', function() {
		
		return registry.getEntrySolFilePromise('Empty.sol').then(function(sol) {
			
			return builder.buildCachePromise(sol); 
			
		}).then(function() {
			expect(fakeWriter.hasForFile('Empty.sol')).toBeTruthy();
			expect(fakeWriter.getContentOfFile('Empty.sol')).toEqual('pragma solidity ^0.4;\n\n contract A{}\n');
			
		});
		
	});
	
	it('generates proper cache for notEmpty', function() {
		
		return registry.getEntrySolFilePromise('NotEmpty.sol').then(function(sol) {
			
			return builder.buildCachePromise(sol); 
			
		}).then(function() {
			expect(fakeWriter.hasForFile('NotEmpty.sol')).toBeTruthy();
			expect(fakeWriter.getContentOfFile('NotEmpty.sol')).toEqual('pragma solidity ^0.4;\n\n contract A{}\n\n contract B{}\n');
			
		});
		
	});
	
	it('generates proper cache for recur1', function() {
		
		return registry.getEntrySolFilePromise('Recur1.sol').then(function(sol) {
			
			return builder.buildCachePromise(sol); 
			
		}).then(function() {
			expect(fakeWriter.hasForFile('Recur1.sol')).toBeTruthy();
			expect(fakeWriter.getContentOfFile('Recur1.sol')).toEqual('pragma solidity ^0.4;\n\n contract A{}\n\n contract D{}\n\n contract C{}\n');
			
		});
		
	});
	
	it('generates proper cache for recur2', function() {
		
		return registry.getEntrySolFilePromise('Recur2.sol').then(function(sol) {
			
			return builder.buildCachePromise(sol); 
			
		}).then(function() {
			expect(fakeWriter.hasForFile('Recur2.sol')).toBeTruthy();
			expect(fakeWriter.getContentOfFile('Recur2.sol')).toEqual('pragma solidity ^0.4;\n\n contract C{}\n\n contract A{}\n\n contract D{}\n');
			
		});
		
	});
	
});