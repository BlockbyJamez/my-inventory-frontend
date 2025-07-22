# 📦 My Inventory App

一套完整的 **前後端分離庫存管理系統**  
前端：`Vue 3 + Vite + Pinia + Element Plus`  
後端：`Node.js + Express + PostgreSQL`

---

## 🔗 線上體驗 Demo

📱 手機掃碼快速體驗：

<img src="./public/qrcode.png" width="180" />

🌐 網址：[https://my-inventory-frontend-lyte.onrender.com/demo](https://my-inventory-frontend-lyte.onrender.com/demo)

---

## ✅ 已完成功能

- ✔️ **使用者登入 / 權限管理（admin / viewer）/權限功能頁分層**
- ✔️ **商品管理**（CRUD、圖片上傳、分類篩選、分頁、即時搜尋）
- ✔️ **出入庫管理**（庫存異動記錄、自動計算庫存）
- ✔️ **操作紀錄查詢**（包含登入、交易紀錄等）
- ✔️ **儀表板 Dashboard**（7 日趨勢圖、統計卡片）
- ✔️ **RWD 響應式設計、前後端部署上線**

---

## 🧱 專案結構

```
my-inventory-app/
├── backend/ # Node.js + Express API
│ ├── routes/ # 各功能模組路由（products, transactions, users...）
│ └── db.js # DB 初始化與連線
├── frontend/ # Vue 3 前端模組
│ ├── views/ # 各頁面元件
│ ├── components/ # 通用元件（表單、Dialog、統計卡）
│ └── stores/ # Pinia 狀態管理
├── uploads/ # 圖片上傳目錄（自動產生）
├── package.json
└── README.md
```
