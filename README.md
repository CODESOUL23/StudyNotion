# StudyNotion - EdTech Platform

A full-stack EdTech platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that enables instructors to create and sell courses while students can purchase and learn from them.

## 🚀 Features

### For Students
- Browse and purchase courses
- Watch video lectures with progress tracking
- Mark lectures as completed
- View enrolled courses dashboard
- Rate and review courses
- Add courses to cart

### For Instructors
- Create and publish courses
- Add sections and video lectures
- Edit existing courses
- View course analytics
- **Enroll as co-instructor** on other courses (max 2 instructors per course)
- Track student enrollments

### General
- User authentication (signup, login, OTP verification)
- Password reset functionality
- Profile management
- Responsive design with Tailwind CSS
- Cloudinary integration for media storage
- Razorpay payment integration

## 🛠️ Tech Stack

**Frontend:**
- React 18.2
- Redux Toolkit (State Management)
- Tailwind CSS
- React Router DOM
- React Hook Form
- video-react (Video Player)
- React Hot Toast (Notifications)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt (Password Hashing)
- Nodemailer (Email Service)
- Cloudinary (Media Storage)
- Razorpay (Payments)

## 📁 Project Structure

```
StudyNotion/
├── public/                 # Static files
├── server/                 # Backend
│   ├── config/            # Database, Cloudinary, Razorpay config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── mail/templates/    # Email templates
├── src/                   # Frontend
│   ├── assets/            # Images, logos
│   ├── components/        # React components
│   ├── data/              # Static data
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── reducer/           # Redux store
│   ├── services/          # API services
│   ├── slices/            # Redux slices
│   └── utils/             # Utility functions
└── package.json
```

## ⚙️ Environment Variables

Create a `.env` file in the **root directory** with the following variables:

```env
# React App
REACT_APP_BASE_URL=http://localhost:5000/api/v1
```

Create a `.env` file in the **server directory** with the following variables:

```env
# Server Port
PORT=5000

# MongoDB Connection
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=StudyNotion

# Email Configuration (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Razorpay Configuration
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account
- Razorpay account (for payments)
- Gmail account (for sending emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CODESOUL23/StudyNotion.git
   cd StudyNotion
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   - Create `.env` file in root directory
   - Create `.env` file in server directory
   - Add all required variables as shown above

5. **Start the backend server**
   ```bash
   cd server
   node index.js
   ```
   Server will run on `http://localhost:5000`

6. **Start the frontend (in a new terminal)**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

### Running Both Servers Simultaneously

You can use two terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
node index.js
```

**Terminal 2 (Frontend):**
```bash
npm start
```

## 📝 API Endpoints

### Authentication
- `POST /api/v1/user/signup` - Register new user
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/sendotp` - Send OTP for verification
- `POST /api/v1/user/changepassword` - Change password

### Courses
- `GET /api/v1/courses/showAllCourses` - Get all courses
- `POST /api/v1/courses/getCourseDetails` - Get course details
- `POST /api/v1/courses/createCourse` - Create new course (Instructor)
- `POST /api/v1/courses/editCourse` - Edit course (Instructor)
- `GET /api/v1/courses/getInstructorCourses` - Get instructor's courses
- `POST /api/v1/courses/enrollAsInstructor` - Enroll as co-instructor

### Sections & Subsections
- `POST /api/v1/courses/createSection` - Create section
- `POST /api/v1/courses/createSubSection` - Create subsection (lecture)
- `POST /api/v1/courses/updateSection` - Update section
- `POST /api/v1/courses/updateSubSection` - Update subsection

### Payments
- `POST /api/v1/payment/capturePayment` - Initiate payment
- `POST /api/v1/payment/verifyPayment` - Verify payment

### Profile
- `GET /api/v1/profile/getUserDetails` - Get user profile
- `PUT /api/v1/profile/updateProfile` - Update profile
- `GET /api/v1/profile/getEnrolledCourses` - Get enrolled courses

## 👥 User Roles

1. **Student** - Can browse, purchase, and learn from courses
2. **Instructor** - Can create courses and enroll as co-instructor
3. **Admin** - Can create categories and manage platform

## 🔐 Default Test Accounts

You can create accounts through the signup page or use the platform to:
- Sign up as a **Student** to purchase courses
- Sign up as an **Instructor** to create courses

## 📱 Screenshots

The platform includes:
- Modern dark-themed UI
- Responsive design for all devices
- Video player with progress tracking
- Course creation wizard
- Dashboard for students and instructors

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**CODESOUL23**
- GitHub: [@CODESOUL23](https://github.com/CODESOUL23)

## 🙏 Acknowledgments

- React and Tailwind CSS communities
- MongoDB Atlas for database hosting
- Cloudinary for media storage
- Razorpay for payment integration
