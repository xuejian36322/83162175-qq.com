import { relations } from "drizzle-orm/relations";
import { users, expenseApplications, businessOrders, invoiceApplications, orderBusinessTypes, businessTypes, taskExecutions, testingReports, customers } from "./schema";

export const expenseApplicationsRelations = relations(expenseApplications, ({one}) => ({
	user_approverId: one(users, {
		fields: [expenseApplications.approverId],
		references: [users.id],
		relationName: "expenseApplications_approverId_users_id"
	}),
	user_applicantId: one(users, {
		fields: [expenseApplications.applicantId],
		references: [users.id],
		relationName: "expenseApplications_applicantId_users_id"
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	expenseApplications_approverId: many(expenseApplications, {
		relationName: "expenseApplications_approverId_users_id"
	}),
	expenseApplications_applicantId: many(expenseApplications, {
		relationName: "expenseApplications_applicantId_users_id"
	}),
	invoiceApplications: many(invoiceApplications),
	businessOrders_managerId: many(businessOrders, {
		relationName: "businessOrders_managerId_users_id"
	}),
	businessOrders_sourceUserId: many(businessOrders, {
		relationName: "businessOrders_sourceUserId_users_id"
	}),
	businessOrders_executor1Id: many(businessOrders, {
		relationName: "businessOrders_executor1Id_users_id"
	}),
	businessOrders_executor2Id: many(businessOrders, {
		relationName: "businessOrders_executor2Id_users_id"
	}),
	businessOrders_certificateMakerId: many(businessOrders, {
		relationName: "businessOrders_certificateMakerId_users_id"
	}),
	businessOrders_lockedBy: many(businessOrders, {
		relationName: "businessOrders_lockedBy_users_id"
	}),
	taskExecutions: many(taskExecutions),
	testingReports_reviewerId: many(testingReports, {
		relationName: "testingReports_reviewerId_users_id"
	}),
	testingReports_createdBy: many(testingReports, {
		relationName: "testingReports_createdBy_users_id"
	}),
	customers: many(customers),
}));

export const invoiceApplicationsRelations = relations(invoiceApplications, ({one}) => ({
	businessOrder: one(businessOrders, {
		fields: [invoiceApplications.orderId],
		references: [businessOrders.id]
	}),
	user: one(users, {
		fields: [invoiceApplications.applicantId],
		references: [users.id]
	}),
}));

export const businessOrdersRelations = relations(businessOrders, ({one, many}) => ({
	invoiceApplications: many(invoiceApplications),
	user_managerId: one(users, {
		fields: [businessOrders.managerId],
		references: [users.id],
		relationName: "businessOrders_managerId_users_id"
	}),
	user_sourceUserId: one(users, {
		fields: [businessOrders.sourceUserId],
		references: [users.id],
		relationName: "businessOrders_sourceUserId_users_id"
	}),
	user_executor1Id: one(users, {
		fields: [businessOrders.executor1Id],
		references: [users.id],
		relationName: "businessOrders_executor1Id_users_id"
	}),
	user_executor2Id: one(users, {
		fields: [businessOrders.executor2Id],
		references: [users.id],
		relationName: "businessOrders_executor2Id_users_id"
	}),
	user_certificateMakerId: one(users, {
		fields: [businessOrders.certificateMakerId],
		references: [users.id],
		relationName: "businessOrders_certificateMakerId_users_id"
	}),
	user_lockedBy: one(users, {
		fields: [businessOrders.lockedBy],
		references: [users.id],
		relationName: "businessOrders_lockedBy_users_id"
	}),
	orderBusinessTypes: many(orderBusinessTypes),
	taskExecutions: many(taskExecutions),
	testingReports: many(testingReports),
}));

export const orderBusinessTypesRelations = relations(orderBusinessTypes, ({one}) => ({
	businessOrder: one(businessOrders, {
		fields: [orderBusinessTypes.orderId],
		references: [businessOrders.id]
	}),
	businessType: one(businessTypes, {
		fields: [orderBusinessTypes.businessTypeId],
		references: [businessTypes.id]
	}),
}));

export const businessTypesRelations = relations(businessTypes, ({many}) => ({
	orderBusinessTypes: many(orderBusinessTypes),
}));

export const taskExecutionsRelations = relations(taskExecutions, ({one, many}) => ({
	businessOrder: one(businessOrders, {
		fields: [taskExecutions.orderId],
		references: [businessOrders.id]
	}),
	user: one(users, {
		fields: [taskExecutions.executorId],
		references: [users.id]
	}),
	testingReports: many(testingReports),
}));

export const testingReportsRelations = relations(testingReports, ({one}) => ({
	businessOrder: one(businessOrders, {
		fields: [testingReports.orderId],
		references: [businessOrders.id]
	}),
	taskExecution: one(taskExecutions, {
		fields: [testingReports.taskExecutionId],
		references: [taskExecutions.id]
	}),
	user_reviewerId: one(users, {
		fields: [testingReports.reviewerId],
		references: [users.id],
		relationName: "testingReports_reviewerId_users_id"
	}),
	user_createdBy: one(users, {
		fields: [testingReports.createdBy],
		references: [users.id],
		relationName: "testingReports_createdBy_users_id"
	}),
}));

export const customersRelations = relations(customers, ({one}) => ({
	user: one(users, {
		fields: [customers.businessUserId],
		references: [users.id]
	}),
}));