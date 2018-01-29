function basename(str) {
    return str.substr(str.lastIndexOf('/') + 1);
}

function createCmd(builder) {
	let cmd = ['solcjs', builder.solFileName];
	
	if(['abi', 'bin'].indexOf(builder.compileType) > -1) {
		cmd.push("--"+builder.compileType);
	}
	
	cmd.push('--optimize -o');
	cmd.push(builder.getOutputDir());
	
	return cmd.join(' '); 
}

function getRemoveBuildDirectoryFirst(builder) {
	return builder.fileRemover.getRemoveFilePromise(builder.outputDir).then(function() {
		return builder.directoryCreator.getCreateDirectoryPromise(builder.outputDir);
	});
}

function getCompilePromise(builder) {
	const cmd = createCmd(builder);
	const self = builder;
	
	return Promise.resolve().then(function() {
		console.log('Executing: '+cmd);
		
		return self.cmdExecutor.getExecuteCommandPromise(cmd);
	}).then(function(obj) {
		if(obj.stdout) {
			console.log(obj.stdout);
		}
		if(obj.stderr) {
			console.error(obj.stderr); 
		}
	});
}

function getRenameFilesPromise(builder) {
	const self = builder;
	
	return Promise.resolve().then(function() {
		// read all files from tmp directory
		return self.directoryReader.getReadDirectoryPromise(self.getOutputDir());
	}).then(function(files) {
		// rename all files in tmp directory
		
		return Promise.all(files.map(function(file) {
			let newFileName = basename(self.solFileName).replace(".", '_');
			let lastName = file.split("_").pop();
			
			newFileName += "_"+lastName;
			
			return self.fileMover.getMoveFilePromise(self.getOutputDir()+"/"+file, self.getOutputDir()+"/"+newFileName).then(function() {
				return newFileName; 
			});
		}));
	}).then(function(newFileNames) {
		// move them to the parent directory
		let promise = Promise.all(newFileNames.map(function(name) {
			return self.fileMover.getMoveFilePromise(self.getOutputDir()+"/"+name, self.getOutputDir()+"/../"+name);
		}));
		
		
		if(self.returnCreatedFilenames) {
			promise = promise.then(function() {
				return newFileNames;
			});
		} else {
			// this is needed to return promise undefined despite of Promise.all
			promise = promise.then(function() {
				return undefined;
			});
		} 
		
		return promise;
	});
}

function getRemoveTemporaryDirPromise(builder) {
	const self = builder;
	
	return Promise.resolve().then(function() {
		
		return self.fileRemover.getRemoveFilePromise(builder.getOutputDir()); 
		
	});
}

class SolcjsPromiseBuilder {
	
	constructor(cmdExecutor, directoryReader, fileMover, fileRemover, dirCreator, compileType, solFileName, outputDir) {
		this.cmdExecutor = cmdExecutor;
		this.directoryReader = directoryReader;
		this.fileMover = fileMover;
		this.fileRemover = fileRemover;
		this.directoryCreator = dirCreator;
		
		this.compileType = compileType;
		this.solFileName = solFileName;
		this.outputDir = outputDir;
		
		this.removeBuildDirectoryFirst = false;
		this.toTemporaryDir = false;
		this.changeFilenames = false;
		this.deleteTemporaryDirAfterUse = false;
		this.returnCreatedFilenames = false;
	}
	
	setRemoveBuildDirectoryFirst(val) {
		this.removeBuildDirectoryFirst = val;
		return this;
	}
	
	setToTemporaryDir(val) {
		this.toTemporaryDir = val;
		return this;
	}
	
	setChangeFilenames(val) {
		if(val) {
			this.toTemporaryDir = true;
		}
		
		this.changeFilenames = val;
		
		return this;
	}
	
	setDeleteTemporaryDirAfterUse(val) {
		if(this.toTemporaryDir) {
			this.deleteTemporaryDirAfterUse = val;
		}
		
		return this;
	}
	
	setReturnCreatedFilenames(val) {
		if(this.changeFilenames) {
			this.returnCreatedFilenames = val;
		}
		
		return this;
	}
	
	getOutputDir() {
		return this.toTemporaryDir ? this.outputDir+"/tmp" : this.outputDir;
	}
	
	build() {
		const self = this;
		
		let promise = Promise.resolve();
		if(this.removeBuildDirectoryFirst) {
			promise = getRemoveBuildDirectoryFirst(this);
		}
		
		promise = promise.then(function() {
			return getCompilePromise(self);
		});
		
		if(this.changeFilenames) {
			promise = promise.then(function() {
				return getRenameFilesPromise(self);
			});
		}
		
		if(this.deleteTemporaryDirAfterUse) {
			promise = promise.then(function(renamedFiles) {
				let removePromise = getRemoveTemporaryDirPromise(self);
				
				if(renamedFiles !== undefined) {
					removePromise = removePromise.then(function() {
						return renamedFiles;
					});
				}
				
				return removePromise;
			});
		}
		
		return promise;
	}
	
}

module.exports = SolcjsPromiseBuilder; 