const fs = require('fs');

class FileMover {
	
	getMoveFilePromise(from, to) {
		return new Promise(function(resolve, reject) {
			fs.rename(from, to, function(err) {
				if(err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
	
}

module.exports = FileMover;