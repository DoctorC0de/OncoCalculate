<div align="center">

# 🏥 OncoCalculate

### 肿瘤医学临床计算器

**专为肿瘤科医师、药师与医学研究人员设计的全功能 Android 临床计算 App**

[![Release](https://img.shields.io/github/v/release/DoctorC0de/OncoCalculate?style=flat-square&color=0ea5e9)](https://github.com/DoctorC0de/OncoCalculate/releases)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Android-34a853?style=flat-square&logo=android&logoColor=white)](https://github.com/DoctorC0de/OncoCalculate/releases)
[![Language](https://img.shields.io/badge/界面语言-中文-e53935?style=flat-square)](https://github.com/DoctorC0de/OncoCalculate)

[📥 下载 APK](https://github.com/DoctorC0de/OncoCalculate/releases/latest) · [📋 公式清单](#-包含计算公式) · [🛠 技术架构](#-技术架构)

</div>

---

## ✨ 功能特性

- 🏥 **全中文界面** — 中文临床术语、公式说明与分级指导，保留国际通用缩写（BSA, AUC, RECIST 等）
- 📐 **SI 国际标准单位** — 默认采用国际标准单位（μmol/L, g/L, mmol/L），支持一键切换传统单位
- 🎨 **Material 3 深色主题** — Android 原生风格 UI 设计，沉浸式深色医疗主题
- ⚡ **Rust 核心计算引擎** — 核心公式由 Pure Rust 编写，保障数值精度，毫秒级运算
- 📱 **完全离线运行** — 零网络依赖，不收集任何患者数据，100% 本地隐私安全
- ⭐ **收藏与历史** — 常用公式一键收藏，自动记录计算历史
- 🔍 **智能搜索** — 支持按名称、缩写、关键词搜索与分类筛选
- 📋 **一键复制结果** — 计算结果一键复制，方便粘贴至病历或报告

---

## 📥 安装方法

1. 前往 [Releases 页面](https://github.com/DoctorC0de/OncoCalculate/releases/latest)
2. 下载最新版 `OncoCalculate.apk`
3. 在 Android 手机上打开并安装（需要允许「安装未知来源应用」）

> **系统要求：** Android 5.0 (API 21) 及以上

---

## 📋 包含计算公式

### 💊 化疗与剂量计算

| 公式 | 说明 |
|------|------|
| **体表面积 BSA** | Mosteller / Du Bois / Haycock / Gehan / Boyd 五种公式对比 |
| **卡铂 Calvert 公式** | Target AUC × (GFR + 25)，靶浓度 AUC 给药剂量计算 |
| **肾小球滤过率 GFR** | Cockcroft-Gault / CKD-EPI 肌酐清除率估算 |

### 🩸 血液毒性与血钙

| 公式 | 说明 |
|------|------|
| **中性粒细胞绝对计数 ANC** | WBC × (%Segs + %Bands)，CTCAE v5.0 毒性分级 (1-4 级) |
| **校正血钙** | 低白蛋白血症校正钙浓度，肿瘤高钙血症评估 |

### 📊 实体瘤疗效评价

| 公式 | 说明 |
|------|------|
| **RECIST 1.1** | 靶病灶 SLD 比对基线/最小值，自动判定 CR/PR/SD/PD |
| **肿瘤倍增时间 & 比生长速率** | 两次测量间肿瘤体积增长动力学分析 |

### 🫁 肝肾与器官功能

| 公式 | 说明 |
|------|------|
| **ALBI 评分** | 白蛋白-胆红素肝功能分级 (Grade 1-3) |
| **Child-Pugh 评分** | 肝硬化严重程度分级 (A/B/C 级) |

### ⚠️ 风险评估

| 公式 | 说明 |
|------|------|
| **Khorana VTE 评分** | 化疗相关静脉血栓栓塞风险分层 |
| **MASCC 评分** | 粒细胞缺乏伴发热风险评估（低危/高危） |

### 💊 药物与单位换算

| 公式 | 说明 |
|------|------|
| **MEDD 阿片类等效剂量** | 吗啡、羟考酮、芬太尼贴剂等阿片类药物等效换算 |
| **糖皮质激素等效换算** | 泼尼松、地塞米松、甲泼尼龙等效剂量换算 |

### 📈 预后分期与评分

| 公式 | 说明 |
|------|------|
| **IPI 国际预后指数** | 非霍奇金淋巴瘤预后分组 |
| **IMDC 评分** | 转移性肾细胞癌预后风险分层 |

---

## 🛠 技术架构

```
OncoCalculate
├── src/                    # 前端 React 应用
│   ├── components/         # Material 3 UI 组件
│   │   ├── Header.tsx          # 顶部应用栏 + 搜索
│   │   ├── BottomTabBar.tsx    # 底部导航栏
│   │   ├── CalculatorCard.tsx  # 公式列表卡片
│   │   ├── CalculatorDetailPage.tsx  # 计算详情页
│   │   ├── CategoryNav.tsx     # 分类筛选 Chips
│   │   └── AboutPage.tsx       # 关于页面
│   ├── utils/formulas/     # 计算公式引擎
│   │   ├── chemo.ts            # BSA, Calvert, GFR
│   │   ├── hematology.ts       # ANC, 校正血钙
│   │   ├── recist.ts           # RECIST 1.1, 倍增时间
│   │   ├── organ.ts            # ALBI, Child-Pugh
│   │   ├── riskScores.ts       # Khorana, MASCC
│   │   ├── conversions.ts      # MEDD, 糖皮质激素
│   │   └── staging.ts          # IPI, IMDC
│   └── types/              # TypeScript 类型定义
├── src-rust/               # Rust 核心计算模块
├── android/                # Android 原生壳 (Capacitor)
├── tailwind.config.js      # Tailwind CSS 主题配置
└── capacitor.config.json   # Capacitor 配置
```

**技术栈：**
- **前端框架**：React 18 + TypeScript + Vite
- **UI 设计**：Tailwind CSS (Material 3 深色主题)
- **计算引擎**：Rust (via WASM)
- **移动端打包**：Capacitor 5 → Android APK
- **图标库**：Lucide React

---

## 🏗 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 同步到 Android 项目
npx cap sync android

# 编译 APK (需要 JDK 17 + Android SDK)
cd android && ./gradlew assembleDebug
```

---

## ⚠️ 医疗免责声明

> **本应用程序仅供肿瘤科执业医师、药师与科研人员参考。**
>
> 计算结果不能替代专业医师的临床判断。在行化疗给药或开具处方前，请务必根据具体临床情况与药品说明书再次复核。开发者不对因使用本工具产生的任何医疗决策后果承担责任。

---

## 📄 开源许可

本项目采用 [MIT License](LICENSE) 开源。

---

<div align="center">
<sub>Made with ❤️ for Oncology Clinicians</sub>
</div>
