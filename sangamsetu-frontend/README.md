# SangamSetu Frontend

A production-ready React frontend for SangamSetu - Lost & Found Management System for large-scale public events like Kumbh Mela.

## 🚀 Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Access Control** - Support for ADMIN, POLICE, and VOLUNTEER roles
- ✅ **Missing Person Registration** - Complete form for reporting missing persons
- ✅ **Found Person Registration** - Form for reporting found persons
- ✅ **AI Match Suggestions** - View and manage AI-generated matches
- ✅ **Dashboard** - Role-based dashboard with statistics
- ✅ **Responsive Design** - Mobile-friendly interface using Tailwind CSS
- ✅ **Centralized API Service** - Clean architecture with separated concerns

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Django backend running (see backend setup)

## 🛠️ Installation

### 1. Clone or navigate to the project directory

```bash
cd sangamsetu-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update the backend API URL:

```bash
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

**Important:** Update the URL to match your Django backend server address.

### 4. Start the development server

```bash
npm start
```

The application will open at `http://localhost:3000`

## 🏗️ Project Structure

```
sangamsetu-frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login.js        # Login component
│   │   ├── common/
│   │   │   ├── Navbar.js       # Navigation bar
│   │   │   └── ProtectedRoute.js # Route protection HOC
│   │   ├── dashboard/
│   │   │   └── Dashboard.js    # Main dashboard
│   │   ├── missing/
│   │   │   └── MissingPersonForm.js
│   │   ├── found/
│   │   │   └── FoundPersonForm.js
│   │   └── matches/
│   │       └── MatchSuggestions.js
│   ├── contexts/
│   │   └── AuthContext.js      # Authentication context
│   ├── services/
│   │   └── api.js              # Centralized API service
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css
│   ├── App.js                  # Main app component with routing
│   └── index.js                # Entry point
├── .env                        # Environment variables (create from .env.example)
├── .env.example                # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Django Backend Integration

### Required Backend API Endpoints

The frontend expects the following endpoints from your Django backend:

#### Authentication
- `POST /api/auth/login/` - Login with username/password
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/user/` - Get current user details

#### Missing Persons
- `GET /api/missing-persons/` - List all missing persons
- `POST /api/missing-persons/` - Create missing person report
- `GET /api/missing-persons/{id}/` - Get single missing person
- `PUT /api/missing-persons/{id}/` - Update missing person
- `DELETE /api/missing-persons/{id}/` - Delete missing person

#### Found Persons
- `GET /api/found-persons/` - List all found persons
- `POST /api/found-persons/` - Create found person report
- `GET /api/found-persons/{id}/` - Get single found person
- `PUT /api/found-persons/{id}/` - Update found person
- `DELETE /api/found-persons/{id}/` - Delete found person

#### Matches
- `GET /api/matches/` - List match suggestions
- `GET /api/matches/{id}/` - Get single match
- `POST /api/matches/{id}/confirm/` - Confirm a match
- `POST /api/matches/{id}/reject/` - Reject a match

#### Statistics (Admin/Police only)
- `GET /api/stats/dashboard/` - Get dashboard statistics
- `GET /api/stats/reports/` - Get reports

### Backend Response Format

#### Login Response
```json
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": {
    "id": 1,
    "username": "police_user",
    "email": "user@example.com",
    "role": "POLICE",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

#### User Roles
- `ADMIN` - Full access
- `POLICE` - Can view matches, confirm/reject matches
- `VOLUNTEER` - Can register missing/found persons

### CORS Configuration

Make sure your Django backend allows requests from `http://localhost:3000`:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# Or for development
CORS_ALLOW_ALL_ORIGINS = True
```

## 👥 User Roles & Permissions

| Feature | Volunteer | Police | Admin |
|---------|-----------|--------|-------|
| Login | ✅ | ✅ | ✅ |
| View Dashboard | ✅ | ✅ | ✅ |
| Register Missing Person | ✅ | ✅ | ✅ |
| Register Found Person | ✅ | ✅ | ✅ |
| View Match Suggestions | ❌ | ✅ | ✅ |
| Confirm/Reject Matches | ❌ | ✅ | ✅ |
| View Statistics | ❌ | ✅ | ✅ |
| Admin Reports | ❌ | ❌ | ✅ |

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔒 Security Features

- JWT token-based authentication
- Tokens stored in localStorage
- Automatic token attachment to API requests
- Auto-redirect on 401 (Unauthorized)
- Role-based route protection
- Secure logout with token cleanup

## 🚀 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run

```bash
docker build -t sangamsetu-frontend .
docker run -p 3000:80 sangamsetu-frontend
```

## 🧪 Testing

```bash
npm test
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Django backend API URL | `http://localhost:8000/api` |
| `REACT_APP_ENV` | Environment (development/production) | `development` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is part of the SangamSetu system.

## 🆘 Troubleshooting

### "Network Error" when logging in
- Ensure Django backend is running
- Check `REACT_APP_API_BASE_URL` in `.env`
- Verify CORS is configured in Django

### "Access Denied" message
- Check user role in database
- Verify JWT token is valid
- Ensure role-based permissions are set correctly in backend

### Blank page after login
- Check browser console for errors
- Verify all API endpoints are accessible
- Check network tab for failed requests

## 📞 Support

For issues or questions, please refer to the main SangamSetu documentation or contact the development team.

---

**Built with ❤️ for Kumbh Mela and large-scale public events**
