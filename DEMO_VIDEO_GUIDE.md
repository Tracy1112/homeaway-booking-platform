# 🎥 项目演示视频制作指南

本指南将帮助你创建一个专业的项目演示视频，用于作品集展示和求职申请。

## 📋 视频内容规划

### 建议的视频结构（5-8 分钟）

1. **开场介绍** (30秒)
   - 项目名称和定位
   - 技术栈简要介绍
   - 项目目标

2. **核心功能演示** (4-5分钟)
   - 用户注册/登录流程
   - 浏览房源列表和搜索
   - 查看房源详情
   - 预订流程（日期选择、价格计算）
   - 支付流程（Stripe 集成）
   - 用户个人中心（预订管理、收藏）
   - 房源管理（创建、编辑房源）
   - 评论系统
   - 管理员仪表板

3. **技术亮点** (1-2分钟)
   - 响应式设计展示
   - 性能优化（快速加载）
   - 错误处理演示
   - 代码质量（可选：展示代码结构）

4. **结尾** (30秒)
   - 项目总结
   - 技术栈回顾
   - 联系方式/链接

## 🛠️ 录制工具推荐

### Mac 用户（推荐）

#### 1. **QuickTime Player**（免费，内置）
- ✅ 系统自带，无需安装
- ✅ 简单易用
- ✅ 支持全屏和窗口录制
- 📍 位置：应用程序 → QuickTime Player
- 使用方法：
  1. 打开 QuickTime Player
  2. 文件 → 新建屏幕录制
  3. 点击录制按钮
  4. 选择录制区域（全屏或窗口）
  5. 开始录制

#### 2. **ScreenFlow**（付费，专业）
- ✅ 功能强大
- ✅ 内置编辑功能
- ✅ 支持多轨道编辑
- 💰 价格：约 $169
- 🔗 [ScreenFlow官网](https://www.telestream.net/screenflow/)

#### 3. **OBS Studio**（免费，开源）
- ✅ 完全免费
- ✅ 功能强大
- ✅ 支持直播和录制
- 🔗 [OBS官网](https://obsproject.com/)

#### 4. **Loom**（免费/付费）
- ✅ 简单易用
- ✅ 自动上传到云端
- ✅ 可以添加摄像头画面
- 🔗 [Loom官网](https://www.loom.com/)

### Windows 用户

#### 1. **Xbox Game Bar**（免费，内置）
- Windows 10/11 自带
- 快捷键：`Win + G`
- 简单易用

#### 2. **OBS Studio**（免费）
- 跨平台，功能强大

#### 3. **Camtasia**（付费）
- 专业录制和编辑工具

## 📝 录制前准备清单

### 1. 环境准备
- [ ] 确保应用已部署并可访问
- [ ] 测试所有功能是否正常工作
- [ ] 准备测试数据（房源、用户账号等）
- [ ] 清理浏览器缓存，确保最佳性能
- [ ] 关闭不必要的通知和应用

### 2. 浏览器设置
- [ ] 使用无痕模式或清理浏览器数据
- [ ] 设置合适的浏览器窗口大小（推荐 1920x1080 或 1280x720）
- [ ] 关闭浏览器扩展（避免干扰）
- [ ] 准备多个测试账号（用户、房东、管理员）

### 3. 录制设置
- [ ] 选择清晰的录制分辨率（至少 1280x720，推荐 1920x1080）
- [ ] 设置合适的帧率（30fps 足够，60fps 更流畅）
- [ ] 测试音频（如果需要旁白）
- [ ] 准备脚本或大纲

## 🎬 录制步骤

### 使用 QuickTime Player（Mac）

1. **打开 QuickTime Player**
   ```
   应用程序 → QuickTime Player
   ```

2. **开始录制**
   - 文件 → 新建屏幕录制
   - 点击录制按钮（红色圆点）
   - 选择录制区域：
     - 点击屏幕任意位置 = 全屏录制
     - 拖拽选择区域 = 部分区域录制

3. **停止录制**
   - 点击菜单栏的停止按钮
   - 或按 `Command + Control + Esc`

4. **保存视频**
   - 文件 → 存储为...
   - 选择保存位置和文件名

### 录制技巧

1. **慢速操作**
   - 鼠标移动和点击要慢一些
   - 给观众时间理解操作

2. **避免错误**
   - 提前测试所有流程
   - 如果出错，暂停录制，重新开始该部分

3. **保持流畅**
   - 避免长时间停顿
   - 如果卡顿，可以后期剪辑

4. **突出关键功能**
   - 在重要功能处稍作停留
   - 可以放大显示关键信息

## ✂️ 视频编辑（可选但推荐）

### 免费编辑工具

#### Mac
- **iMovie**（免费，内置）
  - 系统自带
  - 简单易用
  - 适合基础编辑

- **DaVinci Resolve**（免费，专业）
  - 功能强大
  - 专业级编辑工具
  - 🔗 [DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve)

#### Windows
- **Windows Video Editor**（免费，内置）
- **DaVinci Resolve**（免费）

### 编辑建议

1. **剪辑**
   - 删除错误和卡顿部分
   - 保持节奏流畅
   - 总时长控制在 5-8 分钟

2. **添加标注**
   - 在关键功能处添加文字说明
   - 突出技术亮点
   - 显示技术栈标签

3. **添加背景音乐**（可选）
   - 使用无版权音乐
   - 音量要低，不干扰旁白
   - 推荐：[YouTube Audio Library](https://www.youtube.com/audiolibrary)

4. **添加过渡效果**
   - 简单的淡入淡出即可
   - 避免过度特效

5. **添加片头和片尾**
   - 片头：项目名称、技术栈
   - 片尾：GitHub 链接、联系方式

## 📤 上传和分享

### 推荐平台

1. **YouTube**（推荐）
   - ✅ 免费、稳定
   - ✅ 支持高清视频
   - ✅ 易于嵌入和分享
   - ✅ SEO 友好
   - 设置：
     - 标题：`HomeAway - Full-Stack Booking Platform Demo | Next.js, TypeScript, Prisma`
     - 描述：添加项目介绍、技术栈、GitHub 链接
     - 标签：`nextjs`, `typescript`, `full-stack`, `portfolio`, `australia`

2. **Vimeo**
   - ✅ 专业、高质量
   - ✅ 无广告
   - 💰 免费版有限制

3. **Loom**
   - ✅ 简单快速
   - ✅ 自动生成链接
   - ✅ 适合快速分享

### 视频设置建议

- **分辨率**：1080p (1920x1080) 或 720p (1280x720)
- **格式**：MP4
- **编码**：H.264
- **帧率**：30fps
- **时长**：5-8 分钟

## 🔗 在 README 中添加视频

### 方法 1：YouTube 嵌入（推荐）

```markdown
## 🎥 Demo Video

[![Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

> Click the image above to watch the full demo video
```

### 方法 2：直接链接

```markdown
## 🎥 Demo Video

📹 **Watch Demo**: [YouTube](https://www.youtube.com/watch?v=YOUR_VIDEO_ID) | [Vimeo](https://vimeo.com/YOUR_VIDEO_ID)
```

### 方法 3：使用 iframe（GitHub 不支持，但可以用于其他平台）

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

## 📋 视频脚本示例

### 开场（30秒）

```
"大家好，今天我要展示的是 HomeAway，一个全栈短租预订平台。

这个项目使用 Next.js 14、TypeScript、Prisma 和 Stripe 构建，
专为澳大利亚市场开发，展示了现代 Web 开发的最佳实践。

让我们开始看看这个平台的核心功能。"
```

### 功能演示（按顺序）

```
"首先，用户可以通过搜索和筛选功能浏览房源列表..."

"点击房源卡片，可以看到详细的房源信息，包括图片、地图、设施等..."

"选择日期后，系统会自动计算总价，包括清洁费和服务费..."

"支付流程集成了 Stripe，确保安全的支付处理..."

"用户可以管理自己的预订、收藏喜欢的房源..."

"房源所有者可以创建和管理自己的房源列表..."

"系统还包含完整的评论和评分功能..."

"最后，管理员可以通过仪表板查看平台统计信息..."
```

### 结尾（30秒）

```
"这就是 HomeAway 平台的主要功能。

这个项目展示了：
- 全栈开发能力
- 现代技术栈的使用
- 生产级别的代码质量
- 完整的用户体验设计

项目代码已开源在 GitHub，链接在描述中。
感谢观看！"
```

## ✅ 最终检查清单

- [ ] 视频清晰流畅
- [ ] 所有核心功能都已演示
- [ ] 视频时长合适（5-8分钟）
- [ ] 已上传到 YouTube 或其他平台
- [ ] README 中已添加视频链接
- [ ] 视频描述中包含项目链接和技术栈
- [ ] 视频标题包含关键词（Next.js, TypeScript, Full-Stack）

## 🎯 专业建议

1. **保持简洁**：不要展示所有细节，突出核心功能
2. **展示亮点**：重点展示技术难点和业务逻辑
3. **流畅演示**：提前练习，确保操作流畅
4. **添加说明**：在关键步骤添加文字说明
5. **专业呈现**：使用清晰的音频（如果需要旁白）

## 📚 参考资源

- [YouTube Creator Academy](https://creatoracademy.youtube.com/)
- [无版权音乐库](https://www.youtube.com/audiolibrary)
- [视频编辑教程](https://www.youtube.com/results?search_query=video+editing+tutorial)

---

**祝录制顺利！** 🎬

