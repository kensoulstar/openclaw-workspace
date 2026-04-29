# CLIS 工具集 - 命令行能力参考

_整理于 2026-04-21。这三个工具是星际搭建的 CLI 能力体系。_

---

## 一、OpenCLI（网站→CLI）

**仓库：** `/home/kensoulstar/OpenCLI-main`
**包名：** `@jackwener/opencli`
**安装：** `npm install -g @jackwener/opencli`
**全局配置：** `~/.opencli/`（含站点缓存、凭证等）

### 核心概念

| 概念 | 说明 |
|------|------|
| **内置适配器** | 90+ 站点已封装好的 CLI，直接调用即可 |
| **Browser 自动化** | 复用 Chrome 登录态操作任意网站（需装 Browser Bridge 扩展） |
| **CLI 枢纽** | `opencli register` 把本地工具统一注册到同一入口 |

### 前置要求

- Node.js >= 21.0.0
- Chrome/Chromium 运行中（browser 命令需要）
- Browser Bridge 扩展已安装（浏览器操作场景）

### 配置项

| 变量 | 默认值 | 说明 |
|------|--------|------|
| OPENCLI_DAEMON_PORT | 19825 | daemon-extension 通信端口 |
| OPENCLI_BROWSER_CONNECT_TIMEOUT | 30 | 浏览器连接超时（秒） |
| OPENCLI_BROWSER_COMMAND_TIMEOUT | 60 | 单命令超时（秒） |

### 常用命令速查

```bash
opencli list                  # 查看所有命令
opencli <site> <command>      # 调用适配器

# 输出格式 -f table/json/csv/yaml/md
opencli bilibili hot -f json --limit 5
opencli zhihu hot -f csv
opencli hackernews top -f md

# Browser 操作（AI Agent 用，不手动跑）
opencli browser open <url>    # 打开网页
opencli browser state         # 读取页面内容
opencli browser click ref     # 点击元素
```

### 内置站点分类

| 类型 | 站点 |
|------|------|
| **国内内容** | bilibili, zhihu, weibo, xiaohongshu, douban, v2ex, nowcoder |
| **国际社区** | reddit, twitter/X, hackernews, stackoverflow |
| **视频媒体** | youtube, tiktok, douyin |
| **电商购物** | jd, taobao, amazon, ebay, boss(招聘) |
| **学术文献** | google-scholar, arxiv, baidu-scholar, wangfang |
| **AI 工具** | cursor(桌面端), codex(桌面端), chatgpt-app(桌面端), notio

n(桌面端) |

### CLI 枢纽（注册本地工具）

```bash
opencli register gh    # 注册 GitHub CLI
opencli register docker
opencli register obsidian
```

---

## 二、CLI-Anything（Agent→本地软件）

**仓库：** `/home/kensoulstar/CLI-Anything-main`
**定位：** AI Agent 控制本地软件的标准化框架
**要求：** Python 3.10+，bash 环境（Windows 需 Git Bash/WSL）

### 架构模式

每个软件对应一个 `agent-harness`：
```
<software>/agent-harness/
├── <SOFTWARE>.md          # 架构/SOP 文档
├── setup.py              # Click CLI 入口
├── cli_anything/<software>/
│   ├── core.py           # 核心逻辑
│   ├── backend.py        # 真实软件包装器
│   └── tests/            # 测试用例
```

### 已集成的软件

| 类别 | 软件 | 用途 |
|------|------|------|
| **3D/设计** | Blender, FreeCAD, GIMP, ComfyUI | 建模、绘图、AI 图像生成 |
| **数据库** | ChromaDB | 向量存储与检索 |
| **工作流** | Dify Workflow | AI 应用编排 |
| **搜索** | Exa | AI 增强搜索引擎 |
| **办公** | LibreOffice, Obsidian-Studio | 文档处理、笔记管理 |
| **开发工具** | Codex Skill, PM2 | Node.js 进程管理 |
| **其他** | Zoom, NotebookLM, OpenScreen | 视频通话、笔记分析、录屏 |

### 安装方式

```bash
# 安装单个软件 harness
pip install git+https://github.com/HKUDS/CLI-Anything.git#subdirectory=<软件>/agent-harness

# 测试 harness（mock 模式，不需要真实软件）
cd <软件>/agent-harness
pytest cli_anything/<软件>/tests/test_core.py -v
```

### SKILL.md 位置

技能文件位于 `skills/cli-anything-<软件>/SKILL.md`，Agent 通过读取 SKILL.md 了解如何调用对应软件。

---

## 三、k 命令（宝塔命令行工具）

**位置：** `/usr/local/bin/k` → `/usr/bin/k`
**来源：** 宝塔面板 BT Panel 官方 CLI 工具
**视频介绍：** https://www.bilibili.com/video/BV1ib421E7it?t=0.1

### 核心用法——应用编号安装

```bash
k app                     # 浏览应用市场（显示编号列表）
k app 13                  # 直接安装 Cloudreve 网盘（第13项）
k app <编号>              # 通过编号快速安装任意应用
```

### 完整命令参考

#### 系统管理
| 命令 | 说明 |
|------|------|
| `k` | 启动主菜单 |
| `k install nano wget` / `k add` | 安装包 |
| `k remove docker` / `k del` / `k uninstall` | 卸载包 |
| `k update` / `k 更新` | 系统更新 |
| `k clean` / `k 清理` | 清理垃圾 |
| `k dd` / `k 重装` | 重装系统面板 |
| `k info` | 显示系统信息 |

#### 性能调优
| 命令 | 说明 |
|------|------|
| `k bbr3` / `k bbrv3` | BBR3 加速控制面板 |
| `k nhyh` / `k 内核优化` | 内核调优面板 |
| `k swap 2048` | 设置虚拟内存（MB） |
| `k time Asia/Shanghai` | 设置虚拟时区 |

#### Docker 管理
| 命令 | 说明 |
|------|------|
| `k docker` | Docker 管理平面 |
| `k docker install` | 安装 Docker |
| `k docker ps` | 容器列表 |
| `k docker img` | 镜像管理 |

#### 网站/服务
| 命令 | 说明 |
|------|------|
| `k web` | LDNMP 站点管理 |
| `k wp xxx.com` | 安装 WordPress |
| `k fd xxx.com` / `k rp` | 安装反向代理 |
| `k loadbalance` | 负载均衡 |

#### 安全/网络
| 命令 | 说明 |
|------|------|
| `k dkdk 8080` | 开放端口 |
| `k gbdk 7800` | 关闭端口 |
| `k fxip 127.0.0.0/8` | 放行 IP |
| `k zzip 177.5.25.36` | 阻止 IP |
| `k fhq` / `k 防火墙` | 防火墙面板 |
| `k ssl` | SSL 证书申请 |

#### SSH/远程
| 命令 | 说明 |
|------|------|
| `k ssh` | SSH 连接工具 |
| `k rsync` | 远程同步 |
| `k sshkey github <user>` | GitHub 公钥导入 |

### 应用市场编号速查（部分）

```
13 = Cloudreve 网盘 ★
```

---

## 使用场景映射

| 需求 | 推荐工具 | 示例命令 |
|------|----------|----------|
| 抓取 B站热门数据 | OpenCLI | `opencli bilibili hot -f json` |
| 操作 Cursor/Codex | OpenCLI Browser + CLI-Anything | Agent skill 调用 |
| 安装 Cloudreve 网盘 | k | `k app 13` |
| 批量抓取多平台热榜 | OpenCLI | Shell 循环多个 `opencli` 命令 |
| ComfyUI AI 生图 | CLI-Anything | Agent 通过 harness 调用 |

---

_此文件作为工作区参考文档，后续可随工具升级补充。_
