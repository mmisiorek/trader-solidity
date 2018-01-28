const fs = require('fs');

class FileWriter {
	getWriteFilePromise(fileName, data) {
		
		return new Promise(function(resolve, reject) {
			fs.writeFile(fileName, data, function(err) {
				if(err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
		
	}
};

module.exports = FileWriter;