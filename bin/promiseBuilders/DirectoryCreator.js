const fs = require('fs');

class DirectoryCreator {
	
	getCreateDirectoryPromise(dir) {
		return new Promise(function(resolve, reject) {
			fs.mkdir(dir, function(err) {
				if(err) {
					reject(err);
				} else {
					resolve();
				}
			})
		});
	}
	
}

module.exports = DirectoryCreator;