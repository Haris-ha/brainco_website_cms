#!/bin/bash

# 修复 "p is not a function" 错误的脚本

echo "🔧 修复 Strapi 构建错误..."
echo ""

# 1. 清理构建缓存
echo "步骤 1/5: 清理构建缓存..."
rm -rf .strapi
rm -rf build
rm -rf dist
rm -rf .cache
echo "✅ 构建缓存已清理"

# 2. 清理 node_modules 和锁文件（可选，如果需要）
read -p "是否重新安装依赖？(y/n，默认 n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "步骤 2/5: 清理依赖..."
  rm -rf node_modules
  rm -f package-lock.json
  rm -f pnpm-lock.yaml
  echo "✅ 依赖已清理"
  
  echo "步骤 3/5: 重新安装依赖..."
  if command -v pnpm &> /dev/null; then
    pnpm install
  else
    npm install
  fi
  echo "✅ 依赖已重新安装"
else
  echo "步骤 2/5: 跳过依赖重新安装"
fi

# 3. 验证翻译文件
echo ""
echo "步骤 3/5: 验证翻译文件..."
if node -e "JSON.parse(require('fs').readFileSync('src/admin/translations/zh-Hans.json', 'utf8')); console.log('✅ 翻译文件格式正确')" 2>/dev/null; then
  echo "✅ 翻译文件格式正确"
else
  echo "❌ 翻译文件格式错误，请检查 src/admin/translations/zh-Hans.json"
  exit 1
fi

# 4. 重新构建
echo ""
echo "步骤 4/5: 重新构建项目..."
if command -v pnpm &> /dev/null; then
  pnpm run build
else
  npm run build
fi

if [ $? -eq 0 ]; then
  echo "✅ 构建成功"
else
  echo "❌ 构建失败，请检查错误信息"
  exit 1
fi

# 5. 完成
echo ""
echo "步骤 5/5: 完成"
echo ""
echo "✅ 修复完成！"
echo ""
echo "📋 下一步："
echo "   1. 重启 Strapi 服务"
echo "   2. 清除浏览器缓存（Ctrl+Shift+R 或 Cmd+Shift+R）"
echo "   3. 重新访问管理面板"
echo ""









