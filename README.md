# ☁️ CloudSnap

CloudSnap is a full-stack cloud image uploader that lets users upload images to Amazon S3 and securely preview them using presigned URLs.

It is deployed as a distributed system with a modern React frontend on Vercel and a Node.js backend on Render.

---

## 🌐 Live Demo

🚀 Frontend: https://cloud-snap-five.vercel.app  
⚙️ Backend API: https://cloudsnap-8qek.onrender.com

---

## 🚀 Features

* 📸 Upload images from browser
* 🖼️ Instant local preview before upload
* ☁️ Upload images to private Amazon S3 bucket
* 🔐 Secure access using presigned URLs (no public access)
* 📊 Clean, cloud-inspired UI
* 🎛️ Fully deployed across cloud platforms

---

# 🏗️ Architecture

```text
User (Browser)
      ↓
Vercel (React Frontend)
      ↓
Render (Node.js Backend)
      ↓
AWS S3 (Storage)
      ↓
Presigned URL → Back to Frontend
```

---

## 🛠️ Tech Stack

### Frontend

* React(Vite)
* CSS

### Backend

* Node.js
* Express
* Multer

### Cloud & DevOps

* Vercel (Frontend Hosting)
* Render (Backend Hosting)
* AWS S3
* AWS SDK v3
* Presigned URLs
* Environment Variables

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

## ⚙️ Local Development Setup

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
* The URL expires after a fixed time (1 hour)

### This ensures:

* No public access to your bucket
* Temporary, controlled access to files
* Secure cloud storage pattern

---

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/4d131672-a7fa-4e97-8b4e-416cfc27b7e3" width="700"/>
  <br/>
  <em>① Initial state — No image selected, ready to upload</em>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/ea7dc26a-0728-44c8-baf1-60e747ff7f19" width="700"/>
  <br/>
  <em>② Local preview — Image selected and displayed before upload</em>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/446d353a-de56-4c6a-b817-43b55a2b5f47" width="700"/>
  <br/>
  <em>③ Cloud result — Image successfully uploaded and fetched via secure presigned URL</em>
</p>

---

## 🧠 What I Learned

* Designing and deploying distributed systems
* Integrating AWS S3 using AWS SDK v3
* Using presigned URLs for private file access
* Managing environment variables across platforms
* Handling CORS and cross-origin communication
* Deploying frontend and backend independently

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
