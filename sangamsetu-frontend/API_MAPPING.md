# SangamSetu - Frontend to Backend API Mapping

This document maps every frontend component/action to the exact Django backend API endpoint it calls.

---

## 🔐 Authentication Flow

### Login Component (`src/components/auth/Login.js`)

| Action | Method | Endpoint | Request Body | Expected Response |
|--------|--------|----------|--------------|-------------------|
| User login | POST | `/api/auth/login/` | `{ username, password }` | `{ access, refresh, user: { id, username, role, email, first_name, last_name } }` |

**Frontend Code:**
```javascript
// src/services/api.js
authAPI.login(username, password)
```

**Django View:**
```python
# Backend should implement:
@api_view(['POST'])
def login_view(request):
    # Authenticate user
    # Generate JWT tokens
    # Return tokens + user data
```

---

## 📊 Dashboard Component (`src/components/dashboard/Dashboard.js`)

### Statistics Loading

| Action | Method | Endpoint | Parameters | Expected Response |
|--------|--------|----------|------------|-------------------|
| Load dashboard stats | GET | `/api/stats/dashboard/` | None | `{ missing_count, found_count, match_count }` |

**Frontend Code:**
```javascript
statsAPI.getDashboardStats()
```

**Django View:**
```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    return Response({
        'missing_count': MissingPerson.objects.count(),
        'found_count': FoundPerson.objects.count(),
        'match_count': Match.objects.count()
    })
```

---

## 🔍 Missing Person Registration (`src/components/missing/MissingPersonForm.js`)

### Form Submission

| Action | Method | Endpoint | Request Body | Expected Response |
|--------|--------|----------|--------------|-------------------|
| Register missing person | POST | `/api/missing-persons/` | See below | `{ id, name, age, ... }` |

**Request Body Fields:**
```json
{
  "name": "string (required)",
  "age": "integer (required)",
  "gender": "MALE|FEMALE|OTHER (required)",
  "last_seen_location": "string (required)",
  "last_seen_date": "YYYY-MM-DD (required)",
  "description": "text (optional)",
  "clothing": "string (optional)",
  "identifying_marks": "text (optional)",
  "contact_name": "string (required)",
  "contact_phone": "string (required)",
  "contact_email": "string (optional)"
}
```

**Frontend Code:**
```javascript
missingPersonAPI.create(formData)
```

**Django Model:**
```python
class MissingPerson(models.Model):
    name = models.CharField(max_length=200)
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    last_seen_location = models.CharField(max_length=500)
    last_seen_date = models.DateField()
    description = models.TextField(blank=True)
    clothing = models.CharField(max_length=500, blank=True)
    identifying_marks = models.TextField(blank=True)
    contact_name = models.CharField(max_length=200)
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField(blank=True)
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## ✅ Found Person Registration (`src/components/found/FoundPersonForm.js`)

### Form Submission

| Action | Method | Endpoint | Request Body | Expected Response |
|--------|--------|----------|--------------|-------------------|
| Register found person | POST | `/api/found-persons/` | See below | `{ id, approximate_age, ... }` |

**Request Body Fields:**
```json
{
  "approximate_age": "integer (required)",
  "gender": "MALE|FEMALE|OTHER (required)",
  "found_location": "string (required)",
  "found_date": "YYYY-MM-DD (required)",
  "physical_description": "text (optional)",
  "clothing_description": "string (optional)",
  "distinctive_features": "text (optional)",
  "mental_state": "ALERT|CONFUSED|DISTRESSED|UNCONSCIOUS|INJURED (optional)",
  "finder_name": "string (required)",
  "finder_phone": "string (required)",
  "finder_email": "string (optional)",
  "current_location": "string (required)"
}
```

**Frontend Code:**
```javascript
foundPersonAPI.create(formData)
```

**Django Model:**
```python
class FoundPerson(models.Model):
    approximate_age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    found_location = models.CharField(max_length=500)
    found_date = models.DateField()
    physical_description = models.TextField(blank=True)
    clothing_description = models.CharField(max_length=500, blank=True)
    distinctive_features = models.TextField(blank=True)
    mental_state = models.CharField(max_length=20, choices=MENTAL_STATE_CHOICES, blank=True)
    finder_name = models.CharField(max_length=200)
    finder_phone = models.CharField(max_length=20)
    finder_email = models.EmailField(blank=True)
    current_location = models.CharField(max_length=500)
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## 🔗 Match Suggestions (`src/components/matches/MatchSuggestions.js`)

### Load Matches

| Action | Method | Endpoint | Parameters | Expected Response |
|--------|--------|----------|------------|-------------------|
| Get all matches | GET | `/api/matches/` | `status` (optional) | Array of match objects |

**Query Parameters:**
- `status`: `PENDING`, `CONFIRMED`, or `REJECTED`

**Frontend Code:**
```javascript
matchAPI.getSuggestions({ status: 'PENDING' })
```

**Expected Response:**
```json
{
  "results": [
    {
      "id": 1,
      "missing_person": {
        "id": 1,
        "name": "John Doe",
        "age": 45,
        "gender": "MALE",
        "last_seen_location": "Gate 3",
        "contact_phone": "1234567890"
      },
      "found_person": {
        "id": 2,
        "approximate_age": 45,
        "gender": "MALE",
        "found_location": "Near Gate 3",
        "current_location": "Police Station A",
        "finder_phone": "0987654321"
      },
      "confidence_score": 85.5,
      "match_reason": "Age, gender, and location match with high confidence",
      "status": "PENDING",
      "created_at": "2024-01-15T10:30:00Z",
      "confirmed_by": null,
      "confirmed_at": null
    }
  ]
}
```

### Confirm Match

| Action | Method | Endpoint | Request Body | Expected Response |
|--------|--------|----------|--------------|-------------------|
| Confirm match | POST | `/api/matches/{id}/confirm/` | None | `{ id, status: "CONFIRMED", ... }` |

**Frontend Code:**
```javascript
matchAPI.confirmMatch(matchId)
```

**Django View:**
```python
@action(detail=True, methods=['post'])
@permission_classes([IsPoliceOrAdmin])
def confirm(self, request, pk=None):
    match = self.get_object()
    match.status = 'CONFIRMED'
    match.confirmed_by = request.user
    match.confirmed_at = timezone.now()
    match.save()
    return Response(MatchSerializer(match).data)
```

### Reject Match

| Action | Method | Endpoint | Request Body | Expected Response |
|--------|--------|----------|--------------|-------------------|
| Reject match | POST | `/api/matches/{id}/reject/` | None | `{ id, status: "REJECTED", ... }` |

**Frontend Code:**
```javascript
matchAPI.rejectMatch(matchId)
```

---

## 🔄 Additional API Endpoints

### Get Current User

| Action | Method | Endpoint | Expected Response |
|--------|--------|----------|-------------------|
| Get user profile | GET | `/api/auth/user/` | `{ id, username, role, email, first_name, last_name }` |

### Logout

| Action | Method | Endpoint | Expected Response |
|--------|--------|----------|-------------------|
| Logout | POST | `/api/auth/logout/` | `{ message: "Logged out successfully" }` |

### List Missing Persons

| Action | Method | Endpoint | Expected Response |
|--------|--------|----------|-------------------|
| List all | GET | `/api/missing-persons/` | Array of missing person objects |

### List Found Persons

| Action | Method | Endpoint | Expected Response |
|--------|--------|----------|-------------------|
| List all | GET | `/api/found-persons/` | Array of found person objects |

---

## 🛡️ Authorization Headers

All authenticated requests include:
```
Authorization: Bearer <jwt_access_token>
```

This is automatically handled by the axios interceptor in `src/services/api.js`.

---

## 🚨 Error Handling

### Frontend Error Handler (in `src/services/api.js`)

```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      // Forbidden
      console.error('Access denied');
    }
    return Promise.reject(error);
  }
);
```

### Expected Backend Error Responses

```json
// 400 Bad Request
{
  "detail": "Invalid data provided",
  "errors": {
    "field_name": ["Error message"]
  }
}

// 401 Unauthorized
{
  "detail": "Authentication credentials were not provided."
}

// 403 Forbidden
{
  "detail": "You do not have permission to perform this action."
}

// 404 Not Found
{
  "detail": "Not found."
}
```

---

## 📝 Django URL Configuration Example

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('missing-persons', MissingPersonViewSet)
router.register('found-persons', FoundPersonViewSet)
router.register('matches', MatchViewSet)

urlpatterns = [
    path('api/auth/login/', login_view),
    path('api/auth/logout/', logout_view),
    path('api/auth/user/', current_user_view),
    path('api/stats/dashboard/', dashboard_stats),
    path('api/', include(router.urls)),
]
```

---

## ✅ Testing Checklist

Use this checklist to verify your Django backend:

- [ ] Login endpoint returns JWT tokens
- [ ] Login includes user object with `role` field
- [ ] CORS is configured for `localhost:3000`
- [ ] All viewsets have proper permissions
- [ ] Match confirm/reject endpoints exist
- [ ] Dashboard stats endpoint returns counts
- [ ] All endpoints return proper JSON responses
- [ ] Error responses follow consistent format
- [ ] JWT authentication is working
- [ ] Role-based permissions are enforced

---

**This completes the frontend-backend API mapping! 🎉**

Use this document as your reference when implementing the Django backend.
