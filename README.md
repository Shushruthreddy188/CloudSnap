# ☁️ CloudSnap

CloudSnap is a full-stack image uploader that lets users upload images to Amazon S3 and preview them securely using presigned URLs.

Built with a modern React frontend and a Node.js + Express backend, this project demonstrates secure file handling, cloud storage integration, and a clean, interactive UI.

---

## 🚀 Features

* 📸 Upload images from browser
* 🖼️ Instant local preview before upload
* ☁️ Upload images to Amazon S3
* 🔐 Secure access using presigned URLs (no public bucket needed)
* 📊 Upload progress + activity log
* 🎛️ Clean UI with cloud-style experience

---

## 🛠️ Tech Stack

### Frontend

* React
* CSS

### Backend

* Node.js
* Express
* Multer

### Cloud

* AWS S3
* AWS SDK v3
* Presigned URLs

---

## 📁 Project Structure

```
CloudSnap/
  frontend/
  backend/
  .gitignore
  README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Shushruthreddy188/CloudSnap.git
cd CloudSnap
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

### Create `.env` file in backend folder

```env
PORT=5000
AWS_REGION=us-east-2
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Run backend server

```bash
node server.js
```

Server will run on:

```
http://localhost:5000
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🔐 How Security Works

* Images are uploaded to a **private S3 bucket**
* Backend generates a **presigned URL**
* Frontend uses this URL to preview the image
* The URL expires after a fixed time

### This ensures:

* No public access to your bucket
* Temporary, controlled access to files

---

## 📸 Screenshots
<img width="1278" height="932" alt="Screenshot 2026-04-22 212543" src="https://github.com/user-attachments/assets/4d131672-a7fa-4e97-8b4e-416cfc27b7e3" />
<img width="1256" height="930" alt="Screenshot 2026-04-22 212726" src="https://github.com/user-attachments/assets/ea7dc26a-0728-44c8-baf1-60e747ff7f19" />
<img width="1284" height="929" alt="Screenshot 2026-04-22 212912" src="https://github.com/user-attachments/assets/446d353a-de56-4c6a-b817-43b55a2b5f47" />

---

## 🧠 What I Learned

* Handling file uploads in full-stack applications
* Integrating AWS S3 using AWS SDK v3
* Generating presigned URLs for secure access
* Managing environment variables securely
* Building responsive and interactive UI

---

## ⚠️ Important Notes

* `.env` file is not committed for security reasons
* Never expose AWS credentials publicly
* Use `.env.example` as a reference

---

## 📬 Future Improvements

* Drag & drop upload enhancements
* Multiple image uploads
* Image compression before upload
* CloudFront CDN integration
* User authentication for uploads

---

## 👨‍💻 Author

Built by **Shushruth Kumar Reddy Mandadi**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
