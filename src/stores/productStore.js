import { defineStore } from "pinia";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useAuthStore } from "./authStore";

const API_BASE = import.meta.env.VITE_API_BASE;

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
  }),
  actions: {
    async fetchProducts() {
      const res = await axios.get(`${API_BASE}/products`);
      this.products = res.data;
    },

    async addProduct(product) {
      const auth = useAuthStore();
      await axios.post(
        `${API_BASE}/products`,
        {
          ...product,
          role: auth.user?.role,
          username: auth.user?.username || "unknown",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      this.fetchProducts();
      ElMessage.success("商品已新增");
    },

    async deleteProduct(id) {
      const auth = useAuthStore();
      await axios.delete(`${API_BASE}/products/${id}`, {
        data: {
          role: auth.user?.role,
          username: auth.user?.username || "unknown",
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      this.fetchProducts();
      ElMessage.success("商品已刪除");
    },

    async updateProduct(id, updatedData) {
      const auth = useAuthStore();
      await axios.put(
        `${API_BASE}/products/${id}`,
        {
          ...updatedData,
          role: auth.user?.role,
          username: auth.user?.username || "unknown",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      this.fetchProducts();
      ElMessage.success("商品已更新");
    },
  },
});
