// Mock data for MealMatch - Monthly meal subscription service
// TODO: API Integration - Replace this mock data with actual API calls

export const cooks = [
  {
    id: 1,
    name: "Priya Raman",
    specialty: "Authentic Kongu Cuisine",
    isVeg: true,
    rating: 4.8,
    profileImage: "",
    address: "R.S. Puram, Coimbatore",
    monthlyMenu: [
      { day: "Monday", dish: "Arisi Upma with Coconut Chutney" },
      { day: "Tuesday", dish: "Ragi Mudde with Sambar" },
      { day: "Wednesday", dish: "Kongu Special Biryani" },
      { day: "Thursday", dish: "Kambu Koozh with Spicy Curry" },
      { day: "Friday", dish: "Traditional Thali with 5 Varieties" },
      { day: "Saturday", dish: "Oats Idli with Mint Chutney" },
      { day: "Sunday", dish: "Special Kongu Chicken Curry" }
    ],
    monthlyPrice: 3500,
    reviews: [
      { name: "Rahul Kumar", rating: 5, comment: "Amazing authentic flavors! Reminds me of home-cooked meals." },
      { name: "Sneha Iyer", rating: 4, comment: "Great variety and always fresh. Highly recommend!" },
      { name: "Arjun Patel", rating: 5, comment: "Best Kongu cuisine in Coimbatore. Worth every rupee!" }
    ]
  },
  {
    id: 2,
    name: "Lakshmi Sundaram",
    specialty: "Traditional South Indian",
    isVeg: true,
    rating: 4.6,
    profileImage: "",
    address: "Saibaba Colony, Coimbatore",
    monthlyMenu: [
      { day: "Monday", dish: "Masala Dosa with Sambar & Chutney" },
      { day: "Tuesday", dish: "Curd Rice with Pickle" },
      { day: "Wednesday", dish: "Vegetable Biryani" },
      { day: "Thursday", dish: "Rasam Rice with Papad" },
      { day: "Friday", dish: "Special South Indian Thali" },
      { day: "Saturday", dish: "Pongal with Vada" },
      { day: "Sunday", dish: "Coconut Rice with Curry" }
    ],
    monthlyPrice: 3200,
    reviews: [
      { name: "Meera Krishnan", rating: 5, comment: "Perfect traditional taste. Like my grandmother's cooking!" },
      { name: "Suresh Nair", rating: 4, comment: "Consistent quality and authentic flavors." },
      { name: "Divya Raj", rating: 5, comment: "Excellent service and delicious food every day!" }
    ]
  },
  {
    id: 3,
    name: "Kamala Devi",
    specialty: "Mixed Veg & Non-Veg",
    isVeg: false,
    rating: 4.7,
    profileImage: "",
    address: "Gandhipuram, Coimbatore",
    monthlyMenu: [
      { day: "Monday", dish: "Chicken Curry with Rice" },
      { day: "Tuesday", dish: "Vegetable Sambar Rice" },
      { day: "Wednesday", dish: "Mutton Biryani" },
      { day: "Thursday", dish: "Fish Curry with Appam" },
      { day: "Friday", dish: "Mixed Thali (Veg & Non-Veg)" },
      { day: "Saturday", dish: "Prawn Masala with Rice" },
      { day: "Sunday", dish: "Special Chicken Biryani" }
    ],
    monthlyPrice: 4200,
    reviews: [
      { name: "Vikram Singh", rating: 5, comment: "Great variety! Both veg and non-veg options are excellent." },
      { name: "Anita Sharma", rating: 4, comment: "Fresh ingredients and perfect spice levels." },
      { name: "Karthik Menon", rating: 5, comment: "Best mixed cuisine cook in the area!" }
    ]
  },
  {
    id: 4,
    name: "Radha Krishnan",
    specialty: "Healthy & Nutritious Meals",
    isVeg: true,
    rating: 4.9,
    profileImage: "",
    address: "Peelamedu, Coimbatore",
    monthlyMenu: [
      { day: "Monday", dish: "Quinoa Upma with Vegetables" },
      { day: "Tuesday", dish: "Millet Porridge with Nuts" },
      { day: "Wednesday", dish: "Brown Rice Biryani" },
      { day: "Thursday", dish: "Oats Idiyappam with Dal" },
      { day: "Friday", dish: "Multi-grain Roti with Curry" },
      { day: "Saturday", dish: "Sprouts Salad with Soup" },
      { day: "Sunday", dish: "Special Healthy Thali" }
    ],
    monthlyPrice: 3800,
    reviews: [
      { name: "Dr. Priya Menon", rating: 5, comment: "Perfect for health-conscious students. Nutritious and tasty!" },
      { name: "Ravi Gopal", rating: 5, comment: "Helped me maintain a healthy diet during studies." },
      { name: "Nitya Lal", rating: 4, comment: "Great for fitness enthusiasts. Fresh and healthy options." }
    ]
  }
];

// Mock user data for authentication simulation
export const mockUsers = {
  students: [
    { id: 1, email: "rahul@student.com", password: "password123", name: "Rahul Kumar", subscribedTo: 1 },
    { id: 2, email: "sneha@student.com", password: "password123", name: "Sneha Iyer", subscribedTo: 2 },
    { id: 3, email: "arjun@student.com", password: "password123", name: "Arjun Patel", subscribedTo: null }
  ],
  cooks: [
    { id: 1, email: "priya@cook.com", password: "password123", name: "Priya Raman", cookId: 1 },
    { id: 2, email: "lakshmi@cook.com", password: "password123", name: "Lakshmi Sundaram", cookId: 2 },
    { id: 3, email: "kamala@cook.com", password: "password123", name: "Kamala Devi", cookId: 3 },
    { id: 4, email: "radha@cook.com", password: "password123", name: "Radha Krishnan", cookId: 4 }
  ]
};

// Mock subscription data
export const mockSubscriptions = [
  { 
    id: 1, 
    studentId: 1, 
    cookId: 1, 
    status: "active", 
    startDate: "2024-01-01", 
    nextDelivery: "Today at 12:30 PM",
    trackingStatus: "Your lunch from Priya's Kitchen is on its way!"
  },
  { 
    id: 2, 
    studentId: 2, 
    cookId: 2, 
    status: "active", 
    startDate: "2024-01-15", 
    nextDelivery: "Tomorrow at 1:00 PM",
    trackingStatus: "Order confirmed - preparing your meal"
  }
];

// Mock notifications for cooks
export const mockNotifications = [
  { id: 1, cookId: 1, message: "Rahul has just subscribed!", timestamp: "2 minutes ago", type: "subscription" },
  { id: 2, cookId: 1, message: "New review from Sneha Iyer", timestamp: "1 hour ago", type: "review" },
  { id: 3, cookId: 2, message: "Payment received from Arjun", timestamp: "3 hours ago", type: "payment" },
  { id: 4, cookId: 3, message: "Meera wants to subscribe", timestamp: "5 hours ago", type: "inquiry" }
];

// Helper functions for mock data operations
export const getCookById = (id) => {
  return cooks?.find(cook => cook.id === parseInt(id));
};

export const getSubscriptionByStudentId = (studentId) => {
  return mockSubscriptions.find(sub => sub.studentId === parseInt(studentId));
};

export const getStudentsByCoooklId = (cookId) => {
  const activeSubscriptions = mockSubscriptions.filter(sub => sub.cookId === parseInt(cookId));
  return activeSubscriptions.map(sub => {
    const student = mockUsers.students.find(s => s.id === sub.studentId);
    return { ...student, subscriptionStatus: sub.status };
  });
};

export const getNotificationsByCookId = (cookId) => {
  return mockNotifications.filter(notification => notification.cookId === parseInt(cookId));
};