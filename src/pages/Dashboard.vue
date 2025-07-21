<template>
  <div class="dashboard-container">
    <h2 class="title">📊 庫存儀表板</h2>

    <el-row :gutter="20" class="card-group">
      <el-col :xs="24" :sm="12" :md="8" v-for="item in stats" :key="item.label">
        <el-card shadow="hover" class="stat-card">
          <h3>{{ item.label }}</h3>
          <p class="value">{{ item.value }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

const stats = ref([]);

const fetchSummary = async () => {
  try {
    const res = await fetch("https://my-inventory-backend-lyte.onrender.com/dashboard/summary");
    const data = await res.json();
    stats.value = [
      { label: "商品總數", value: data.productCount },
      { label: "總庫存數量", value: data.totalStock },
      { label: "今日交易筆數", value: data.todayTxnCount },
      { label: "今日入庫數量", value: data.todayStockIn },
      { label: "今日出庫數量", value: data.todayStockOut },
    ];
  } catch (err) {
    console.error("儀表板資料錯誤", err);
    ElMessage.error("無法載入儀表板資料");
  }
};

onMounted(() => {
  fetchSummary();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1080px;
  margin: auto;
  padding: 24px;
}
.title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
}
.card-group {
  margin-top: 20px;
}
.stat-card {
  text-align: center;
  padding: 16px;
  border-radius: 12px;
  background: #fdfdfd;
}
.stat-card h3 {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 8px;
}
.stat-card .value {
  font-size: 2rem;
  color: #cc5500;
  font-weight: bold;
}
</style>
