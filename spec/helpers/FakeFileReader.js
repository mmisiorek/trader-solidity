class FakeFileReader {
	
	constructor(contents) {
		this.contents = contents;
	}
	
	getReadFilePromise(fileName) {
		const self = this;
		
		return new Promise(function(resolve, reject) {
			if(fileName in self.contents) {
				resolve(self.contents[fileName]);
			} else {
				reject();
			}
			
		});
	}
}

module.exports = FakeFileReader;