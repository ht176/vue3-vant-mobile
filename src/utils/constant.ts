/**
 * 应用程序ID
 * @type {string}
 */
export const APP_ID = 'pad'

/**
 * 应用程序私钥
 * @type {string}
 */
export const APP_KEY = 'JLMED-iHDIS-2020'

/**
 * 默认分页大小
 * @type {number}
 */
export const PAGE_SIZE = 50

/**
 * 默认星期从周几开始,默认从周一开始  1 Monday ... 7 Sunday
 */
export const WEEK_START = 1

/**
 * 医生排班是否支持单日多选  0只能单选  1支持多选
 */
export const DOCTOR_SCHEDULE_MUTISELECT = 1

/**
 * 护士排班是否支持单日多选  0只能单选  1支持多选
 */
export const NURSE_SCHEDULE_MUTISELECT = 1

/**
 * 会话存储名称
 * @type {string}
 */
export const TOKEN_STORAGE_NAME = 'aGhfdG9rZW4='

/**
 * 会话用户存储名称
 * @type {string}
 */
export const TOKEN_USER_STORAGE_NAME = 'aGhfdXNlcg=='

/**
 * 用户名存储名称
 * @type {string}
 */
export const UID_STORAGE_NAME = 'aGhfdWlk'
/**
 * 用户菜单存储名称
 * @type {string}
 */
export const TOKEN_MENU_STORAGE_NAME = 'aGhfbWVudXM='

/**
 * 默认透析时长 分钟
 */
export const DEFAULT_DIALYSIS_DURATION = 240

// #region 字典分类编码

// #region 系统 DIC.SYS
/**
 * 颜色代码
 */
export const DIC_SYS_COLOR = 'DIC.SYS.COLOR'

/**
 * 字体颜色代码
 */
export const DIC_SYS_FONTCOLOR = 'DIC.SYS.FONTCOLOR'

/**
 * 单位
 */
export const DIC_SYS_UNIT = 'DIC.SYS.UNIT'

/**
 * 用户标签
 */
export const DIC_SYS_USER_TAG = 'DIC.SYS.USER.TAG'

/**
 * 档案标签 - 系统
 */
export const DIC_SYS_ARCHIVE_TAG = 'DIC.SYS.ARCHIVE.TAG'

/**
 * 档案分类 - 系统
 */
export const DIC_SYS_ARCHIVE_TYPE = 'DIC.SYS.ARCHIVE.TYPE'
// #endregion

// #region 医院 DIC.HOSPITAL
/**
 * 医院类型
 */
export const DIC_HOSPITAL_TYPE = 'DIC.HOSPITAL.TYPE'

/**
 * 医院性质
 */
export const DIC_HOSPITAL_NATURE = 'DIC.HOSPITAL.NATURE'

/**
 * 医院级别
 */
export const DIC_HOSPITAL_LEVEL = 'DIC.HOSPITAL.LEVEL'
// #endregion

// #region DIC.PEOPLE
/**
 * 性别
 */
export const DIC_PEOPLE_GENDER = 'DIC.PEOPLE.GENDER'

/**
 * 民族
 */
export const DIC_PEOPLE_NATIONALITY = 'DIC.PEOPLE.NATIONALITY'

/**
 * 血型
 */
export const DIC_PEOPLE_BLOODTYPE = 'DIC.PEOPLE.BLOODTYPE'

/**
 * RH
 */
export const DIC_PEOPLE_RH = 'DIC.PEOPLE.RH'

/**
 * 病情
 */
export const DIC_PATIENT_CONDITION = 'DIC.PATIENT.CONDITION'

/**
 * 使用类型
 */
export const EQUIPMENTSTATUS = 'EQUIPMENTSTATUS'
/**
 * 证件类型
 */
export const DIC_PEOPLE_IDTYPE = 'DIC.PEOPLE.IDTYPE'

/**
 * 身份证
 */
export const DIC_PEOPLE_IDTYPE_IDCARD = '1'

/**
 * 婚否
 */
export const DIC_PEOPLE_MARITAL = 'DIC.PEOPLE.MARITAL'

/**
 * 文化程度
 */
export const DIC_PEOPLE_EDUCATIONALLEVEL = 'DIC.PEOPLE.EDUCATIONALLEVEL'

/**
 * 政治面貌
 */
export const DIC_PEOPLE_POLITICAL = 'DIC.PEOPLE.POLITICAL'

/**
 * 职业
 */
export const DIC_PEOPLE_PROFESSION = 'DIC.PEOPLE.PROFESSION'

/**
 * 医保类型
 */
export const DIC_PEOPLE_MEDICARETYPE = 'DIC.PEOPLE.MEDICARETYPE'
// #endregion

// #region 医护人员 DIC.MEDICAL
/**
 * 医生职务
 */
export const DIC_MEDICAL_DOCTOR_TITLE = 'DIC.MEDICAL.DOCTOR.TITLE'
/**
 * 护士职务
 */
export const DIC_MEDICAL_NURSE_TITLE = 'DIC.MEDICAL.NURSE.TITLE'

/**
 * 医生职称
 */
export const DIC_MEDICAL_DOCTOR_PROFESSIONALTITLE = 'DIC.MEDICAL.DOCTOR.PROFESSIONALTITLE'

/**
 * 护士职称
 */
export const DIC_MEDICAL_NURSE_PROFESSIONALTITLE = 'DIC.MEDICAL.NURSE.PROFESSIONALTITLE'
// #endregion

// #region 检查检验 DIC.LISPACS
/**
 * 检查大类 - 检查检验
 */
export const DIC_EXAMINE_CATEGORY = 'DIC.EXAMINE.CATEGORY'
/**
 * 检查项目 - 检查检验
 */
export const DIC_EXAMINE_ITEM = 'DIC.EXAMINE.ITEM'

/**
 * 检查部位 - 检查检验
 */
export const DIC_EXAMINE_POSITION = 'DIC.EXAMINE.POSITION'
// #endregion

// #region 患者 DIC.PATIENT
/**
 * 转归类型
 */
export const DIC_PATIENT_PROGNOSIS_TYPE = 'DIC.PATIENT.PROGNOSIS.TYPE'

/**
 * 来源
 */
export const DIC_PATIENT_SOURCE = 'DIC.PATIENT.SOURCE'

/**
 * 透析状态
 */
export const DIC_PATIENT_DIALYSIS_STATE = 'DIC.PATIENT.DIALYSIS.STATE'

/**
 * 患者治疗状态
 */
export const DIC_PATIENT_CURE_TYPE = 'DIC.PATIENT.CURE.TYPE'

/**
 * 标签级别
 */
export const DIC_PATIENT_TAG_LEVEL = 'DIC.PATIENT.TAG.LEVEL'

/**
 * 系统疾病史或者异常
 */
export const DIC_PATIENT_DHAA = 'DIC.PATIENT.DHAA'

/**
 * 既往肾脏替代治疗史详情
 */
export const DIC_PATIENT_RRTD = 'DIC.PATIENT.RRTD'

/**
 * 血压测量部位
 */
export const DIC_PATIENT_MEASURE_BP_POSITION = 'DIC.PATIENT.MEASURE.BP.POSITION'

/**
 * 测量阶段
 */
export const DIC_PATIENT_MEASURE_TAG = 'DIC.PATIENT.MEASURE.TAG'

/**
 * 称重方式
 */
export const DIC_PATIENT_MEASURE_WEIGHT_MODE = 'DIC.PATIENT.MEASURE.WEIGHT.MODE'

/**
 * 诊断
 */
export const DIC_PATIENT_DIAGNOSIS = 'DIC.PATIENT.DIAGNOSIS'
/**
 * 宣教效果
 */
export const DIC_PATIENT_HEALTHEDUCATION_EFFECT = 'DIC.PATIENT.HEALTHEDUCATION.EFFECT'

/**
 * 患者状态
 */
export const DIC_PATIENT_TEMPERATURE_STATUS = 'DIC.PATIENT.TEMPERATURE.STATUS'

// #endregion

// #region 血管通路 DIC.VASCULAR.ACCESS

/**
 * 位置(左-右) - 血管通路
 */
export const DIC_VASCULAR_ACCESS_LOCATION = 'DIC.VASCULAR.ACCESS.LOCATION'

/**
 * 血管通路类型 - 血管通路
 */
export const DIC_VASCULAR_ACCESS_TYPE = 'DIC.VASCULAR.ACCESS.TYPE'

/**
 * 位置-CVC - 血管通路
 */
export const DIC_VASCULAR_ACCESS_POSITION_CVC = 'DIC.VASCULAR.ACCESS.POSITION.CVC'

/**
 * 位置-AVF - 血管通路
 */
export const DIC_VASCULAR_ACCESS_POSITION_AVF = 'DIC.VASCULAR.ACCESS.POSITION.AVF'

/**
 * 位置-AVG - 血管通路
 */
export const DIC_VASCULAR_ACCESS_POSITION_AVG = 'DIC.VASCULAR.ACCESS.POSITION.AVG'

/**
 * 中心静脉置管方法 - 血管通路
 */
export const DIC_VASCULAR_ACCESS_WAY_CVC = 'DIC.VASCULAR.ACCESS.WAY.CVC'

/**
 * 改变原因 - 血管通路
 */
export const DIC_VASCULAR_ACCESS_CHANGECAUSE = 'DIC.VASCULAR.ACCESS.CHANGECAUSE'
// #endregion

// #region 药品 DIC.DRUG
/**
 * 给药方式
 */
export const DIC_DRUG_USAGEMODE = 'DIC.DA.USAGEMODE'
// #endregion

// #region 处方 DIC.PRESCRIPTION
/**
 * 类型 - 处方
 */
export const DIC_PRESCRIPTION_TYPE = 'DIC.PRESCRIPTION.TYPE'
// #endregion 处方 DIC.PRESCRIPTION

// #region 医嘱 DIC.DA
/**
 * 类型
 */
export const DIC_DA_TYPE = 'DIC.DA.TYPE'

/**
 * 频次
 */
export const DIC_DA_INTERVAL = 'DIC.DA.INTERVAL'

/**
 * 用法
 */
export const DIC_DA_USAGE = 'DIC.DA.USAGEMODE'

/**
 * 周执行
 */
export const DIC_DA_WEEKDAY = 'DIC.DA.WEEKDAY'

/**
 * 临时医嘱状态
 */
export const DIC_DA_TEMP_STATUS = 'DIC.DA.TEMP.STATUS'
// #endregion

// #region 透析区间 DIC.DIALYSIS.AREA
/**
 * 类型
 */
export const DIC_DIALYSIS_AREA_TYPE = 'DIC.DIALYSIS.AREA.TYPE'

/**
 * 颜色
 */
export const DIC_DIALYSIS_AREA_COLOR = 'DIC.DIALYSIS.AREA.COLOR'

/**
 * 图标
 */
export const DIC_DIALYSIS_AREA_ICON = 'DIC.DIALYSIS.AREA.ICON'
// #endregion

// #region 透析 DIC.DIALYSIS
/**
 * 透析方式
 */
export const DIC_DIALYSIS_MODE = 'DIC.DIALYSIS.MODE'

/**
 * 置换方式
 */
export const DIC_DIALYSIS_RFM = 'DIC.DIALYSIS.RFM'

/**
 * 透析日
 */
export const DIC_DIALYSIS_WEEKDAY = 'DIC.DIALYSIS.WEEKDAY'

/**
 * 透析 - 图标
 */
export const DIC_DIALYSIS_ICON = 'DIC.DIALYSIS.ICON'

/**
 * 抗凝剂类型
 */
export const DIC_ANTICOAGULANT_TYPE = 'DIC.ANTICOAGULANT.TYPE'

/**
 * 种类-低分子肝素-抗凝剂
 */
export const DIC_ANTICOAGULANT_LMWH_TYPE = 'DIC.ANTICOAGULANT.LMWH.TYPE'

/**
 * 抗凝剂单位
 */
export const DIC_ANTICOAGULANT_UNIT = 'DIC.ANTICOAGULANT.UNIT'

/**
 * 透中事件类型
 */
export const DIC_DIALYSIS_EVENTTYPE = 'DIC.DIALYSIS.EVENTTYPE'

/**
 * 透中事件处理
 */
export const DIC_DIALYSIS_EVENTDISPOSE = 'DIC.DIALYSIS.EVENTDISPOSE'

/**
 * 透中监测-管路情况
 */
export const DIC_DIALYSIS_MONITOR_TUBE = 'DIC.DIALYSIS.MONITOR.TUBE'

/**
 * 透中监测-渗血情况
 */
export const DIC_DIALYSIS_MONITOR_ERRHYSIS = 'DIC.DIALYSIS.MONITOR.ERRHYSIS'

/**
 * 透中监测-抗凝情况
 */
export const DIC_DIALYSIS_MONITOR_ANT = 'DIC.DIALYSIS.MONITOR.ANT'

/**
 * 病情与处理
 */
export const DIC_DIALYSIS_MONITOR_REMARK = 'DIC.DIALYSIS.MONITOR.REMARK'

/**
 * 提前下机原因模板
 */
export const DIC_DIALYSIS_OFFEARLY_TMPL = 'DIC.DIALYSIS.OFFEARLY.TMPL'
// #endregion

// #region 评估

/**
 * 入科方式
 */
export const DIC_ASSEMENT_ENTRYMODE = 'DIC.ASSEMENT.ENTRYMODE'

/**
 * 意识
 */
export const DIC_ASSEMENT_CONSCIOUSNESS = 'DIC.ASSEMENT.CONSCIOUSNESS'

/**
 * 水肿
 */
export const DIC_ASSEMENT_EDEMA = 'DIC.ASSEMENT.EDEMA'

/**
 * 腹水
 */
export const DIC_ASSEMENT_ASCITES = 'DIC.ASSEMENT.ASCITES'

/**
 * 出血
 */
export const DIC_ASSEMENT_HEMORRHAGE = 'DIC.ASSEMENT.HEMORRHAGE'

/**
 * 内瘘杂音
 */
export const DIC_ASSEMENT_AFM = 'DIC.ASSEMENT.AFM'

/**
 * 静脉导管-管周
 */
export const DIC_ASSEMENT_CVC_EXTERNAL = 'DIC.ASSEMENT.CVC.EXTERNAL'

/**
 * 渗血
 */
export const DIC_ASSEMENT_OSMOTICBLOOD = 'DIC.ASSEMENT.OSMOTICBLOOD'

/**
 * 血肿
 */
export const DIC_ASSEMENT_HEMATOMA = 'DIC.ASSEMENT.HEMATOMA'

/**
 * 处理
 */
export const DIC_ASSEMENT_HANDLE = 'DIC.ASSEMENT.HANDLE'

/**
 * 透析器堵塞
 */
export const DIC_ASSEMENT_DIALYZERBLOCKAGE = 'DIC.ASSEMENT.DIALYZERBLOCKAGE'

/**
 * 血路管堵塞
 */
export const DIC_ASSEMENT_BLOODTUBEBLOCKAGE = 'DIC.ASSEMENT.BLOODTUBEBLOCKAGE'

/**
 * 封管液
 */
export const DIC_ASSEMENT_SEALINGLIQUID = 'DIC.ASSEMENT.SEALINGLIQUID'

/**
 * 中心静脉置管-导管
 */
export const DIC_ASSEMENT_CVC = 'DIC.ASSEMENT.CVC'

/**
 * 患者去向
 */
export const DIC_ASSEMENT_PATIENT_TO = 'DIC.ASSEMENT.PATIENT.TO'

// #endregion 评估

// #region 设备 DIC.DEV
/**
 * 类型
 */
export const DIC_DEV_TYPE = 'DIC.DEV.TYPE'

/**
 * 病情类型
 */
export const DIC_DEV_DISEASE_TYPE = 'DIC.DEV.DISEASE.TYPE'

/**
 * 状态
 */
export const DIC_DEV_STATUS = 'DIC.DEV.STATUS'

/**
 * 管理类型
 */
export const DIC_DEV_CLASS = 'DIC.DEV.CLASS'

/**
 * 消毒方式
 */
export const DIC_DEV_DIS_MODE = 'DIC.DEV.DIS.MODE'

/**
 * 消毒程序-机外
 */
export const DIC_DEV_DIS_PROGRAM_EXTERIOR = 'DIC.DEV.DIS.PROGRAM.EXTERIOR'

/**
 * 消毒程序-机内
 */
export const DIC_DEV_DIS_PROGRAM_INTERNAL = 'DIC.DEV.DIS.PROGRAM.INTERNAL'
// #endregion

// #region 日志 DIC.LOG
/**
 * 模块
 */
export const DIC_LOG_MODULE = 'DIC.LOG.MODULE'
// #endregion

// #region 透析医嘱执行状态

/**
 * 执行状态（总）
 */
export const DIC_DIALYSIS_DA_STATUS = 'DIC.DIALYSIS.DA.STATUS'

/**
 * 待核对
 */
export const DIC_DIALYSIS_DA_STATUS_NOTCHECK = 'NOTCHECK'

/**
 * 已核对(待执行)
 */
export const DIC_DIALYSIS_DA_STATUS_VALIDATED = 'VALIDATED'

/**
 * 已撤销
 */
export const DIC_DIALYSIS_DA_STATUS_REVOCATION = 'REVOCATION'

/**
 * 待调整
 */
export const DIC_DIALYSIS_DA_STATUS_MODIFY = 'MODIFY'

/**
 * 已执行
 */
export const DIC_DIALYSIS_DA_STATUS_EXECUTED = 'EXECUTED'

// #endregion 透析医嘱执行状态

// #region 临时医嘱状态

/**
 * 新医嘱
 */
export const DIC_DA_TEMP_STATUS_NEW = 'NEW'

/**
 * 已使用
 */
export const DIC_DA_TEMP_STATUS_USED = 'USED'

/**
 * 已撤销
 */
export const DIC_DA_TEMP_STATUS_REVOCATION = 'REVOCATION'

// #endregion 临时医嘱状态

// #region 科室

/**
 * 交班类型
 */
export const DIC_DEPT_SHTYPE = 'DIC.DEPT.SHTYPE'

// #endregion 科室

// #region 诊断

/**
 * 传染病种类
 */
export const DIC_DIAGNOSIS_ID_TYPE = 'DIC.DIAGNOSIS.ID.TYPE'
/**
 * 传染病属性
 */
export const DIC_PATIENT_POSITIVE = 'DIC.PATIENT.POSITIVE'

// #endregion 科室

// #endregion 字典分类编码

// #region 库房项目分类代码 ROOM

// #region 药品
/**
 * 药品
 */
export const ROOM_ITEM_DRUG = 'ROOM.ITEM.DRUG'
// #endregion 药品

// #region 耗材
/**
 * 耗材
 */
export const ROOM_ITEM_CONSUMABLE = 'ROOM.ITEM.CONSUMABLE'

/**
 * 透析器
 */
export const ROOM_ITEM_CONSUMABLE_TXQ = 'ROOM.ITEM.CONSUMABLE.TXQ'

/**
 * 灌流器
 */
export const ROOM_ITEM_CONSUMABLE_GLQ = 'ROOM.ITEM.CONSUMABLE.GLQ'

/**
 * 血滤器
 */
export const ROOM_ITEM_CONSUMABLE_XLQ = 'ROOM.ITEM.CONSUMABLE.XLQ'

/**
 * 血路管
 */
export const ROOM_ITEM_CONSUMABLE_XLG = 'ROOM.ITEM.CONSUMABLE.XLG'
// #endregion 耗材

// #region 项目
/**
 * 项目
 */
export const ROOM_ITEM_PROJECT = 'ROOM.ITEM.PROJECT'
// #endregion 项目
// #endregion 库房项目分类代码 ROOM

/**
 * 检验项检验周期
 */
export const DIC_LISPACS_CHECK_INTERVAL = 'DIC.LISPACS.CHECK.INTERVAL'
/**
 * 透析评估类型
 */
export const DIC_DIALYSIS_ASSEMENT_TYPE = 'DIC.DIALYSIS.ASSEMENT.TYPE'

/**
 * 穿刺方法
 */
export const DIC_DIALYSIS_PUNCTURE_METHOD = 'DIC.DIALYSIS.PUNCTURE.METHOD'
// #region 患者 DIC.PATIENT
/**
 * 转归类型
 */
export const DIC_PROGNOSIS_TYPE = 'DIC.PROGNOSIS.TYPE'
/**
 * 转出地点
 */
export const DIC_PROGNOSIS_OUT_LOCATION = 'DIC.PROGNOSIS.OUT.LOCATION'

/**
 * 转出原因
 */
export const DIC_PROGNOSIS_OUT_CAUSE = 'DIC.PROGNOSIS.OUT.CAUSE'

/**
 * 退出原因
 */
export const DIC_PROGNOSIS_QUIT_CAUSE = 'DIC.PROGNOSIS.QUIT.CAUSE'

/**
 * 死亡原因
 */
export const DIC_PROGNOSIS_QUIT_DIE_CAUSE = 'DIC.PROGNOSIS.QUIT.DIE.CAUSE'

/**
 * 心血管事件
 */
export const DIC_PROGNOSIS_QUIT_DIE_CAUSE_CVE = 'DIC.PROGNOSIS.QUIT.DIE.CAUSE.CVE'

/**
 * 脑血管事件
 */
export const DIC_PROGNOSIS_QUIT_DIE_CAUSE_MACCE = 'DIC.PROGNOSIS.QUIT.DIE.CAUSE.MACCE'

/**
 * 感染
 */
export const DIC_PROGNOSIS_QUIT_DIE_CAUSE_INFECTION = 'DIC.PROGNOSIS.QUIT.DIE.CAUSE.INFECTION'
/**
 * 样本类型
 */
export const DIC_TEST_SAMPLETYPE = 'DIC.TEST.SAMPLETYPE'

export const DIC_EXAMINE_DATASOURCE = 'DIC.EXAMINE.DATASOURCE'
/**
 * 血压计袖带消毒方式
 */
export const DIC_DEV_DIS_PROGRAM_SPHYGMOMANOMETERCUFF = 'DIC.DEV.DIS.PROGRAM.SPHYGMOMANOMETERCUFF'

/**
 * 自定义表单类型
 */
export const DIC_TMPL_CUSTOM = 'DIC.TMPL.CUSTOM'

/**
 * 自定义病程模板
 */
export const DIC_DISEASE_CUSTOM = 'DIC.DISEASE.CUSTOM'

/**
 * 点位穿刺节点
 */
export const DIC_SYS_PUNC_DIRECTION = 'DIC.SYS.PUNC.DIRECTION'
/*
  维修部位
*/
export const DIC_DEV_REPAIRPOSITION = 'DIC.DEV.REPAIRPOSITION'

/**
 *  透析机/血透机型号
 */
export const DIC_DEV_DIALYSIS_MODEL = 'DIC.DEV.DIALYSIS.MODEL'

/**
 * 推荐配色
 */
export const DIC_SYS_RECOMMENDED_COLOR = 'DIC.SYS.RECOMMENDED.COLOR'

/**
 * 系统参数定义
 */

/**
 * 开启
 */
export const SYSTEMSETTING_OPEN = '1'

/**
 * 关闭
 */
export const SYSTEMSETTING_CLOSE = '0'

/**
 * 透析液是否含糖
 */
export const CUREFLOW_SUGAR_SHOW = 'CUREFLOW.SUGAR.SHOW'

/**
 * 透析时长单位
 */
export const DIALYSIS_DURATION_UNIT = 'DIALYSIS.DURATION.UNIT'

/**
 * 透析记录单占位符
 */
export const DIALYSIS_RECORD_DEFAULT_PLACEHOLDER = 'DIALYSIS.RECORD.DEFAULT.PLACEHOLDER'

/**
 * 评估项目自动生成
 */
export const DIALYSIS_RECORD_ASSEMENTITEM_AUTOGENERATE = 'DIALYSIS.RECORD.ASSEMENTITEM.AUTOGENERATE'

/**
 * 制定处方时展示重要信息
 */
export const CUREFLOW_PRESCRIPTION_SHORTCUT = 'CUREFLOW.PRESCRIPTION.SHORTCUT'

/**
 * 床单元清洁模式
 */
export const DIALYSIS_BEDUNIT_CLEAN = 'DIALYSIS.BEDUNIT.CLEAN'

/**
 * 医嘱执行指定执行时间
 */
export const CUREFLOW_ADJUSTMENT_EXECUTIONTIME_DA = 'CUREFLOW.ADJUSTMENT.EXECUTIONTIME.DA'

/**
 * 不用填写体重的测量方式
 */
export const CUREFLOW_WEIGHT_MODE_NOMEASURE = 'CUREFLOW.WEIGHT.MODE.NOMEASURE'

/**
 * 不用填写血压的测量位置
 */
export const CUREFLOW_BP_POSITION_NOMEASURE = 'CUREFLOW.BP.POSITION.NOMEASURE'

/**
 * 上机修改血流量
 */
export const CUREFLOW_MODIFY_BLOODFLOWRATE = 'CUREFLOW.MODIFY.BLOODFLOWRATE'
/**
 * 透析记录单是否显示电子签名
 */
export const DIALYSIS_RECORD_DISPLAY_SIGNATURE = 'DIALYSIS.RECORD.DISPLAY.SIGNATURE'

export const DIALYSIS_UF_UNIT = 'DIALYSIS.UF.UNIT'
/**
 * 是否展示医院名称
 */
export const DIALYSIS_RECORD_HOSPITAL_SHOW = 'DIALYSIS.RECORD.HOSPITAL.SHOW'
