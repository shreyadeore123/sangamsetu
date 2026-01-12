# SangamSetu Frontend - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd sangamsetu-frontend
npm install
```

### Step 2: Configure Backend URL
Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and set your Django backend URL:
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

### Step 3: Start the Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 🔗 Connect to Your Django Backend

### Required Backend Endpoints

Your Django backend needs these endpoints:

1. **Authentication**
   - `POST /api/auth/login/` - Returns JWT tokens
   - `POST /api/auth/logout/`
   - `GET /api/auth/user/`

2. **Missing Persons**
   - `GET/POST /api/missing-persons/`
   - `GET/PUT/DELETE /api/missing-persons/{id}/`

3. **Found Persons**
   - `GET/POST /api/found-persons/`
   - `GET/PUT/DELETE /api/found-persons/{id}/`

4. **Matches**
   - `GET /api/matches/`
   - `POST /api/matches/{id}/confirm/`
   - `POST /api/matches/{id}/reject/`

5. **Statistics**
   - `GET /api/stats/dashboard/`

### Django CORS Setup

In your Django `settings.py`:

```python
# Install: pip install django-cors-headers

INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

# For development
CORS_ALLOW_ALL_ORIGINS = True

# For production
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://yourdomain.com",
]
```

### Expected Login Response Format

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "ADMIN",
    "first_name": "Admin",
    "last_name": "User"
  }
}
```

---

## 👥 Test User Credentials

Create test users in Django with these roles:

1. **Admin User**
   - Role: `ADMIN`
   - Access: Everything

2. **Police User**
   - Role: `POLICE`
   - Access: Register cases, view/confirm matches

3. **Volunteer User**
   - Role: `VOLUNTEER`
   - Access: Register missing/found persons only

---

## 📋 Checklist Before Running

- [ ] Node.js installed (v14+)
- [ ] Django backend running
- [ ] CORS configured in Django
- [ ] `.env` file created with correct backend URL
- [ ] Test users created in Django
- [ ] All required API endpoints implemented

---

## 🐛 Common Issues

### Issue: "Network Error" on login
**Solution:** 
- Check if Django is running: `python manage.py runserver`
- Verify backend URL in `.env`
- Check Django CORS settings

### Issue: "Access Denied" after login
**Solution:**
- Check user role in Django admin
- Verify JWT token is being returned
- Check browser console for errors

### Issue: Blank page after login
**Solution:**
- Open browser console (F12)
- Check for JavaScript errors
- Verify all API endpoints are accessible

---

## 🚢 Production Deployment

### Build for Production
```bash
npm run build
```

### Using Docker
```bash
# Build image
docker build -t sangamsetu-frontend .

# Run container
docker run -p 3000:80 sangamsetu-frontend
```

### Using Docker Compose
```bash
docker-compose up -d
```

---

## 📞 Need Help?

1. Check the main README.md for detailed documentation
2. Review Django backend logs
3. Check browser console for frontend errors
4. Verify network requests in browser DevTools

---

**You're all set! 🎉**

Login with your test credentials and start using SangamSetu!
