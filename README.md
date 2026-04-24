# Coze Mini Program

这是一个基于 [Taro 4](https://docs.taro.zone/docs/) + [Nest.js](https://nestjs.com/) 的前后端分离项目，由扣子编程 CLI 创建。

## 项目简介

陕西叁恒企业业务管理系统，支持叁恒计量和叁恒智安两家公司的业务订单全生命周期管理，包括订单管理、费用申请、开票对接、业绩统计等核心功能。

## 技术栈

- **整体框架**: Taro 4.1.9
- **语言**: TypeScript 5.4.5
- **渲染**: React 18.0.0
- **样式**: TailwindCSS 4.1.18
- **Tailwind 适配层**: weapp-tailwindcss 4.9.2
- **状态管理**: Zustand 5.0.9
- **图标库**: lucide-react-taro latest
- **工程化**: Vite 4.2.0
- **包管理**: pnpm
- **运行时**: Node.js >= 18
- **服务端**: NestJS 10.4.15
- **数据库**: Supabase (PostgreSQL)
- **数据库 ORM**: Drizzle ORM 0.45.1
- **类型校验**: Zod 4.3.5

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置 Supabase 数据库（必选）

项目使用 Supabase 作为后端数据库。在启动项目之前，必须先完成 Supabase 配置：

#### 2.1 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 **"Start your project"** 按钮
3. 使用 GitHub 或 Google 账号登录（免费注册）
4. 创建新项目：
   - **Name**: `sanheng-business-management`
   - **Database Password**: 设置一个强密码（务必保存）
   - **Region**: 选择 `Southeast Asia (Singapore)` 或距离你最近的区域
   - **Pricing Plan**: 选择 **Free**（免费计划）
5. 等待项目创建完成（1-2 分钟）

#### 2.2 获取连接信息

1. 在项目左侧菜单，点击 **Settings** → **API**
2. 复制以下信息：
   ```
   Project URL: https://xxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

#### 2.3 配置环境变量

在 `server/.env` 文件中填入连接信息：

```bash
# Supabase 数据库配置
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 2.4 同步数据库表结构

```bash
# 同步数据库表结构
coze-coding-ai db upgrade

# 验证表是否创建成功
coze-coding-ai db list-tables
```

#### 2.5 初始化基础数据

```bash
# 初始化业务类型（压力表、燃气管道等）
coze-coding-ai db execute-sql -f ./server/init-data/business-types.sql

# 初始化测试用户（可选）
coze-coding-ai db execute-sql -f ./server/init-data/test-users.sql
```

#### 2.6 验证配置

```bash
# 测试 Supabase 连接
./scripts/test-supabase-connection.sh
```

📖 **详细配置指南**: 请查看 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 3. 启动开发服务

同时启动 H5 前端和 NestJS 后端：

```bash
pnpm dev
```

- 前端地址：http://localhost:5000
- 后端地址：http://localhost:3000

单独启动：

```bash
pnpm dev:web      # 仅 H5 前端
pnpm dev:weapp    # 仅微信小程序
pnpm dev:server   # 仅后端服务
```

### 4. 构建项目

```bash
pnpm build        # 构建所有（H5 + 小程序 + 后端）
pnpm build:web    # 仅构建 H5，输出到 dist-web
pnpm build:weapp  # 仅构建微信小程序，输出到 dist
pnpm build:server # 仅构建后端
```

### 5. 预览小程序

```bash
pnpm preview:weapp # 构建并生成预览小程序二维码
```

---

## 项目结构

```
├── .cozeproj/                # Coze 平台配置
│   └── scripts/              # 构建和运行脚本
├── config/                   # Taro 构建配置
│   ├── index.ts              # 主配置文件
│   ├── dev.ts                # 开发环境配置
│   └── prod.ts               # 生产环境配置
├── server/                   # NestJS 后端服务
│   ├── src/
│   │   ├── main.ts           # 服务入口
│   │   ├── app.module.ts     # 根模块
│   │   ├── app.controller.ts # 应用控制器
│   │   ├── app.service.ts    # 应用服务
│   │   ├── storage/          # 数据库存储层
│   │   │   └── database/     # Supabase 数据库配置
│   │   └── modules/          # 业务模块
│   │       ├── users/        # 用户管理模块
│   │       ├── orders/       # 订单管理模块
│   │       ├── business-types/ # 业务类型模块
│   │       ├── expense-applications/ # 费用申请模块
│   │       ├── invoice-applications/ # 开票申请模块
│   │       └── statistics/   # 统计模块
│   └── init-data/            # 初始化数据脚本
├── src/                      # 前端源码
│   ├── pages/                # 页面组件
│   │   ├── login/            # 登录页面
│   │   ├── role-select/      # 角色选择页面
│   │   ├── index/            # 首页（订单列表）
│   │   ├── order-create/     # 订单创建页面
│   │   ├── users/            # 用户管理页面
│   │   ├── my-tasks/         # 我的工作页面
│   │   ├── map-lock/         # 地图标点锁定页面
│   │   ├── order-execution/  # 订单执行页面
│   │   ├── statistics/       # 数据统计页面
│   │   ├── expense-application/ # 费用申请页面
│   │   ├── invoice-application/ # 开票申请页面
│   │   ├── certificates/     # 证书管理页面
│   │   └── settings/         # 系统设置页面
│   ├── presets/              # 框架预置逻辑（无需读取，如无必要不改动）
│   ├── utils/                # 工具函数
│   │   ├── permission.ts     # 权限管理
│   │   └── date.ts           # 日期处理
│   ├── network.ts            # 封装好的网络请求工具
│   ├── app.ts                # 应用入口
│   ├── app.config.ts         # 应用配置
│   └── app.css               # 全局样式
├── types/                    # TypeScript 类型定义
├── key/                      # 小程序密钥（CI 上传用）
├── scripts/                  # 脚本工具
│   └── test-supabase-connection.sh # Supabase 连接测试
├── .env.local                # 环境变量
└── project.config.json       # 微信小程序项目配置
```

---

## 功能模块

### 前端页面

| 页面 | 路径 | 功能说明 |
|------|------|---------|
| 登录页 | `pages/login/index` | 微信登录、测试模式登录 |
| 角色选择 | `pages/role-select/index` | 支持一人多角色选择 |
| 首页 | `pages/index/index` | 订单列表、搜索筛选 |
| 订单创建 | `pages/order-create/index` | 创建订单、业务类型选择、地址定位 |
| 用户管理 | `pages/users/index` | 用户列表、新增用户 |
| 用户编辑 | `pages/users/edit` | 编辑用户信息、角色配置 |
| 我的工作 | `pages/my-tasks/index` | 我的任务列表、任务执行 |
| 地图标点 | `pages/map-lock/index` | 地图标点锁定、24小时自动解锁 |
| 订单执行 | `pages/order-execution/index` | 订单执行、照片上传、结果录入 |
| 数据统计 | `pages/statistics/index` | 订单统计、金额统计、用户统计 |
| 费用申请 | `pages/expense-application/index` | 居间费、工费、运费申请 |
| 开票申请 | `pages/invoice-application/index` | 专票、普票申请 |
| 证书管理 | `pages/certificates/index` | 证书列表、状态跟踪 |
| 系统设置 | `pages/settings/index` | 公司信息、业务配置、退出登录 |

### 后端接口

| 模块 | 路径 | 功能说明 |
|------|------|---------|
| 用户管理 | `/api/users` | CRUD 操作、角色管理 |
| 订单管理 | `/api/orders` | CRUD 操作、状态流转 |
| 业务类型 | `/api/business-types` | 业务类型管理 |
| 费用申请 | `/api/expense-applications` | 费用申请、审批 |
| 开票申请 | `/api/invoice-applications` | 开票申请、状态更新 |
| 统计数据 | `/api/statistics` | 订单、金额、用户统计 |

---

## 核心开发规范

### 前端规范

#### 网络请求

**IMPORTANT: 禁止直接使用 Taro.request、Taro.uploadFile、Taro.downloadFile，必须使用 Network.request、Network.uploadFile、Network.downloadFile。**

```typescript
import { Network } from '@/network'

// GET 请求
const data = await Network.request({ url: '/api/users' })

// POST 请求
const result = await Network.request({
  url: '/api/user/login',
  method: 'POST',
  data: { username, password }
})

// 文件上传
await Network.uploadFile({
  url: '/api/upload',
  filePath: tempFilePath,
  name: 'file'
})
```

#### 跨端兼容性

所有原生组件使用前必须检测平台环境：

```typescript
const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

if (isWeapp) {
  // 小程序特定代码
} else {
  // H5 降级处理
}
```

#### 组件使用

优先使用 `@/components/ui` 下的组件：

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
```

### 后端规范

#### 数据库操作

所有数据库操作必须检查 error：

```typescript
const { data, error } = await client.from('users').select('*')
if (error) throw new Error(`查询失败: ${error.message}`)
```

#### API 响应格式

统一使用以下响应格式：

```typescript
{
  code: 200,
  msg: 'success',
  data: { ... }
}
```

---

## 常见问题

### Q1: Supabase 连接失败？
**A**: 检查 `.env` 文件中的 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 是否正确填写。

### Q2: 数据库表未创建？
**A**: 执行 `coze-coding-ai db upgrade` 同步表结构。

### Q3: 小程序预览二维码无法访问？
**A**: 确保在 Coze 平台配置了微信开放平台 AppID。

---

## 相关文档

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase 配置详细指南
- [AGENTS.md](./AGENTS.md) - 开发规范和约束
- [Taro 官方文档](https://docs.taro.zone/docs/)
- [Supabase 官方文档](https://supabase.com/docs)
- [NestJS 官方文档](https://docs.nestjs.com/)

---

## License

MIT
