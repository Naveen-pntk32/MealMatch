#  MealMatch Auth API Documentation

## To run

```
npm run dev
```

---

##  Base URL

```
https://mealmatch-fj6j.onrender.com
```

---

##  Register API

**Endpoint:**

```
POST /api/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "password": "test1234",
  "role": "CONSUMER",
  "foodPreference": "Vegetarian",
  "locationName": "Chennai",
  "locationLatitude": 13.0827,
  "locationLongitude": 80.2707,
  "email": "john@example.com",
  "mobileNumber": "9876543210"
}
```

**Sample Fetch Code:**

```js
async function registerUser() {
  const res = await fetch("https://mealmatch-fj6j.onrender.com/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "John Doe",
      password: "test1234",
      role: "CONSUMER",
      foodPreference: "Vegetarian",
      locationName: "Chennai",
      locationLatitude: 13.0827,
      locationLongitude: 80.2707,
      email: "john@example.com",
      mobileNumber: "9876543210"
    })
  });

  const data = await res.json();
  console.log("Register response:", data);
}
```

---

##  Login API

**Endpoint:**

```
POST /api/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "test1234"
}
```

**Sample Fetch Code:**

```js
async function loginUser() {
  const res = await fetch("https://mealmatch-fj6j.onrender.com/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", // required for cookies
    body: JSON.stringify({
      email: "john@example.com",
      password: "test1234"
    })
  });

  const text = await res.text();
  console.log("Login response:", text);
}
```

---

##  Required `.env` Variables

```env
PORT=3000
MONGO_URL=connecting-url
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=1d
```

>  Replace `MONGO_URL` with your actual MongoDB connection string.

---

##  Notes

- Use `credentials: "include"` to support cookie-based authentication.
- After successful login, a cookie named `token` will be set.
- Use HTTPS and `secure: true` in cookies for production.

---

## TO get the userdata for reference

```
GET /api/register/user
```
---

## TO get the nearby cook details

```
POST /api/nearByCook
```
# sample request body

```json
{
  lat : 12.63, 
  lon : 12.6543,
  radius : 5000 // in meter
}
```
---


### sample user data
# cook

```
  {
  "name": "Priya Kitchen",
  "password": "cook@123",
  "role": "COOK",
  "foodPreference": "NONVEG",
  "locationName": "Tambaram, Chennai",
  "locationLatitude": 12.9246,
  "locationLongitude": 80.1275,
  "email": "priya@kitchen.com",
  "mobileNumber": 9123456789
}

```

# student
```
{
  "name": "John Doe",
  "password": "test1234",
  "role": "STUDENT",
  "foodPreference": "VEG",
  "locationName": "Chennai",
  "locationLatitude": 13.0827,
  "locationLongitude": 80.2707,
  "email": "john@example.com",
  "mobileNumber": 9876543210
}

```



```

curl -X POST http://localhost:5000/api/addfood \
-H "Content-Type: application/json" \
-d '{
  "cookId": ""68fa2f77742940be0abd88cc"",
  "menuItems": [
    {"day": "Monday", "dishName": "Chicken Biryani"},
    {"day": "Tuesday", "dishName": "Fish Curry with Rice"},
    {"day": "Wednesday", "dishName": "Paneer Butter Masala"},
    {"day": "Thursday", "dishName": "Egg Fried Rice"},
    {"day": "Friday", "dishName": "Mutton Curry with Parotta"},
    {"day": "Saturday", "dishName": "Vegetable Pulao"},
    {"day": "Sunday", "dishName": "Lemon Rice and Potato Fry"}
  ]
}'
```

```
curl -X POST http://localhost:5000/api/subscribe \
-H "Content-Type: application/json" \
-d '{
  "cookId": "68fa2f77742940be0abd88cc",
  "studentId": "68fa2f56742940be0abd88c9",
  "planType": "weekly",
  "startDate": "2025-10-23",
  "endDate": "2025-10-30",
  "transactions": [
    { "transactionId": "txn001", "date": "2025-10-23" }
  ]
}'

```

```
curl -X GET http://localhost:5000/api/subscribe/student/68fa2f56742940be0abd88c9
```

```
curl -X GET http://localhost:5000/api/subscribe/cook/68fa2f77742940be0abd88cc

```