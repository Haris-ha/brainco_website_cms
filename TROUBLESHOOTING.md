# 故障排查指南

## "p is not a function" 错误

### 问题描述
在访问 Strapi 管理面板时出现错误：
```
It seems like there is a bug in your instance, but we've got you covered.
p is not a function
```

### 原因分析
这个错误通常由以下原因引起：
1. **构建缓存损坏** - `.strapi`、`build` 或 `dist` 目录中的缓存文件损坏
2. **翻译文件格式错误** - JSON 格式不正确
3. **依赖版本冲突** - node_modules 中的依赖版本不兼容
4. **构建不完整** - 上次构建过程中断或失败

### 解决方案

#### 方案 1：快速修复（推荐）

运行修复脚本：
```bash
./fix-build-error.sh
```

#### 方案 2：手动修复

**步骤 1：清理构建缓存**
```bash
rm -rf .strapi
rm -rf build
rm -rf dist
rm -rf .cache
```

**步骤 2：验证翻译文件**
```bash
node -e "JSON.parse(require('fs').readFileSync('src/admin/translations/zh-Hans.json', 'utf8')); console.log('✅ OK')"
```

如果报错，检查 `src/admin/translations/zh-Hans.json` 文件格式。

**步骤 3：重新构建**
```bash
npm run build
# 或
pnpm run build
```

**步骤 4：重启服务**
```bash
# 开发模式
npm run develop

# 生产模式
npm start
```

#### 方案 3：完全重置（如果上述方案都不行）

```bash
# 1. 停止服务
# Ctrl+C 或 kill 进程

# 2. 清理所有缓存和构建文件
rm -rf .strapi build dist .cache node_modules

# 3. 重新安装依赖
npm install
# 或
pnpm install

# 4. 重新构建
npm run build

# 5. 重启服务
npm run develop
```

### 预防措施

1. **定期清理构建缓存**
   ```bash
   rm -rf .strapi build dist
   ```

2. **确保翻译文件格式正确**
   - 使用 JSON 验证工具检查
   - 确保没有尾随逗号
   - 确保所有字符串都用双引号

3. **使用版本锁定**
   - 提交 `package-lock.json` 或 `pnpm-lock.yaml`
   - 使用相同的 Node.js 版本

### 常见问题

**Q: 修复后仍然报错？**
A: 
1. 清除浏览器缓存（Ctrl+Shift+R）
2. 检查浏览器控制台的完整错误信息
3. 查看服务器日志获取更多信息

**Q: 构建时间很长？**
A: 这是正常的，首次构建或清理后重建需要较长时间。

**Q: 如何避免这个问题？**
A: 
- 定期清理构建缓存
- 确保翻译文件格式正确
- 使用稳定的依赖版本
- 在部署前进行完整构建测试

### 相关文件

- `src/admin/app.js` - 管理面板配置
- `src/admin/translations/zh-Hans.json` - 中文翻译文件
- `package.json` - 项目依赖配置

### 获取帮助

如果问题仍然存在：
1. 检查 Strapi 官方文档
2. 查看 GitHub Issues
3. 联系技术支持团队









