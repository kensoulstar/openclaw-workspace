# MEMORY.md - 长期记忆

This file contains curated memories worth keeping long-term. Updated as lessons and preferences are learned.

---

## 交流偏好

- 星际不喜欢「标准助理腔」「研究报告腔」「交作业腔」。信息对了但说话像在提交分析报告,也算AI味重。
- 更适合星际的方式：先给判断再说为什么，像一起聊选题,不像做答辩。
- 可以展示思考过程，但不要写成生硬的流程汇报。
- 不确定时直接说，「我还在想」「这个没完全想清楚」比硬凹洞察更好。
- 破折号、感叹号、套话开头是最容易踩的 AI 味雷区。

## 写作习惯

- 写之前先判断:有没有独家take? 有→评论路径(短、锐、一个核心论点); 没有→报道路径或先不写。
- 星际写文章前习惯先做竞品扫描,看最近3个月同话题别人怎么写的。
- 偏好从具体经历和数据里长出观点,不是先摆观点再找例子。
- 商单文章也要有自己的角度,不能写成软文模板。
- 每篇文章约10处加粗标记重点,方便读者扫读。
- 配图优先AI生成,HTML截图只在精确数据表格时兜底。

## 技术偏好

- 写代码优先TypeScript,除非明确要求JavaScript。
- API密钥放 .env,通过'process.env'读取,不硬编码。
- 星际从未手写过代码,所有产品都是AI写的。不要用「退化」之类暗示曾经会写代码的表述。
- iOS开发是主力技术方向,当前在做小猫补光灯的下一代产品。

## 工作方式

- 涉及数据、后台、报表类任务:不要只截图转述,要主动梳理、提炼结论、给判断和下一步建议。
- 文章/草稿必须写入md文件,不要直接写在回复里。
- 星际更喜欢先看结论,细节按需展开。
- 遇到长任务在后台跑时,至少每2分钟同步一次进展,不要等跑完才汇报。

## 审美偏好

- 赛博霓虹/深蓝底色(#0D,117)是审美禁区。
- 封面图不加个人署名/水印
- 图片用1K或2K分辨率,不用4K。
- 配色偏好温暖、有质感的方向,拒绝程序员默认审美。

## 关键资料位置

- 写作总部：`/Users/alchain/Documents/写作/`
- 路由文件：`/Users/alchain/Documents/写作/CLAUDE.md`
- AI味审校指南、风格指南、语言特征、金句表达都在 `04-写作参考/` 下
- 星际的账号：公众号「星际」、B站「AI进化论-花生」、官网 bookai.top

---

## 2026-04-09 系统配置信息

### 主机信息
- 主机名: DESKTOP-UPG3TJ6
- 系统版本: Windows_NT 10.0.26100 (x64)
- 操作系统: Windows 11 专业版

### CPU信息
- CPU架构: x64
- CPU型号: Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz
- CPU核心数: 8
- CPU频率: 2.4 GHz

### 显卡信息
- 显卡型号: NVIDIA GeForce RTX 2080 Ti
- 显卡驱动: 32.0.15.7283
- 显示分辨率: 1720 x 1440
- 显存容量: 4GB GDDR6
- 显示适配器: Microsoft Remote Display Adapter (远程桌面)
- 虚拟显示: SudoMaker Virtual Display Adapter, OrayIddDriver Device

### 音频设备
- NVIDIA高清音频
- Realtek高清音频
- NVIDIA虚拟音频设备

### 硬盘配置
- 主硬盘: KIOXIA-EXCERIA G2 SSD (2TB, NVMe接口)
- 存储阵列: SYNOLOGY Storage (6.4TB, SCSI接口)

### 开发环境
- Node.js版本: v22.22.1
- PowerShell版本: 7.x
- OpenClaw运行时: agent=main
- 技能配置: 71个已安装技能

---

_This file grows as we learn more about what matters._

---

## 长效反馈闭环

> 仅当质检员 VERDICT: PASS 时提取。每次 /plan 阶段必须读取本节寻找同类模式。

– [Topic]: 质检员子Agent注册
 – [Success Logic]: 直接写 openclaw.json 注册 verifier，绕过 openclaw agents add CLI（插件依赖安装导致超时）；agents.list 必须是数组格式
 – [Tool Chain]: python3 config patch → gateway restart → config verify
 – [Evidence]: agents.list = [{id: verifier, name: 🛡️质检员, workspace: /home/kensoulstar/.openclaw/workspace/agent/质检员}]
 – [Timestamp]: 2026-04-27

## 2026-04-27 系统配置变更

### 记忆系统
- 安装了 nomic-embed-text 向量模型（Ollama, 274 MB）
- memory.backend = builtin, memorySearch.provider = ollama, model = nomic-embed-text
- 向量数据库就绪

### Agent 架构
- 创建了 **架构师** Agent（agents/架构师/）
- Full Mesh 全网状通信：main ↔ verifier ↔ 架构师
- tools.agentToAgent 已启用

### Skills 安装
- 6 个架构 Skills（agent-lifecycle-mgr, behavior-design, blast-radius-permission, mcp-integration, skill-packaging, verification-agent）
- 11 个核心 Skills（verify, debug, simplify, batch, stuck, remember, updateConfig, keybindings, loop, claudeApi, claudeInChrome）
- context-compact 上下文压缩

### MCP 服务器
- filesystem, github, slack, puppeteer 四个服务器已注册

### 浏览器
- Playwright 安装（v1.59.1）
- browser.enabled = true, Chrome 启动成功

### Obsidian CLI
- Obsidian snap 安装（1.12.7）
- CLI 已启用，Vault: mybook (/home/kensoulstar/mybook)

### 定时任务
- PR 监控任务（每 5 分钟）

### 备份
- 备份文件 ~/.openclaw/backup/（13 MB）
---

## 2026-04-29 新增经验

### draw.io 技能与 CLI

- drawio-skill 已安装（agents365-ai/drawio-skill），依赖桌面版 draw.io CLI
- Docker 版 draw.io 无法替代桌面 CLI
- draw.io CLI 在 Ubuntu 上的调用方式：`DISPLAY=:1 /usr/bin/drawio -x <file.drawio> -f png -o <out.png>`
- XML 中文字符用 UTF-8，无需 HTML 实体转换
- 生成的图表文件存放在 `~/.openclaw/workspace/` 下
- 导出 PNG + SVG + .drawio 源文件三种格式一起交付

### draw.io 排版经验

- 中文字符列宽至少 150px，否则文字覆盖
- 字体用 Microsoft YaHei，大小 10-11pt
- draw.io --export 在有图形界面的 Ubuntu 上正常可用，不需要 xvfb

### gh CLI

- Ubuntu apt 源中有包（gh 2.45.0），星际已安装并完成 GitHub OAuth 授权
- 账户：kensoulstar，token 权限：repo/gist/workflow

### 备份方案

- 备份仓库：github.com/kensoulstar/openclaw-workspace
- 备份脚本：`~/.openclaw/workspace/backup_openclaw.sh`
