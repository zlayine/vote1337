module.exports = `
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
	enabled: Boolean
	createdAt: String!
    updatedAt: String!
}

type MealItem {
    _id: ID!
    name: String!
    image_url: String!
	votes_up: Int!
	votes_down: Int!
	reports: Int!
	meal: Meal!
	votes: [Vote!]
	createdAt: String!
    updatedAt: String!
}

type MealExport {
	mealName: String
	itemName: String!
	votes_up: Int!
	votes_down: Int!
	user: String!
	vote: String!
	report: String
	voteDate: String!
	mealDate: String!
}

type Vote {
    _id: ID!
    user: User!
    vote: String!
    meal_item: MealItem!
	createdAt: String!
    updatedAt: String!
}

type Report {
	_id: ID!
	user: User!
	meal_item: MealItem!
	report: String!
	createdAt: String!
}

type ReportData {
	reports: [Report!]
	page: Int
	totalPages: Int
}

type MealData {
	meals: [Meal!]
	page: Int
	totalPages: Int
}

type LoginData {
	user: User!
	token: String!
}

input MealItemInput {
	meal: String!
	name: String!
	image: Upload!
}

input VoteInput {
	vote: String!
	meal_item_id: String!
	report: String
}

type RootQuery {
    getMeals(page: Int): MealData!
	getMeal(mealId: String!): Meal!
    getReports(meal: String!): [Report!]
	login(userId: String!): LoginData!
	getUser(userId: String!): User!
	checkAddMeal: Boolean!
	getMealExport(mealId: String): [MealExport]!
}

type RootMutation {
	createMeal(mealName: String): Meal
	createMealItem(input: MealItemInput): String
	deleteMeal(mealId: String!): Boolean
	createUser(code: String!): LoginData
	addVotes(voteInput: [VoteInput!]!, meal: String!): Meal
}

type RootSubscription {
	mealCreated: Meal
	mealFetched: String
}

schema {
    query: RootQuery
    mutation: RootMutation
	subscription: RootSubscription
}
`;