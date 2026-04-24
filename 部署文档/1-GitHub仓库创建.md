# GitHub 仓库创建和代码上传指南

## 📋 前提条件
- 已注册 GitHub 账号

## 🚀 步骤 1：创建 GitHub 仓库

1. **登录 GitHub**
   - 访问：https://github.com/
   - 点击右上角 "+" → "New repository"

2. **填写仓库信息**
   - Repository name: `sanheng-business-system`
   - Description: `陕西叁恒企业业务管理系统`
   - 选择：Public（公开）或 Private（私有）
   - 勾选：Add a README file
   - 点击：Create repository

3. **复制仓库地址**
   - 会显示类似：`https://github.com/你的用户名/sanheng-business-system.git`

---

## 📤 步骤 2：准备代码上传

### 方法 A：在云电脑上操作（推荐）

在云电脑终端执行以下命令：

```bash
# 1. 进入项目目录
cd /workspace/projects

# 2. 初始化 Git 仓库
git init

# 3. 添加所有文件
git add .

# 4. 创建首次提交
git commit -m "Initial commit: 陕西叁恒企业业务管理系统"

# 5. 添加远程仓库
git remote add origin https://github.com/你的用户名/sanheng-business-system.git

# 6. 推送到 GitHub
git branch -M main
git push -u origin main
```

**注意**：将 `你的用户名` 替换为您的 GitHub 用户名

**如果需要认证**：
- 首次推送时，GitHub 会要求认证
- 使用您的 GitHub 账号和密码（或 Personal Access Token）

---

### 方法 B：手动上传（如果 Git 不可用）

1. **打包代码**
   ```bash
   cd /workspace/projects
   tar -czf sanheng-code.tar.gz --exclude='node_modules' --exclude='dist-*' --exclude='.git' .
   ```

2. **下载文件**
   - 通过云电脑的文件管理工具下载 `sanheng-code.tar.gz`
   - 或使用其他方式下载到本地电脑

3. **在本地解压并上传到 GitHub**
   - 解压到本地文件夹
   - 在 GitHub 仓库页面，点击 "Upload files"
   - 拖拽解压后的所有文件上传
   - 填写提交信息，点击 "Commit changes"

---

## 🔑 方法 C：使用 Personal Access Token（推荐）

如果 Git push 时认证失败，使用 Personal Access Token：

1. **创建 Token**
   - 登录 GitHub
   - 点击右上角头像 → "Settings"
   - 左侧菜单 → "Developer settings"
   - 点击 "Personal access tokens" → "Tokens (classic)"
   - 点击 "Generate new token (classic)"
   - 设置：
     - Note: `sanheng-business`
     - Expiration: `90 days` 或 `No expiration`
     - 勾选权限：`repo`（完整仓库访问权限）
   - 点击 "Generate token"
   - **复制生成的 token（只显示一次！）**

2. **使用 Token 推送**
   ```bash
   # 在云电脑终端执行
   cd /workspace/projects
   git init
   git add .
   git commit -m "Initial commit"

   # 添加远程仓库
   git remote add origin https://github.com/你的用户名/sanheng-business-system.git

   # 使用 Token 推送（注意：Token 代替密码）
   git push -u origin main
   # 提示输入用户名时：输入 GitHub 用户名
   # 提示输入密码时：粘贴刚才复制的 Token
   ```

---

## ✅ 步骤 3：验证上传成功

1. 访问您的 GitHub 仓库页面
2. 检查文件是否都已上传
3. 确认代码结构完整

---

## 🎯 下一步：部署到 Vercel

代码上传到 GitHub 后，继续下一步：`2-部署到Vercel.md`

---

## ❓ 常见问题

### Q1: Git 命令提示 "command not found"？
A: Git 可能未安装。使用方法 B（手动上传）。

### Q2: 推送时提示认证失败？
A: 使用方法 C（Personal Access Token）。

### Q3: 上传太慢怎么办？
A: 只上传必要文件，排除 `node_modules` 和构建产物。

---

## 📞 需要帮助？

如果遇到问题，请告诉我：
1. 使用了哪个方法？
2. 遇到了什么错误？
3. 错误信息的具体内容？

我会帮您解决！
