// Cook Profile Page - Display cook details and monthly menu with Razorpay
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

// TODO: API Integration - Replace with real API calls
import { getCookById } from '../mockData';
import axios from 'axios';

const CookProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // TODO: API Integration - Fetch cook data from backend
  const cook = getCookById(id);

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

  const handleSubscribe = async (amt) => {
    // if (!user) {
    //   toast({
    //     title: 'Login Required',
    //     description: 'Please login to subscribe to a cook',
    //     variant: 'destructive'
    //   });
    //   navigate('/login');
    //   return;
    // }

    // if (user.role !== 'STUDENT') {
    //   toast({
    //     title: 'Access Denied',
    //     description: 'Only students can subscribe to cooks',
    //     variant: 'destructive'
    //   });
    //   return;
    // }

    if (!scriptLoaded || !window.Razorpay) {
      toast({
        title: 'Razorpay Not Loaded',
        description: 'Please wait for Razorpay script to load',
        variant: 'destructive'
      });
      return;
    }

    setIsSubscribing(true);

    try {
      // 1️⃣ Create order on backend
      const orderRes = await axios.post('https://razorpay-project.onrender.com/create-order', {
        amount: amt * 100 // Convert ₹ to paise
      });

      const keyRes = await axios.get('https://razorpay-project.onrender.com/get-key');
      const { key } = keyRes.data;
      const { order } = orderRes.data;

      // 2️⃣ Razorpay options
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'MealMatch',
        description: `Subscribe to ${cook.name}`,
        order_id: order.id,
        handler: async function (response) {
          toast({
            title: 'Payment Successful!',
            description: `You have successfully subscribed to ${cook.name}`,
          });

          // Optional: call backend to save subscription
          await axios.post('https://razorpay-project.onrender.com/pay-orders', {
            cookId: 1,
            userId: 11,
            amount: order.amount,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });

          navigate('/student/dashboard');
        },
        prefill: {
          name: "arul",
          email: "arul@gmail.com",
          contact:'9999999999',
        },
        theme: {
          color: '#28b26f',
        },
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

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8"
                alt="MealMatch Logo"
                src="/figmaAssets/frame.svg"
              />
              <h1 className="text-xl font-bold text-[#28b26f]">MealMatch</h1>
            </div>

            {user ? (
              <Button
                variant="outline"
                onClick={() => {
                  const dashboardPath = user.role === 'STUDENT' ? '/student/dashboard' : '/cook/dashboard';
                  navigate(dashboardPath);
                }}
              >
                Dashboard
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cook Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src={cook.profileImage} alt={cook.name} />
                  <AvatarFallback className="text-2xl">
                    {cook.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <CardTitle className="text-2xl text-gray-800">{cook.name}</CardTitle>
                
                <div className="flex items-center justify-center gap-2 mt-2">
                  <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-lg">{cook.rating}</span>
                  <span className="text-gray-600">({cook.reviews.length} reviews)</span>
                </div>

                <Badge className={`mt-3 ${cook.isVeg ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                  {cook.isVeg ? 'Pure Vegetarian' : 'Veg & Non-Veg'}
                </Badge>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <ChefHatIcon className="w-5 h-5 text-[#28b26f]" />
                    <div>
                      <p className="font-medium">Specialty</p>
                      <p className="text-sm text-gray-600">{cook.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-[#28b26f]" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-gray-600">{cook.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-[#28b26f]" />
                    <div>
                      <p className="font-medium">Delivery Time</p>
                      <p className="text-sm text-gray-600">12:00 PM - 2:00 PM</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#28b26f] mb-2">
                      ₹{cook.monthlyPrice}
                    </p>
                    <p className="text-gray-600 mb-4">per month</p>
                    
                    <Button
                      onClick={()=> handleSubscribe(cook.monthlyPrice)}
                      disabled={isSubscribing}
                      className="w-full bg-[#28b26f] hover:bg-[#28b26f]/90 h-12 text-white font-semibold"
                    >
                      {isSubscribing ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="w-5 h-5" />
                          Subscribe Now
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Menu & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Monthly Menu */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <CalendarIcon className="w-6 h-6 text-[#28b26f]" />
                  <CardTitle className="text-2xl">Monthly Menu</CardTitle>
                </div>
                <p className="text-gray-600">
                  Fresh meals prepared daily with authentic ingredients
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {cook.monthlyMenu.map((meal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#28b26f] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#28b26f] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {meal.day.substring(0, 3)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{meal.day}</p>
                          <p className="text-gray-600">{meal.dish}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[#28b26f] border-[#28b26f]">
                        Fresh
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Customer Reviews</CardTitle>
                <p className="text-gray-600">
                  What our students say about {cook.name}'s cooking
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cook.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{review.name}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CookProfilePage;
