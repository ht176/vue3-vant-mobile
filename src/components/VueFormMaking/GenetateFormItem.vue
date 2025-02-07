<template>
  <div v-show="show">
    <el-form-item
      v-if="widget.type !== 'dic'"
      :label="widget.type === 'label' || widget.type === 'monthSummary' || widget.type === 'customCrrtTable' ? '' : widget.name"
      :prop="widget.model"
      :label-width="`${widget.options.labelWidth || widget.type === 'customCrrtTable' || widget.type === 'monthSummary' || widget.type === 'label' ? widget.options.labelWidth : labelWidth}px`"
      :class="customRequired + (widget.type === 'label' || !showContentLint ? ' printLabel ' : ' printContent ') + (Array.isArray(widget.options.className) && widget.options.className.length > 0 ? `${widget.options.className.join(' ')} margin-bottom-0 ` : '')"
    >
      <template v-if="widget.type === 'input'">
        <el-input
          v-if="widget.options.dataType === 'number' || widget.options.dataType === 'integer' || widget.options.dataType === 'float'"
          v-model.number="dataModel"
          type="text"
          :placeholder="widget.options.placeholder"
          :style="{ width: `${widget.options.width}px` }"
        />
        <el-input
          v-else
          v-model="dataModel"
          type="text"
          :placeholder="widget.options.placeholder"
          :style="{ width: widget.options.width ? `${widget.options.width}px` : '100%' }"
        >
          <template v-if="widget.options.inputSlot">
            {{ widget.options.inputSlotContent }}
          </template>
        </el-input>
      </template>
      <template v-else-if="widget.type === 'textarea'">
        <el-input v-model="dataModel" type="textarea" :autosize="{ minRows: 5 }" :rows="5" :disabled="widget.options.disabled" :placeholder="widget.options.placeholder" :style="{ width: `${widget.options.width}px` }" />
      </template>
      <template v-else-if="widget.type === 'number'">
        <el-input-number v-model="dataModel" :style="{ width: `${widget.options.width}px` }" :step="widget.options.step" controls-position="right" />
      </template>
      <template v-else-if="widget.type === 'radio'">
        <el-radio-group v-model="dataModel" :style="{ width: `${widget.options.width}px` }">
          <el-radio v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="index" :style="{ display: widget.options.inline ? 'inline-block' : 'block' }" :value="item.value" @click.prevent="radioClick(item.value)">
            <template v-if="widget.options.remote">
              {{ item.label }}
            </template>
            <template v-else>
              {{ widget.options.showLabel ? item.label : item.value }}
            </template>
          </el-radio>
        </el-radio-group>
      </template>
      <template v-else-if="widget.type === 'checkbox'">
        <el-checkbox-group v-model="dataModel" :style="{ width: `${widget.options.width}px` }" @change="checkBoxChange">
          <el-checkbox v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="index" :style="{ display: widget.options.inline ? 'inline-block' : 'block' }" :value="item.value">
            <template v-if="widget.options.remote">
              {{ item.label }}
            </template>
            <template v-else>
              {{ widget.options.showLabel ? item.label : item.value }}
            </template>
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <template v-else-if="widget.type === 'time'">
        <el-time-picker v-model="dataModel" :is-range="widget.options.isRange" :placeholder="widget.options.placeholder" :start-placeholder="widget.options.startPlaceholder" :end-placeholder="widget.options.endPlaceholder" :readonly="widget.options.readonly" :disabled="widget.options.disabled" :editable="widget.options.editable" :clearable="widget.options.clearable" :arrow-control="widget.options.arrowControl" :value-format="widget.options.format" :style="{ width: `${widget.options.width}px` }" />
      </template>
      <template v-else-if="widget.type === 'date'">
        <el-date-picker v-model="dataModel" :type="widget.options.type" :placeholder="widget.options.placeholder" :start-placeholder="widget.options.startPlaceholder" :end-placeholder="widget.options.endPlaceholder" :readonly="widget.options.readonly" :disabled="widget.options.disabled" :editable="widget.options.editable" :clearable="widget.options.clearable" :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format" :format="widget.options.format" :style="{ width: `${widget.options.width}px` }" />
      </template>
      <template v-else-if="widget.type === 'monthSummary'">
        <table v-if="JSON.parse(dataModel) && JSON.parse(dataModel).length" class="month-table">
          <tr v-for="(item, index) in JSON.parse(dataModel)" :key="index">
            <td class="month-td" style="width:120px!important;">
              {{ item.Report }}
            </td>
            <td class="month-td">
              {{ item.Items }}
            </td>
          </tr>
        </table>
        <table v-else class="month-table">
          <tbody>
            <tr>
              <td class="month-td" style="width:120px!important;" />
              <td class="month-td" />
            </tr>
            <tr>
              <td class="month-td" />
              <td class="month-td" />
            </tr>
            <tr>
              <td class="month-td" />
              <td class="month-td" />
            </tr>
            <tr>
              <td class="month-td" />
              <td class="month-td" />
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else-if="widget.type === 'rate'">
        <el-rate v-model="dataModel" :max="widget.options.max" :disabled="widget.options.disabled" :allow-half="widget.options.allowHalf" />
      </template>
      <template v-else-if="widget.type === 'color'">
        <el-color-picker v-model="dataModel" :disabled="widget.options.disabled" :show-alpha="widget.options.showAlpha" />
      </template>
      <template v-else-if="widget.type === 'select'">
        <el-select v-model="dataModel" :disabled="widget.options.disabled" :multiple="widget.options.multiple" :clearable="widget.options.clearable" :placeholder="widget.options.placeholder" :style="{ width: `${widget.options.width}px` }" :filterable="widget.options.filterable">
          <el-option v-for="item in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote ? item.label : item.value" />
        </el-select>
      </template>
      <template v-else-if="widget.type === 'switch'">
        <el-switch v-model="dataModel" :disabled="widget.options.disabled" />
      </template>
      <template v-else-if="widget.type === 'slider'">
        <el-slider v-model="dataModel" :min="widget.options.min" :max="widget.options.max" :disabled="widget.options.disabled" :step="widget.options.step" :show-input="widget.options.showInput" :range="widget.options.range" :style="{ width: `${widget.options.width}px` }" />
      </template>
      <template v-if="widget.type === 'imgupload'">
        <FmUpload v-model="dataModel" :disabled="widget.options.disabled" :style="{ width: `${widget.options.width}px` }" :width="widget.options.size.width" :height="widget.options.size.height" :token="widget.options.token" :domain="widget.options.domain" :length="widget.options.length" />
      </template>
      <!-- <template v-if="widget.type === 'editor'">
        <FmEditor v-model="dataModel" :width="`${widget.options.width}px`" :height="widget.options.height" />
      </template> -->
      <template v-else-if="widget.type === 'cascader'">
        <el-cascader v-model="dataModel" :disabled="widget.options.disabled" :clearable="widget.options.clearable" :placeholder="widget.options.placeholder" :style="{ width: `${widget.options.width}px` }" :options="widget.options.remoteOptions" />
      </template>
      <template v-else-if="widget.type === 'label'">
        <span :style="{ 'font-size': `${widget.options.fontSize}px`, 'color': widget.options.fontColor }" :width="`${widget.options.width}px`">{{ widget.options.defaultValue === '占位' ? '' : widget.options.defaultValue }}</span>
      </template>
      <!-- 分数 -->
      <template v-else-if="widget.type === 'fraction'">
        <div>
          <span>{{ dataModel = widget.options.fraction }}</span>
        </div>
      </template>
      <!-- 结果 -->
      <template v-else-if="widget.type === 'result'">
        <div>
          <span>{{ dataModel = getexplain }}</span>
        </div>
      </template>
    </el-form-item>
    <el-form-item v-show="!show">
      &nbsp;
    </el-form-item>
    <Dictionary
      v-if="widget.type === 'dic'"
      v-model="dataModel"
      :custom-label="widget.name"
      size="small"
      :type="widget.dicType"
      :dic-code="widget.codeArr.length > 0 ? widget.codeArr[widget.codeArr.length - 1] : ''"
      :label-width="`${widget.options.labelWidth ? widget.options.labelWidth : labelWidth}px`"
      :muti-select="widget.valueType === 'multi'"
      style="padding: 5px 10px"
    />
  </div>
</template>

<script setup lang="ts">
// import FmUpload from './Upload'
// import FmEditor from './Editor/tinymce'

const props = defineProps({
  models: { type: Object, default: () => ({}) },
  widget: { type: Object, required: true },
  rules: { type: Object, default: () => ({}) },
  remote: { type: Object, default: () => ({}) },
  labelWidth: { type: Number, default: 0 },
  showContentLint: { type: Boolean, default: false },
  fraction: { type: Number, default: 0 },
})

const emit = defineEmits(['update:models'])

const dataModel = ref(
  props.models[props.widget.model]
  || (props.widget.type === 'checkbox'
    || props.widget.type === 'imgupload'
    ? []
    : null),
)

const customRequired = ref('')

const show = computed(() => {
  if (!props.widget.show) {
    return true
  }
  switch (props.widget.show.expression) {
    case 'contain':
      return (
        props.models[props.widget.show.depend]
        && props.models[props.widget.show.depend].includes(props.widget.show.dependValue)
      )
    case '=':
      return props.models[props.widget.show.depend] === props.widget.show.dependValue
    case '>':
      return props.models[props.widget.show.depend] > props.widget.show.dependValue
    case '<':
      return props.models[props.widget.show.depend] < props.widget.show.dependValue
    case '>=':
      return props.models[props.widget.show.depend] >= props.widget.show.dependValue
    case '<=':
      return props.models[props.widget.show.depend] <= props.widget.show.dependValue
    case '!=':
      return props.models[props.widget.show.depend] !== props.widget.show.dependValue
    default:
      return true
  }
})

const getexplain = computed(() => {
  let result = ''
  if (props.widget.options.range && props.widget.options.range.length > 0) {
    props.widget.options.range.forEach((r) => {
      if (
        r.min
        && Number(r.min)
        && r.max
        && Number(r.max)
        && props.fraction
        && Number(props.fraction)
        && Number(r.min) <= Number(props.fraction)
        && Number(r.max) >= Number(props.fraction)
      ) {
        result = r.explain
      }
    })
  }
  return result
})

// if (props.widget.options.remote && props.remote[props.widget.options.remoteFunc]) {
//   props.remote[props.widget.options.remoteFunc]((data) => {
//     props.widget.options.remoteOptions = data.map(item => ({
//       value: item[props.widget.options.props.value],
//       label: item[props.widget.options.props.label],
//       children: item[props.widget.options.props.children],
//     }))
//   })
// }

function radioClick(item) {
  dataModel.value = item === dataModel.value ? '' : item
}

function checkBoxChange() {
  if (dataModel.value.length !== 0) {
    const checkArr = []
    dataModel.value.forEach((i) => {
      if (i) {
        checkArr.push({
          value: i,
          group: Number.parseInt(
            props.widget.options.options.find(item => item.value === i).group,
          ),
        })
      }
    })

    const group = Number.parseInt(
      props.widget.options.options.find(
        i => i.value === dataModel.value[dataModel.value.length - 1],
      ).group,
    )

    const groupArr = []
    checkArr
      .filter(i => i.group === group)
      .forEach((i) => {
        groupArr.push(i.value)
      })
    dataModel.value = groupArr
  }
}

function assign() {
  const obj = { ...props.models }
  dataModel.value = obj[props.widget.model]
    ? obj[props.widget.model]
    : props.widget.type === 'checkbox'
      ? []
      : null
  customRequired.value
    = props.rules[props.widget.model]
    && props.rules[props.widget.model].length > 0
    && props.rules[props.widget.model].find(i => i.required)
      ? 'customRequired'
      : ''
}
watch(
  () => dataModel,
  (val) => {
    const updatedModels = { ...props.models, [props.widget.model]: val }
    emit('update:models', updatedModels)
  },
  { deep: true },
)
watch(
  () => props.models,
  (val) => {
    dataModel.value = val[props.widget.model]
      ? val[props.widget.model]
      : props.widget.type === 'checkbox' || props.widget.type === 'customCrrtTable'
        ? []
        : null
  },
  { deep: true },
)

defineExpose({ assign })
</script>
