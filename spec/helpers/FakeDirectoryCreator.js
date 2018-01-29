class FakeDirectoryCreator {
	constructor() {
		this.directories = [];
	}
	
	getCreateDirectoryPromise(dir) {
		const self = this;
		
		return new Promise(function(resolve, reject) {
			self.directories.push(dir);
			resolve();
		});
	}
}

module.exports = FakeDirectoryCreator;