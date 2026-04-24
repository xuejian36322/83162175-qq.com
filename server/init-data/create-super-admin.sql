-- 创建超级管理员账户
-- 账户：18700999611
-- 密码：xuejian36322
-- 角色：super_admin

INSERT INTO users (
	id,
	open_id,
	name,
	phone,
	avatar_url,
	role,
	roles,
	company,
	is_active,
	approval_status,
	created_at,
	updated_at
) VALUES (
	gen_random_uuid(),
	'super_admin_openid_xuejian',
	'薛健（超级管理员）',
	'18700999611',
	'https://via.placeholder.com/100x100?text=SuperAdmin',
	'super_admin',
	'["super_admin"]'::jsonb,
	'sanheng_jiliang',
	true,
	'approved',
	NOW(),
	NOW()
)
ON CONFLICT (open_id) DO NOTHING;

-- 输出结果
DO $$
BEGIN
	RAISE NOTICE '超级管理员账户创建成功！';
	RAISE NOTICE '手机号: 18700999611';
	RAISE NOTICE '角色: super_admin';
	RAISE NOTICE '审批状态: approved（已自动审批）';
END $$;
