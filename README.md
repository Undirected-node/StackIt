# 🚀 Full Stack Realtime Chat Application


## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Setup](#️-environment-setup)
- [🔧 Installation](#-installation)
- [📱 Usage](#-usage)
- [🏗️ Project Structure](#️-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication** - Secure user authentication with JSON Web Tokens
- **Protected Routes** - Client and server-side route protection
- **Password Encryption** - Secure password hashing with bcrypt
- **Input Validation** - Comprehensive form validation and sanitization

### 💬 Real-time Communication
- **Instant Messaging** - Real-time message delivery with Socket.io
- **Online Status** - Live user presence indicators
- **Typing Indicators** - See when someone is typing
- **Message Status** - Delivered and read receipts
- **File Sharing** - Image and file upload capabilities

### 🎨 User Experience
- **Responsive Design** - Mobile-first responsive layout
- **Dark/Light Theme** - Toggle between themes
- **Modern UI** - Clean interface with TailwindCSS + Daisy UI
- **Loading States** - Skeleton loaders and loading indicators
- **Error Handling** - Graceful error handling and user feedback

### 🔧 Technical Features
- **Global State Management** - Efficient state handling with Zustand
- **Optimistic Updates** - Smooth user experience with optimistic UI updates
- **Image Optimization** - Cloudinary integration for image handling
- **Cross-platform** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Daisy UI** - Beautiful component library
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token for authentication

### Cloud Services
- **Cloudinary** - Image and video management
- **MongoDB Atlas** - Cloud database service
- **Render/Vercel** - Deployment platforms

## 📸 Screenshots

<div align="center">

### 🏠 Home Page
![Home Page](/frontend/public/homepage.png)

### 👤 Profile Settings
![Profile Settings](/frontend/public/profilepage.png)

</div>

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Git**

### One-Command Setup

```bash
# Clone and setup the project
git clone https://github.com/DebuggingDork/chat-application.git
cd chat-application
npm run setup
```

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/chatapp
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 🔑 Getting Your Environment Variables

1. **MongoDB URI**:
   - Local: `mongodb://localhost:27017/chatapp`
   - Atlas: Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)

2. **Cloudinary Credentials**:
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Get your cloud name, API key, and API secret from the dashboard

3. **JWT Secret**:
   - Generate a secure random string: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## 🔧 Installation

### Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/DebuggingDork/chat-application.git
cd chat-application

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd frontend
npm install
cd ..

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# 5. Seed the database (optional)
npm run seed

# 6. Start development servers
npm run dev
```

### Production Build

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

## 📱 Usage

### Development Mode

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
npm run server    # Backend only (http://localhost:5001)
npm run client    # Frontend only (http://localhost:5173)
```

### Available Scripts

```bash
npm run dev          # Start development servers
npm run build  _________      # Build for production
npm start      _________      # Start production server
npm run server       # Start backend only
npm run client       # Start frontend only
npm run seed         # Seed database with sample data
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Default Credentials

After seeding the database, you can use these test accounts:

```
Email: john@example.com
Password: 123456

Email: jane@example.com  
Password: 123456
```

## 🏗️ Project Structure

```
chat-application/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Route controllers
│   │   ├── 📁 middleware/      # Custom middleware
│   │   ├── 📁 models/          # Database models
│   │   ├── 📁 routes/          # API routes
│   │   ├── 📁 lib/             # Utility libraries
│   │   └── 📄 index.js         # Server entry point
│   ├── 📄 package.json
│   └── 📄 .env
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   ├── 📁 pages/           # Page components
│   │   ├── 📁 store/           # Zustand stores
│   │   ├── 📁 lib/             # Utility functions
│   │   ├── 📄 App.jsx          # Main App component
│   │   └── 📄 main.jsx         # React entry point
│   ├── 📄 package.json
│   ├── 📄 tailwind.config.js
│   └── 📄 vite.config.js
├── 📄 package.json              # Root package.json
├── 📄 README.md
└── 📄 LICENSE
```

## 🚀 Deployment

### Deploy to Render

1. **Backend Deployment**:
   - Connect your GitHub repository to Render
   - Set environment variables in Render dashboard
   - Deploy as a Web Service

2. **Frontend Deployment**:  
   - Deploy to Vercel or Netlify
   - Update API endpoints to point to your backend URL

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style

- Use ESLint configuration provided
- Follow conventional commit messages
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🌟 Show Your Support

If you found this project helpful, please give it a ⭐️!

**Made with ❤️ by [Mamidala Mani](https://github.com/DebuggingDork)**

[🐛 Report Bug](https://github.com/DebuggingDork/chat-application/issues) • [✨ Request Feature](https://github.com/DebuggingDork/chat-application/issues) • [💬 Ask Question](https://github.com/DebuggingDork/chat-application/discussions)

</div>#   T e a m - 4 2 3 0  
 