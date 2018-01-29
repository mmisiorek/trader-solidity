const fs = require('fs-extra');

class FileRemover {
	
	getRemoveFilePromise(file) {
		return new Promise(function(resolve, reject) {
			fs.remove(file, function(err) {
				if(err) {
					reject(err);
				} else {
					resolve(); 
				}
			});
		})
	}
	
}

module.exports = FileRemover;