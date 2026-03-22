# AI Feedback Recovery System

A full-stack application to recover customer feedback via Email when an AI call is missed.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Axios, Lucide-React
- **Backend:** Node.js, Express, Nodemailer, JWT

## 🚀 Key Features
- **Call-to-Email Fallback:** Automatically triggers an email if a call status is 'not_answered'.
- **Secure Tokenized Links:** Uses JWT for unique and expiring survey links.
- **Data Capture:** Stores 5-question survey responses with channel attribution.
