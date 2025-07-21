<template>
  <div class="dashboard-page">
    <el-card class="main-card" shadow="always">
      <div class="header">
        <el-page-header content="📊 庫存儀表板" @back="goBack" />
      </div>

      <el-row :gutter="20" class="card-group">
        <el-col :xs="24" :sm="12" :md="8" v-for="item in stats" :key="item.label">
          <el-card shadow="hover" class="stat-card">
            <h3>{{ item.label }}</h3>
            <p class="value">{{ item.value }}</p>
          </el-card>
        </el-col>
      </el-row>

      <div class="chart-container">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Line } from "vue-chartjs";
import { useRouter } from "vue-router";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

const router = useRouter()

function goBack() {
  router.push('/')
}

const stats = ref([]);
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "入庫數量",
      data: [],
      borderColor: "#67c23a",
      backgroundColor: "rgba(103, 194, 58, 0.3)",
      fill: true,
      tension: 0.3,
    },
    {
      label: "出庫數量",
      data: [],
      borderColor: "#f56c6c",
      backgroundColor: "rgba(245, 108, 108, 0.3)",
      fill: true,
      tension: 0.3,
    },
  ],
});
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "📈 最近 7 日出入庫數量趨勢",
    },
  },
};

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

const fetchChart = async () => {
  try {
    const res = await fetch("https://my-inventory-backend-lyte.onrender.com/dashboard/weekly-summary");
    const data = await res.json();

    chartData.value.labels = data.map((item) => item.date);
    chartData.value.datasets[0].data = data.map((item) => Number(item.stockin));
    chartData.value.datasets[1].data = data.map((item) => Number(item.stockout));
  } catch (err) {
    console.error("趨勢圖資料錯誤", err);
    ElMessage.error("無法載入趨勢圖資料");
  }
};

onMounted(() => {
  fetchSummary();
  fetchChart();
});
</script>

<style scoped>
.dashboard-page {
  padding: 24px;
  background: #f6f7f9;
  min-height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.main-card {
  max-width: 1080px;
  margin: auto;
  padding: 24px;
  border-radius: 12px;
}
.title {
  font-size: 1.8rem;
  margin-bottom: 24px;
  color: #333;
}
.card-group {
  margin-bottom: 40px;
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
.chart-container {
  height: 400px;
  position: relative;
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.06);
}
</style>
