import { pgTable, serial, timestamp, varchar, integer, text, boolean, numeric, jsonb, index, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// 角色枚举（新需求：8个角色，支持一人多角色）
export const userRoleEnum = pgEnum("user_role", [
  "super_admin",          // 超级管理员（张宇）
  "testing_manager",       // 检测负责人（袁昭）
  "engineering_manager",  // 工程负责人（袁勃，兼业务经理）
  "finance",              // 财务
  "business_manager",     // 业务经理（肖兴涛、陈俭等）
  "testing_worker",       // 检测人员
  "installation_worker",  // 安装人员
  "certificate_maker",    // 证书编制人员
])


export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表 - 存储用户信息、角色、所属公司
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    open_id: varchar("open_id", { length: 128 }).notNull().unique(),
    name: varchar("name", { length: 128 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    avatar_url: varchar("avatar_url", { length: 500 }),
    role: userRoleEnum("role").notNull().default("business_assistant"), // 使用新的角色枚举
    company: varchar("company", { length: 50 }).notNull().default("sanheng_jiliang"), // 叁恒计量/叁恒智安
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("users_open_id_idx").on(table.open_id),
    index("users_role_idx").on(table.role),
    index("users_company_idx").on(table.company),
  ]
);

// 业务类型配置表 - 管理所有业务类型
export const businessTypes = pgTable(
  "business_types",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull().unique(), // 业务类型名称
    category: varchar("category", { length: 50 }).notNull(), // 分类（计量/工程/其他）
    icon: varchar("icon", { length: 50 }), // 图标名称
    description: varchar("description", { length: 200 }), // 描述
    sort_order: integer("sort_order").default(0), // 排序
    is_active: boolean("is_active").default(true).notNull(), // 是否启用
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("business_types_category_idx").on(table.category),
    index("business_types_is_active_idx").on(table.is_active),
  ]
);

// 订单表 - 业务台账主表
export const businessOrders = pgTable(
  "business_orders",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    order_no: varchar("order_no", { length: 50 }).notNull().unique(), // 序号（自动编号）

    // 基本信息
    order_date: timestamp("order_date", { withTimezone: true }).notNull(), // 下单日期
    customer_name: varchar("customer_name", { length: 200 }).notNull(), // 客户名称
    invoice_company_name: varchar("invoice_company_name", { length: 200 }), // 开票单位名称
    report_name: varchar("report_name", { length: 200 }), // 报告名称（计量业务）

    // 业务信息（主业务类型，用于兼容旧数据）
    business_type: varchar("business_type", { length: 100 }), // 主业务类型（已废弃，保留用于兼容）
    quantity: integer("quantity"), // 数量（已废弃，保留用于兼容）
    unit_price: numeric("unit_price", { precision: 10, scale: 2 }), // 单价（已废弃，保留用于兼容）
    contract_amount: numeric("contract_amount", { precision: 12, scale: 2 }), // 合同金额（汇总）
    actual_amount: numeric("actual_amount", { precision: 12, scale: 2 }), // 实收金额

    // 费用相关
    commission_standard: numeric("commission_standard", { precision: 10, scale: 2 }), // 居间标准
    commission_fee: numeric("commission_fee", { precision: 12, scale: 2 }), // 居间费用（自动计算）
    third_party_collection: numeric("third_party_collection", { precision: 12, scale: 2 }), // 三方代收
    transport_fee: numeric("transport_fee", { precision: 10, scale: 2 }), // 路费
    tax_fee: numeric("tax_fee", { precision: 10, scale: 2 }), // 税金
    deposit: numeric("deposit", { precision: 12, scale: 2 }), // 定金

    // 工费相关（智安专用）
    labor_fee: numeric("labor_fee", { precision: 12, scale: 2 }), // 工费
    labor_fee_remaining: numeric("labor_fee_remaining", { precision: 12, scale: 2 }), // 工费剩余

    // 人员信息
    manager_id: varchar("manager_id", { length: 36 }).notNull().references(() => users.id), // 业务经理
    source_user_id: varchar("source_user_id", { length: 36 }).references(() => users.id), // 业务来源
    executor1_id: varchar("executor1_id", { length: 36 }).references(() => users.id), // 执行人员1
    executor2_id: varchar("executor2_id", { length: 36 }).references(() => users.id), // 执行人员2
    certificate_maker_id: varchar("certificate_maker_id", { length: 36 }).references(() => users.id), // 证书编制

    // 日期信息
    execution_date: timestamp("execution_date", { withTimezone: true }), // 执行日期
    commission_date: timestamp("commission_date", { withTimezone: true }), // 居间日期
    payment_date: timestamp("payment_date", { withTimezone: true }), // 回款日期
    report_completion_date: timestamp("report_completion_date", { withTimezone: true }), // 报告完成日期
    report_delivery_date: timestamp("report_delivery_date", { withTimezone: true }), // 报告送达日期

    // 枚举字段
    payment_method: varchar("payment_method", { length: 100 }).notNull(), // 回款方式
    status: varchar("status", { length: 50 }).notNull().default("pending"), // 订单状态（待分配/已接单/执行中/待验收/已完成/已取消）
    report_type: varchar("report_type", { length: 50 }), // 报告类型
    test_result: varchar("test_result", { length: 50 }), // 检测结果（合格/不合格）

    // 联系信息
    contact_person: varchar("contact_person", { length: 100 }), // 联系人
    contact_phone: varchar("contact_phone", { length: 20 }), // 联系电话
    address: text("address"), // 客户地址

    // 位置信息
    location_latitude: numeric("location_latitude", { precision: 10, scale: 7 }), // 纬度
    location_longitude: numeric("location_longitude", { precision: 10, scale: 7 }), // 经度

    // 其他信息
    tracking_number: varchar("tracking_number", { length: 100 }), // 运单号
    remarks: text("remarks"), // 备注
    company: varchar("company", { length: 50 }).notNull(), // 所属公司（叁恒计量/叁恒智安）

    // 时间戳
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("business_orders_order_no_idx").on(table.order_no),
    index("business_orders_customer_name_idx").on(table.customer_name),
    index("business_orders_status_idx").on(table.status),
    index("business_orders_manager_id_idx").on(table.manager_id),
    index("business_orders_company_idx").on(table.company),
    index("business_orders_order_date_idx").on(table.order_date),
    index("business_orders_executor1_id_idx").on(table.executor1_id),
    index("business_orders_executor2_id_idx").on(table.executor2_id),
    index("business_orders_payment_date_idx").on(table.payment_date),
  ]
);

// 订单业务类型关联表 - 支持一个订单多个业务类型
export const orderBusinessTypes = pgTable(
  "order_business_types",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    order_id: varchar("order_id", { length: 36 }).notNull().references(() => businessOrders.id, { onDelete: "cascade" }),
    business_type_id: varchar("business_type_id", { length: 36 }).notNull().references(() => businessTypes.id), // 关联业务类型配置表
    business_type_name: varchar("business_type_name", { length: 100 }).notNull(), // 冗余存储业务类型名称
    quantity: integer("quantity").notNull(), // 数量
    unit_price: numeric("unit_price", { precision: 10, scale: 2 }).notNull(), // 单价
    contract_amount: numeric("contract_amount", { precision: 12, scale: 2 }).notNull(), // 合同金额（自动计算）
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("order_business_types_order_id_idx").on(table.order_id),
    index("order_business_types_business_type_id_idx").on(table.business_type_id),
  ]
);

// 开票申请表
export const invoiceApplications = pgTable(
  "invoice_applications",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    order_id: varchar("order_id", { length: 36 }).notNull().references(() => businessOrders.id, { onDelete: "cascade" }), // 关联订单

    // 客户信息
    customer_name: varchar("customer_name", { length: 200 }).notNull(), // 冗余存储
    invoice_company_name: varchar("invoice_company_name", { length: 200 }).notNull(), // 发票抬头
    tax_id: varchar("tax_id", { length: 50 }).notNull(), // 统一社会信用代码

    // 开票信息
    invoice_items: varchar("invoice_items", { length: 100 }).notNull(), // 开票项目
    invoice_details: text("invoice_details").notNull(), // 开票明细
    invoice_amount: numeric("invoice_amount", { precision: 12, scale: 2 }).notNull(), // 开票总金额
    invoice_type: varchar("invoice_type", { length: 20 }).notNull(), // 发票类型（专票/普票）

    // 归属和状态
    invoice_belonging: varchar("invoice_belonging", { length: 50 }).notNull(), // 开票归属（计量开/智安开）
    status: varchar("status", { length: 50 }).notNull().default("pending"), // 待开票/已开票/已送达

    // 其他信息
    remarks: text("remarks"),
    applicant_id: varchar("applicant_id", { length: 36 }).notNull().references(() => users.id), // 申请人

    // 时间戳
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("invoice_applications_order_id_idx").on(table.order_id),
    index("invoice_applications_status_idx").on(table.status),
    index("invoice_applications_invoice_belonging_idx").on(table.invoice_belonging),
    index("invoice_applications_applicant_id_idx").on(table.applicant_id),
  ]
);

// 费用申请表
export const expenseApplications = pgTable(
  "expense_applications",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),

    // 申请信息
    expense_type: varchar("expense_type", { length: 50 }).notNull(), // 申请类型（居间费/工费/运费）
    order_ids: jsonb("order_ids").notNull(), // 关联订单列表（JSON数组）
    total_amount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(), // 申请总金额
    expense_details: text("expense_details").notNull(), // 费用明细
    payee: varchar("payee", { length: 200 }).notNull(), // 收款人

    // 审批信息
    approval_status: varchar("approval_status", { length: 50 }).notNull().default("pending"), // 待审批/已通过/已拒绝/已支付
    approver_id: varchar("approver_id", { length: 36 }).references(() => users.id), // 审批人
    payment_date: timestamp("payment_date", { withTimezone: true }), // 支付时间

    // 其他信息
    applicant_id: varchar("applicant_id", { length: 36 }).notNull().references(() => users.id), // 申请人

    // 时间戳
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("expense_applications_expense_type_idx").on(table.expense_type),
    index("expense_applications_approval_status_idx").on(table.approval_status),
    index("expense_applications_applicant_id_idx").on(table.applicant_id),
    index("expense_applications_approver_id_idx").on(table.approver_id),
  ]
);

// 任务执行记录表（用于安装工和检测员记录执行过程）
export const taskExecutions = pgTable(
  "task_executions",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    order_id: varchar("order_id", { length: 36 }).notNull().references(() => businessOrders.id, { onDelete: "cascade" }),
    executor_id: varchar("executor_id", { length: 36 }).notNull().references(() => users.id),
    task_type: varchar("task_type", { length: 50 }).notNull(), // 安装/检测
    task_status: varchar("task_status", { length: 50 }).default("pending"), // 待执行/进行中/已完成/已取消
    accept_time: timestamp("accept_time", { withTimezone: true }),
    start_time: timestamp("start_time", { withTimezone: true }),
    completion_time: timestamp("completion_time", { withTimezone: true }),
    execution_data: jsonb("execution_data"), // 执行记录（JSON格式）
    remarks: text("remarks"),
    photos: jsonb("photos"), // 施工/检测照片（JSON数组）
    location_latitude: numeric("location_latitude", { precision: 10, scale: 7 }),
    location_longitude: numeric("location_longitude", { precision: 10, scale: 7 }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("task_executions_order_id_idx").on(table.order_id),
    index("task_executions_executor_id_idx").on(table.executor_id),
    index("task_executions_task_status_idx").on(table.task_status),
  ]
);

// 检测报告表（用于检测员和证书管理员）
export const testingReports = pgTable(
  "testing_reports",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    order_id: varchar("order_id", { length: 36 }).notNull().references(() => businessOrders.id, { onDelete: "cascade" }),
    task_execution_id: varchar("task_execution_id", { length: 36 }).references(() => taskExecutions.id),
    report_no: varchar("report_no", { length: 100 }).notNull().unique(), // 报告编号
    testing_data: jsonb("testing_data").notNull(), // 检测数据（JSON格式）
    test_result: varchar("test_result", { length: 50 }).notNull(), // 合格/不合格/待复检
    conclusion: text("conclusion"), // 检测结论
    testing_standard: varchar("testing_standard", { length: 200 }), // 检测标准
    testing_environment: text("testing_environment"), // 检测环境
    testing_equipment: text("testing_equipment"), // 检测设备
    status: varchar("status", { length: 50 }).default("draft"), // 草稿/待审核/已审核/已发布
    reviewer_id: varchar("reviewer_id", { length: 36 }).references(() => users.id), // 审核人
    review_time: timestamp("review_time", { withTimezone: true }),
    review_remarks: text("review_remarks"),
    certificate_no: varchar("certificate_no", { length: 100 }), // 证书编号
    certificate_date: timestamp("certificate_date", { withTimezone: true }), // 证书颁发日期
    certificate_expiry_date: timestamp("certificate_expiry_date", { withTimezone: true }), // 证书有效期至
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
    created_by: varchar("created_by", { length: 36 }).notNull().references(() => users.id),
  },
  (table) => [
    index("testing_reports_order_id_idx").on(table.order_id),
    index("testing_reports_task_execution_id_idx").on(table.task_execution_id),
    index("testing_reports_status_idx").on(table.status),
    index("testing_reports_report_no_idx").on(table.report_no),
  ]
);

// 客户表（用于统一管理客户信息）
export const customers = pgTable(
  "customers",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 200 }).notNull(),
    short_name: varchar("short_name", { length: 100 }),
    invoice_company_name: varchar("invoice_company_name", { length: 200 }),
    tax_id: varchar("tax_id", { length: 50 }),
    invoice_address: text("invoice_address"),
    invoice_phone: varchar("invoice_phone", { length: 20 }),
    invoice_bank_name: varchar("invoice_bank_name", { length: 200 }),
    invoice_bank_account: varchar("invoice_bank_account", { length: 100 }),
    contact_person: varchar("contact_person", { length: 100 }),
    contact_phone: varchar("contact_phone", { length: 20 }),
    contact_email: varchar("contact_email", { length: 100 }),
    address: text("address"),
    industry: varchar("industry", { length: 100 }),
    level: varchar("level", { length: 50 }).default("normal"), // 普通客户/重要客户/VIP客户
    remarks: text("remarks"),
    business_user_id: varchar("business_user_id", { length: 36 }).references(() => users.id),
    company: varchar("company", { length: 50 }).notNull(),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("customers_name_idx").on(table.name),
    index("customers_business_user_id_idx").on(table.business_user_id),
    index("customers_company_idx").on(table.company),
    index("customers_is_active_idx").on(table.is_active),
  ]
);

// 系统设置表（用于公司管理员管理系统配置）
export const systemSettings = pgTable(
  "system_settings",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: text("value").notNull(),
    description: varchar("description", { length: 200 }),
    category: varchar("category", { length: 50 }).default("general"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("system_settings_key_idx").on(table.key),
    index("system_settings_category_idx").on(table.category),
  ]
);

