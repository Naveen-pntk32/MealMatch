import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  ArrowLeftIcon, 
  StarIcon, 
  MapPinIcon, 
  ClockIcon,
  ChefHatIcon,
  CalendarIcon,
  CheckCircleIcon
} from 'lucide-react';
import axios from 'axios';

const CookProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [cook, setCook] = useState(null);
  const [monthlyMenu, setMonthlyMenu] = useState([]);
  const [price, setPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // ✅ Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // ✅ Fetch cook + menu data
  useEffect(() => {
    const fetchCookData = async () => {
      try {
        setIsLoading(true);

        const cookRes = await axios.get(`http://localhost:3000/api/register/user/${id}`);
        setCook(cookRes.data);

        const menuRes = await axios.get(`http://localhost:3000/api/addfood/${id}`);
        const menuData = menuRes.data.menu;

        // Extract price
        setPrice(menuData.monthlyPrice);

        const formattedMenu = Object.entries(menuData)
          .filter(([key]) =>
            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(key)
          )
          .map(([day, dishName]) => ({ day, dishName }));

        setMonthlyMenu(formattedMenu);
      } catch (error) {
        console.error("Error fetching cook data:", error);
        toast({
          title: "Error",
          description: "Failed to load cook details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCookData();
  }, [id, toast]);

  // ✅ Handle Razorpay payment
  const handleSubscribe = async (amt) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to subscribe to a cook',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    if (user.role !== 'STUDENT') {
      toast({
        title: 'Access Denied',
        description: 'Only students can subscribe to cooks',
        variant: 'destructive'
      });
      return;
    }

    if (!scriptLoaded || !window.Razorpay) {
      toast({
        title: 'Razorpay Not Loaded',
        description: 'Please wait for Razorpay script to load',
        variant: 'destructive'
      });
      return;
    }

    const studentId = await localStorage.getItem('uid');
     
    if (studentId ) {
      const check = await fetch(`http://localhost:3000/api/subscribe/check/${studentId}`);
      const checkData = await check.json();
      if (checkData.check) {
        toast({
          title: 'Already Subscribed',
          description: 'You already have an active subscription',
          variant: 'destructive'
        });
        return;
      }
    }

    setIsSubscribing(true);
    try {
      const orderRes = await axios.post('https://razorpay-project.onrender.com/create-order', {
        amount: amt * 100
      });

      const keyRes = await axios.get('https://razorpay-project.onrender.com/get-key');
      const { key } = keyRes.data;
      const { order } = orderRes.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'MealMatch',
        description: `Subscribe to ${cook.name}`,
        order_id: order.id,


        handler: async function (response) {
  try {
    console.log("✅ Payment Successful!");
    console.log("Payment ID:", response.razorpay_payment_id);
    console.log("Order ID:", response.razorpay_order_id);
    console.log("Signature:", response.razorpay_signature);

    toast({
      title: "Payment Successful!",
      description: `You have successfully subscribed to ${cook.name}`,
    });

    // Step 1️⃣: Log the transaction to Razorpay backend
    await axios.post("https://razorpay-project.onrender.com/pay-orders", {
      cookId: cook.id,
      userId: user.id,
      amount: order.amount / 100, // convert from paise to ₹
      razorpayPaymentId: response.razorpay_payment_id,
      razorpayOrderId: response.razorpay_order_id,
      razorpaySignature: response.razorpay_signature,
    });

    // Step 2️⃣: Add subscription entry in main backend
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

  //  try {
const res = await fetch("http://localhost:3000/api/subscribe", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    cookId: "68fb403bd6b0ee1e50f4e7ca",
    studentId: "                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ",
    planType: "MONTHLY", // ✅ Fixed: must be uppercase
    startDate: today.toISOString(),
    endDate: nextMonth.toISOString(),
    transactions: [
      {
        transactionId: response.razorpay_payment_id,
        date: new Date().toISOString(),
      },
    ],
  }),
});


  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Subscription creation failed");
  }

  const data = await res.json();
  console.log("✅ Subscription created:", data);

  // Optional: show toast or redirect
  toast({
    title: "Subscription Created",
    description: `You have successfully subscribed to ${cook.name}`,
  });
  // navigate("/student/dashboard");

// } catch (error) {
//   console.error("❌ Error creating subscription:", error);
//   toast({
//     title: "Error",
//     description: "Failed to create subscription. Please try again.",
//     variant: "destructive",
//   });
// }


    console.log("✅ Subscription created and transaction logged.");
    navigate("/student/dashboard");
  } catch (error) {
    console.error("Error while logging transaction or creating subscription:", error);
    toast({
      title: "Error",
      description: "Payment succeeded but failed to log details. Please contact support.",
      variant: "destructive",
    });
  }
},

        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobileNumber,
        },
        theme: { color: '#28b26f' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment Error:', error);
      toast({
        title: 'Payment Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Loading cook details...</p>
      </div>
    );
  }

  if (!cook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cook Not Found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <img className="w-8 h-8" alt="MealMatch Logo" src="/figmaAssets/frame.svg" />
            <h1 className="text-xl font-bold text-[#28b26f]">MealMatch</h1>
          </div>
          {user ? (
            <Button variant="outline" onClick={() => {
              const dashboardPath = user.role === 'STUDENT' ? '/student/dashboard' : '/cook/dashboard';
              navigate(dashboardPath);
            }}>
              Dashboard
            </Button>
          ) : (
            <Link to="/login"><Button variant="outline">Login</Button></Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={cook.profileImage} alt={cook.name} />
                <AvatarFallback className="text-2xl">{cook.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl text-gray-800">{cook.name}</CardTitle>
              <div className="flex items-center justify-center gap-2 mt-2">
                <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{cook.rating}</span>
              </div>
              <Badge className={`mt-3 ${cook.isVeg ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {cook.isVeg ? 'Pure Vegetarian' : 'Veg & Non-Veg'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#28b26f] mb-2">₹{price}</p>
                <p className="text-gray-600 mb-4">per month</p>
                <Button
                  onClick={() => handleSubscribe(price)}
                  disabled={isSubscribing}
                  className="w-full bg-[#28b26f] hover:bg-[#28b26f]/90 h-12 text-white font-semibold"
                >
                  {isSubscribing ? "Processing..." : "Subscribe Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Section */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <CalendarIcon className="w-6 h-6 text-[#28b26f]" />
                <CardTitle className="text-2xl">Weekly Menu</CardTitle>
              </div>
              <p className="text-gray-600">Fresh meals prepared daily</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {monthlyMenu.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#28b26f] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#28b26f] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{meal.day.substring(0,3)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{meal.day}</p>
                        <p className="text-gray-600">{meal.dishName}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[#28b26f] border-[#28b26f]">Fresh</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CookProfilePage;
