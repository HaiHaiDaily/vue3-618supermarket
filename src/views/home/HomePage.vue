<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { getEmployeeListService, getShoppingListService } from '@/api/report'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

const dateList = ref([])
const totalEmployeeList = ref([])
const newEmployeeList = ref([])

const dateList2 = ref([])
const totalShoppingList = ref([])
const newShoppingList = ref([])

const createEcharts = () => {
  var chartDom = document.getElementById('employee')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    title: {
      text: '员工数据'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增员工', '员工总数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateList.value
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增员工',
        type: 'line',
        stack: 'Total',
        data: newEmployeeList.value
      },
      {
        name: '员工总数',
        type: 'line',
        stack: 'Total',
        data: totalEmployeeList.value
      }
    ]
  }

  option && myChart.setOption(option)
}

const createEcharts2 = () => {
  var chartDom = document.getElementById('shopping')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    title: {
      text: '商品数据'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增商品', '商品总数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateList2.value
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增商品',
        type: 'line',
        stack: 'Total',
        data: newShoppingList.value
      },
      {
        name: '商品总数',
        type: 'line',
        stack: 'Total',
        data: totalShoppingList.value
      }
    ]
  }

  option && myChart.setOption(option)
}

//获得数据
const getEmployeeList = async () => {
  //获取近一周
  const begin = new Date()
  begin.setDate(begin.getDate() - 7)
  const end = new Date()
  // end.setDate(end.getDate() - 7)

  console.log(begin.toLocaleDateString())
  console.log(end.toLocaleDateString())
  //发送请求获得数据
  const res = await getEmployeeListService(
    begin.toLocaleDateString(),
    end.toLocaleDateString()
  )
  dateList.value = res.data.data.dateList.split(',')
  totalEmployeeList.value = res.data.data.totalEmployeeList.split(',')
  newEmployeeList.value = res.data.data.newEmployeeList.split(',')
  createEcharts()
  createEcharts2()
}

//获得数据2
const getShoppingList = async () => {
  //获取近一周
  const begin = new Date()
  begin.setDate(begin.getDate() - 7)
  const end = new Date()
  // end.setDate(end.getDate() - 7)

  console.log(begin.toLocaleDateString())
  console.log(end.toLocaleDateString())
  //发送请求获得数据
  const res = await getShoppingListService(
    begin.toLocaleDateString(),
    end.toLocaleDateString()
  )
  dateList2.value = res.data.data.dateList.split(',')
  totalShoppingList.value = res.data.data.totalShoppingList.split(',')
  newShoppingList.value = res.data.data.newShoppingList.split(',')
  createEcharts2()
}

onMounted(() => {
  getEmployeeList()
  getShoppingList()
})
</script>

<template>
  <page-container title="数据展示">
    <el-row>
      <el-col :span="12">
        <div id="employee" style="width: 600px; height: 400px"></div
      ></el-col>
      <el-col :span="12">
        <div id="shopping" style="width: 600px; height: 400px"></div
      ></el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped></style>
