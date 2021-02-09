const models = require('../../models/index')
const { transformReport } = require("./merge");

module.exports = {
	getReports: async (args) => {
		try {
			const page = args.page;
			const reports = await models.Report.find({meal: args.meal}).skip((page - 1) * 10).limit(10);
			const res = reports.map(e => {
				return transformReport(e)
			});
			return {
				page: +page,
				reports: res,
				totalPages: parseInt(reports.length / 10) + 1
			}
		} catch (err) {
			console.log(err);
			throw err
		}
	},
	createReport: async (args) => {
		// if (!req.isAuth)
		// 	throw new Error('Unauthenticated');
		try {
			const reportData = new models.Report({
				description: args.reportInput.description,
				meal_item: args.reportInput.meal_item,
				meal: args.reportInput.meal,
				user: "60200e78d89b4f1f4b27105b",
				// user: req.userId
			});
			const result = await reportData.save();
			return transformReport(result);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
}