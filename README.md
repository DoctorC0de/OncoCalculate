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

- 🏥 **全中文界面** — 纯正中文临床术语、公式说明与权威分级指南，保留国际通用缩写（BSA, AUC, ECOG, RECIST 等）
- 📐 **SI 国际标准单位** — 默认优先国际标准单位（μmol/L, g/L, mmol/L），并支持一键无缝双向切换传统临床单位（mg/dL, g/dL）
- 🎨 **Material 3 双主题** — 清新明亮（Light Mode 查房模式）与深邃护眼（Dark Mode 夜间模式）随心一键切换
- ⚡ **Pure Rust 核心计算引擎** — 核心数学公式由 Rust 编写，彻底解决前端浮点误差，毫秒级快速运算
- 👤 **患者档案跨公式联动** — 录入一次患者基本生理参数（性别、年龄、身高、体重、肌酐），各计算器自动同步预填，杜绝繁琐重复输入
- 📝 **规范化病历小结一键生成** — 自动排版标准 EMR 临床小结，支持一键复制到剪贴板或系统原生分享
- 📱 **完全离线隐私安全** — 零网络依赖，零外部数据埋点，不采集任何患者个人隐私，100% 本地运算
- ⏳ **历史记录深度还原** — 记录每次计算的输入快照与单位，点击即可完全还原历史患者数据
- 🔍 **智能搜索与分类检索** — 支持名称、拼音缩写、临床标签搜索与横向分类筛选
- 🔢 **便捷参数微调与预设** — 数字输入框配备步进微调按钮 (`-` / `+`) 及常用参数快速预设 Chips

---

## 📥 安装方法

1. 前往 [Releases 页面](https://github.com/DoctorC0de/OncoCalculate/releases/latest)
2. 下载最新版 `OncoCalculate.apk`
3. 在 Android 手机上打开并安装（需要允许「安装未知来源应用」）

> **系统要求：** Android 5.0 (API 21) 及以上

---

## 📋 包含计算公式 (共 21 项)

### 💊 化疗与剂量计算

| 公式 | 缩写 | 说明与临床意义 |
|------|------|----------------|
| **体表面积计算器** | BSA | Mosteller / Du Bois / Haycock / Gehan / Boyd 五大经典公式比对 |
| **卡铂 Calvert 公式** | Calvert | Target AUC × (GFR + 25)，125 mL/min 上限自动封顶保护 |
| **肾小球滤过率** | GFR / CrCl | Cockcroft-Gault 肌酐清除率 & CKD-EPI 2021 eGFR 评估 |
| **理想体重与校正体重** | IBW / AdjBW | Devine 公式与 BMI 计算，指导成人肥胖肿瘤患者化疗剂量调整 (ASCO) |

### 🩸 血液毒性与血钙

| 公式 | 缩写 | 说明与临床意义 |
|------|------|----------------|
| **中性粒细胞绝对计数** | ANC | WBC × (%Segs + %Bands)，匹配 CTCAE v5.0 粒细胞减少 1-4 级分级 |
| **校正血钙浓度** | Corr Ca | 纠正低白蛋白血症伪低钙，准确评估肿瘤相关高钙血症危象 |

### 📊 实体瘤疗效评价

| 公式 | 缩写 | 说明与临床意义 |
|------|------|----------------|
| **实体瘤疗效评估器** | RECIST 1.1 | 靶病灶最长径之和 (SLD) 比对基线与最小值，自动判定 CR / PR / SD / PD |
| **肿瘤倍增时间** | DT / SGR | 两次影像测量间肿瘤体积倍增动力学与特定生长速率分析 |

### 🫁 肝肾与器官功能

| 公式 | 缩写 | 说明与临床意义 |
|------|------|----------------|
| **ALBI 肝功能分级** | ALBI | 白蛋白-胆红素客观评分，原发性肝癌 (HCC) 专用储备评估 (Grade 1-3) |
| **Child-Pugh 评分** | Child-Pugh | 经典肝硬化代偿分级 (Class A / B / C)，抗肿瘤靶向药耐受评估 |
| **终末期肝病模型** | MELD-Na | UNOS 标准加权血钠 MELD 评分，评估肝衰竭及 90 天病死率预测 |

### ⚠️ 风险与感染评估

| 公式 | 缩写 | 说明与临床意义 |
|------|------|----------------|
| **肿瘤相关血栓风险** | Khorana | 评估门诊实体瘤患者化疗相关静脉血栓栓塞 (VTE) 风险层级 |
| **粒缺发热风险指数** | MASCC | 评估发热性中性粒细胞减少 (FN) 患者严重并发症风险及门诊口服抗生素指征 |
| **稳定期粒缺发热指数** | CISNE | 专为实体瘤稳定期粒缺发热设计，比 MASCC 更精准识别隐匿严重感染并发症 |

### 💊 药物与单位换算

| 公式 | 缩写 | 说明与临床意义 |
|------|------|----------------|
| **阿片类等效剂量换算** | MEDD | 吗啡、羟考酮、芬太尼透皮贴等阿片类止痛药等效换算及不完全交叉耐受减量 |
| **糖皮质激素等效换算** | Steroid | 地塞米松、泼尼松、甲泼尼龙、氢化可的松等抗炎水肿剂量换算 |

### 📈 预后分期与评分

| 公式 | 缩写 | 说明与临床意义 |
|------|------|----------------|
| **体能状态双向评分** | ECOG / KPS | 国际肿瘤学标准体能状态评定，化疗耐受门槛判定与临床处方指导 |
| **弥漫大B细胞淋巴瘤预后** | IPI / R-IPI | 经典 IPI 及利妥昔单抗时代 R-IPI 侵袭性淋巴瘤预后分层 |
| **滤泡性淋巴瘤预后** | FLIPI | 国际滤泡性淋巴瘤预后评分系统与预计 10 年总生存率 |
| **多发性骨髓瘤修订分期** | R-ISS | 整合 ISS 分期、高危细胞遗传学 (iFISH) 与 LDH 的金标准模型 |
| **晚期肾细胞癌模型** | IMDC | 转移性透明细胞肾细胞癌 (mRCC) 预后危险度分层与一线靶免用药指导 |

---

## 🛠 技术架构

```
OncoCalculate
├── src/                    # 现代化 React 前端
│   ├── components/         # Material 3 原生触控组件
│   │   ├── Header.tsx            # 顶部应用栏 + 主题切换 + 档案入口
│   │   ├── BottomTabBar.tsx      # 底部导航栏 (Pill 指示器)
│   │   ├── CalculatorCard.tsx    # 列表卡片 (分类色彩标 + 标签)
│   │   ├── CalculatorDetailPage.tsx # 计算详情页 (步进器 + 预设Chips)
│   │   ├── CategoryNav.tsx       # 分类筛选 Chips
│   │   ├── PatientProfileModal.tsx # 患者档案跨公式联动弹窗
│   │   ├── EMRNoteModal.tsx      # 规范化病历小结一键导出弹窗
│   │   ├── Snackbar.tsx          # 胶囊浮条 Toast 反馈
│   │   └── AboutPage.tsx         # 关于与指南
│   ├── context/            # 全局状态管理
│   │   └── ThemeContext.tsx      # Material 3 Light/Dark 主题上下文
│   ├── utils/formulas/     # 21 项肿瘤临床公式算法库
│   │   ├── chemo.ts              # BSA, Calvert, GFR, IBW/AdjBW
│   │   ├── hematology.ts         # ANC, 校正血钙
│   │   ├── recist.ts             # RECIST 1.1, 倍增时间
│   │   ├── organ.ts              # ALBI, Child-Pugh, MELD-Na
│   │   ├── riskScores.ts         # Khorana, MASCC, CISNE
│   │   ├── conversions.ts        # MEDD, 糖皮质激素
│   │   ├── performance.ts        # ECOG / KPS
│   │   └── staging.ts            # IPI, FLIPI, R-ISS, IMDC
│   └── types/              # TypeScript 强类型定义
├── src-rust/               # Pure Rust 核心计算引擎 (带自动化单元测试)
├── android/                # Android 原生包装工程 (Capacitor 5)
├── tailwind.config.js      # Tailwind CSS + Material 3 主题配置
└── capacitor.config.json   # 移动端运行时配置
```

---

## 🏗 本地构建与开发

```bash
# 1. 安装依赖
npm install

# 2. 运行自动化测试
npm run test         # 运行 Vitest 测试 (14 个核心测试套件)
cd src-rust && cargo test # 运行 Rust 核心算法测试

# 3. 启动本地开发服务器
npm run dev

# 4. 生产构建打包
npm run build

# 5. 同步至 Android 原生项目
npx cap sync android

# 6. 编译生成 Android APK (需要 JDK 17 及 Android SDK)
cd android && ./gradlew assembleDebug
```

---

## ⚠️ 医疗免责声明

> **本应用程序仅供肿瘤科执业医师、临床药师与医学科研人员学术与诊疗参考。**
>
> 测算结果不能替代执业医师的专业临床判断。在行化疗药物开具或处方调整前，请务必根据具体临床情况、患者器官储备及最新药品说明书再次核验。开发者对任何依据本工具计算结果所做出的临床决策后果不承担任何法律责任。

---

## 📄 开源许可

本项目遵循 [MIT License](LICENSE) 开源协议。

---

<div align="center">
<sub>Designed with ❤️ for Oncology Clinicians and Researchers</sub>
</div>
