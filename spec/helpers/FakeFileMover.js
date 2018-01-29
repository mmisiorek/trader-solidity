class FakeFileMover {
	
	constructor() {
		this.moves = [];
	}
	
	getMoveFilePromise(from, to) {
		const self = this;
		
		return new Promise(function(resolve, reject) {
			self.moves.push({from: from, to: to});
			resolve();
		});
	}
	
	getDestinationsForSource(source) {
		return this.moves.filter(function(obj) {
			return obj.from === source;
		}).map(function(obj) {
			return obj.to;
		});
	}
	
	getSourcesForDestination(dest) {
		return this.moves.filter(function(obj) {
			return obj.to === dest;
		}).map(function(obj) {
			return obj.from;
		});
	}
}

module.exports = FakeFileMover;