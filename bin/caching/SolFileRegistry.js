const SolFile = require('./SolFile.js');
const fs = require('fs'); 

class SolFileRegistry {
	
	constructor(contextDir, fileReader) {
		this.contextDir = contextDir;
		this.fileReader = fileReader;
		
		this.solFiles = {};
		this.processingFiles = {};
	}
	
	isFileProcessed(fileName) {
		return fileName in this.processingFiles;
	}
	
	getSolFilePromise(fileName, addToProcessingFiles) {
		const self = this;
		
		if(addToProcessingFiles === undefined) {
			addToProcessingFiles = true;
		}
		
		return new Promise(function(resolve, reject) {
			
			if(addToProcessingFiles) {
				self.processingFiles[fileName] = true;
			}
			
			resolve();
		}).then(function() {
			
			return Promise.resolve().then(function() {
				
				const solFileFromRegistry = self.solFiles[fileName];
				
				if(solFileFromRegistry) {
					return Promise.resolve(solFileFromRegistry); 
					
				} else {
					const prefix = self.contextDir ? self.contextDir+"/" : "";
					
					return self.fileReader.getReadFilePromise(prefix+fileName).then(function(content) {
						const solFile = new SolFile(self, content, fileName);
						
						return solFile.getCreateImportPromise().then(function() {
							return solFile; 
						});
					});
				}
			});
			
		}).then(function(solFile) {
			
			self.solFiles[fileName] = solFile;
			if(addToProcessingFiles) {
				delete self.processingFiles[fileName];
			}
			
			return solFile;
		});
		
	}
	
	getEntrySolFilePromise(fileName) {
		const self = this;
		
		return this.getSolFilePromise(fileName).then(function() {
			let promises = [];
			
			for(let solFileName in self.solFiles) {
				promises.push(self.solFiles[solFileName].getReplaceImportStubsPromise());
			}
			
			return Promise.all(promises);
		}).then(function() {
			return self.solFiles[fileName];
		});
	}
}

module.exports = SolFileRegistry;