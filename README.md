# 📦 My Inventory App

一套完整的 **前後端分離庫存管理系統**  
前端：`Vue 3 + Vite + Pinia + Element Plus`  
後端：`Node.js + Express + PostgreSQL`

---

## 🔗 線上體驗 Demo

📱 手機掃碼快速體驗：

<img src="./public/qr-code.png" width="180" />

快速 DEMO 範例帳號 / 密碼： admin / 1234

🌐 網址：[https://blockbyjamez.github.io/my-inventory-frontend/](https://blockbyjamez.github.io/my-inventory-frontend/)

---

## ✅ 已完成功能

- ✔️ **使用者登入 / 權限管理（admin / viewer）/ 權限功能頁分層**
- ✔️ **商品管理**（CRUD、圖片上傳、分類篩選、分頁、即時搜尋）
- ✔️ **出入庫管理**（庫存異動記錄、自動計算庫存）
- ✔️ **操作紀錄查詢**（包含登入、交易紀錄等）
- ✔️ **儀表板 Dashboard**（7 日趨勢圖、統計卡片）
- ✔️ **RWD 響應式設計、前後端部署上線**

---

## 🧱 專案結構

```
my-inventory-frontend/
├── public/
│   └── vite.svg
│   └── qrcode.png
├── src/
│   ├── assets/
│   ├── pages/              # 功能頁面
│   │   ├── Dashboard.vue
│   │   ├── Home.vue
│   │   ├── LogView.vue
│   │   ├── PermissionView.vue
│   │   ├── ProductForm.vue
│   │   ├── ProductList.vue
│   │   └── TransactionView.vue
│   ├── router/
│   │   └── routes.js       # Vue Router 設定
│   ├── stores/             # Pinia 狀態管理
│   │   ├── authStore.js
│   │   └── productStore.js
│   ├── views/              # 使用者登入 / 註冊相關驗證頁面
│   │   ├── ForgotPassword.vue
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css           # 全域樣式
├── index.html
├── .env.production
├── vite.config.js
├── package.json
└── README.md
```
