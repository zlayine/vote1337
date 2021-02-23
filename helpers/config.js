const fs = require('fs');

exports.getConfig = () => {
	let rawdata = fs.readFileSync('./appconfig.json');
	let config = JSON.parse(rawdata);
	return config;
}

exports.updateConfig = (data) => {
	fs.writeFile('./appconfig.json', data, 'utf8', () => {});
	return 1;
}
