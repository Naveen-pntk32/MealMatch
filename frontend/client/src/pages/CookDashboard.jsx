// Cook Dashboard - Display subscribers and notifications
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  LogOutIcon, 
  StarIcon, 
  MapPinIcon, 
  UsersIcon,
  ChefHatIcon,
  CalendarIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  HomeIcon,
  DollarSignIcon,
  TrendingUpIcon
} from 'lucide-react';

// TODO: API Integration - Replace with real API calls
import { 
  getCookById, 
  getStudentsByCoooklId,
  getNotificationsByCookId,
  cooks 
} from '../mockData';

const CookDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // TODO: API Integration - Fetch cook's data from backend
  console.log(user?.uid);
  const cookProfile = user?.uid ? getCookById(1) : null;
  const subscribers = cookProfile ? getStudentsByCoooklId(cookProfile.id) : [];
  const notifications = cookProfile ? getNotificationsByCookId(cookProfile.id) : [];

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
    navigate('/');
  };

  const getTodaysMeal = () => {
    if (!cookProfile) return null;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return cookProfile.monthlyMenu.find(meal => meal.day === today);
  };

  const getMonthlyStats = () => {
    const subscriberCount = subscribers.length;
    const monthlyRevenue = subscriberCount * (cookProfile?.monthlyPrice || 0);
    const averageRating = cookProfile?.rating || 0;
    const totalReviews = cookProfile?.reviews?.length || 0;

    return {
      subscriberCount,
      monthlyRevenue,
      averageRating,
      totalReviews
    };
  };

  const todaysMeal = getTodaysMeal();
  const stats = getMonthlyStats();

  if (!user || user.role !== 'COOK') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <Button onClick={() => navigate('/login')} variant="outline">
            Login as Cook
          </Button>
        </div>
      </div>
    );
  }

  if (!cookProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cook Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Please contact support to set up your cook profile.</p>
          <Button onClick={() => navigate('/')} variant="outline">
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
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <img
                  className="w-8 h-8"
                  alt="MealMatch Logo"
                  src="/figmaAssets/frame.svg"
                />
                <h1 className="text-xl font-bold text-[#28b26f]">MealMatch</h1>
              </Link>
              <Badge variant="outline" className="text-[#28b26f] border-[#28b26f]">
                Cook Dashboard
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Link to={`/cook/${cookProfile.id}`}>
                <Button variant="outline" size="sm">
                  View My Profile
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                size="sm"
              >
                <LogOutIcon className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={cookProfile.profileImage} alt={cookProfile.name} />
              <AvatarFallback className="text-xl">
                {cookProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome, {cookProfile.name}!
              </h2>
              <p className="text-gray-600">{cookProfile.specialty} • {cookProfile.address}</p>
              <div className="flex items-center gap-2 mt-1">
                <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{cookProfile.rating}</span>
                <span className="text-gray-500">({cookProfile.reviews.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <UsersIcon className="w-8 h-8 text-[#28b26f] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.subscriberCount}</h3>
              <p className="text-gray-600">Active Subscribers</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <DollarSignIcon className="w-8 h-8 text-[#28b26f] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">₹{stats.monthlyRevenue.toLocaleString()}</h3>
              <p className="text-gray-600">Monthly Revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <StarIcon className="w-8 h-8 text-[#28b26f] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.averageRating}</h3>
              <p className="text-gray-600">Average Rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUpIcon className="w-8 h-8 text-[#28b26f] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalReviews}</h3>
              <p className="text-gray-600">Total Reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Meal Banner */}
        {todaysMeal && (
          <Card className="mb-8 bg-gradient-to-r from-[#28b26f]/10 to-[#28b26f]/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ChefHatIcon className="w-12 h-12 text-[#28b26f]" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Today's Special</h3>
                    <p className="text-lg text-gray-700">{todaysMeal.dish}</p>
                    <p className="text-sm text-gray-600">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <Badge className="bg-[#28b26f] text-white text-lg px-4 py-2">
                  {subscribers.length} Orders
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscribers">My Subscribers</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Menu */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#28b26f]" />
                    Weekly Menu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cookProfile.monthlyMenu.slice(0, 7).map((meal, index) => {
                      const isToday = meal.day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isToday 
                              ? 'border-[#28b26f] bg-[#28b26f]/5' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isToday ? 'bg-[#28b26f] text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <span className="text-sm font-semibold">
                                {meal.day.substring(0, 3)}
                              </span>
                            </div>
                            <div>
                              <p className={`font-medium ${isToday ? 'text-[#28b26f]' : 'text-gray-800'}`}>
                                {meal.day}
                              </p>
                              <p className="text-sm text-gray-600">{meal.dish}</p>
                            </div>
                          </div>
                          {isToday && (
                            <Badge className="bg-[#28b26f] text-white">Today</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-[#28b26f]" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cookProfile.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {review.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-sm">{review.name}</h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-[#28b26f]" />
                  My Subscribers ({subscribers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscribers.length > 0 ? (
                  <div className="space-y-4">
                    {subscribers.map((subscriber, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {subscriber.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{subscriber.name}</h4>
                            <p className="text-sm text-gray-600">{subscriber.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge 
                            className={
                              subscriber.subscriptionStatus === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {subscriber.subscriptionStatus}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // TODO: API Integration - Implement subscriber management
                              toast({
                                title: 'Feature Coming Soon',
                                description: 'Subscriber management will be available soon',
                              });
                            }}
                          >
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Subscribers Yet</h3>
                    <p className="text-gray-500 mb-6">
                      Start building your customer base by promoting your delicious meals!
                    </p>
                    <Link to={`/cook/${cookProfile.id}`}>
                      <Button className="bg-[#28b26f] hover:bg-[#28b26f]/90">
                        View My Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-[#28b26f]" />
                  Order Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          notification.type === 'subscription' ? 'bg-green-100' :
                          notification.type === 'review' ? 'bg-blue-100' :
                          notification.type === 'payment' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}>
                          {notification.type === 'subscription' && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
                          {notification.type === 'review' && <StarIcon className="w-5 h-5 text-blue-600" />}
                          {notification.type === 'payment' && <DollarSignIcon className="w-5 h-5 text-yellow-600" />}
                          {notification.type === 'inquiry' && <AlertCircleIcon className="w-5 h-5 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{notification.message}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.timestamp}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BellIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notifications</h3>
                    <p className="text-gray-500">
                      You'll see new orders and updates here when they arrive.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CookDashboard;