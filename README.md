# 📱 Mini Social Post Application

A full-stack social media application inspired by TaskPlanet, where users can create accounts, share posts with text and images, and engage through likes and comments.

![Made with React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Material-UI](https://img.shields.io/badge/UI-Material_UI-007FFF?logo=mui)

## ✨ Features

- 🔐 **User Authentication** - Secure signup and login with JWT
- 📝 **Create Posts** - Share text, images, or both
- 📰 **Public Feed** - View all posts from all users in real-time
- ❤️ **Like System** - Like and unlike posts with instant feedback
- 💬 **Comments** - Add comments and view latest 2 comments per post
- �️ **View More Comments** - Expand to see all comments on any post
- 📊 **Sort Posts** - Sort by Recent, Most Liked, or Most Commented
- 🔒 **Password Visibility** - Toggle password visibility in auth forms
- ✅ **Form Validation** - Real-time Zod validation with clear error messages
- �🗑️ **Delete Posts** - Remove your own posts
- 📱 **Responsive Design** - Clean, minimalistic UI that works on all devices

## 🎯 Demo

**Key Functionalities:**
- Either text OR image is required (not both mandatory)
- Latest 2 comments displayed below each post
- Like count and comment count visible
- User can delete only their own posts
- Real-time UI updates on all interactions

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool for faster development
- **Material-UI (MUI)** - Component library for polished UI
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **Zod** - Schema validation

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud-based media storage
- **Zod** - Schema validation

## 📁 Project Structure

```
socialApp/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Post.js              # Post schema with likes & comments
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── posts.js             # Post CRUD operations
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── config/
│   │   └── cloudinary.js        # Cloudinary configuration
│   ├── uploads/                 # (Legacy - now using Cloudinary)
│   ├── server.js                # Express server setup
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── api.js           # Axios API calls
    │   ├── components/
    │   │   ├── CreatePost.jsx   # Post creation form
    │   │   ├── PostCard.jsx     # Post display component
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Auth state management
    │   ├── pages/
    │   │   ├── Feed.jsx         # Main feed page
    │   │   ├── Login.jsx        # Login page
    │   │   └── Signup.jsx       # Signup page
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd socialApp
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

npm run dev
```

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Environment Variables

Create a `.env` file in the `backend` folder:

```env
MONGODB_URI=mongodb://localhost:27017/socialapp
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
NODE_ENV=development

# Cloudinary Configuration (Get these from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Setting up Cloudinary:**
1. Sign up for a free account at [Cloudinary](https://cloudinary.com)
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your `.env` file

## 📖 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |

### Posts
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all posts | No |
| POST | `/api/posts` | Create new post | Yes |
| POST | `/api/posts/:id/like` | Like/unlike post | Yes |
| POST | `/api/posts/:id/comment` | Add comment | Yes |
| DELETE | `/api/posts/:id` | Delete post | Yes |

## 🎨 UI Design

The UI is inspired by the TaskPlanet social feed with:
- Clean, minimalistic design
- Card-based layout for posts
- Material Design principles
- Smooth interactions and transitions
- Responsive grid system

## 📝 Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Use your credentials to access the feed
3. **Create Post**: Click on the post creation area, add text/image
4. **Interact**: Like posts by clicking the heart icon, add comments
5. **Manage**: Delete your own posts using the delete icon

## 🏆 Bonus Features Implemented

✅ Clean and modern UI with Material-UI  
✅ Fully responsive layout  
✅ Efficient code structure with reusable components  
✅ Comprehensive error handling  
✅ Loading states for better UX  
✅ Form validation  
✅ Real-time UI updates  
✅ Code comments and documentation  

## 🔒 Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Protected API routes
- Input validation on both frontend and backend
- File upload size limits (5MB)
- Image type validation

## 🚧 Future Enhancements

- [ ] Pagination for posts
- [ ] User profiles
- [ ] Follow/Unfollow system
- [ ] Real-time notifications
- [ ] Image optimization
- [ ] Search functionality
- [ ] Post editing
- [ ] Dark mode

## 📚 Learning Outcomes

This project demonstrates proficiency in:
- Full-stack JavaScript development
- RESTful API design
- MongoDB database modeling
- React hooks and Context API
- JWT authentication implementation
- File upload handling
- Material-UI component library
- Responsive web design

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built as an internship project to demonstrate full-stack development skills.

---

**⭐ If you found this project helpful, please give it a star!**
