import development from './development.json';
import production from './production.json';

const { NODE_ENV: mode } = process.env;

const configuration = {
	development,
	production
};

console.log(process.env.mode);

exports.process = { ...configuration[mode], mode };