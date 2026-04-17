import { pgTable, serial, timestamp, varchar, integer, text, boolean, numeric, jsonb, index, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// 角色枚举
export const userRoleEnum = pgEnum("user_role", [
  "company_admin",        // 公司管理员
  "finance",              // 财务
  "engineering_director", // 工程部负责人
  "testing_director",     // 检测部负责人
  "certificate_manager",  // 检测证书管理员
  "business_assistant",   // 业务助理
  "engineering_business_1", // 工程公司业务1部
  "engineering_business_2", // 工程公司业务2部
  "metrology_business_1",   // 计量公司业务1部
  "installer",             // 安装工
  "tester"                 // 检测员
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
