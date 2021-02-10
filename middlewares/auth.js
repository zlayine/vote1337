const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
	const authData = req.get('Authorization');
	if (!authData)
	{
		req.isAuth = false;
		return next();
	}
	const token = authData.split(' ')[1];
	if (!token || token == '')
	{
		req.isAuth = false;
		return next();
	}
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, 'herfhehrbve12jkdkfdf')
	} catch (err) {
		req.isAuth = false;
		return next();
	}
	if (!decodedToken)
	{
		req.isAuth = false;
		return next();
	}
	req.isAuth = true;
	req.userId = decodedToken.userId;
	return next();
}