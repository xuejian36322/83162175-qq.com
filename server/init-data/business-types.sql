-- 初始化业务类型数据
-- 执行方式: coze-coding-ai db execute-sql -f ./server/init-data/business-types.sql

-- 插入计量检测业务类型
INSERT INTO business_types (name, category, icon, description, sort_order, is_active, created_at, updated_at) VALUES
('压力表检测', '计量检测', 'gauge', '各类压力表的计量检测', 1, true, NOW(), NOW()),
('温度计检测', '计量检测', 'thermometer', '各类温度计的计量检测', 2, true, NOW(), NOW()),
('流量计检测', '计量检测', 'flow-meter', '各类流量计的计量检测', 3, true, NOW(), NOW()),
('电表检测', '计量检测', 'zap', '电表的计量检测', 4, true, NOW(), NOW()),
('水表检测', '计量检测', 'droplets', '水表的计量检测', 5, true, NOW(), NOW()),
('燃气表检测', '计量检测', 'flame', '燃气表的计量检测', 6, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 插入燃气工程业务类型
INSERT INTO business_types (name, category, icon, description, sort_order, is_active, created_at, updated_at) VALUES
('燃气管道检测', '燃气工程', 'flame', '燃气管道安全检测', 7, true, NOW(), NOW()),
('燃气管道安装', '燃气工程', 'wrench', '燃气管道安装工程', 8, true, NOW(), NOW()),
('燃气管道改造', '燃气工程', 'refresh-cw', '燃气管道改造工程', 9, true, NOW(), NOW()),
('燃气设备维修', '燃气工程', 'settings', '燃气设备维修保养', 10, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 插入工程检测业务类型
INSERT INTO business_types (name, category, icon, description, sort_order, is_active, created_at, updated_at) VALUES
('特种设备检测', '工程检测', 'shield-alert', '特种设备安全检测', 11, true, NOW(), NOW()),
('安全阀校验', '工程检测', 'check-circle', '安全阀的校验与检测', 12, true, NOW(), NOW()),
('无损检测', '工程检测', 'scan', '材料无损检测服务', 13, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 插入其他服务业务类型
INSERT INTO business_types (name, category, icon, description, sort_order, is_active, created_at, updated_at) VALUES
('技术咨询服务', '其他服务', 'help-circle', '提供技术咨询服务', 14, true, NOW(), NOW()),
('培训服务', '其他服务', 'graduation-cap', '专业技能培训服务', 15, true, NOW(), NOW()),
('设备租赁', '其他服务', 'truck', '检测设备租赁服务', 16, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 输出结果
DO $$
BEGIN
  RAISE NOTICE '业务类型初始化完成！共插入 % 条记录', (
    SELECT COUNT(*) FROM business_types
  );
END $$;
