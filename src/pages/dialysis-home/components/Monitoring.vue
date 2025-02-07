<template>
  <div class="mb-2 flex justify-between">
    <div>
      <slot name="header">
        <span>
          透中监测
        </span>
        <span>
          - 抗凝剂：{{ cureData.anticoagulantName }}；
        </span>
        <template v-if="cureData.antiTmplType === '模板1'">
          <span>首剂：{{ cureData.first + cureData.firstUnit }}</span>
          <span>追加速率：{{ cureData.appendRate + cureData.appendRateUnit }}</span>
        </template>
        <template v-else-if="cureData.antiTmplType === '模板2'">
          <span>速率：{{ cureData.appendRate }}ml/h</span>
        </template>
        <template v-if="cureData?.antiTmplType === '模板1' || cureData?.antiTmplType === '模板2' || cureData?.antiTmplType === '模板4' || cureData?.antiTmplType === '低分子肝素模板'">
          <span v-if="cureData?.antiTmplType === '模板4' || cureData?.antiTmplType === '低分子肝素模板'">剂量：{{ cureData.total + cureData.totalUnit }}</span>
          <template v-else>
            <!-- <span>追加时间：{{ cureData.appendTime + cureData.totalUnit }}h</span> -->
            <span>总量：{{ cureData.total }}h</span>
          </template>
        </template>
        <span v-if="cureData?.antiTmplType === '模板4'">
          追加剂量：{{ cureData.append + cureData.appendUnit }}
        </span>
        <span v-if="(cureData.ufg || cureData.ufg === 0)">
          ；预脱：{{ convertDialysisUnit(cureData.ufg, paramUfgUnit) }}{{ paramUfgUnit }}
        </span>
      </slot>
    </div>
    <div>
      <el-button type="primary" size="small" @click="handleAddClick">
        新增
      </el-button>
    </div>
  </div>
  <el-table border :data="tableData">
    <el-table-column label="时间" prop="monitorTime" min-width="80" :formatter="(_row, _column, cellValue) => formatToTimeHM(cellValue)" />
    <el-table-column v-if="getFieldArterialPressure" :label="getFieldArterialPressure.columnLabel || '动脉压'" prop="arterialPressure" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldVenousPressure" :label="getFieldVenousPressure.columnLabel || '静脉压'" prop="venousPressure" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldTmp" :label="getFieldTmp.columnLabel || '跨膜压'" prop="tmp" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldSbp" :label="`血压|${paramBpUnit}`" prop="sbp" min-width="80" :render-header="renderHeader" :formatter="(row) => formatBloodPressure(row)" />
    <el-table-column v-if="getFieldPosition" :label="getFieldPosition.columnLabel || '测量位置'" prop="positionLabel" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldPulse" :label="getFieldPulse.columnLabel || '脉搏'" prop="pulse" min-width="80" :render-header="renderHeader" />
    <el-table-column v-if="getFieldDialysateFlowRate" :label="getFieldDialysateFlowRate.columnLabel || '透析液流量'" prop="dialysateFlowRate" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldDialysateCond" :label="getFieldDialysateCond.columnLabel || '透析液电导度'" prop="dialysateCond" min-width="120" :render-header="renderHeader" />
    <el-table-column v-if="getFieldDialysateTemp" :label="getFieldDialysateTemp.columnLabel || '透析液温度'" prop="dialysateTemp" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldRfr" :label="getFieldRfr.columnLabel || '置换液流量'" prop="rfr" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldRfv" :label="getFieldRfv.columnLabel || '置换液量'" prop="rfv" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldCumulativeHeparinVolume" :label="getFieldCumulativeHeparinVolume.columnLabel || '累计肝素量'" prop="cumulativeHeparinVolume" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldUfr" :label="getFieldUfr.columnLabel || '超滤率'" prop="ufr" min-width="80" :render-header="renderHeader" />
    <el-table-column v-if="getFieldUfv" :label="getFieldUfv.columnLabel || '超滤量'" prop="ufv" min-width="80" :render-header="renderHeader" />
    <el-table-column v-if="getFieldBloodFlowRate" :label="getFieldBloodFlowRate.columnLabel || '血流量'" prop="bloodFlowRate" min-width="80" :render-header="renderHeader" />
    <el-table-column v-if="getFieldRemark" :label="getFieldRemark.columnLabel || '病情与处理'" prop="remark" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldExt1" :label="getFieldExt1.columnLabel" prop="ext1" :render-header="renderHeader" />
    <el-table-column v-if="getFieldExt2" :label="getFieldExt2.columnLabel" prop="ext2" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldExt3" :label="getFieldExt3.columnLabel" prop="ext3" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldExt4" :label="getFieldExt4.columnLabel" prop="ext4" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldExt5" :label="getFieldExt5.columnLabel" prop="ext5" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldExt6" :label="getFieldExt6.columnLabel" prop="ext6" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldExt7" :label="getFieldExt7.columnLabel" prop="ext7" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldExt8" :label="getFieldExt8.columnLabel" prop="ext8" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldExt9" :label="getFieldExt9.columnLabel" prop="ext9" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldExt10" :label="getFieldExt10.columnLabel" prop="ext10" min-width="100" :render-header="renderHeader" />
    <el-table-column v-if="getFieldNurseName" :label="getFieldNurseName.columnLabel" prop="creater" min-width="100" :render-header="renderHeader" />
    <el-table-column label="操作" fixed="right" min-width="180">
      <template #default="scope">
        <el-button type="primary" size="small" @click="handleEditClick(scope.row)">
          编 辑
        </el-button>
        <el-button size="small" @click="handleDeleteClick(scope.row.cureMonitorId)">
          刪 除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogVisible" fullscreen append-to-body>
    <template #header>
      <span>
        透中监测
      </span>
      <span class="ml-4">{{ `${cureData.dialysisAreaName}/${cureData.bedName}/${cureData.patientNameFull}` }}</span>
    </template>
    <div v-loading="dialogVisibleLoading" class="pb-4">
      <div class="my-2">
        <AbnormalInfo
          ref="abnormalInfoRef" :patient-id="cureData.patientId" :blood-pressure-show="!!getFieldSbp" :sbp="formData.sbp" :dbp="formData.dbp"
          :pulse-show="!!getFieldPulse" :pulse="formData.pulse" :temp-show="!!getFieldTemp" :temp="formData.temp"
        />
      </div>
      <el-form ref="ruleFormRef" :model="formData" :rules="formRules" label-width="auto">
        <el-row :gutter="16">
          <!-- 监测日期 -->
          <el-col :span="8">
            <el-form-item label="监测日期" prop="monitorTime">
              <el-date-picker v-model="formData.monitorTime as unknown as Date" class="!w-full" type="datetime" :clearable="false" placeholder="请选择监测日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
          </el-col>
          <!-- 监测时间 -->
          <el-col :span="8">
            <el-form-item label="监测时间" prop="monitorTime">
              <el-time-picker v-model="formData.monitorTime as unknown as Date" class="!w-full" :clearable="false" placeholder="请选择监测时间" format="HH:mm" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
          </el-col>
          <!-- 测量位置 -->
          <el-col v-if="getFieldPosition" :span="8" :style="{ order: getFieldPosition.sequence }">
            <el-form-item :label="getFieldPosition.label" prop="position">
              <Dictionary v-model="formData.position" :dic-code="DIC_PATIENT_MEASURE_BP_POSITION" type="select" :placeholder="getFieldPosition.placeholder" @change="handleBpPositionChange" />
            </el-form-item>
          </el-col>
          <!-- 血压 -->
          <el-col v-if="getFieldSbp" :span="8" :style="{ order: getFieldSbp.sequence }">
            <el-form-item :label="getFieldSbp.label" prop="bloodPressure" :rules="getBloodPressureRule">
              <BloodPressure v-model="formData" sbp-field="sbp" dbp-field="dbp" :disabled="disabledSbp(formData.position)" :is-error="bloodPressureError" @change="handleBloodPressureChange" />
            </el-form-item>
          </el-col>
          <!-- 脉搏 -->
          <el-col v-if="getFieldPulse" :span="8" :style="{ order: getFieldPulse.sequence }">
            <el-form-item prop="pulse" :label="getFieldPulse.label" :rules="getPulseRule">
              <el-input v-model="formData.pulse" type="number" :placeholder="getFieldPulse.placeholder" :disabled="disabledSbp(formData.position)">
                <template v-if="getFieldPulse.unit" #append>
                  {{ getFieldPulse.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 静脉压 -->
          <el-col v-if="getFieldVenousPressure" :span="8" :style="{ order: getFieldVenousPressure.sequence }">
            <el-form-item prop="venousPressure" :label="getFieldVenousPressure.label">
              <el-input v-model="formData.venousPressure" type="number" :placeholder="getFieldVenousPressure.placeholder">
                <template v-if="getFieldVenousPressure.unit" #append>
                  {{ getFieldVenousPressure.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 动脉压 -->
          <el-col v-if="getFieldArterialPressure" :span="8" :style="{ order: getFieldArterialPressure.sequence }">
            <el-form-item prop="arterialPressure" :label="getFieldArterialPressure.label">
              <el-input v-model="formData.arterialPressure" type="number" :placeholder="getFieldArterialPressure.placeholder">
                <template v-if="getFieldArterialPressure.unit" #append>
                  {{ getFieldArterialPressure.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 跨膜压 -->
          <el-col v-if="getFieldTmp" :span="8" :style="{ order: getFieldTmp.sequence }">
            <el-form-item prop="tmp" :label="getFieldTmp.label">
              <el-input v-model="formData.tmp" type="number" :placeholder="getFieldTmp.placeholder">
                <template v-if="getFieldTmp.unit" #append>
                  {{ getFieldTmp.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 透析液流量 -->
          <el-col v-if="getFieldDialysateFlowRate" :span="8" :style="{ order: getFieldDialysateFlowRate.sequence }">
            <el-form-item prop="dialysateFlowRate" :label="getFieldDialysateFlowRate.label">
              <el-input v-model="formData.dialysateFlowRate" type="number" :placeholder="getFieldDialysateFlowRate.placeholder">
                <template v-if="getFieldDialysateFlowRate.unit" #append>
                  {{ getFieldDialysateFlowRate.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 透析液温度 -->
          <el-col v-if="getFieldDialysateTemp" :span="8" :style="{ order: getFieldDialysateTemp.sequence }">
            <el-form-item prop="dialysateTemp" :label="getFieldDialysateTemp.label">
              <el-input v-model="formData.dialysateTemp" type="number" :placeholder="getFieldDialysateTemp.placeholder">
                <template v-if="getFieldDialysateTemp.unit" #append>
                  {{ getFieldDialysateTemp.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 透析液电导度 -->
          <el-col v-if="getFieldDialysateCond" :span="8" :style="{ order: getFieldDialysateCond.sequence }">
            <el-form-item prop="dialysateCond" :label="getFieldDialysateCond.label">
              <el-input v-model="formData.dialysateCond" type="number" :placeholder="getFieldDialysateCond.placeholder">
                <template v-if="getFieldDialysateCond.unit" #append>
                  {{ getFieldDialysateCond.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 置换液流量 -->
          <el-col v-if="getFieldRfr" :span="8" :style="{ order: getFieldRfr.sequence }">
            <el-form-item prop="rfr" :label="getFieldRfr.label">
              <el-input v-model="formData.rfr" type="number" :placeholder="getFieldRfr.placeholder">
                <template v-if="getFieldRfr.unit" #append>
                  {{ getFieldRfr.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 置换液量 -->
          <el-col v-if="getFieldRfv" :span="8" :style="{ order: getFieldRfv.sequence }">
            <el-form-item prop="rfv" :label="getFieldRfv.label">
              <el-input v-model="formData.rfv" type="number" :placeholder="getFieldRfv.placeholder">
                <template v-if="getFieldRfv.unit" #append>
                  {{ getFieldRfv.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 累计肝素量 -->
          <el-col v-if="getFieldCumulativeHeparinVolume" :span="8" :style="{ order: getFieldCumulativeHeparinVolume.sequence }">
            <el-form-item prop="cumulativeHeparinVolume" :label="getFieldCumulativeHeparinVolume.label">
              <el-input v-model="formData.cumulativeHeparinVolume" type="number" :placeholder="getFieldCumulativeHeparinVolume.placeholder">
                <template v-if="getFieldCumulativeHeparinVolume.unit" #append>
                  {{ getFieldCumulativeHeparinVolume.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 肝素量 -->
          <el-col v-if="getFieldHeparin" :span="8" :style="{ order: getFieldHeparin.sequence }">
            <el-form-item prop="heparin" :label="getFieldHeparin.label">
              <el-input v-model="formData.heparin" type="number" :placeholder="getFieldHeparin.placeholder">
                <template v-if="getFieldHeparin.unit" #append>
                  {{ getFieldHeparin.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 超滤率 -->
          <el-col v-if="getFieldUfr" :span="8" :style="{ order: getFieldUfr.sequence }">
            <el-form-item prop="ufr" :label="getFieldUfr.label">
              <el-input v-model="formData.ufr" type="number" :placeholder="getFieldUfr.placeholder">
                <template v-if="getFieldUfr.unit" #append>
                  {{ getFieldUfr.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 超滤量 -->
          <el-col v-if="getFieldUfv" :span="8" :style="{ order: getFieldUfv.sequence }">
            <el-form-item prop="ufv" :label="getFieldUfv.label">
              <el-input v-model="formData.ufv" type="number" :placeholder="getFieldUfv.placeholder">
                <template v-if="getFieldUfv.unit" #append>
                  {{ getFieldUfv.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 血流量 -->
          <el-col v-if="getFieldBloodFlowRate" :span="8" :style="{ order: getFieldBloodFlowRate.sequence }">
            <el-form-item prop="bloodFlowRate" :label="getFieldBloodFlowRate.label">
              <el-input v-model="formData.bloodFlowRate" type="number" :placeholder="getFieldBloodFlowRate.placeholder">
                <template v-if="getFieldBloodFlowRate.unit" #append>
                  {{ getFieldBloodFlowRate.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 呼吸 -->
          <el-col v-if="getFieldBreathe" :span="8" :style="{ order: getFieldBreathe.sequence }">
            <el-form-item prop="breathe" :label="getFieldBreathe.label">
              <el-input v-model="formData.breathe" type="number" :placeholder="getFieldBreathe.placeholder">
                <template v-if="getFieldBreathe.unit" #append>
                  {{ getFieldBreathe.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 体温 -->
          <el-col v-if="getFieldTemp" :span="8" :style="{ order: getFieldTemp.sequence }">
            <el-form-item prop="temp" :label="getFieldTemp.label">
              <el-input v-model="formData.temp" type="number" :placeholder="getFieldTemp.placeholder">
                <template #append>
                  {{ getFieldTemp.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 渗血情况 -->
          <el-col v-if="getFieldRemarkErrhysis" :span="8" :style="{ order: getFieldRemarkErrhysis.sequence }">
            <el-form-item :label="getFieldRemarkErrhysis.label" prop="remarkErrhysis">
              <Dictionary v-model="formData.remarkErrhysis" :dic-code="DIC_DIALYSIS_MONITOR_ERRHYSIS" type="select" :is-multiple="true" :placeholder="getFieldRemarkErrhysis.placeholder" />
            </el-form-item>
          </el-col>
          <!-- 抗凝情况 -->
          <el-col v-if="getFieldRemarkAnticoagulation" :span="8" :style="{ order: getFieldRemarkAnticoagulation.sequence }">
            <el-form-item :label="getFieldRemarkAnticoagulation.label" prop="remarkAnticoagulation">
              <Dictionary v-model="formData.remarkAnticoagulation" :dic-code="DIC_DIALYSIS_MONITOR_ANT" type="select" :is-multiple="true" :placeholder="getFieldRemarkAnticoagulation.placeholder" />
            </el-form-item>
          </el-col>
          <!-- 管路情况 -->
          <el-col v-if="getFieldRemarkTube" :span="8" :style="{ order: getFieldRemarkTube.sequence }">
            <el-form-item :label="getFieldRemarkTube.label" prop="remarkTube">
              <Dictionary v-model="formData.remarkTube" :dic-code="DIC_DIALYSIS_MONITOR_TUBE" type="select" :is-multiple="true" :placeholder="getFieldRemarkTube.placeholder" />
            </el-form-item>
          </el-col>
          <template v-if="getFieldRemark">
            <!-- 处理模板 -->
            <el-col :span="24" :style="{ order: getFieldRemark.sequence }">
              <el-form-item label="处理模板：">
                <Dictionary v-model="tempRemarkValue" :dic-code="DIC_DIALYSIS_MONITOR_REMARK" type="select" :is-multiple="true" split-value=";" placeholder="请选择处理模板" @change="handleTempRemarkChange" />
              </el-form-item>
            </el-col>
            <!-- 病情与处理 -->
            <el-col :span="24" :style="{ order: getFieldRemark.sequence }">
              <el-form-item :label="getFieldRemark.label">
                <el-input v-model="formData.remark" type="textarea" :rows="4" :placeholder="getFieldRemark.placeholder" />
              </el-form-item>
            </el-col>
          </template>
          <!-- 预留字段1 -->
          <el-col v-if="getFieldExt1" :span="8" :style="{ order: getFieldExt1.sequence }">
            <el-form-item prop="ext1" :label="getFieldExt1.label">
              <el-input v-model="formData.ext1" :placeholder="getFieldExt1.placeholder">
                <template v-if="getFieldExt1.unit" #append>
                  {{ getFieldExt1.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 预留字段2 -->
          <el-col v-if="getFieldExt2" :span="8" :style="{ order: getFieldExt2.sequence }">
            <el-form-item prop="ext2" :label="getFieldExt2.label">
              <el-input v-model="formData.ext2" :placeholder="getFieldExt2.placeholder">
                <template v-if="getFieldExt2.unit" #append>
                  {{ getFieldExt2.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 预留字段3 -->
          <el-col v-if="getFieldExt3" :span="8" :style="{ order: getFieldExt3.sequence }">
            <el-form-item prop="ext3" :label="getFieldExt3.label">
              <el-input v-model="formData.ext3" :placeholder="getFieldExt3.placeholder">
                <template v-if="getFieldExt3.unit" #append>
                  {{ getFieldExt3.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 预留字段4 -->
          <el-col v-if="getFieldExt4" :span="8" :style="{ order: getFieldExt4.sequence }">
            <el-form-item prop="ext4" :label="getFieldExt4.label">
              <el-input v-model="formData.ext4" :placeholder="getFieldExt4.placeholder">
                <template v-if="getFieldExt4.unit" #append>
                  {{ getFieldExt4.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 预留字段5 -->
          <el-col v-if="getFieldExt5" :span="8" :style="{ order: getFieldExt5.sequence }">
            <el-form-item prop="ext5" :label="getFieldExt5.label">
              <el-input v-model="formData.ext5" :placeholder="getFieldExt5.placeholder">
                <template v-if="getFieldExt5.unit" #append>
                  {{ getFieldExt5.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 预留字段6 -->
          <el-col v-if="getFieldExt6" :span="8" :style="{ order: getFieldExt6.sequence }">
            <el-form-item prop="ext6" :label="getFieldExt6.label">
              <el-input v-model="formData.ext6" :placeholder="getFieldExt6.placeholder">
                <template v-if="getFieldExt6.unit" #append>
                  {{ getFieldExt6.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 预留字段7 -->
          <el-col v-if="getFieldExt7" :span="8" :style="{ order: getFieldExt7.sequence }">
            <el-form-item prop="ext7" :label="getFieldExt7.label">
              <el-input v-model="formData.ext7" :placeholder="getFieldExt7.placeholder">
                <template v-if="getFieldExt7.unit" #append>
                  {{ getFieldExt7.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 预留字段8 -->
          <el-col v-if="getFieldExt8" :span="8" :style="{ order: getFieldExt8.sequence }">
            <el-form-item prop="ext8" :label="getFieldExt8.label">
              <el-input v-model="formData.ext8" :placeholder="getFieldExt8.placeholder">
                <template v-if="getFieldExt8.unit" #append>
                  {{ getFieldExt8.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 预留字段9 -->
          <el-col v-if="getFieldExt9" :span="8" :style="{ order: getFieldExt9.sequence }">
            <el-form-item prop="ext9" :label="getFieldExt9.label">
              <el-input v-model="formData.ext9" :placeholder="getFieldExt9.placeholder">
                <template v-if="getFieldExt9.unit" #append>
                  {{ getFieldExt9.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 预留字段10 -->
          <el-col v-if="getFieldExt10" :span="8" :style="{ order: getFieldExt10.sequence }">
            <el-form-item prop="ext10" :label="getFieldExt10.label">
              <el-input v-model="formData.ext10" :placeholder="getFieldExt10.placeholder">
                <template v-if="getFieldExt10.unit" #append>
                  {{ getFieldExt10.unit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="fixed bottom-0 right-4 w-full bg-white py-1 text-right">
        <el-button v-if="showSync && paramDevBedSideBp && paramIotEnabled" type="primary" @click="handleBloodPressureMeasureClick">
          测量血压
        </el-button>
        <el-button v-if="paramDevBedSideBp" type="primary" @click="handleBloodSyncClick">
          血压同步
        </el-button>
        <el-button v-if="paramIotEnabled" type="primary" @click="handleFormSyncClick">
          一键同步
        </el-button>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSaveClick">
          确定
        </el-button>
      </div>
    </div>
    <van-notify v-model:show="dialogErrorNotify" type="danger">
      {{ errorNotifyMessage }}
    </van-notify>
  </el-dialog>
</template>

<script setup lang="ts">
import type { CureTodayView } from '@/services/CureServiceProxies'
import { CureServiceProxy, MonitorCureMiddleEditModel, MonitorCureMiddleView } from '@/services/CureServiceProxies'
import { useAppStore, useDialysisStore } from '@/stores'
import { dateUtil, formatToDate, formatToDateTime, formatToTimeHM, getNowDate } from '@/utils/date'
import { convertDialysisUnit, disabledSbp } from '@/utils/dialysis'
import type { FormInstance, FormRules } from 'element-plus'
import { showNotify } from 'vant'
import { DIC_DIALYSIS_MONITOR_ANT, DIC_DIALYSIS_MONITOR_ERRHYSIS, DIC_DIALYSIS_MONITOR_REMARK, DIC_DIALYSIS_MONITOR_TUBE, DIC_PATIENT_MEASURE_BP_POSITION } from '@/utils/constant'

const { cureData } = defineProps({
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
})

const emit = defineEmits(['hanldeChangeLoading'])

const dialysisStore = useDialysisStore()

const cureServiceProxy = new CureServiceProxy()

const tableData = ref<MonitorCureMiddleView[]>([])
const { sysFiledList, getParametersValue, getDicDataByCode } = useAppStore()
const ruleFormRef = ref<FormInstance>()
const abnormalInfoRef = ref(null)
const formData = ref<MonitorCureMiddleView>(new MonitorCureMiddleView()) // 下机表单数据
// 表单校验规则
const formRules = reactive<FormRules<MonitorCureMiddleView>>({})
const dialogVisible = ref(false)
const dialogVisibleLoading = ref(false)
const tempRemarkValue = ref(null)

onBeforeMount(async () => {
  // 加载自定义字段
  await getAllFieldList()
})
onMounted(() => {
  initLoad()
})
/** 初始化透中监测数据 */
async function initLoad() {
  emit('hanldeChangeLoading', true)
  await getMonitoringData()
  emit('hanldeChangeLoading', false)
}
/** 获取透中监测数据 */
async function getMonitoringData() {
  const { success, data, message } = await cureServiceProxy.monitorCureMiddleGET(cureData.cureRecordId)
  if (success) {
    tableData.value = data
  }
  else {
    showNotify({ type: 'danger', message })
  }
}
/** 血压单位 */
const paramBpUnit = getParametersValue('VITALSIGNS.BP.UNIT')
/** 透中监测血压默认测量位置 */
const paramDefaultBpPositionMonitor = getParametersValue('CUREFLOW.DEFAULT.BP.POSITION.MONITOR')
/** 启用床旁血压计 */
const paramDevBedSideBp = getParametersValue('DEV.BEDSIDE.BP', true)
/** 血透机联机 */
const paramIotEnabled = getParametersValue('IOT.ENABLED', true)
/** 超滤单位 */
const paramUfgUnit = getParametersValue('DIALYSIS.UF.UNIT')
/** 患者当天当班次透析 */
const showSync = computed(() => {
  return cureData.shiftId === dialysisStore.cureShift.id && formatToDate(cureData.dialysisDate) === getNowDate()
})
const getFieldType = 'CureMonitor'
const allFiledList = ref<CustomSysFieldItemView[]>([]) // 模块自定义字段
// 内置字段
const getSysFieldList = computed(() => {
  const sysFieldList = allFiledList.value.filter(x => x.system)
  sysFieldList.forEach((x) => {
    const requiredRule = { required: !!x.required, message: `${x.dataType === 'OPTION' ? '请选择' : '请输入'}${x.label.replace('：', '')}`, trigger: ['blur', 'change'] }
    // 常规字段
    if (formRules[x.value]) {
      let isBeing = false
      formRules[x.value].forEach((e) => {
        if ('required' in e) {
          isBeing = true
          e.required = !!x.required
        }
      })
      if (!isBeing) {
        formRules[x.value].push(requiredRule)
      }
    }
    else {
      formRules[x.value] = [requiredRule]
    }
  })
  return sysFieldList
})
/** 获取模块所有字段 */
function getAllFieldList() {
  allFiledList.value = sysFiledList.filter(x => x.show && x.sysFieldTypeCode === getFieldType).map((x) => {
    const label = x.name2 || x.name
    return { ...x, columnLabel: label ? `${label}|${x.unit || ''}` : '', label: `${label}：`, placeholder: `${x.dataType === 'OPTION' ? '请选择' : '请输入'}${label}` }
  })
}
function getSysFieldProperty(key, typeCode) {
  return getSysFieldList.value.find(x => x.value === key && x.sysFieldTypeCode === typeCode)
}
const getFieldPosition = computed(() => {
  return getSysFieldProperty('position', getFieldType)
})
const getFieldArterialPressure = computed(() => {
  return getSysFieldProperty('arterialPressure', getFieldType)
})
const getFieldTmp = computed(() => {
  return getSysFieldProperty('tmp', getFieldType)
})
const getFieldVenousPressure = computed(() => {
  return getSysFieldProperty('venousPressure', getFieldType)
})
const getFieldSbp = computed(() => {
  return getSysFieldProperty('sbp', getFieldType)
})
/** 该字段在新增方法中使用eval调用 */
// eslint-disable-next-line unused-imports/no-unused-vars
const getFieldDbp = computed(() => {
  return getSysFieldProperty('dbp', getFieldType)
})
const getFieldPulse = computed(() => {
  return getSysFieldProperty('pulse', getFieldType)
})
const getPulseRule = computed(() => [{ required: getFieldPulse.value.required || (formData.value.position !== 'NOMEASURE' && !(disabledSbp(formData.value.position))), message: getFieldPulse.value.placeholder, trigger: 'blur' }])
const getFieldDialysateFlowRate = computed(() => {
  return getSysFieldProperty('dialysateFlowRate', getFieldType)
})
const getFieldDialysateTemp = computed(() => {
  return getSysFieldProperty('dialysateTemp', getFieldType)
})
const getFieldRfr = computed(() => {
  return getSysFieldProperty('rfr', getFieldType)
})
// 血压错误状态
const bloodPressureError = ref(false)
const getBloodPressureRule = computed(() => [{ required: getFieldSbp.value.required || (formData.value.position !== 'NOMEASURE' && !(disabledSbp(formData.value.position))), validator: validateBloodRule, trigger: 'blur' }])
function validateBloodRule(_rule, _value, callback) {
  setTimeout(() => {
    bloodPressureError.value = true
    const { sbp, dbp } = formData.value
    if ((!disabledSbp(formData.value.position) && formData.value.position !== 'NOMEASURE') || getFieldSbp.value.required) {
      if ((!sbp && dbp) && sbp !== 0) {
        callback(new Error('请输入收缩压'))
      }
      else if ((sbp && !dbp) && dbp !== 0) {
        callback(new Error('请输入舒张压'))
      }
      else if (!sbp && !dbp && sbp !== 0 && dbp !== 0) {
        callback(new Error('请输入血压'))
      }
      else if (sbp > 999 || sbp < 0 || dbp > 999 || dbp < 0) {
        callback(new Error('请输入正确的正整数'))
      }
      else {
        bloodPressureError.value = false
        callback()
      }
    }
    else {
      bloodPressureError.value = false
      callback()
    }
  }, 200)
}
const getFieldNurseName = computed(() => {
  return getSysFieldProperty('nurseName', getFieldType)
})
const getFieldRfv = computed(() => {
  return getSysFieldProperty('rfv', getFieldType)
})
const getFieldCumulativeHeparinVolume = computed(() => {
  return getSysFieldProperty('cumulativeHeparinVolume', getFieldType)
})
const getFieldBloodFlowRate = computed(() => {
  return getSysFieldProperty('bloodFlowRate', getFieldType)
})
const getFieldUfv = computed(() => {
  return getSysFieldProperty('ufv', getFieldType)
})
const getFieldDialysateCond = computed(() => {
  return getSysFieldProperty('dialysateCond', getFieldType)
})
const getFieldHeparin = computed(() => {
  return getSysFieldProperty('heparin', getFieldType)
})
const getFieldUfr = computed(() => {
  return getSysFieldProperty('ufr', getFieldType)
})
const getFieldBreathe = computed(() => {
  return getSysFieldProperty('breathe', getFieldType)
})
const getFieldTemp = computed(() => {
  return getSysFieldProperty('temp', getFieldType)
})
const getFieldRemarkErrhysis = computed(() => {
  return getSysFieldProperty('remarkErrhysis', getFieldType)
})
const getFieldRemarkAnticoagulation = computed(() => {
  return getSysFieldProperty('remarkAnticoagulation', getFieldType)
})
const getFieldRemarkTube = computed(() => {
  return getSysFieldProperty('remarkTube', getFieldType)
})
const getFieldRemark = computed(() => {
  return getSysFieldProperty('remark', getFieldType)
})
const getFieldExt1 = computed(() => {
  return getSysFieldProperty('ext1', getFieldType)
})
const getFieldExt2 = computed(() => {
  return getSysFieldProperty('ext2', getFieldType)
})
const getFieldExt3 = computed(() => {
  return getSysFieldProperty('ext3', getFieldType)
})
const getFieldExt4 = computed(() => {
  return getSysFieldProperty('ext4', getFieldType)
})
const getFieldExt5 = computed(() => {
  return getSysFieldProperty('ext5', getFieldType)
})
const getFieldExt6 = computed(() => {
  return getSysFieldProperty('ext6', getFieldType)
})
const getFieldExt7 = computed(() => {
  return getSysFieldProperty('ext7', getFieldType)
})
const getFieldExt8 = computed(() => {
  return getSysFieldProperty('ext8', getFieldType)
})
const getFieldExt9 = computed(() => {
  return getSysFieldProperty('ext9', getFieldType)
})
const getFieldExt10 = computed(() => {
  return getSysFieldProperty('ext10', getFieldType)
})
/** 表头格式化 */
function renderHeader({ column }) {
  return h('span', {}, [
    h('span', {}, column.label.split('|')[0]),
    h('br'),
    h('span', {}, column.label.split('|')[1]),
  ])
}
function formatBloodPressure(row: MonitorCureMiddleView) {
  return row.position === 'NOMEASURE' ? row.positionLabel : (`${row.sbp}/${row.dbp}`)
}
/** 新增 */
function handleAddClick() {
  const lastData = tableData.value[0] || new MonitorCureMiddleView()
  const fields = ['sbp', 'dbp', 'pulse', 'venousPressure', 'arterialPressure', 'tmp', 'dialysateFlowRate', 'dialysateTemp', 'dialysateCond', 'rfr', 'rfv', 'cumulativeHeparinVolume', 'heparin', 'ufr', 'ufv', 'bloodFlowRate', 'breathe', 'temp', 'remarkErrhysis', 'remarkAnticoagulation', 'remarkTube', 'remark', 'ext1', 'ext2', 'ext3', 'ext4', 'ext5', 'ext6', 'ext7', 'ext8', 'ext9', 'ext10']
  const data = new MonitorCureMiddleView({
    cureRecordId: cureData.cureRecordId,
    monitorTime: dateUtil(),
  })

  fields.forEach((field) => {
    // eslint-disable-next-line no-eval
    const fieldValue = eval(`getField${field.charAt(0).toUpperCase() + field.slice(1)}`)
    data[field] = fieldValue.value?.isInheritance ? (lastData[field] ?? fieldValue.value.default) : fieldValue.value?.default
  })

  data.position = paramDefaultBpPositionMonitor
  handleEditClick(data)
}
/** 编辑 */
function handleEditClick(val: MonitorCureMiddleView) {
  dialogVisible.value = true
  formData.value = new MonitorCureMiddleView({ ...val })
}
/** 删除 */
async function handleDeleteClick(id: string) {
  ElMessageBox.confirm(
    '确认要删除监测数据吗?',
    '删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      // appendTo: 'advice-div',
    },
  ).then(async () => {
    const { success } = await cureServiceProxy.monitorCureMiddlePOST3(id)
    if (success) {
      showNotify({ type: 'success', message: `删除成功` })
      initLoad()
    }
  }).catch(() => {
  })
}

/** 改变血压测量方式 */
function handleBpPositionChange() {
  if (disabledSbp(formData.value.position)) {
    formData.value.sbp = null
    formData.value.dbp = null
  }
}
const dicBpPosition = getDicDataByCode(DIC_PATIENT_MEASURE_BP_POSITION)
/** 改变血压 */
function handleBloodPressureChange() {
  const { sbp, dbp, position } = formData.value
  if ((sbp || dbp) && position === (dicBpPosition.find(x => x.value === 'NOMEASURE')?.value || '')) {
    formData.value.position = (dicBpPosition.find(x => x.value === 'UP')?.value || '')
  }
}
watch(() => [formData.value.sbp, formData.value.dbp], () => {
  handleBloodPressureChange()
})
function handleTempRemarkChange(val) {
  formData.value.remark = val?.toString()
}
/** 新增编辑监测错误提示（全屏会遮盖showNotify，使用组件方式调用） */
const dialogErrorNotify = ref(false)
const errorNotifyMessage = ref(null)
/** 新增编辑监测弹窗内提示 */
function showDialogErrorNotify(val: string) {
  dialogErrorNotify.value = true
  errorNotifyMessage.value = val
  setTimeout(() => {
    dialogErrorNotify.value = false
  }, 2000)
}
/** 测量血压 */
async function handleBloodPressureMeasureClick() {
  emit('hanldeChangeLoading', true)
  const { success, message } = await cureServiceProxy.box(cureData.cureRecordId)
  emit('hanldeChangeLoading', false)
  if (success) {
    showNotify({ type: 'success', message: '成功下发指令，请等待执行结果' })
  }
  else {
    showDialogErrorNotify(message)
  }
}
/** 血压同步 */
async function handleBloodSyncClick() {
  emit('hanldeChangeLoading', true)
  const { success, data, message } = await cureServiceProxy.syncSphygmometerData(cureData.cureRecordId)
  emit('hanldeChangeLoading', false)
  if (success) {
    Object.assign(formData.value, {
      sbp: data.sbp || formData.value.sbp,
      dbp: data.dbp || formData.value.dbp,
      pulse: data.pulse || formData.value.pulse,
    })
  }
  else {
    showDialogErrorNotify(message)
  }
}
/** 血压同步 */
async function handleFormSyncClick() {
  dialogVisibleLoading.value = true
  const { success, data, message } = await cureServiceProxy.sync(cureData.cureRecordId, formatToDateTime(formData.value.monitorTime))
  dialogVisibleLoading.value = false
  if (success) {
    Object.assign(formData.value, { ...data })
  }
  else {
    showDialogErrorNotify(message)
  }
}
/** 保存 */
async function handleSaveClick() {
  await ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      dialogVisibleLoading.value = true
      const formSaveData = new MonitorCureMiddleEditModel({ ...toRaw(formData.value) })
      const { success, message } = await (formData.value.cureMonitorId ? cureServiceProxy.monitorCureMiddlePOST2(formData.value.cureMonitorId, formSaveData) : cureServiceProxy.monitorCureMiddlePOST(formSaveData))
      dialogVisibleLoading.value = false
      if (success) {
        dialogVisible.value = false
        initLoad()
      }
      else {
        showDialogErrorNotify(message)
      }
    }
  })
}
</script>

<style scoped lang="less">
</style>
