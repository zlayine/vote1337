const fs = require('fs');

exports.getConfig = () => {
	let rawdata = fs.readFileSync('./appconfig.json');
	let config = JSON.parse(rawdata);
	return config;
}

exports.updateConfig = (data) => {
	fs.writeFileSync('./appconfig.json', JSON.stringify(data));
	return 1;
}
