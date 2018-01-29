class FakeDirectoryReader {
	
	constructor(data) {
		this.data = data;
	}
	
	getReadDirectoryPromise(dirName) {
		const self = this;
		
		return new Promise(function(resolve, reject) {
			if(!(dirName in self.data)) {
				resolve([]);
				return;
			}
			
			resolve(self.data[dirName]);
		});
	}
	
}

module.exports = FakeDirectoryReader;