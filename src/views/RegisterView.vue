<template>
  <div class="register-container">
    <el-card class="register-card" shadow="always">
      <h2 class="title">📝 建立新帳號</h2>
      <p class="subtitle" v-if="step === 1">請填寫帳號與信箱以接收驗證碼</p>
      <p class="subtitle" v-else>請輸入收到的驗證碼完成註冊</p>

      <el-form :model="form" ref="formRef" label-position="top" class="register-form">
        <template v-if="step === 1">
          <el-form-item label="帳號">
            <el-input v-model="form.username" placeholder="請輸入帳號" size="large" clearable />
          </el-form-item>

          <el-form-item label="密碼">
            <el-input v-model="form.password" type="password" placeholder="請輸入密碼" size="large" clearable />
          </el-form-item>

          <el-form-item label="確認密碼">
            <el-input v-model="form.confirmPassword" type="password" placeholder="再次輸入密碼" size="large" clearable />
          </el-form-item>

          <el-form-item label="電子信箱">
            <el-input v-model="form.email" placeholder="請輸入 Email" size="large" clearable @keyup.enter="sendCode"/>
          </el-form-item>

          <el-button type="primary" @click="sendCode" class="register-btn" size="large" round>
            發送驗證碼
          </el-button>
        </template>

        <template v-else>
          <el-form-item label="驗證碼">
            <el-input v-model="form.code" placeholder="請輸入 Email 驗證碼" size="large" clearable @keyup.enter="verifyAndRegister"/>
          </el-form-item>

          <el-button type="primary" @click="verifyAndRegister" class="register-btn" size="large" round>
            完成註冊
          </el-button>
        </template>

        <div class="login-link">
          已有帳號？<router-link to="/login">點此登入</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";

const API_BASE = import.meta.env.VITE_API_BASE;
const router = useRouter();
const formRef = ref();

const form = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  code: "",
});

const step = ref(1);

async function sendCode() {
  if (!form.username || !form.password || !form.confirmPassword || !form.email) {
    ElMessage.warning("請填寫所有欄位");
    return;
  }
  if (form.password.length < 4) {
    ElMessage.error("密碼長度至少需為 4 碼");
    return;
  }
  if (form.password !== form.confirmPassword) {
    ElMessage.error("密碼與確認密碼不一致");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    ElMessage.error("請輸入有效的 Email 格式");
    return;
  }

  const loading = ElLoading.service({ lock: true, text: "發送驗證碼中...", background: "rgba(0, 0, 0, 0.7)" });
  try {
    const res = await fetch(`${API_BASE}/api/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.username, email: form.email }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "發送驗證碼失敗");

    ElMessage.success("✅ 驗證碼已寄出，請至信箱查收");
    step.value = 2;
  } catch (err) {
    ElMessage.error("❌ " + err.message);
  } finally {
    loading.close();
  }
}

async function verifyAndRegister() {
  if (!form.code) {
    ElMessage.warning("請輸入驗證碼");
    return;
  }

  const loading = ElLoading.service({ lock: true, text: "驗證中...", background: "rgba(0, 0, 0, 0.7)" });
  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
        email: form.email,
        code: form.code,
      }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "註冊失敗");

    ElMessage.success("🎉 註冊成功，歡迎加入！");
    router.push("/login");
  } catch (err) {
    ElMessage.error("❌ " + err.message);
  } finally {
    loading.close();
  }
}

document.querySelectorAll('input, textarea, select').forEach((el) => {
  el.addEventListener('touchstart', (e) => {
    e.preventDefault();
    el.focus({ preventScroll: true });
  });
});
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #e4edf4);
  padding: 2rem;
}

.register-card {
  width: 100%;
  max-width: 450px;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.title {
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  color: #303133;
}

.subtitle {
  font-size: 0.95rem;
  color: #909399;
  margin-bottom: 2rem;
}

.register-form {
  text-align: left;
}

.register-btn {
  width: 100%;
  margin: 1rem 0;
}

.login-link {
  text-align: center;
  font-size: 0.85rem;
  color: #606266;
}

.login-link a {
  margin-left: 4px;
  color: #409eff;
  text-decoration: none;
}
</style>
