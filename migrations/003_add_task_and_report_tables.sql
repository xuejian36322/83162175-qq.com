-- 添加任务执行记录表（用于安装工和检测员记录执行过程）
CREATE TABLE IF NOT EXISTS task_executions (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(36) NOT NULL REFERENCES business_orders(id) ON DELETE CASCADE,
  executor_id VARCHAR(36) NOT NULL REFERENCES users(id),
  
  -- 任务信息
  task_type VARCHAR(50) NOT NULL, -- 安装/检测
  task_status VARCHAR(50) DEFAULT 'pending', -- 待执行/进行中/已完成/已取消
  
  -- 接单时间
  accept_time TIMESTAMP WITH TIME ZONE,
  
  -- 开始执行时间
  start_time TIMESTAMP WITH TIME ZONE,
  
  -- 完成时间
  completion_time TIMESTAMP WITH TIME ZONE,
  
  -- 执行记录（JSON格式，存储详细执行信息）
  execution_data JSONB,
  
  -- 执行说明
  remarks TEXT,
  
  -- 施工/检测照片（JSON数组）
  photos JSONB,
  
  -- 地理位置信息
  location_latitude NUMERIC(10, 7),
  location_longitude NUMERIC(10, 7),
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX task_executions_order_id_idx ON task_executions(order_id);
CREATE INDEX task_executions_executor_id_idx ON task_executions(executor_id);
CREATE INDEX task_executions_task_status_idx ON task_executions(task_status);

-- 添加检测报告表（用于检测员和证书管理员）
CREATE TABLE IF NOT EXISTS testing_reports (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(36) NOT NULL REFERENCES business_orders(id) ON DELETE CASCADE,
  task_execution_id VARCHAR(36) REFERENCES task_executions(id),
  
  -- 报告编号
  report_no VARCHAR(100) UNIQUE NOT NULL,
  
  -- 检测数据（JSON格式）
  testing_data JSONB NOT NULL,
  
  -- 检测结果
  test_result VARCHAR(50) NOT NULL, -- 合格/不合格/待复检
  
  -- 检测结论
  conclusion TEXT,
  
  -- 检测标准
  testing_standard VARCHAR(200),
  
  -- 检测环境
  testing_environment TEXT,
  
  -- 检测设备
  testing_equipment TEXT,
  
  -- 报告状态
  status VARCHAR(50) DEFAULT 'draft', -- 草稿/待审核/已审核/已发布
  
  -- 审核人
  reviewer_id VARCHAR(36) REFERENCES users(id),
  review_time TIMESTAMP WITH TIME ZONE,
  review_remarks TEXT,
  
  -- 证书编号
  certificate_no VARCHAR(100),
  
  -- 证书颁发日期
  certificate_date DATE,
  
  -- 证书有效期至
  certificate_expiry_date DATE,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  
  created_by VARCHAR(36) NOT NULL REFERENCES users(id)
);

CREATE INDEX testing_reports_order_id_idx ON testing_reports(order_id);
CREATE INDEX testing_reports_task_execution_id_idx ON testing_reports(task_execution_id);
CREATE INDEX testing_reports_status_idx ON testing_reports(status);
CREATE INDEX testing_reports_report_no_idx ON testing_reports(report_no);

-- 添加客户表（用于统一管理客户信息）
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息
  name VARCHAR(200) NOT NULL,
  short_name VARCHAR(100),
  
  -- 开票信息
  invoice_company_name VARCHAR(200),
  tax_id VARCHAR(50),
  invoice_address TEXT,
  invoice_phone VARCHAR(20),
  invoice_bank_name VARCHAR(200),
  invoice_bank_account VARCHAR(100),
  
  -- 联系信息
  contact_person VARCHAR(100),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  address TEXT,
  
  -- 行业分类
  industry VARCHAR(100),
  
  -- 客户级别
  level VARCHAR(50) DEFAULT 'normal', -- 普通客户/重要客户/VIP客户
  
  -- 备注
  remarks TEXT,
  
  -- 归属业务员
  business_user_id VARCHAR(36) REFERENCES users(id),
  
  -- 所属公司
  company VARCHAR(50) NOT NULL,
  
  -- 状态
  is_active BOOLEAN DEFAULT true NOT NULL,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX customers_name_idx ON customers(name);
CREATE INDEX customers_business_user_id_idx ON customers(business_user_id);
CREATE INDEX customers_company_idx ON customers(company);
CREATE INDEX customers_is_active_idx ON customers(is_active);

-- 添加系统设置表（用于公司管理员管理系统配置）
CREATE TABLE IF NOT EXISTS system_settings (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description VARCHAR(200),
  category VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX system_settings_key_idx ON system_settings(key);
CREATE INDEX system_settings_category_idx ON system_settings(category);

-- 插入默认系统设置
INSERT INTO system_settings (key, value, description, category) VALUES
  ('company_name', '陕西叁恒', '公司名称', 'general'),
  ('order_no_prefix', 'ORD', '订单号前缀', 'general'),
  ('report_no_prefix', 'RPT', '报告号前缀', 'general'),
  ('certificate_no_prefix', 'CERT', '证书号前缀', 'general')
ON CONFLICT (key) DO NOTHING;
