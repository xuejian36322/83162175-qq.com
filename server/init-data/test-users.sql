-- 初始化测试用户数据
-- 执行方式: coze-coding-ai db execute-sql -f ./server/init-data/test-users.sql

-- 插入叁恒计量公司用户
INSERT INTO users (open_id, name, phone, avatar_url, role, roles, company, is_active, created_at, updated_at) VALUES
(
  'test_openid_admin_1',
  '张三（管理员）',
  '13800138001',
  'https://via.placeholder.com/100x100?text=Admin',
  'company_admin',
  ARRAY['company_admin', 'finance_manager', 'business_manager'],
  'sanheng_jiliang',
  true,
  NOW(),
  NOW()
),
(
  'test_openid_fm_1',
  '李四（财务）',
  '13800138002',
  'https://via.placeholder.com/100x100?text=Finance',
  'finance_manager',
  ARRAY['finance_manager'],
  'sanheng_jiliang',
  true,
  NOW(),
  NOW()
),
(
  'test_openid_bm_1',
  '王五（业务）',
  '13800138003',
  'https://via.placeholder.com/100x100?text=Business',
  'business_manager',
  ARRAY['business_manager'],
  'sanheng_jiliang',
  true,
  NOW(),
  NOW()
),
(
  'test_openid_te_1',
  '赵六（技术）',
  '13800138004',
  'https://via.placeholder.com/100x100?text=Tech',
  'technician',
  ARRAY['technician'],
  'sanheng_jiliang',
  true,
  NOW(),
  NOW()
),
(
  'test_openid_ex_1',
  '孙七（执行）',
  '13800138005',
  'https://via.placeholder.com/100x100?text=Exec',
  'executor',
  ARRAY['executor'],
  'sanheng_jiliang',
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- 插入叁恒智安公司用户
INSERT INTO users (open_id, name, phone, avatar_url, role, roles, company, is_active, created_at, updated_at) VALUES
(
  'test_openid_admin_2',
  '周八（管理员）',
  '13800138006',
  'https://via.placeholder.com/100x100?text=Admin',
  'company_admin',
  ARRAY['company_admin', 'finance_manager', 'business_manager'],
  'sanheng_zhian',
  true,
  NOW(),
  NOW()
),
(
  'test_openid_fm_2',
  '吴九（财务）',
  '13800138007',
  'https://via.placeholder.com/100x100?text=Finance',
  'finance_manager',
  ARRAY['finance_manager'],
  'sanheng_zhian',
  true,
  NOW(),
  NOW()
),
(
  'test_openid_bm_2',
  '郑十（业务）',
  '13800138008',
  'https://via.placeholder.com/100x100?text=Business',
  'business_manager',
  ARRAY['business_manager'],
  'sanheng_zhian',
  true,
  NOW(),
  NOW()
),
(
  'test_openid_te_2',
  '陈十一（技术）',
  '13800138009',
  'https://via.placeholder.com/100x100?text=Tech',
  'technician',
  ARRAY['technician'],
  'sanheng_zhian',
  true,
  NOW(),
  NOW()
),
(
  'test_openid_ex_2',
  '林十二（执行）',
  '13800138010',
  'https://via.placeholder.com/100x100?text=Exec',
  'executor',
  ARRAY['executor'],
  'sanheng_zhian',
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- 插入超级管理员（可以跨公司管理）
INSERT INTO users (open_id, name, phone, avatar_url, role, roles, company, is_active, created_at, updated_at) VALUES
(
  'test_openid_super',
  '超级管理员',
  '13800000000',
  'https://via.placeholder.com/100x100?text=Super',
  'super_admin',
  ARRAY['super_admin', 'company_admin', 'finance_manager', 'business_manager', 'technician', 'executor', 'intermediary', 'driver'],
  'sanheng_jiliang',
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- 输出结果
DO $$
BEGIN
  RAISE NOTICE '测试用户初始化完成！共插入 % 条记录', (
    SELECT COUNT(*) FROM users
  );
  RAISE NOTICE '叁恒计量用户数: %', (
    SELECT COUNT(*) FROM users WHERE company = 'sanheng_jiliang'
  );
  RAISE NOTICE '叁恒智安用户数: %', (
    SELECT COUNT(*) FROM users WHERE company = 'sanheng_zhian'
  );
END $$;
