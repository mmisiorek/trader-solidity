function basename(str) {
    return str.substr(str.lastIndexOf('/') + 1);
}

class SolFileTracker {
	
	constructor() {
		this.files = {}; 
	}

	track(solFile) {
		this.files[solFile.fileName] = solFile;
		
		for(let subSolFile of solFile.imports) {
			if(!this.files[subSolFile.fileName]) {
				this.track(subSolFile);
			}
		}
		
		return this.getFiles();
	}
	
	getFiles() {
		const self = this;
		
		return Object.keys(this.files).map(function(key) {
			return self.files[key]; 
		}).reverse();
	}
}

class CacheBuilder {
	
	constructor(cacheDir, fileWriter) {
		this.cacheDir = cacheDir;
		this.fileWriter = fileWriter;
	}
	
	buildCachePromise(solFile) {
		const self = this;
		
		return new Promise(function(resolve, reject) {
			const fileName = basename(solFile.fileName); 
			const prefix = self.cacheDir ? self.cacheDir+"/" : "";
			const cacheFilePath = prefix+fileName;
			const tracker = new SolFileTracker();
			const solFiles = tracker.track(solFile);
			
			let fileContent = solFiles[0].getPragmaSolidity()+"\n";
			for(let f of solFiles) {
				fileContent += f.getContentWithoutImportsAndPragmas()+"\n";
			}
			
			self.fileWriter.getWriteFilePromise(cacheFilePath, fileContent).then(function() {
				resolve(cacheFilePath);
			});
		});
	}
	
}

module.exports = CacheBuilder;