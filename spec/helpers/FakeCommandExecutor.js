class FakeCommandExecutor {
	
	constructor() {
		this.cmds = [];
	}
	
	getExecuteCommandPromise(cmd) {
		const self = this;
		
		return new Promise(function(resolve, reject) {
			self.cmds.push(cmd);
			resolve({stdout: '', stderr: ''});
		});
	}
	
}

module.exports = FakeCommandExecutor;