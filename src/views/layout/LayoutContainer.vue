<script setup>
import {
  Management,
  UserFilled,
  User,
  Crop,
  // EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import { useEmployeeStore } from '@/stores'
import { onMounted } from 'vue'
import router from '@/router'

//获取employeeStore
const employeeStore = useEmployeeStore()
onMounted(() => {
  //获取用户信息
  employeeStore.getEmployee()
})

// 点击事件: logout->退出 ；其他->跳转
const handleCommand = async (key) => {
  if (key === 'logout') {
    // 添加一个提示框 (await:被标上的函数执行成功就继续下面的代码，否则等待)
    await ElMessageBox.confirm('您确定要退出吗？', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '关闭',
      type: 'warning'
    })
    // 清除 token 和 employee信息
    employeeStore.removeToken()
    employeeStore.setEmployee({})
    //退出到登录页
    router.push('/login')
  } else {
    router.push(`/employee/${key}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <!-- 整个菜单组件 -->
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <!-- 一级菜单 -->
        <el-menu-item index="/home">
          <el-icon><Management /></el-icon>
          <span>系统首页</span>
        </el-menu-item>

        <!-- 一级菜单 -->
        <el-menu-item index="/employee">
          <el-icon><User /></el-icon>
          <span>员工管理</span>
        </el-menu-item>

        <!-- 一级菜单 -->
        <!-- <el-menu-item index="/user">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item> -->

        <!-- 多级菜单 -->
        <el-sub-menu index="">
          <!-- 多级菜单标题 -->
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>更多管理</span>
          </template>
          <!-- 展开的内容 -->
          <!-- <el-menu-item index="/orders">
            <el-icon><EditPen /></el-icon>
            <span>订单管理</span>
          </el-menu-item> -->
          <el-menu-item index="/shopping">
            <el-icon><User /></el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="/category">
            <el-icon><User /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 右上部分 -->
      <el-header>
        <!-- 展示给用户看到的 -->
        <div>
          用户名：<strong>{{
            employeeStore.employee.name || employeeStore.employee.username
          }}</strong>
        </div>
        <!-- 下拉菜单 -->
        <el-dropdown @command="handleCommand" placement="bottom-end">
          <span class="el-dropdown__box">
            <el-avatar :src="employeeStore.employee.image" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="info" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="update" :icon="Crop"
                >修改信息</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="Crop"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 右下部分 -->
      <el-main>
        <!-- 二级路由出口 -->
        <router-view></router-view>
      </el-main>
      <el-footer>618超市管理系统 ©2023</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
