# 部署到 Vercel - 完整指南

## 📋 前提条件
- ✅ 已注册 GitHub 账号
- ✅ 已将代码上传到 GitHub（参考 `1-GitHub仓库创建.md`）

---

## 🚀 步骤 1：注册 Vercel

1. **访问 Vercel**
   - 打开浏览器：https://vercel.com/

2. **注册账号**
   - 点击右上角 "Sign Up"
   - 选择 "Continue with GitHub"
   - 授权 Vercel 访问您的 GitHub
   - 选择账号类型（选择 Hobby/Free，免费）

3. **完成注册**
   - 填写用户名
   - 点击 "Continue"

---

## 🚀 步骤 2：部署项目

1. **导入项目**
   - 登录 Vercel 后，点击 "Add New" → "Project"
   - 在 "Import Git Repository" 中找到您的仓库
   - `sanheng-business-system`
   - 点击 "Import"

2. **配置项目**
   - **Framework Preset**: 选择 "Other" 或 "Create React App"
   - **Root Directory**: 保持默认（或者填写 `.`）
   - **Build Command**: 留空（或者填写 `pnpm build:web`）
   - **Output Directory**: 输入 `dist-web`
   - **Install Command**: 留空（或者填写 `pnpm install`）

3. **环境变量配置**
   - 点击 "Environment Variables"
   - 添加以下变量：
     - **Name**: `PROJECT_DOMAIN`
     - **Value**: `https://your-backend-server.com`（暂时留空或填写测试地址）
   - 点击 "Add"

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待部署完成（约 1-2 分钟）

---

## 🎉 步骤 3：获取访问地址

1. **查看部署结果**
   - 部署完成后，会显示一个绿色的 "✓"
   - 会自动分配一个域名，类似：
     - `https://sanheng-business-system.vercel.app`
     - 或 `https://sanheng-business-system-xxxxx.vercel.app`

2. **访问网站**
   - 点击部署结果中的域名
   - 或直接在浏览器中输入域名访问

3. **测试系统**
   - 点击"微信登录"
   - 输入测试代码（如：`test_code_18700999611`）
   - 验证系统是否正常工作

---

## 🔧 步骤 4：配置后端 API（可选）

如果您有后端服务器，需要配置 API 地址：

1. **回到 Vercel 项目**
   - 点击项目名称
   - 点击 "Settings" → "Environment Variables"

2. **添加环境变量**
   - Name: `PROJECT_DOMAIN`
   - Value: 您的后端服务器地址
     - 例如：`http://your-backend-server.com` 或 `https://api.yourdomain.com`

3. **重新部署**
   - 点击 "Deployments" → "..."
   - 点击 "Redeploy"
   - 等待重新部署完成

---

## 🎨 步骤 5：自定义域名（可选）

1. **添加域名**
   - 在项目页面点击 "Settings" → "Domains"
   - 点击 "Add Domain"
   - 输入您的域名（如：`business.sanheng.com`）
   - 点击 "Add"

2. **配置 DNS**
   - Vercel 会提供 DNS 配置信息
   - 在域名提供商处添加 CNAME 记录
   - 等待 DNS 生效（几分钟到几小时）

---

## 📊 步骤 6：查看部署日志

1. **查看日志**
   - 在项目页面点击 "Deployments"
   - 点击任意部署记录
   - 点击 "Build Log" 或 "Function Log"

2. **排查问题**
   - 如果部署失败，查看错误信息
   - 如果网站无法访问，查看 Function Log

---

## ✅ 步骤 7：自动化部署

配置完成后，每次推送代码到 GitHub，Vercel 会自动部署：

```bash
# 在云电脑修改代码后
git add .
git commit -m "Update feature"
git push

# Vercel 会自动检测并重新部署
```

---

## 💰 费用说明

**Vercel 免费套餐包含**：
- ✅ 无限项目
- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ 自动 HTTPS
- ✅ 自定义域名支持
- ✅ 自动 CDN

**完全免费，适合个人和小型项目！**

---

## 🎯 完整工作流程

```
1. 注册 GitHub 账号
2. 创建仓库并上传代码
3. 注册 Vercel（用 GitHub 登录）
4. 导入项目到 Vercel
5. 配置构建参数
6. 部署项目
7. 获得访问地址
8. 开始使用系统！
```

---

## ❓ 常见问题

### Q1: 部署失败怎么办？
A:
1. 检查构建日志
2. 确认 Output Directory 设置为 `dist-web`
3. 确认代码已正确上传到 GitHub

### Q2: 部署成功但无法访问？
A:
1. 等待几分钟（DNS 生效）
2. 检查 Vercel 状态页面（https://status.vercel.com）
3. 清除浏览器缓存

### Q3: 如何更新网站？
A:
```bash
git add .
git commit -m "Update"
git push
```
Vercel 会自动重新部署。

### Q4: 如何删除项目？
A:
1. 在 Vercel 项目页面
2. 点击 "Settings" → "General"
3. 滚动到底部，点击 "Delete Project"

---

## 📞 需要帮助？

如果遇到问题，请告诉我：
1. 在哪个步骤遇到问题？
2. 具体的错误信息是什么？
3. 部署日志中的错误内容

我会帮您解决！

---

## 🎉 完成！

恭喜您！系统已成功部署到 Vercel！

现在您可以：
- ✅ 通过域名访问系统
- ✅ 在任何设备上使用
- ✅ 自动 HTTPS 安全连接
- ✅ 自动更新部署

**开始使用您的系统吧！** 🚀
