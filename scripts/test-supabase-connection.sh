#!/bin/bash

# Supabase 连接测试脚本
# 使用方法: ./scripts/test-supabase-connection.sh

echo "=========================================="
echo "  Supabase 连接测试"
echo "=========================================="
echo ""

# 加载环境变量
if [ -f "./server/.env" ]; then
    export $(cat ./server/.env | grep -v '^#' | xargs)
else
    echo "❌ 错误: 找不到 .env 文件"
    echo "请先按照 SUPABASE_SETUP.md 配置 Supabase 连接信息"
    exit 1
fi

# 检查必要的配置
if [ "$SUPABASE_URL" = "https://your-project.supabase.co" ] || [ "$SUPABASE_URL" = "" ]; then
    echo "❌ 错误: SUPABASE_URL 未配置"
    echo "请在 ./server/.env 文件中填写正确的 SUPABASE_URL"
    exit 1
fi

if [ "$SUPABASE_ANON_KEY" = "your-anon-public-key-here" ] || [ "$SUPABASE_ANON_KEY" = "" ]; then
    echo "❌ 错误: SUPABASE_ANON_KEY 未配置"
    echo "请在 ./server/.env 文件中填写正确的 SUPABASE_ANON_KEY"
    exit 1
fi

echo "✅ 配置检查通过"
echo ""

# 测试 API 连接
echo "正在测试 Supabase API 连接..."
API_RESPONSE=$(curl -s -w "\n%{http_code}" "${SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_ANON_KEY}")
HTTP_CODE=$(echo "$API_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Supabase API 连接成功"
    echo ""
else
    echo "❌ Supabase API 连接失败 (HTTP $HTTP_CODE)"
    echo "请检查 SUPABASE_URL 和 SUPABASE_ANON_KEY 是否正确"
    exit 1
fi

# 测试数据库表是否存在
echo "正在检查数据库表..."
TABLES_RESPONSE=$(curl -s "${SUPABASE_URL}/rest/v1/users?select=id&limit=1&apikey=${SUPABASE_ANON_KEY}")

if [ $? -eq 0 ]; then
    echo "✅ 数据库表连接正常"
else
    echo "⚠️  数据库表可能还未创建"
    echo "请执行: coze-coding-ai db upgrade"
    exit 1
fi

echo ""
echo "=========================================="
echo "  🎉 Supabase 连接测试通过！"
echo "=========================================="
echo ""
echo "下一步操作:"
echo "1. 同步数据库表结构: coze-coding-ai db upgrade"
echo "2. 初始化业务类型: coze-coding-ai db execute-sql -f ./server/init-data/business-types.sql"
echo "3. 初始化测试用户: coze-coding-ai db execute-sql -f ./server/init-data/test-users.sql"
echo ""
