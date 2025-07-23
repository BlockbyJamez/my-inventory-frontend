<template>
  <div class="log-page">
    <el-card class="main-card" shadow="always">
      <div class="header">
        <el-page-header content="📝 操作紀錄" @back="goBack" />
        <el-select
          v-model="selectedAction"
          placeholder="篩選操作類型"
          clearable
          class="action-filter"
        >
          <el-option label="全部" :value="''" />
          <el-option label="新增商品" value="add_product" />
          <el-option label="更新商品" value="update_product" />
          <el-option label="刪除商品" value="delete_product" />
          <el-option label="出入庫" value="add_transaction" />
          <el-option label="權限變更" value="update_permissions" />
          <el-option label="登入成功" value="login_success" />
          <el-option label="註冊帳號" value="register_user" />
        </el-select>
      </div>

      <h2 class="title">📋 操作紀錄一覽</h2>

      <el-table v-if="!isMobile" :data="filteredLogs" style="width: 100%" border stripe>
        <el-table-column prop="timestamp" label="時間" width="180">
          <template #default="{ row }">
            {{ formatTaiwanTime(row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="操作人" width="120" />
        <el-table-column prop="action" label="操作行為" width="150" />
        <el-table-column label="細節">
          <template #default="{ row }">
            <div>{{ summarize(row) }}</div>
            <el-popover trigger="click" placement="bottom">
              <template #reference>
                <el-button size="small" text type="primary">查看原始 JSON</el-button>
              </template>
              <pre class="json-view">{{ formatDetails(row.details) }}</pre>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <div v-else class="log-cards">
        <div v-for="row in filteredLogs" :key="row.id" class="log-card">
          <div><strong>時間：</strong>{{ formatTaiwanTime(row.timestamp) }}</div>
          <div><strong>操作人：</strong>{{ row.username }}</div>
          <div><strong>行為：</strong>{{ row.action }}</div>
          <div><strong>細節：</strong>{{ summarize(row) }}</div>
          <el-popover trigger="click" placement="bottom">
            <template #reference>
              <el-button size="small" text type="primary">查看原始 JSON</el-button>
            </template>
            <pre class="json-view">{{ formatDetails(row.details) }}</pre>
          </el-popover>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const logs = ref([])
const selectedAction = ref('')
const auth = useAuthStore()
const router = useRouter()
const API_BASE = import.meta.env.VITE_API_BASE;

const isMobile = ref(window.innerWidth <= 768)
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768
})

function goBack() {
  router.push('/')
}

function formatTaiwanTime(utcString) {
  if (!utcString) return '-'
  const date = new Date(utcString)
  return date.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
}

function formatDetails(details) {
  if (!details) return '-'
  try {
    return JSON.stringify(JSON.parse(details), null, 2)
  } catch (e) {
    return details
  }
}

function summarize(row) {
  try {
    const d = JSON.parse(row.details || '{}')
    switch (row.action) {
      case 'update_product':
        return `✏️ 更新商品「${d.name}」，庫存改為 ${d.stock}`
      case 'add_product':
        return `➕ 新增商品「${d.name}」`
      case 'delete_product':
        return `🗑️ 刪除商品 ID ${d.id}`
      case 'add_transaction':
        return `📦 商品「${d.productName}」${d.type === 'in' ? '入庫' : '出庫'} ${d.quantity}`
      case 'update_permissions':
        return `🛢 修改使用者「${d.username}」權限為 ${d.newRole}`
      case 'login_success':
        return `🔑 使用者「${d.username}」登入成功`
      case 'register_user':
        return `🆕 註冊新使用者「${d.username}」`
      default:
        return '—'
    }
  } catch {
    return '—'
  }
}

const filteredLogs = computed(() => {
  if (!selectedAction.value) return logs.value
  return logs.value.filter(log => log.action === selectedAction.value)
})

async function fetchLogs() {
  const res = await fetch(`${API_BASE}/logs`, {
    headers: {
      'x-role': auth.user?.role || '',
      'x-username': auth.user?.username || 'unknown'
    }
  })
  const data = await res.json()
  if (res.ok) {
    logs.value = data
  } else {
    ElMessage.error(data.error || '讀取失敗')
  }
}

onMounted(fetchLogs)

document.querySelectorAll('input, textarea, select').forEach((el) => {
  el.addEventListener('touchstart', (e) => {
    e.preventDefault();
    el.focus({ preventScroll: true });
  });
});
</script>

<style scoped>
.log-page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.main-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  background-color: #ffffff;
  border: 1px solid #ebeef5;
  padding: 24px;
}

.action-filter {
  width: 250px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  color: #303133;
}

.json-view {
  white-space: pre-wrap;
  max-width: 600px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.log-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.log-card {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  background: #f9f9f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  font-size: 14px;
}
</style>
