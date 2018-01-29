const exec = require('child_process').exec;

class CommandExecutor {
	
	getExecuteCommandPromise(cmd) {
		return new Promise(function(resolve, reject) {
			exec(cmd, function(err, stdout, stderr) {
				if(err){
					reject(err);
					return;
				}
				
				resolve({stdout: stdout, stderr: stderr}); 
			});
		});
	}
	
}

module.exports = CommandExecutor;