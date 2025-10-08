#  MealMatch Auth API Documentation

## To run

```
npm run dev
```

---

##  Base URL

```
http://localhost:3000
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
  const res = await fetch("http://localhost:3000/api/register", {
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
  const res = await fetch("http://localhost:3000/api/login", {
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