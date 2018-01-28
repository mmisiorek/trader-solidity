class FakeFileWriter {
	
	constructor() {
		this.files = {};
	}
	
	getWriteFilePromise(fileName, content) {
		const self = this;
		
		return new Promise(function(resolve, reject) {
			if(!(fileName in self.files)) {
				self.files[fileName] = "";
			}
			
			self.files[fileName] += content;
			resolve();
		});
	}
	
	hasForFile(fileName) {
		return fileName in this.files;
	}
	
	getContentOfFile(fileName) {
		if(!this.hasForFile(fileName)) {
			throw new Error();
		}
		
		return this.files[fileName];
	}
	
}

module.exports = FakeFileWriter;