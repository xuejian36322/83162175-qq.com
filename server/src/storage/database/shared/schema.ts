import { pgTable, index, foreignKey, pgPolicy, varchar, jsonb, numeric, text, timestamp, serial, unique, boolean, integer, date, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

const gen_random_uuid = () => sql`gen_random_uuid()`

export const userRole = pgEnum("user_role", ['company_admin', 'finance', 'engineering_director', 'testing_director', 'certificate_manager', 'business_assistant', 'engineering_business_1', 'engineering_business_2', 'metrology_business_1', 'installer', 'tester', 'super_admin', 'testing_manager', 'engineering_manager', 'business_manager', 'testing_worker', 'installation_worker', 'certificate_maker'])


export const expenseApplications = pgTable("expense_applications", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	expenseType: varchar("expense_type", { length: 50 }).notNull(),
	orderIds: jsonb("order_ids").notNull(),
	totalAmount: numeric("total_amount", { precision: 12, scale:  2 }).notNull(),
	expenseDetails: text("expense_details").notNull(),
	payee: varchar({ length: 200 }).notNull(),
	approvalStatus: varchar("approval_status", { length: 50 }).default('pending').notNull(),
	approverId: varchar("approver_id", { length: 36 }),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }),
	applicantId: varchar("applicant_id", { length: 36 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("expense_applications_applicant_id_idx").using("btree", table.applicantId.asc().nullsLast().op("text_ops")),
	index("expense_applications_approval_status_idx").using("btree", table.approvalStatus.asc().nullsLast().op("text_ops")),
	index("expense_applications_approver_id_idx").using("btree", table.approverId.asc().nullsLast().op("text_ops")),
	index("expense_applications_expense_type_idx").using("btree", table.expenseType.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.approverId],
			foreignColumns: [users.id],
			name: "expense_applications_approver_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.applicantId],
			foreignColumns: [users.id],
			name: "expense_applications_applicant_id_users_id_fk"
		}),
	pgPolicy("expense_applications_登录用户可读", { as: "permissive", for: "select", to: ["public"], using: sql`(( SELECT auth.role() AS role) = 'authenticated'::text)` }),
	pgPolicy("expense_applications_登录用户可写入", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("expense_applications_登录用户可更新", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("expense_applications_登录用户可删除", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const invoiceApplications = pgTable("invoice_applications", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	orderId: varchar("order_id", { length: 36 }).notNull(),
	customerName: varchar("customer_name", { length: 200 }).notNull(),
	invoiceCompanyName: varchar("invoice_company_name", { length: 200 }).notNull(),
	taxId: varchar("tax_id", { length: 50 }).notNull(),
	invoiceItems: varchar("invoice_items", { length: 100 }).notNull(),
	invoiceDetails: text("invoice_details").notNull(),
	invoiceAmount: numeric("invoice_amount", { precision: 12, scale:  2 }).notNull(),
	invoiceType: varchar("invoice_type", { length: 20 }).notNull(),
	invoiceBelonging: varchar("invoice_belonging", { length: 50 }).notNull(),
	status: varchar({ length: 50 }).default('pending').notNull(),
	remarks: text(),
	applicantId: varchar("applicant_id", { length: 36 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("invoice_applications_applicant_id_idx").using("btree", table.applicantId.asc().nullsLast().op("text_ops")),
	index("invoice_applications_invoice_belonging_idx").using("btree", table.invoiceBelonging.asc().nullsLast().op("text_ops")),
	index("invoice_applications_order_id_idx").using("btree", table.orderId.asc().nullsLast().op("text_ops")),
	index("invoice_applications_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [businessOrders.id],
			name: "invoice_applications_order_id_business_orders_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.applicantId],
			foreignColumns: [users.id],
			name: "invoice_applications_applicant_id_users_id_fk"
		}),
	pgPolicy("invoice_applications_登录用户可读", { as: "permissive", for: "select", to: ["public"], using: sql`(( SELECT auth.role() AS role) = 'authenticated'::text)` }),
	pgPolicy("invoice_applications_登录用户可写入", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("invoice_applications_登录用户可更新", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("invoice_applications_登录用户可删除", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const users = pgTable("users", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	openId: varchar("open_id", { length: 128 }).notNull(),
	name: varchar({ length: 128 }).notNull(),
	phone: varchar({ length: 20 }),
	avatarUrl: varchar("avatar_url", { length: 500 }),
	role: varchar({ length: 50 }).default('business_manager').notNull(),
	company: varchar({ length: 50 }).default('sanheng_jiliang').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	roles: jsonb().default([]),
}, (table) => [
	index("users_company_idx").using("btree", table.company.asc().nullsLast().op("text_ops")),
	index("users_open_id_idx").using("btree", table.openId.asc().nullsLast().op("text_ops")),
	index("users_role_idx").using("btree", table.role.asc().nullsLast().op("text_ops")),
	unique("users_open_id_unique").on(table.openId),
	pgPolicy("users_登录用户可读", { as: "permissive", for: "select", to: ["public"], using: sql`(( SELECT auth.role() AS role) = 'authenticated'::text)` }),
	pgPolicy("users_登录用户可写入", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("users_登录用户可更新", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("users_登录用户可删除", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const businessTypes = pgTable("business_types", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	category: varchar({ length: 50 }).notNull(),
	icon: varchar({ length: 50 }),
	description: varchar({ length: 200 }),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("business_types_category_idx").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("business_types_is_active_idx").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	unique("business_types_name_key").on(table.name),
]);

export const businessOrders = pgTable("business_orders", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	orderNo: varchar("order_no", { length: 50 }).notNull(),
	orderDate: timestamp("order_date", { withTimezone: true, mode: 'string' }).notNull(),
	customerName: varchar("customer_name", { length: 200 }).notNull(),
	invoiceCompanyName: varchar("invoice_company_name", { length: 200 }),
	reportName: varchar("report_name", { length: 200 }),
	businessType: varchar("business_type", { length: 100 }).notNull(),
	quantity: integer().notNull(),
	unitPrice: numeric("unit_price", { precision: 10, scale:  2 }).notNull(),
	contractAmount: numeric("contract_amount", { precision: 12, scale:  2 }).notNull(),
	actualAmount: numeric("actual_amount", { precision: 12, scale:  2 }),
	commissionStandard: numeric("commission_standard", { precision: 10, scale:  2 }),
	commissionFee: numeric("commission_fee", { precision: 12, scale:  2 }),
	thirdPartyCollection: numeric("third_party_collection", { precision: 12, scale:  2 }),
	transportFee: numeric("transport_fee", { precision: 10, scale:  2 }),
	taxFee: numeric("tax_fee", { precision: 10, scale:  2 }),
	deposit: numeric({ precision: 12, scale:  2 }),
	laborFee: numeric("labor_fee", { precision: 12, scale:  2 }),
	laborFeeRemaining: numeric("labor_fee_remaining", { precision: 12, scale:  2 }),
	managerId: varchar("manager_id", { length: 36 }).notNull(),
	sourceUserId: varchar("source_user_id", { length: 36 }),
	executor1Id: varchar("executor1_id", { length: 36 }),
	executor2Id: varchar("executor2_id", { length: 36 }),
	certificateMakerId: varchar("certificate_maker_id", { length: 36 }),
	executionDate: timestamp("execution_date", { withTimezone: true, mode: 'string' }),
	commissionDate: timestamp("commission_date", { withTimezone: true, mode: 'string' }),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }),
	reportCompletionDate: timestamp("report_completion_date", { withTimezone: true, mode: 'string' }),
	reportDeliveryDate: timestamp("report_delivery_date", { withTimezone: true, mode: 'string' }),
	paymentMethod: varchar("payment_method", { length: 100 }).notNull(),
	status: varchar({ length: 50 }).default('pending').notNull(),
	reportType: varchar("report_type", { length: 50 }),
	testResult: varchar("test_result", { length: 50 }),
	contactPerson: varchar("contact_person", { length: 100 }),
	contactPhone: varchar("contact_phone", { length: 20 }),
	address: text(),
	locationLatitude: numeric("location_latitude", { precision: 10, scale:  7 }),
	locationLongitude: numeric("location_longitude", { precision: 10, scale:  7 }),
	trackingNumber: varchar("tracking_number", { length: 100 }),
	remarks: text(),
	company: varchar({ length: 50 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	lockStatus: varchar("lock_status", { length: 50 }).default('unlocked'),
	lockedBy: varchar("locked_by", { length: 36 }),
	lockedAt: timestamp("locked_at", { withTimezone: true, mode: 'string' }),
	actualQuantity: integer("actual_quantity"),
	executionPhotos: jsonb("execution_photos"),
	coWorkers: jsonb("co_workers"),
	certificateStatus: varchar("certificate_status", { length: 50 }).default('pending'),
	certificateShippedAt: timestamp("certificate_shipped_at", { withTimezone: true, mode: 'string' }),
	certificateDeliveredAt: timestamp("certificate_delivered_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("business_orders_company_idx").using("btree", table.company.asc().nullsLast().op("text_ops")),
	index("business_orders_customer_name_idx").using("btree", table.customerName.asc().nullsLast().op("text_ops")),
	index("business_orders_executor1_id_idx").using("btree", table.executor1Id.asc().nullsLast().op("text_ops")),
	index("business_orders_executor2_id_idx").using("btree", table.executor2Id.asc().nullsLast().op("text_ops")),
	index("business_orders_manager_id_idx").using("btree", table.managerId.asc().nullsLast().op("text_ops")),
	index("business_orders_order_date_idx").using("btree", table.orderDate.asc().nullsLast().op("timestamptz_ops")),
	index("business_orders_order_no_idx").using("btree", table.orderNo.asc().nullsLast().op("text_ops")),
	index("business_orders_payment_date_idx").using("btree", table.paymentDate.asc().nullsLast().op("timestamptz_ops")),
	index("business_orders_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.managerId],
			foreignColumns: [users.id],
			name: "business_orders_manager_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.sourceUserId],
			foreignColumns: [users.id],
			name: "business_orders_source_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.executor1Id],
			foreignColumns: [users.id],
			name: "business_orders_executor1_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.executor2Id],
			foreignColumns: [users.id],
			name: "business_orders_executor2_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.certificateMakerId],
			foreignColumns: [users.id],
			name: "business_orders_certificate_maker_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.lockedBy],
			foreignColumns: [users.id],
			name: "business_orders_locked_by_fkey"
		}),
	unique("business_orders_order_no_unique").on(table.orderNo),
	pgPolicy("business_orders_登录用户可读", { as: "permissive", for: "select", to: ["public"], using: sql`(( SELECT auth.role() AS role) = 'authenticated'::text)` }),
	pgPolicy("business_orders_登录用户可写入", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("business_orders_登录用户可更新", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("business_orders_登录用户可删除", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const orderBusinessTypes = pgTable("order_business_types", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	orderId: varchar("order_id", { length: 36 }).notNull(),
	businessTypeId: varchar("business_type_id", { length: 36 }).notNull(),
	businessTypeName: varchar("business_type_name", { length: 100 }).notNull(),
	quantity: integer().notNull(),
	unitPrice: numeric("unit_price", { precision: 10, scale:  2 }).notNull(),
	contractAmount: numeric("contract_amount", { precision: 12, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("order_business_types_business_type_id_idx").using("btree", table.businessTypeId.asc().nullsLast().op("text_ops")),
	index("order_business_types_order_id_idx").using("btree", table.orderId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [businessOrders.id],
			name: "order_business_types_order_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.businessTypeId],
			foreignColumns: [businessTypes.id],
			name: "order_business_types_business_type_id_fkey"
		}),
]);

export const taskExecutions = pgTable("task_executions", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	orderId: varchar("order_id", { length: 36 }).notNull(),
	executorId: varchar("executor_id", { length: 36 }).notNull(),
	taskType: varchar("task_type", { length: 50 }).notNull(),
	taskStatus: varchar("task_status", { length: 50 }).default('pending'),
	acceptTime: timestamp("accept_time", { withTimezone: true, mode: 'string' }),
	startTime: timestamp("start_time", { withTimezone: true, mode: 'string' }),
	completionTime: timestamp("completion_time", { withTimezone: true, mode: 'string' }),
	executionData: jsonb("execution_data"),
	remarks: text(),
	photos: jsonb(),
	locationLatitude: numeric("location_latitude", { precision: 10, scale:  7 }),
	locationLongitude: numeric("location_longitude", { precision: 10, scale:  7 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("task_executions_executor_id_idx").using("btree", table.executorId.asc().nullsLast().op("text_ops")),
	index("task_executions_order_id_idx").using("btree", table.orderId.asc().nullsLast().op("text_ops")),
	index("task_executions_task_status_idx").using("btree", table.taskStatus.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [businessOrders.id],
			name: "task_executions_order_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.executorId],
			foreignColumns: [users.id],
			name: "task_executions_executor_id_fkey"
		}),
]);

export const testingReports = pgTable("testing_reports", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	orderId: varchar("order_id", { length: 36 }).notNull(),
	taskExecutionId: varchar("task_execution_id", { length: 36 }),
	reportNo: varchar("report_no", { length: 100 }).notNull(),
	testingData: jsonb("testing_data").notNull(),
	testResult: varchar("test_result", { length: 50 }).notNull(),
	conclusion: text(),
	testingStandard: varchar("testing_standard", { length: 200 }),
	testingEnvironment: text("testing_environment"),
	testingEquipment: text("testing_equipment"),
	status: varchar({ length: 50 }).default('draft'),
	reviewerId: varchar("reviewer_id", { length: 36 }),
	reviewTime: timestamp("review_time", { withTimezone: true, mode: 'string' }),
	reviewRemarks: text("review_remarks"),
	certificateNo: varchar("certificate_no", { length: 100 }),
	certificateDate: date("certificate_date"),
	certificateExpiryDate: date("certificate_expiry_date"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	createdBy: varchar("created_by", { length: 36 }).notNull(),
}, (table) => [
	index("testing_reports_order_id_idx").using("btree", table.orderId.asc().nullsLast().op("text_ops")),
	index("testing_reports_report_no_idx").using("btree", table.reportNo.asc().nullsLast().op("text_ops")),
	index("testing_reports_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("testing_reports_task_execution_id_idx").using("btree", table.taskExecutionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [businessOrders.id],
			name: "testing_reports_order_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.taskExecutionId],
			foreignColumns: [taskExecutions.id],
			name: "testing_reports_task_execution_id_fkey"
		}),
	foreignKey({
			columns: [table.reviewerId],
			foreignColumns: [users.id],
			name: "testing_reports_reviewer_id_fkey"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "testing_reports_created_by_fkey"
		}),
	unique("testing_reports_report_no_key").on(table.reportNo),
]);

export const customers = pgTable("customers", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	name: varchar({ length: 200 }).notNull(),
	shortName: varchar("short_name", { length: 100 }),
	invoiceCompanyName: varchar("invoice_company_name", { length: 200 }),
	taxId: varchar("tax_id", { length: 50 }),
	invoiceAddress: text("invoice_address"),
	invoicePhone: varchar("invoice_phone", { length: 20 }),
	invoiceBankName: varchar("invoice_bank_name", { length: 200 }),
	invoiceBankAccount: varchar("invoice_bank_account", { length: 100 }),
	contactPerson: varchar("contact_person", { length: 100 }),
	contactPhone: varchar("contact_phone", { length: 20 }),
	contactEmail: varchar("contact_email", { length: 100 }),
	address: text(),
	industry: varchar({ length: 100 }),
	level: varchar({ length: 50 }).default('normal'),
	remarks: text(),
	businessUserId: varchar("business_user_id", { length: 36 }),
	company: varchar({ length: 50 }).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("customers_business_user_id_idx").using("btree", table.businessUserId.asc().nullsLast().op("text_ops")),
	index("customers_company_idx").using("btree", table.company.asc().nullsLast().op("text_ops")),
	index("customers_is_active_idx").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("customers_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.businessUserId],
			foreignColumns: [users.id],
			name: "customers_business_user_id_fkey"
		}),
]);

export const systemSettings = pgTable("system_settings", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	key: varchar({ length: 100 }).notNull(),
	value: text().notNull(),
	description: varchar({ length: 200 }),
	category: varchar({ length: 50 }).default('general'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("system_settings_category_idx").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("system_settings_key_idx").using("btree", table.key.asc().nullsLast().op("text_ops")),
	unique("system_settings_key_key").on(table.key),
]);
