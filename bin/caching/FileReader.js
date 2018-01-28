const fs = require('fs');

class FileReader {
	getReadFilePromise(fileName) {
		
		return new Promise(function(resolve, reject) {
			fs.readFile(fileName, 'utf8', function(err, content) {
				if(err) {
					reject(err);
				} else {
					resolve(content); 
				}
			});
		});
	}
};

module.exports = FileReader;