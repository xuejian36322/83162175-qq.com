# 系统更新进度追踪

## 已完成功能

### 1. 数据库更新 ✅
- [x] 在 `users` 表添加 `roles` 字段（JSONB 类型，支持一人多角色）
- [x] 兼容旧数据：将现有用户的 `role` 迁移到 `roles`
- [x] 在 `business_orders` 表添加锁定相关字段：
  - `lock_status`: 锁定状态（unlocked/locked/expired）
  - `locked_by`: 锁定人ID
  - `locked_at`: 锁定时间
- [x] 在 `business_orders` 表添加执行结果相关字段：
  - `execution_date`: 执行日期
  - `actual_quantity`: 实际数量
  - `test_result`: 检测结果（合格/不合格）
  - `execution_photos`: 施工照片（JSONB）
  - `co_workers`: 共同施工人员（JSONB）
- [x] 在 `business_orders` 表添加证书寄送相关字段：
  - `certificate_status`: 证书状态（pending/preparing/shipped/delivered）
  - `certificate_shipped_at`: 证书寄送日期
  - `tracking_number`: 运单号
  - `certificate_delivered_at`: 证书送达日期

### 2. 角色系统重构 ✅
- [x] 从11个角色精简为8个角色：
  - 超级管理员（张宇）
  - 检测负责人（袁昭）
  - 工程负责人（袁勃，兼业务经理）
  - 财务
  - 业务经理（肖兴涛、陈俭等）
  - 检测人员
  - 安装人员
  - 证书编制人员
- [x] 支持一人多角色
- [x] 更新权限判断逻辑，支持多角色判断
- [x] 更新角色选择页面，支持多选
- [x] 更新首页，根据用户角色动态显示功能入口

### 3. 地图标点功能（前端） ✅
- [x] 创建地图标点页面（`/pages/map-lock/index`）
- [x] 显示未施工订单列表
- [x] 支持执行人员锁定订单（先到先得）
- [x] 支持解锁订单
- [x] 显示订单锁定状态
- [x] 跳转到订单执行页面

### 4. 后端登录接口更新 ✅
- [x] 登录返回 `roles` 字段（数组）而非 `role` 字段
- [x] 兼容旧数据：自动从 `role` 迁移到 `roles`
- [x] 测试模式默认创建 `roles` 字段

## 进行中功能

### 1. 订单锁定功能（后端） 🚧
- [ ] 创建 `BusinessOrdersController`
- [ ] 实现 `GET /api/business-orders/map-orders` 接口（获取未施工订单）
- [ ] 实现 `POST /api/business-orders/lock` 接口（锁定订单）
- [ ] 实现 `POST /api/business-orders/unlock` 接口（解锁订单）
- [ ] 实现24小时自动解锁定时任务
- [ ] API 接口测试（curl 验证）
- [ ] 前后端匹配验证

### 2. 订单执行功能 🚧
- [ ] 创建订单执行页面（`/pages/order-execution/index`）
- [ ] 填写执行结果（检测结果、实际数量）
- [ ] 上传施工照片
- [ ] 添加共同施工人员
- [ ] 保存执行结果

### 3. 订单执行结果保存（后端） 🚧
- [ ] 实现 `POST /api/business-orders/:id/execution` 接口
- [ ] 保存执行结果到数据库
- [ ] 支持照片上传（集成 TOS 对象存储）
- [ ] 更新订单状态（执行中 → 已完成）

## 待开发功能

### P0 功能
- [ ] 用户管理页面完善（支持一人多角色配置）
- [ ] 数据统计页面（业绩统计、订单统计）
- [ ] 费用申请功能（居间费、外包工费、运费）
- [ ] 开票申请与审批功能
- [ ] 证书寄送管理
- [ ] 客户档案管理

### P1 功能
- [ ] 系统设置功能
- [ ] 通知消息功能
- [ ] 工程管理页面
- [ ] 检测管理页面
- [ ] 报告审核功能

## 技术债务
- [ ] 完善错误处理和日志记录
- [ ] 添加单元测试和集成测试
- [ ] 性能优化（列表分页、懒加载）
- [ ] 图片压缩和优化
- [ ] 数据备份策略

## 最近更新日期
2024年1月23日
