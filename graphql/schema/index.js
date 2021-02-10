const { buildSchema } = require("graphql")
module.exports = buildSchema(`
scalar Upload

type User {
    _id: ID!
    username: String!
    displayname: String!
	intra_id: String!
	image_url: String!
	staff: Boolean!
	campus: String!
}

type Meal {
    _id: ID!
    name: String!
    votes_up: Int!
    votes_down: Int!
    user: User!
	reports: [Report!]
	meals: [MealItem!]!
	createdAt: String!
    updatedAt: String!
}

type MealItem {
    _id: ID!
    name: String!
    image_url: String!
	votes_up: Int!
	votes_down: Int!
	votes_sick: Int!
	meal: Meal!
	votes: [Vote!]
	createdAt: String!
    updatedAt: String!
}

type Report {
    _id: ID!
    description: String!
    meal_item: MealItem!
    meal: Meal!
	user: User!
	createdAt: String!
    updatedAt: String!
}

type Vote {
    _id: ID!
    user: User!
    vote: String!
    meal_item: MealItem!
	createdAt: String!
    updatedAt: String!
}

type MealData {
	meals: [Meal!]
	page: Int
	totalPages: Int
}

type ReportData {
	reports: [Report!]
	page: Int
	totalPages: Int
}

type LoginData {
	user: User!
	token: String!
}

input MealItemInput {
	name: String!
	image: Upload!
}

input MealInput {
    name: String!
	items: [MealItemInput!]!
}

input ReportInput {
	description: String!
	meal_item: String!
	meal: String!
}

input VoteInput {
	vote: String!
	meal_item_id: String!
	report: String!
}

type RootQuery {
    getMeals(page: Int): MealData!
    getReports(page: Int, meal: String!): ReportData!
	login(userId: String!): LoginData!
	getUser(userId: String!): User!
}

type RootMutation {
	createMeal(mealInput: MealInput): Meal
	deleteMeal(mealId: String!): String
	createReport(reportInput: ReportInput): Report
	createUser(code: String!): LoginData
	addVotes(voteInput: [VoteInput!]!, meal: String!): Meal
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);