<template>
  <div class="profile-page">
    <el-card v-if="user" class="profile-card" shadow="always">
      <div class="header">
        <el-page-header content="👤 個人設定" @back="goBack" />
      </div>
      <h2 class="title">🛂 個人資料</h2>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="帳號">{{ user.username }}</el-descriptions-item>
        <el-descriptions-item label="信箱">{{ user.email }}</el-descriptions-item>
        <el-descriptions-item label="身分">{{ user.role }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>修改密碼</el-divider>

      <el-form :model="form" label-width="100px" @submit.prevent class="password-form">
        <el-form-item label="舊密碼">
          <el-input v-model="form.oldPassword" type="password" show-password placeholder="請輸入舊密碼" />
        </el-form-item>
        <el-form-item label="新密碼">
          <el-input v-model="form.newPassword" type="password" show-password placeholder="請輸入新密碼" />
        </el-form-item>
        <el-form-item label="確認新密碼">
          <el-input v-model="form.confirmPassword" type="password" show-password placeholder="請再次輸入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPassword">修改密碼</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const API_BASE = import.meta.env.VITE_API_BASE

const user = ref(null)
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

async function fetchProfile() {
  try {
    const res = await fetch(`${API_BASE}/profile/me`, {
      headers: {
        'x-username': authStore.user?.username || localStorage.getItem('username') || '',
        'x-role': authStore.user?.role || localStorage.getItem('role') || '',
      }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '取得個人資料失敗')
    authStore.login(data)
    user.value = data
    console.log('✅ 取得個人資料成功:', data)
  } catch (err) {
    ElMessage.error(err.message)
  }
}

async function submitPassword() {
  if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
    return ElMessage.warning('請完整填寫所有欄位')
  }
  if (form.newPassword !== form.confirmPassword) {
    return ElMessage.error('新密碼與確認密碼不一致')
  }

  try {
    const res = await fetch(`${API_BASE}/profile/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-username': user.value.username,
        'x-role': user.value.role
      },
      body: JSON.stringify({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      })
    })

    const result = await res.json()
    if (!res.ok) throw new Error(result.error || '密碼修改失敗')
    ElMessage.success('✅ 密碼修改成功')
    form.oldPassword = form.newPassword = form.confirmPassword = ''
  } catch (err) {
    ElMessage.error(err.message)
  }
}

function goBack() {
  router.push('/')
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-page {
  max-width: 720px;
  margin: 40px auto;
  padding: 0 20px;
}

.header {
  margin-bottom: 16px;
}

.title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #303133;
  text-align: center;
  margin-bottom: 1.5rem;
}

.profile-card {
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.password-form {
  margin-top: 24px;
}
</style>
