interface FilterItem {
  value: any
  type?: 'like' | '>' | '<' | '>=' | '<=' | '=' | '!='
  dbName?: string
}

interface Filter {
  [key: string]: FilterItem | number | string
  pageIndex?: number
  pageSize?: number
  order?: string
}

interface QueryItem {
  where: string
  whereData: any[]
}

/**
 * 将过滤器对象转换为可执行的查询条件
 * @param filter - 包含过滤条件和分页信息的对象
 * @returns 包含where条件和参数的QueryItem对象
 * @description
 * 1. 初始化基础查询条件 '1=1'
 * 2. 过滤无效值（undefined和空字符串，0除外）
 * 3. 根据不同类型构建查询条件
 *   - like: 模糊查询
 *   - >,<,>=,<=,=,!=: 比较查询
 *   - 默认: 使用Contains进行模糊查询
 */
function format(filter: Filter): QueryItem {
  const queryItem: QueryItem = {
    where: '1=1',
    whereData: [],
  }

  // 过滤掉值为undefined或空字符串的键（0除外）
  const validKeys = Object.keys(filter).filter((key) => {
    const filterItem = filter[key]
    const value = typeof filterItem === 'object' ? filterItem.value : null
    return value || value === 0
  })

  // 遍历有效键并构建查询条件
  validKeys.forEach((key, index) => {
    const filterItem = filter[key]
    const isFilterItem = typeof filterItem === 'object'
    const dbName = isFilterItem ? (filterItem as FilterItem).dbName || key : key
    const value = isFilterItem ? (filterItem as FilterItem).value : filterItem

    // 根据类型构建不同的查询条件
    switch (isFilterItem ? (filterItem as FilterItem).type : undefined) {
      case 'like':
        queryItem.where += ` && ${dbName}.Contains(@${index})`
        break
      case '>':
      case '<':
      case '>=':
      case '<=':
      case '=':
      case '!=':
        queryItem.where += ` && ${dbName} ${isFilterItem ? (filterItem as FilterItem).type : '='} @${index}`
        break
      default:
        queryItem.where += ` && ${dbName}.Contains(@${index})`
        break
    }
    queryItem.whereData.push(value)
  })

  return queryItem
}

/**
 * 将前端过滤器转换为后端请求格式
 * @param filter - 前端传入的过滤器对象
 * @returns 返回JSON字符串格式的请求过滤器
 * @throws
 * - 当filter为空时返回错误信息
 * - 当缺少pageIndex时返回错误信息
 * - 当缺少pageSize时返回错误信息
 * @description
 * 1. 参数校验
 * 2. 调用format方法格式化查询条件
 * 3. 返回符合后端接口要求的JSON字符串
 */
export default function queryFilter(filter: Filter): string {
  try {
    if (Object.prototype.hasOwnProperty.call(filter, 'Predicate')) {
      return JSON.stringify(filter)
    }
    // 参数校验
    if (!filter) {
      throw new Error('Search Condition can not be null')
    }

    if (!filter.pageIndex) {
      throw new Error('pageIndex not found')
    }

    if (!filter.pageSize) {
      throw new Error('pageSize not found')
    }

    // 格式化过滤器
    const result = format(filter)

    // 返回请求过滤器对象
    return JSON.stringify({
      PageIndex: filter.pageIndex!,
      PageSize: filter.pageSize!,
      Predicate: result.where,
      PredicateValues: result.whereData,
      Ordering: filter.order,
    })
  }
  catch (error) {
    console.error(error.message)
  }
}
