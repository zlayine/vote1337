exports.dateToString = date => {
	return new Date(date).toISOString();
}
exports.dateToFormat = date => {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2)
		month = '0' + month;
	if (day.length < 2)
		day = '0' + day;
	let str = [year, month, day].join('-');
	str += " " + d.getHours() + ":" + d.getMinutes();
	return str;
}