import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import ProfileEditForm from './sections/ProfileEditForm';
import MenuManagement from './sections/MenuManagement';
import { 
  ArrowLeftIcon, 
  StarIcon, 
  MapPinIcon, 
  ClockIcon,
  ChefHatIcon,
  CalendarIcon,
  CheckCircleIcon,
  PencilIcon
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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  
  const isOwnProfile = user && (user._id === id || (!id && user.role === 'COOK'));

  // If no ID provided and user is a cook, use their own ID
  useEffect(() => {
    if (!id && user?.role === 'COOK') {
      navigate(`/cook/${user._id}`);
    }
  }, [user, id]);

  // ✅ Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const fetchCookData = async () => {
    try {
      if (!id) return;
      setIsLoading(true);
      const cookRes = await axios.get(`http://localhost:3000/api/register/user/${id}`);
      if (!cookRes.data || cookRes.data.message === 'User not found') {
        setCook(null);
        setIsLoading(false);
        toast({
          title: "Cook Not Found",
          description: "Cook profile not found. Please contact support.",
          variant: "destructive",
        });
        return;
      }
      setCook(cookRes.data);

      const menuRes = await axios.get(`http://localhost:3000/api/addfood/${id}`);
      const menuData = menuRes.data.menu;

      // Extract price
      setPrice(menuData.monthlyPrice);

      const formattedMenu = Object.entries(menuData)
        .filter(([key]) =>
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(key)
        )
        .map(([day, item]) => ({
          day,
          dish: item.dish || item, // Support both new and old format
          description: item.description || '' // Add description, default to empty string
        }));

      setMonthlyMenu(formattedMenu);
      // If this is the cook's own profile, fetch subscribers
      if (isOwnProfile) {
        await fetchSubscriptions(user._id);
      }
    } catch (error) {
      setCook(null);
      toast({
        title: "Error",
        description: "Failed to load cook details. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscriptions = async (cookId) => {
    try {
      setSubsLoading(true);
      const res = await fetch(`http://localhost:3000/api/subscribe/cook/${user._id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribers(data.subscriptions || []);
      } else {
        console.error('Failed to load subscriptions', data);
        setSubscribers([]);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setSubscribers([]);
    } finally {
      setSubsLoading(false);
    }
  };

  // ✅ Fetch cook + menu data
  useEffect(() => {
    fetchCookData();
  }, [id, toast, user]); // Add user dependency to refresh when login state changes

  // Only fetch data when necessary props change
  useEffect(() => {
    fetchCookData();
  }, [id, user]);

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

    // Use user._id and cook._id for MongoDB ObjectIds
    const studentId = user?._id;
    const cookId = cook?._id;
    if (!studentId || !cookId) {
      toast({
        title: 'Error',
        description: 'Invalid user or cook ID. Please try again.',
        variant: 'destructive'
      });
      return;
    }
    // Check if already subscribed
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
    // console.log("Payment ID:", response.razorpay_payment_id);
    // console.log("Order ID:", response.razorpay_order_id);
    // console.log("Signature:", response.razorpay_signature);

    toast({
      title: "Payment Successful!",
      description: `You have successfully subscribed to ${cook.name}`,
    });

    // Step 1️⃣: Log the transaction to Razorpay backend
    await axios.post("https://razorpay-project.onrender.com/pay-orders", {
      cookId: cookId,
      userId: studentId,
      amount: order.amount / 100, // convert from paise to ₹
      razorpayPaymentId: response.razorpay_payment_id,
      razorpayOrderId: response.razorpay_order_id,
      razorpaySignature: response.razorpay_signature,
    });

    // Step 2️⃣: Add subscription entry in main backend
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const res = await fetch("http://localhost:3000/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cookId: cookId,
        studentId: studentId,
        planType: "MONTHLY",
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
  // console.log("✅ Subscription created:", data);

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


    // console.log("✅ Subscription created and transaction logged.");
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
        <p className="text-lg font-medium text-red-600">Cook profile not found. Please contact support.</p>
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
          <div className="sticky top-8">
          <Card className="z-20 bg-white">
            {isEditingProfile && isOwnProfile ? (
              <ProfileEditForm 
                profile={cook} 
                onSave={(updatedProfile) => {
                  if (updatedProfile) {
                    setCook(updatedProfile);
                  }
                  setIsEditingProfile(false);
                }}
              />
            ) : (
              <CardHeader className="text-center relative">
                {isOwnProfile && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )}
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
            )}
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#28b26f] mb-2">₹{price}</p>
                <p className="text-gray-600 mb-4">per month</p>
                {!isOwnProfile && user?.role === 'STUDENT' && (
                  <Button
                    onClick={() => handleSubscribe(price)}
                    disabled={isSubscribing}
                    className="w-full bg-[#28b26f] hover:bg-[#28b26f]/90 h-12 text-white font-semibold"
                  >
                    {isSubscribing ? "Processing..." : "Subscribe Now"}
                  </Button>
                )}
                {isOwnProfile && (
                  <div className="text-sm text-gray-600 mt-2">
                    This is your profile view. Students can subscribe to your meal service from here.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Subscribers (only visible to cook on their own profile) */}
          {isOwnProfile && (
            <Card className="mt-6 bg-white">
              <CardHeader>
                <CardTitle>Subscribers ({subscribers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {subsLoading ? (
                  <p className="text-sm text-gray-500">Loading subscribers...</p>
                ) : subscribers.length === 0 ? (
                  <p className="text-sm text-gray-500">No subscribers yet</p>
                ) : (
                  <ul className="space-y-3">
                    {subscribers.map((sub) => (
                      <li key={sub._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{sub.studentId?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{sub.studentId?.email}</p>
                        </div>
                        <Badge variant="outline" className="text-[#28b26f]">{sub.status}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
          </div>
        </div>

        {/* Menu Section */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-6 h-6 text-[#28b26f]" />
                  <CardTitle className="text-2xl">Weekly Menu</CardTitle>
                </div>
                {isOwnProfile && !isEditingMenu && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsEditingMenu(true)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-gray-600">Fresh meals prepared daily</p>
            </CardHeader>
            <CardContent>
              {isEditingMenu && isOwnProfile ? (
                <MenuManagement 
                  cookId={id}
                  initialMenu={{
                    ...monthlyMenu.reduce((acc, meal) => {
                      acc[meal.day] = {
                        dish: meal.dish,
                        description: meal.description
                      };
                      return acc;
                    }, {}),
                    monthlyPrice: price
                  }}
                  onSave={async () => {
                    await fetchCookData(); // Refresh data first
                    setIsEditingMenu(false); // Then close the edit mode
                  }}
                  onCancel={() => setIsEditingMenu(false)}
                />
              ) : (
                <div className="grid gap-4">
                  {monthlyMenu.map((meal, index) => (
                    <div key={index} className="flex flex-col rounded-lg border border-gray-200 hover:border-[#28b26f] transition-colors">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#28b26f] rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{meal.day.substring(0,3)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{meal.day}</p>
                            <p className="text-gray-600">{meal.dish}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[#28b26f] border-[#28b26f]">Fresh</Badge>
                      </div>
                      {meal.description && (
                        <div className="px-6 pb-4">
                          <p className="text-sm text-gray-600 whitespace-pre-line">{meal.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CookProfilePage;
