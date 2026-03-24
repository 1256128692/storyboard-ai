# -*- coding: utf-8 -*-
import xlsxwriter

wb = xlsxwriter.Workbook(r'C:\Users\Administrator\Desktop\上海基数运维_销售简单版.xlsx')

DARK_BLUE   = "#1E3A5F"
MID_BLUE    = "#2C5F8A"
ACCENT_BLUE = "#4A90D9"
ACCENT_GREEN= "#27AE60"
ACCENT_ORG  = "#E67E22"
LIGHT_BLUE  = "#D6E4F0"
LIGHT_GREEN = "#D5F5E3"
LIGHT_ORG   = "#FDEBD0"
LIGHT_GRAY  = "#F2F3F4"
WHITE       = "#FFFFFF"
DARK_GRAY   = "#2C3E50"
YELLOW_BG   = "#FFF9E6"

def add_with_format(ws, row, col, value, fmt):
    ws.write(row, col, value, fmt)

def title_fmt(wb, size=18, bold=True, color=WHITE, bg=DARK_BLUE, align="center"):
    return wb.add_format({
        "bold": bold, "font_size": size, "font_color": color,
        "bg_color": bg, "align": align, "valign": "vcenter",
        "border": 1, "font_name": "微软雅黑",
        "text_wrap": True,
    })

def hdr_fmt(wb, bg=DARK_GRAY, color=WHITE, size=10, bold=True):
    return wb.add_format({
        "bold": bold, "font_size": size, "font_color": color,
        "bg_color": bg, "align": "center", "valign": "vcenter",
        "border": 1, "font_name": "微软雅黑",
    })

def cell_fmt(wb, bg=WHITE, color=DARK_GRAY, size=10, bold=False, align="left", valign="vcenter", wrap=True):
    return wb.add_format({
        "bold": bold, "font_size": size, "font_color": color,
        "bg_color": bg, "align": align, "valign": valign,
        "border": 1, "font_name": "微软雅黑",
        "text_wrap": wrap,
    })

# ===================== Sheet 1 =====================
ws = wb.add_worksheet("一句话介绍我能做什么")

ws.set_column("A:A", 26)
ws.set_column("B:B", 26)
ws.set_column("C:C", 26)
ws.set_column("D:D", 26)

# 主标题
ws.merge_range("A1:D1", "上海基数运维 · 一句话告诉客户我们能做什么", title_fmt(wb, 18))
ws.set_row(0, 50)

# 副标题
ws.merge_range("A2:D2", "蓝西销售专用版 · 客户问起来，3分钟讲清楚", title_fmt(wb, 10, True, WHITE, MID_BLUE))
ws.set_row(1, 22)

# 引导说明
ws.merge_range("A3:D3",
    "使用说明：左侧是客户常问的问题，中间是我们能解决的方案。客户问什么，你指哪行念哪行，3分钟让客户知道我们能帮他解决。\n"
    "合作模式：上海基数运维（IT基础设施）+ 上海蓝西实验室设备（实验室整体建设），兄弟联手，客户的IT问题我们全包",
    wb.add_format({
        "font_size": 9, "font_color": DARK_GRAY,
        "bg_color": YELLOW_BG, "align": "left", "valign": "vcenter",
        "border": 2, "font_name": "微软雅黑", "text_wrap": True,
    }))
ws.set_row(2, 44)

# 每块的配置
blocks = [
    {
        "icon_title": "场景一：客户刚做完实验室装修，接下来IT怎么办？",
        "subtitle": "机房建设 / 服务器采购 / 网络安全 · 交钥匙工程",
        "header_bg": DARK_BLUE,
        "col_headers": ["客户遇到的问题", "举个例子", "我们能帮他解决", "我们怎么帮"],
        "rows": [
            (
                "客户刚盖好实验室，装修完了，但IT这块完全没规划，不知道要买多少服务器、怎么配网络、以后怎么扩展",
                "某生物药企：实验室建好了，才发现机房没规划，增量改造花了2倍的钱和半年时间",
                "我们帮他做IT整体规划，出方案、供设备、搞实施，一站式搞定",
                "上门勘查 → 出规划方案 → 供应设备 → 部署实施 → 后续运维，客户只对接我们一个供应商"
            ),
        ],
        "row_bg": LIGHT_BLUE,
    },
    {
        "icon_title": "场景二：客户要上ERP/LIMS等业务系统，但没有服务器",
        "subtitle": "服务器采购 / 系统部署 · 配套服务",
        "header_bg": ACCENT_BLUE,
        "col_headers": ["客户遇到的问题", "举个例子", "我们能帮他解决", "我们怎么帮"],
        "rows": [
            (
                "客户想买ERP/LIMS等系统，软件商说需要服务器，但客户不知道买什么配置、买几台",
                "某IVD公司：买了LIMS软件，IT说需要服务器，不知道怎么选，配了3个月才配好，耽误上线",
                "我们帮他选型、采购、安装、调试，客户坐等可用",
                "告诉客户用途和预算 → 我们出配置清单 → 供货 → 上门安装调试 → 交付使用"
            ),
        ],
        "row_bg": LIGHT_BLUE,
    },
    {
        "icon_title": "场景三：客户想做AI，但完全不懂算力",
        "subtitle": "AI算力服务器 · 药物研发加速",
        "header_bg": ACCENT_ORG,
        "col_headers": ["客户遇到的问题", "举个例子", "我们能帮他解决", "我们怎么帮"],
        "rows": [
            (
                "客户听说AI很火，想用AI做药物研发、化合物筛选等，但不知道需要什么GPU服务器，不知道多少钱",
                "某biotech公司：想用AI筛选化合物，买了普通服务器跑不动，才知道要买GPU服务器，重复采购花了冤枉钱",
                "我们根据他的AI场景推荐GPU服务器型号和数量，让他一次买对",
                "沟通AI应用场景 → 推荐合适的GPU服务器 → 供货+部署 → 效果验证"
            ),
        ],
        "row_bg": LIGHT_ORG,
    },
    {
        "icon_title": "场景四：客户担心数据安全，怕被攻击/泄密",
        "subtitle": "网络安全 / 数据安全 · 深信服代理",
        "header_bg": ACCENT_GREEN,
        "col_headers": ["客户遇到的问题", "举个例子", "我们能帮他解决", "我们怎么帮"],
        "rows": [
            (
                "客户担心服务器被黑客攻击、数据被偷、员工泄密，但不知道怎么防护",
                "某药企：研发数据差点被离职员工拷走幸好发现及时；一次勒索病毒让整个IT系统瘫痪2周",
                "我们代理深信服全套产品，防火墙+数据防泄漏+日志审计，一套方案全部搞定",
                "评估安全现状 → 出方案 → 供货+部署 → 7x24小时安全监控运维"
            ),
        ],
        "row_bg": LIGHT_GREEN,
    },
    {
        "icon_title": "场景五：客户业务发展快，服务器不够用了",
        "subtitle": "服务器扩容 · 平滑升级",
        "header_bg": "#2980B9",
        "col_headers": ["客户遇到的问题", "举个例子", "我们能帮他解决", "我们怎么帮"],
        "rows": [
            (
                "客户业务增长快，服务器跑不动了，存储不够了，想扩容但不知道怎么扩、会不会影响现有业务",
                "某药企：业务快速发展，服务器跑不动，扩容时业务中断了一整天，丢了不少订单",
                "我们帮他评估现状，规划扩容方案，平滑升级不断服",
                "现场评估 → 制定扩容方案 → 利旧现有设备 → 平滑升级 → 业务不中断"
            ),
        ],
        "row_bg": LIGHT_BLUE,
    },
    {
        "icon_title": "场景六：客户IT没人维护，出了问题没人管",
        "subtitle": "IT运维服务 · 全包托管",
        "header_bg": DARK_GRAY,
        "col_headers": ["客户遇到的问题", "举个例子", "我们能帮他解决", "我们怎么帮"],
        "rows": [
            (
                "客户IT团队只有1-2个人，忙不过来；或者根本没有IT，服务器出了问题到处找人",
                "某初创药企：IT就一个兼职，服务器崩溃凌晨2点找不到人，业务停了2天",
                "我们提供全年IT托管服务，远程监控+故障到场+定期巡检，客户专注业务就行",
                "签约年度维保 → 7x24小时监控 → 故障4小时到场 → 季度巡检报告"
            ),
        ],
        "row_bg": LIGHT_GRAY,
    },
]

r = 4
for block in blocks:
    # 大标题行
    ws.merge_range(r, 0, r, 3, block["icon_title"], title_fmt(wb, 13, True, WHITE, block["header_bg"]))
    ws.set_row(r, 30)
    r += 1
    # 副标题
    ws.merge_range(r, 0, r, 3, "  " + block["subtitle"],
        wb.add_format({"font_size": 9, "italic": True, "font_color": WHITE,
                       "bg_color": block["header_bg"], "align": "left", "valign": "vcenter",
                       "border": 1, "font_name": "微软雅黑"}))
    ws.set_row(r, 18)
    r += 1
    # 列标题
    for col, hdr in enumerate(block["col_headers"]):
        ws.write(r, col, hdr, hdr_fmt(wb, bg=DARK_GRAY))
    ws.set_row(r, 22)
    r += 1
    # 内容行
    for row_idx, (p, pe, s, se) in enumerate(block["rows"]):
        bg = block["row_bg"] if row_idx % 2 == 0 else WHITE
        fmt = cell_fmt(wb, bg=bg, size=10)
        ws.write(r, 0, p, fmt)
        ws.write(r, 1, pe, fmt)
        ws.write(r, 2, s, fmt)
        ws.write(r, 3, se, fmt)
        ws.set_row(r, 50)
        r += 1
    r += 1

# 结尾
ws.merge_range(r, 0, r, 3,
    "有客户IT需求，联系我们！上海基数运维 + 上海蓝西实验室设备 · 兄弟联手，客户IT问题全覆盖",
    title_fmt(wb, 10, True, WHITE, DARK_BLUE))
ws.set_row(r, 36)

# ===================== Sheet 2: 快速参考卡 =====================
ws2 = wb.add_worksheet("快速参考卡")
ws2.set_column("A:A", 24)
ws2.set_column("B:B", 40)
ws2.set_column("C:C", 40)

ws2.merge_range("A1:C1", "快速参考卡 · 3分钟背完", title_fmt(wb, 16))
ws2.set_row(0, 42)

sections = [
    ("我能做什么（6句话）", [
        "1. 帮客户做机房IT整体规划，建完不后悔",
        "2. 卖服务器、存储、网络设备，一线品牌都有",
        "3. 帮客户部署ERP/LIMS等系统，配好就能用",
        "4. 卖AI算力服务器，帮biotech用上AI研发",
        "5. 深信服网络安全，数据防住、攻击挡住",
        "6. IT全年托管运维，客户只管专注业务",
    ]),
    ("客户最常问的6个问题", [
        "Q1：机房要怎么建？ → 找我们，出方案+施工+设备一条龙",
        "Q2：服务器买几台？ → 告诉我们你上什么系统，我们帮你算",
        "Q3：想做AI要多少预算？→ 看场景，小则10万，大则上百万，我们给你选型",
        "Q4：数据安全吗？→ 深信服全线产品，防火墙+数据防泄漏，合规等保",
        "Q5：以后要扩展怎么办？→ 规划阶段就帮你考虑扩容，避免重复建设",
        "Q6：有售后吗？→ 有，7x24小时值班，核心系统4小时到场",
    ]),
    ("我们的优势（3句话）", [
        "1. 深耕IT 20年，服务过100+生物制药客户，行业懂行",
        "2. 服务器/存储/网络/安全/系统，一站式供齐，不用对多个供应商",
        "3. 兄弟公司上海蓝西（实验室建设）+ 我们（IT基础设施），客户IT问题全覆盖",
    ]),
    ("什么时候找我们（4个时机）", [
        "客户刚做完实验室/厂房装修 → 趁机房还空，现在介入最合适",
        "客户要上ERP/LIMS等系统 → 服务器选型采购交给我们",
        "客户担心数据安全/怕攻击 → 深信服代理，给客户打包方案",
        "客户IT团队人手不够 → 年度托管，客户减负专注业务",
    ]),
]

r2 = 3
for sec_title, items in sections:
    ws2.merge_range(r2, 0, r2, 2, sec_title, hdr_fmt(wb, bg=ACCENT_BLUE, size=11))
    ws2.set_row(r2, 26)
    r2 += 1
    for i, item in enumerate(items):
        bg = LIGHT_GRAY if i % 2 == 0 else WHITE
        fmt = cell_fmt(wb, bg=bg, size=10)
        ws2.write(r2, 0, "", fmt)
        ws2.write(r2, 1, item, fmt)
        ws2.write(r2, 2, "", fmt)
        ws2.set_row(r2, 24)
        r2 += 1
    r2 += 1

wb.close()
print("OK")
