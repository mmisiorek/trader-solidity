const fs = require('fs'); 

class DirectoryReader {
	
	getReadDirectoryPromise(dirPath) {
		return new Promise(function(resolve, reject) {
			fs.readdir(dirPath, function(err, files) {
				if(err) {
					reject(err);
				}
				
				resolve(files);
			});
		});
	}
	
}

module.exports = DirectoryReader;