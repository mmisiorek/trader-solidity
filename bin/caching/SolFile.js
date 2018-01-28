const importLineRegex = new RegExp("^import (\"|').*(\"|');$", 'i');
const pragmaLineRegex = new RegExp('^pragma .*;$', 'i');
const pragmaSolidityLineRegex = new RegExp('^pragma solidity .*$', 'i');

function findImports(content) {
	let imports = [];
	const contentInLines = content.split("\n"); 
	const regexMatch = new RegExp("(\"|').*(\"|');$" );
	
	for(let line of contentInLines) {
		if(importLineRegex.test(line.trim())) {
			let match = line.trim().match(regexMatch)[0];
			imports.push(match.substring(1, match.length-2)); 
		}
	}
	
	return imports;
}

class SolFile {
	
	constructor(registry, content, fileName) {
		this.content = content;
		this.fileName = fileName;
		this.importFileNames = findImports(this.content);
		
		this.registry = registry;
		this.imports = [];
	}
	
	getCreateImportPromise() {
		const self = this;

		return Promise.resolve().then(function() {
			let promises = [];
			
			self.importStubs = []; 
			for(let fileName of self.importFileNames) {
				if(self.registry.isFileProcessed(fileName)) {
					self.importStubs.push(fileName);
				} else {
					promises.push(self.registry.getSolFilePromise(fileName).then(function(solFile) {
						self.imports.push(solFile);
					})); 
				}
			}
			
			return Promise.all(promises); 
		});
	}
	
	getReplaceImportStubsPromise() {
		const self = this;
		
		return Promise.resolve().then(function() {
			let promises = [];
			
			for(let stub of self.importStubs) {
				promises.push(self.registry.getSolFilePromise(stub, false).then(function(solFile) {
 					self.imports.push(solFile);
				})); 
			}
			
			delete self.importStubs;
			
			return Promise.all(promises); 
		});
	}
	
	getContentWithoutImportsAndPragmas() {
		return this.content.split("\n").filter(function(line) {
			return !importLineRegex.test(line.trim()) && !pragmaLineRegex.test(line.trim());
			
		}).join("\n");
	}
	
	getPragmaSolidity() {
		return this.content.split("\n").filter(function(line) {
			return pragmaSolidityLineRegex.test(line.trim());
			
		}).join('\n');
	}
}

module.exports = SolFile;