const models = require('../../models/index')
const { transformReport } = require("./merge");

module.exports = {
	getReports: async (args) => {
		try {
			// const count = parseInt(await models.Report.count() / 10);
			// const reports = await models.Report.find({ meal: args.meal }).skip((page - 1) * 10).limit(10);
			const reports = await models.Report.find({ meal: args.meal });
			return reports.map(e => {
				return transformReport(e)
			});
		} catch (err) {
			console.log(err);
			throw err
		}
	},
}