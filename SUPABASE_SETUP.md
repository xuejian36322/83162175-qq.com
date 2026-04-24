# Supabase 项目创建与配置指南

## 📋 快速开始（5 分钟完成）

### 步骤 1：创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 **"Start your project"** 按钮
3. 使用 GitHub 或 Google 账号登录（免费注册）
4. 填写项目信息：
   - **Name**: `sanheng-business-management`
   - **Database Password**: 设置一个强密码（务必保存）
   - **Region**: 选择 `Southeast Asia (Singapore)` 或距离你最近的区域
   - **Pricing Plan**: 选择 **Free**（免费计划）
5. 点击 **"Create new project"**
6. 等待 1-2 分钟，项目创建完成

### 步骤 2：获取连接信息

1. 在项目左侧菜单，点击 **Settings** → **API**
2. 复制以下两个信息：
   ```
   Project URL: https://xxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. 将这两个值填写到 `server/.env` 文件中：
   ```bash
   SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 步骤 3：同步数据库表结构

在项目根目录执行以下命令：

```bash
# 同步数据库表结构（需要先填写好 .env 文件）
coze-coding-ai db upgrade

# 验证表是否创建成功
coze-coding-ai db list-tables
```

### 步骤 4：初始化基础数据

数据库表同步成功后，执行以下命令初始化业务类型数据：

```bash
# 初始化业务类型（压力表、燃气管道等）
coze-coding-ai db execute-sql -f ./server/init-data/business-types.sql

# 初始化测试用户（可选）
coze-coding-ai db execute-sql -f ./server/init-data/test-users.sql
```

---

## 🔍 验证配置

### 1. 检查后端服务日志

```bash
# 查看后端日志，确认 Supabase 连接成功
tail -f /tmp/coze-logs/dev.log
```

### 2. 测试 API 接口

```bash
# 测试用户列表接口
curl http://localhost:3000/api/users

# 测试业务类型接口
curl http://localhost:3000/api/business-types
```

---

## 📝 常见问题

### Q1: 执行 `db upgrade` 时报错 "connection refused"
**A**: 检查 `.env` 文件中的 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 是否正确填写。

### Q2: 如何查看数据库表结构？
**A**:
1. 登录 Supabase Dashboard
2. 点击左侧菜单 **Table Editor**
3. 查看所有已创建的表

### Q3: 如何重置数据库？
**A**:
1. 登录 Supabase Dashboard
2. 点击左侧菜单 **SQL Editor**
3. 执行以下命令：
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO anon;
   ```
4. 重新执行 `coze-coding-ai db upgrade`

---

## 📚 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [项目数据库表结构说明](./server/storage/database/shared/schema.ts)
- [API 接口文档](./API.md)

---

## ⚠️ 注意事项

1. **安全性**：
   - 不要将 `SUPABASE_ANON_KEY` 提交到公开代码仓库
   - `.env` 文件已添加到 `.gitignore`

2. **免费限制**：
   - 数据库：500MB
   - API 请求：每月 50,000 次
   - 实时连接：100 个
   - 足够满足开发和小规模生产使用

3. **备份**：
   - 建议定期备份数据库
   - Supabase Dashboard 提供手动备份功能

---

## 🎯 完成后的下一步

配置完成后，系统将完全可用，你可以：
- 创建真实订单
- 添加真实用户
- 审批费用申请
- 查看统计数据

祝你使用愉快！
