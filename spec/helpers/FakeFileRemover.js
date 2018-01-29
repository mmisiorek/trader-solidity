class FakeFileRemover {
	
	constructor() {
		this.files = [];
	}
	
	getRemoveFilePromise(file) {
		const self = this;
		
		return new Promise(function(resolve, reject) {
			self.files.push(file);
			resolve();
		});
	}
	
	hasFileBeenRemoved(file) {
		return this.files.indexOf(file) > -1;
	}
	
}

module.exports = FakeFileRemover;