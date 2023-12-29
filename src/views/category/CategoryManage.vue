<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  categoryGetListService,
  categoryDelByIdService,
  categoryUpdateService
} from '@/api/category'
import { formatTime } from '@/utils/format'
import CategoryEdit from '@/views/category/components/CategoryEdit.vue'

// 数据
const categoryList = ref([])
const total = ref(0)

// 双向绑定数据
const params = ref({
  page: 1, // 第几页
  pageSize: 5, // 每页几条数据
  name: '',
  employeeName: '',
  status: ''
})

// loding
const loading = ref(false)

// 绑定抽屉
const categoryEditRef = ref()

// 获取数据
const getArtcleList = async () => {
  loading.value = true
  const res = await categoryGetListService(params.value)
  console.log(res.data.data)
  categoryList.value = res.data.data.records
  console.log(categoryList.value)
  total.value = res.data.data.total
  loading.value = false
}
getArtcleList()

// 每页几条数据发生变化
const onSizeChange = (size) => {
  // 每页条数变化 -->从第一页渲染即可
  params.value.page = 1
  params.value.pageSize = size
  getArtcleList()
}

// 第几页发生变化
const onCurrentChange = (page) => {
  // 更新当前页
  params.value.page = page
  // 基于当前页渲染
  getArtcleList()
}

// 搜索逻辑
const onSearch = () => {
  // 从第一页开始渲染
  params.value.page = 1
  // 根据最新的条件发请求渲染
  getArtcleList()
}

// 重置逻辑
const onReset = () => {
  // 重置搜索条件
  params.value.page = 1
  params.value.name = ''
  params.value.employeeName = ''
  params.value.status = ''
  // 重新发请求
  getArtcleList()
}

// 编辑新增逻辑
const onAddEmployee = () => {
  categoryEditRef.value.open({})
}
// 修改逻辑
const onEditEmployee = (row) => {
  categoryEditRef.value.open(row)
}

// 删除逻辑 管理员权限
const onDeleteCategory = async (row) => {
  // 消息弹框
  await ElMessageBox.confirm('您确定删除该分类信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  //删除请求
  await categoryDelByIdService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  // 重新渲染
  getArtcleList()
}

//修改状态
const updateStatus = async (row) => {
  if (row.status === 1) {
    //修改row.status的状态
    row.status = 0
  } else {
    row.status = 1
  }
  //发送修改请求
  await categoryUpdateService(row)
  ElMessage({ type: 'success', message: '修改成功' })
  // 重新渲染
  getArtcleList()
}

// 子传父 添加|修改 成功逻辑
const onSuccess = (type) => {
  if (type === 'add') {
    //添加 -->desc排序 在最前添加--> 跳转第一页并渲染
    // const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.page = 1
  }
  getArtcleList()
}
</script>

<template>
  <page-container title="分类管理">
    <template #extra>
      <el-button @click="onAddEmployee" type="primary"> 新增分类 </el-button>
    </template>
    <!-- 搜索表单区域 -->
    <el-form inline>
      <el-form-item label="分类名称:" prop="name">
        <el-input v-model="params.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="创建人姓名:" prop="employeeName">
        <el-input
          v-model="params.employeeName"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="categoryList" style="width: 100%">
      <el-table-column label="分类名称">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="详细描述" prop="description"></el-table-column>
      <el-table-column label="排序号" prop="sort"> </el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-link
            v-if="row.status === 1"
            type="primary"
            @click="updateStatus(row)"
            >启用</el-link
          >
          <el-link v-else type="danger" @click="updateStatus(row)"
            >禁用</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime">
        <template #default="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="employeeName"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button circle plain type="primary" @click="onEditEmployee(row)"
            >修改</el-button
          >
          <el-button circle plain type="danger" @click="onDeleteCategory(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.page"
      v-model:page-size="params.pageSize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉弹窗 -->
    <CategoryEdit ref="categoryEditRef" @success="onSuccess"></CategoryEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
