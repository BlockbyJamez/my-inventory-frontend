<template>
  <div class="profile-page">
    <el-card class="profile-card" shadow="always">
      <h2>👤 個人設定</h2>

      <el-descriptions v-if="authStore.user" :column="1" border>
        <el-descriptions-item label="帳號">{{ authStore.user.username }}</el-descriptions-item>
        <el-descriptions-item label="信箱">{{ authStore.user.email }}</el-descriptions-item>
        <el-descriptions-item label="身分">{{ authStore.user.role }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>修改密碼</el-divider>

      <el-form :model="form" label-width="100px" class="password-form" @submit.prevent>
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
import { reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const API_BASE = import.meta.env.VITE_API_BASE;

const form = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const submitPassword = async () => {
  if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
    ElMessage.warning("請完整填寫所有欄位");
    return;
  }
  if (form.newPassword !== form.confirmPassword) {
    ElMessage.error("新密碼與確認密碼不一致");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/profile/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-username": authStore.user.username,
        "x-role": authStore.user.role,
      },
      body: JSON.stringify({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "修改失敗");

    ElMessage.success(data.message || "密碼修改成功");
    form.oldPassword = form.newPassword = form.confirmPassword = "";
  } catch (err) {
    ElMessage.error(err.message);
  }
};

// 初次載入：若 authStore 無 user → 從 localStorage 補回來
if (!authStore.user) {
  const storedUser = {
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
    email: localStorage.getItem("email"),
  };
  if (storedUser.username && storedUser.role && storedUser.email) {
    authStore.login(storedUser);
  }
}

// 呼叫後端取得完整 user profile
onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/profile/me`, {
      headers: {
        "x-username": authStore.user?.username || "",
        "x-role": authStore.user?.role || "",
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "取得個人資料失敗");

    authStore.login(data); // 用完整資料更新 authStore（順便更新 localStorage）
    console.log("✅ 後端回傳 user：", data);
  } catch (err) {
    ElMessage.error(err.message);
  }
});
</script>

<style scoped>
.profile-page {
  padding: 24px;
  max-width: 720px;
  margin: auto;
}
.profile-card {
  padding: 20px;
  border-radius: 12px;
}
.password-form {
  margin-top: 24px;
}
</style>
