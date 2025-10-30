// Student Dashboard - Display subscription and food tracking
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Progress } from "../components/ui/progress";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import {
  LogOutIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  ChefHatIcon,
  CalendarIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  HomeIcon,
} from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [subscription, setSubscription] = useState(null);
  const [cook, setCook] = useState(null);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch subscription and cook details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch subscription details for this student
        const uid = await localStorage.getItem("uid")
        const subRes = await fetch(
          `http://localhost:3000api/subscribe/student/${uid}`
        );
        const subscriptionData = await subRes.json();
        setSubscription(subscriptionData.subscription);

        // Fetch cook + menu data
        if (subscriptionData?.subscription?.cookId) {
          const cookRes = await fetch(
            `http://localhost:3000api/getcook/full/${subscriptionData.subscription.cookId}`
          );
          const data = await cookRes.json();
          setCook(data.cook);
          setMenu(data.menu);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  // ✅ Get today's meal from menu object
  const getTodaysMeal = () => {
    if (!menu) return null;
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return menu[today]?.dish || null;
  };

  const getDeliveryStatus = () => {
    if (!subscription) return null;
    const hour = currentTime.getHours();
    if (hour < 11) {
      return {
        status: "preparing",
        message: "Your meal is being prepared",
        icon: ChefHatIcon,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    } else if (hour < 13) {
      return {
        status: "on_way",
        message: "Your meal is on the way",
        icon: TruckIcon,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      };
    } else if (hour < 15) {
      return {
        status: "delivered",
        message: "Your meal has been delivered!",
        icon: CheckCircleIcon,
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    } else {
      return {
        status: "completed",
        message: "Today's meal completed",
        icon: CheckCircleIcon,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      };
    }
  };

  const todaysMeal = getTodaysMeal();
  const deliveryStatus = getDeliveryStatus();

  if (!user || user.role !== "STUDENT") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <Button onClick={() => navigate("/login")} variant="outline">
            Login as Student
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img className="w-8 h-8" alt="MealMatch Logo" src="/figmaAssets/frame.svg" />
              <h1 className="text-xl font-bold text-[#28b26f]">MealMatch</h1>
            </Link>
            <Badge variant="outline" className="text-[#28b26f] border-[#28b26f]">
              Student Dashboard
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <HomeIcon className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <TruckIcon className="w-6 h-6 text-[#28b26f]" />
                Food Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscription && cook ? (
                <div className="space-y-6">
                  {/* Today's Meal */}
                  <div className="bg-gradient-to-r from-[#28b26f]/10 to-[#28b26f]/5 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Today's Meal</h3>
                      <Badge className="bg-[#28b26f] text-white">
                        {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                      </Badge>
                    </div>

                    {todaysMeal ? (
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={cook.profileImage || ""} alt={cook.name} />
                          <AvatarFallback>
                            {cook.name?.split(" ").map(n => n[0]).join("") || "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800">{todaysMeal}</h4>
                          <p className="text-gray-600">by {cook.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <AlertCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No meal scheduled for today</p>
                      </div>
                    )}
                  </div>

                  {/* Delivery Status */}
                  {deliveryStatus && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Delivery Status</h3>
                      <div className={`flex items-center gap-4 p-4 rounded-lg ${deliveryStatus.bgColor}`}>
                        <deliveryStatus.icon className={`w-8 h-8 ${deliveryStatus.color}`} />
                        <div className="flex-1">
                          <p className={`font-semibold ${deliveryStatus.color}`}>
                            {deliveryStatus.message}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Expected delivery: 12:30 PM - 1:30 PM
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Preparing</span>
                          <span>On the way</span>
                          <span>Delivered</span>
                        </div>
                        <Progress
                          value={
                            deliveryStatus.status === "preparing"
                              ? 25
                              : deliveryStatus.status === "on_way"
                              ? 65
                              : 100
                          }
                          className="h-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Active Subscription
                  </h3>
                  <Link to="/">
                    <Button className="bg-[#28b26f] hover:bg-[#28b26f]/90">
                      Browse Cooks
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Menu */}
          {menu && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-[#28b26f]" />
                  This Week's Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(menu)
                  .filter(day => day.match(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/))
                  .map((day, i) => {
                    const isToday =
                      day === new Date().toLocaleDateString("en-US", { weekday: "long" });
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isToday
                            ? "border-[#28b26f] bg-[#28b26f]/5"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isToday
                                ? "bg-[#28b26f] text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {day.substring(0, 3)}
                          </div>
                          <div>
                            <p
                              className={`font-medium ${
                                isToday ? "text-[#28b26f]" : "text-gray-800"
                              }`}
                            >
                              {day}
                            </p>
                            <p className="text-sm text-gray-600">{menu[day]?.dish}</p>
                            <p className="text-xs text-gray-500">{menu[day]?.description}</p>
                          </div>
                        </div>
                        {isToday && (
                          <Badge className="bg-[#28b26f] text-white">Today</Badge>
                        )}
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">My Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              {subscription && cook ? (
                <div className="space-y-4 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-3">
                    <AvatarImage src={cook.profileImage || ""} alt={cook.name} />
                    <AvatarFallback>
                      {cook.name?.split(" ").map(n => n[0]).join("") || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{cook.name}</h3>
                  <p className="text-sm text-gray-600">{cook.foodPreference} Cook</p>
                  <div className="flex justify-center gap-1 mt-2">
                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.5</span>
                  </div>
                  <Separator />
                  <p className="text-sm text-gray-600">{cook.location?.address}</p>
                  <p className="text-sm text-gray-600">Daily: 12:00 PM - 2:00 PM</p>
                  <h3 className="text-2xl font-bold text-[#28b26f]">
                    ₹{menu?.monthlyPrice || 0}
                  </h3>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <XCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No active subscription</p>
                  <Link to="/">
                    <Button
                      size="sm"
                      className="bg-[#28b26f] hover:bg-[#28b26f]/90"
                    >
                      Find a Cook
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
