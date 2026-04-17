-- 创建用户角色枚举
CREATE TYPE user_role AS ENUM (
  'company_admin',        -- 公司管理员
  'finance',              -- 财务
  'engineering_director', -- 工程部负责人
  'testing_director',     -- 检测部负责人
  'certificate_manager',  -- 检测证书管理员
  'business_assistant',   -- 业务助理
  'engineering_business_1', -- 工程公司业务1部
  'engineering_business_2', -- 工程公司业务2部
  'metrology_business_1'    -- 计量公司业务1部
);

-- 修改 users 表的 role 列类型
ALTER TABLE users
  ALTER COLUMN role TYPE user_role USING role::text::user_role;

-- 创建业务类型配置表
CREATE TABLE IF NOT EXISTS business_types (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  description VARCHAR(200),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX business_types_category_idx ON business_types(category);
CREATE INDEX business_types_is_active_idx ON business_types(is_active);

-- 创建订单业务类型关联表
CREATE TABLE IF NOT EXISTS order_business_types (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(36) NOT NULL REFERENCES business_orders(id) ON DELETE CASCADE,
  business_type_id VARCHAR(36) NOT NULL REFERENCES business_types(id),
  business_type_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  contract_amount NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX order_business_types_order_id_idx ON order_business_types(order_id);
CREATE INDEX order_business_types_business_type_id_idx ON order_business_types(business_type_id);

-- 插入初始业务类型数据
INSERT INTO business_types (name, category, icon, description, sort_order) VALUES
  -- 计量检测类
  ('压力表检测', '计量', 'Gauge', '各类压力表的计量检测', 1),
  ('安全阀检测', '计量', 'ShieldAlert', '安全阀校验检测', 2),
  ('温度计检测', '计量', 'Thermometer', '温度计计量检测', 3),
  ('流量计检测', '计量', 'Activity', '流量计检定检测', 4),
  ('电表检测', '计量', 'Zap', '电能表检定检测', 5),
  ('水表检测', '计量', 'Droplets', '水表检定检测', 6),
  ('燃气表检测', '计量', 'Flame', '燃气表检定检测', 7),
  ('衡器检测', '计量', 'Scale', '各类衡器检定', 8),
  -- 燃气工程类
  ('燃气管道安装', '工程', 'Wrench', '燃气管道安装工程', 9),
  ('燃气设备改造', '工程', 'Wrench', '燃气设备升级改造', 10),
  ('燃气报警器安装', '工程', 'AlertTriangle', '燃气报警器安装', 11),
  ('燃气阀门安装', '工程', 'Circle', '燃气阀门安装', 12),
  ('燃气表安装', '工程', 'Flame', '燃气表安装工程', 13),
  ('燃气管道维修', '工程', 'Hammer', '燃气管道维修', 14),
  ('燃气设备巡检', '工程', 'ClipboardCheck', '燃气设备定期巡检', 15),
  ('燃气管道清洗', '工程', 'Wind', '燃气管道清洗服务', 16);

-- 更新用户角色为新的枚举值
UPDATE users SET role = 'business_assistant' WHERE role IN ('business_manager', 'executor', 'certificate_maker');
UPDATE users SET role = 'company_admin' WHERE role = 'admin';
UPDATE users SET role = 'testing_director' WHERE role = 'testing_director';
UPDATE users SET role = 'engineering_director' WHERE role = 'engineering_director';
UPDATE users SET role = 'finance' WHERE role = 'finance';
