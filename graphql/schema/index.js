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
}

input UserInput {
	username: String!
    displayname: String!
	intra_id: String!
	image_url: String!
	staff: Boolean!
	campus: String!
}

type RootQuery {
    getMeals(page: Int): MealData!
    getReports(page: Int): ReportData!
}

type RootMutation {
	createMeal(mealInput: MealInput): Meal
	createReport(reportInput: ReportInput): Report
	createUser(userInput: UserInput): User
	addVote(voteInput: VoteInput): Vote
	testFile(file: Upload!, name: String!): String!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);