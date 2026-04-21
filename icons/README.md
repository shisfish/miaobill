# TabBar 图标说明

## 已下载的图标

已为您下载好 Material Design 风格的图标：

| 页面 | 未选中图标 | 选中图标 |
|------|-----------|---------|
| 明细 | icons/list.svg | icons/list-selected.svg |
| 图表 | icons/chart.svg | icons/chart-selected.svg |
| 记账 | icons/add.svg | icons/add-selected.svg |
| 我的 | icons/user.svg | icons/user-selected.svg |

## 图标来源

图标来自 Material Design Icons 库：https://materialdesignicons.com/

## 微信小程序 tabBar 图标要求

- 尺寸：81px * 81px（iPhone 6 Plus 高清版）
- 格式：PNG 8位透明通道
- 大小：不超过 40kb

## 如何将 SVG 转换为 PNG

### 方法1：使用在线转换工具
1. 访问 https://cloudconvert.com/svg-to-png 或 https://convertio.co/zh/svg-png/
2. 上传 SVG 文件
3. 设置尺寸为 81x81 像素
4. 下载 PNG 文件

### 方法2：使用设计软件
使用 Figma、Sketch 或 Adobe Illustrator 等工具：
1. 打开 SVG 文件
2. 设置画布尺寸为 81x81 像素
3. 导出为 PNG 格式，保持透明背景

### 方法3：使用命令行工具（需要 ImageMagick）
```bash
convert -size 81x81 list.svg list.png
```

## app.json 配置示例（使用 PNG 图标）

将 SVG 转换为 PNG 后，使用以下配置：

```json
"tabBar": {
  "color": "#999999",
  "selectedColor": "#FFD54F",
  "backgroundColor": "#FFFFFF",
  "borderStyle": "black",
  "list": [
    {
      "pagePath": "pages/statistics/statistics",
      "text": "明细",
      "iconPath": "icons/list.png",
      "selectedIconPath": "icons/list-selected.png"
    },
    {
      "pagePath": "pages/index/index",
      "text": "图表",
      "iconPath": "icons/chart.png",
      "selectedIconPath": "icons/chart-selected.png"
    },
    {
      "pagePath": "pages/addRecord/addRecord",
      "text": "记账",
      "iconPath": "icons/add.png",
      "selectedIconPath": "icons/add-selected.png"
    },
    {
      "pagePath": "pages/mine/mine",
      "text": "我的",
      "iconPath": "icons/user.png",
      "selectedIconPath": "icons/user-selected.png"
    }
  ]
}
```
