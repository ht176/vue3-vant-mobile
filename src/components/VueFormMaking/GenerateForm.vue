<template>
  <div>
    <el-form ref="generateForm" :size="data.config.size" :model="models" :rules="rules" :label-position="data.config.labelPosition" class="printLint">
      <template v-for="item in data.list" :key="item.key">
        <template v-if="item.type === 'grid'">
          <el-row type="flex" :gutter="item.options.gutter ? item.options.gutter : 0" :justify="item.options.justify" :align="item.options.align">
            <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">
              <template v-for="citem in col.list" :key="citem.key">
                <el-form-item v-if="citem.type === 'blank'" :label="citem.name" :prop="citem.model">
                  <slot :name="citem.model" :model="models" />
                </el-form-item>
                <GenetateFormItem v-else ref="genetateItemGrid" v-model:models="models" :remote="remote" :rules="rules" :widget="citem" :label-width="data.config.labelWidth" :show-content-lint="data.config.labelPosition !== 'top'" :fraction="fraction" />
              </template>
            </el-col>
          </el-row>
        </template>
        <template v-else-if="item.type === 'blank'">
          <el-form-item :label="item.name" :prop="item.model">
            <slot :name="item.model" :model="models" />
          </el-form-item>
        </template>
        <template v-else>
          <GenetateFormItem :key="item.key" ref="genetateItem" v-model:models="models" :rules="rules" :widget="item" :remote="remote" :label-width="data.config.labelWidth" :show-content-lint="data.config.labelPosition !== 'top'" :fraction="fraction" />
        </template>
      </template>
    </el-form>
    <div style="display:none;">
      {{ fraction }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: Object as PropType<DataStructure>,
  remote: Object,
  value: Object,
  insite: Boolean,
})

const models = ref({ flag: '' })
const rules = ref({})
const generateForm = ref(null)
const genetateItem = ref([])
const genetateItemGrid = ref([])

const fraction = computed(() => {
  let fraction = 0
  // 栅格布局外计算分数
  props.data.list.forEach((l) => {
    if (l.type === 'radio') {
      if (models.value[l.model]) {
        const result = models.value[l.model]
        const filterNo = l.options.options.filter(o => o.value === result)
        if (filterNo && filterNo.length > 0) {
          const no = filterNo[0].fraction
          fraction += Number(no)
        }
      }
    }
    if (l.type === 'checkbox') {
      if (models.value[l.model] && models.value[l.model].length > 0) {
        const result = models.value[l.model].toString().split(',')
        result.forEach((r) => {
          const filterNo = l.options.options.filter(o => o.value === r)
          if (filterNo && filterNo.length > 0) {
            const no = filterNo[0].fraction
            fraction += Number(no)
          }
        })
      }
    }
  })
  // 栅格布局内计算分数
  props.data.list.forEach((l) => {
    if (l.columns && l.columns.length) {
      l.columns.forEach((c) => {
        if (c.list && c.list.length) {
          c.list.forEach((cl) => {
            if (cl.type === 'radio') {
              if (models.value[cl.model]) {
                const result = models.value[cl.model]
                const filterNo = cl.options.options.filter(o => o.value === result)
                if (filterNo && filterNo.length > 0) {
                  const no = filterNo[0].fraction
                  fraction += Number(no)
                }
              }
            }
            if (cl.type === 'checkbox') {
              if (models.value[cl.model] && models.value[cl.model].length > 0) {
                const result = models.value[cl.model].toString().split(',')
                result.forEach((r) => {
                  const filterNo = cl.options.options.filter(o => o.value === r)
                  if (filterNo && filterNo.length > 0) {
                    const no = filterNo[0].fraction
                    fraction += Number(no)
                  }
                })
              }
            }
          })
        }
      })
    }
  })
  // 栅格布局外绑定分数
  props.data.list.forEach((l) => {
    if (l.type === 'fraction') {
      l.options.fraction = fraction
    }
  })
  // 栅格布局内绑定分数
  props.data.list.forEach((l) => {
    if (l.columns && l.columns.length) {
      l.columns.forEach((c) => {
        if (c.list && c.list.length) {
          c.list.forEach((cl) => {
            if (cl.type === 'fraction') {
              cl.options.fraction = fraction
            }
          })
        }
      })
    }
  })
  return fraction
})

function generateModle(genList) {
  nextTick(() => {
    for (let i = 0; i < genList.length; i++) {
      if (genList[i].type === 'grid') {
        genList[i].columns.forEach((item) => {
          generateModle(item.list)
        })
      }
      else {
        if (props.value && Object.keys(props.value).includes(genList[i].model)) {
          models.value[genList[i].model] = props.value[genList[i].model]
        }
        else {
          if (genList[i].type === 'blank') {
            models.value[genList[i].model] = genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : [])
          }
          else {
            models.value[genList[i].model] = genList[i].options.defaultValue
          }
        }
        if (genList[i].type === 'rate') {
          models.value[genList[i].model] = Number(models.value[genList[i].model])
        }
        if (genList[i].type === 'checkbox') {
          models.value[genList[i].model] = models.value[genList[i].model].length > 0 ? models.value[genList[i].model].toString().split(',') : []
        }
        if (genList[i].type === 'select' && genList[i].options.multiple) {
          models.value[genList[i].model] = models.value[genList[i].model].length > 0 ? models.value[genList[i].model].toString().split(',') : []
        }
        if (rules.value[genList[i].model]) {
          rules.value[genList[i].model] = [...rules.value[genList[i].model], ...genList[i].rules.map((item) => {
            if (item.pattern) {
              return { ...item, pattern: JSON.parse(item.pattern) }
            }
            else {
              return { ...item }
            }
          })]
        }
        else {
          rules.value[genList[i].model] = [...genList[i].rules.map((item) => {
            if (item.pattern) {
              return { ...item, pattern: JSON.parse(item.pattern) }
            }
            else {
              return { ...item }
            }
          })]
        }
      }
    }
    // 调用子组件的赋值方法
    if (genetateItem.value && genetateItem.value.length > 0) {
      genetateItem.value.forEach((i) => {
        i.assign()
      })
    }
    // 调用栅格化子组件的赋值方法
    if (genetateItemGrid.value && genetateItemGrid.value.length > 0) {
      genetateItemGrid.value.forEach((i) => {
        i.assign()
      })
    }
    models.value.flag = ''
  })
}

function getData(): Promise<{ success: boolean, data: Record<string, any> | string }> {
  for (const key in models.value) {
    if (typeof models.value[key] === 'number' && Number(models.value[key]) >= 0) {
      models.value[key] = models.value[key].toString()
    }
    if (models.value[key] && models.value[key].length >= 0 && !(key.split('_')[0] === 'imgupload')) {
      models.value[key] = models.value[key].toString()
    }
  }
  return new Promise((resolve, _reject) => {
    generateForm.value.validate((valid) => {
      if (valid) {
        props.data.list.forEach((item, _index) => {
          if (item.columns && item.columns.length) {
            item.columns.forEach(
              (items) => {
                items.list.forEach(
                  (item1) => {
                    if (item1.show) {
                      let isContain = true
                      switch (item1.show.expression) {
                        case 'contain':
                          isContain = models.value[item1.show.depend] && models.value[item1.show.depend].includes(item1.show.dependValue)
                          break
                        case '=':
                          isContain = models.value[item1.show.depend] === (item1.show.dependValue)
                          break
                        case '>':
                          isContain = models.value[item1.show.depend] > (item1.show.dependValue)
                          break
                        case '<':
                          isContain = models.value[item1.show.depend] < (item1.show.dependValue)
                          break
                        case '>=':
                          isContain = models.value[item1.show.depend] >= (item1.show.dependValue)
                          break
                        case '<=':
                          isContain = models.value[item1.show.depend] <= (item1.show.dependValue)
                          break
                        case '!=':
                          isContain = models.value[item1.show.depend] !== (item1.show.dependValue)
                          break
                      }
                      if (!isContain) {
                        models.value[item1.model] = item1 === 'checkbox' ? [] : null
                      }
                    }
                  },
                )
              },
            )
          }
          else {
            if (item.show) {
              let isContain = true
              switch (item.show.expression) {
                case 'contain':
                  isContain = models.value[item.show.depend] && models.value[item.show.depend].includes(item.show.dependValue)
                  break
                case '=':
                  isContain = models.value[item.show.depend] === (item.show.dependValue)
                  break
                case '>':
                  isContain = models.value[item.show.depend] > (item.show.dependValue)
                  break
                case '<':
                  isContain = models.value[item.show.depend] < (item.show.dependValue)
                  break
                case '>=':
                  isContain = models.value[item.show.depend] >= (item.show.dependValue)
                  break
                case '<=':
                  isContain = models.value[item.show.depend] <= (item.show.dependValue)
                  break
                case '!=':
                  isContain = models.value[item.show.depend] !== (item.show.dependValue)
                  break
              }
              if (!isContain && item.show.expression) {
                // models.value[item.model] = item === 'checkbox' ? [] : null
              }
            }
          }
        })
        resolve({ success: true, data: models.value })
      }
      else {
        resolve({ success: false, data: new Error('表单数据校验失败').message })
      }
    })
  })
}

watch(() => props.value, (val) => {
  models.value = { ...models.value, ...val }
  if (props.data.list && props.data.list.length > 0) {
    nextTick(() => {
      generateModle(props.data.list)
    })
  }
}, { deep: true })

onMounted(() => {
  if (props.data.list && props.data.list.length > 0) {
    generateModle(props.data.list)
  }
})
defineExpose({ getData })
</script>
