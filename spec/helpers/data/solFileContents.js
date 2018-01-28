const contents = {
	"Empty.sol": "pragma solidity ^0.4;\n\n contract A{}",
	"NotEmpty.sol": "pragma solidity ^0.4;\n\n import 'Empty.sol';\n contract B{}",
	"Recur1.sol": "pragma solidity ^0.4;\n\n import 'Recur2.sol';\n contract C{}",
	"Recur2.sol": "pragma solidity ^0.4;\n\n import 'Empty.sol';\n import 'Recur1.sol';\n contract D{}"
};

module.exports = contents;