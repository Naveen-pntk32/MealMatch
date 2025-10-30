// CookDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  LogOutIcon, 
  StarIcon, 
  UsersIcon,
  ChefHatIcon,
  CalendarIcon,
  BellIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  HomeIcon,
  DollarSignIcon,
  TrendingUpIcon
} from 'lucide-react';


const CookDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [cookProfile, setCookProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [cookStats, setCookStats] = useState({ activeSubscribers: 0 });

  // Fetch cook profile by user ID
  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {

        const res = await fetch(`http://localhost:3000api/register/user/${user.uid}`);
        if (!res.ok) throw new Error('Failed to fetch cook profile');
        const data = await res.json();
        setCookProfile(data);


        // Fetch cook stats
        const statsRes = await fetch(`http://localhost:3000/api/getCooks/stats/${user._id}`);
        if (!statsRes.ok) {
          console.error('Stats response not OK:', await statsRes.text());
          throw new Error('Failed to fetch cook stats');
        }
        const statsData = await statsRes.json();
        console.log('Cook Stats:', statsData);
        setCookStats(statsData);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Could not load cook profile or stats. Please try again.',
        });
      }
    };

    fetchData();
  }, [user?._id, toast]);

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged Out', description: 'You have been successfully logged out' });
    navigate('/');
  };

  const getTodaysMeal = () => {
    if (!cookProfile || !cookProfile.monthlyMenu) return null;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return cookProfile.monthlyMenu.find(meal => meal.day === today);
  };

  const getMonthlyStats = () => {
    const subscriberCount = cookStats.activeSubscribers || 0;
    const monthlyRevenue = cookStats.monthlyRevenue || 0;
    const averageRating = cookProfile?.rating || 0;
    const totalReviews = cookProfile?.reviews?.length || 0;

    return { subscriberCount, monthlyRevenue, averageRating, totalReviews };
  };

  const todaysMeal = getTodaysMeal();
  const stats = getMonthlyStats();

  if (!user || user.role !== 'COOK') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <Button onClick={() => navigate('/login')} variant="outline">Login as Cook</Button>
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
          <Button onClick={() => navigate('/')} variant="outline">Back to Home</Button>
        </div>
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
            <Badge variant="outline" className="text-[#28b26f] border-[#28b26f]">Cook Dashboard</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link to={`/cook/${cookProfile._id}`}>
              <Button variant="outline" size="sm">View My Profile</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm"><HomeIcon className="w-4 h-4 mr-2"/>Home</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOutIcon className="w-4 h-4 mr-2"/>Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={cookProfile.profileImage} alt={cookProfile.name} />
            <AvatarFallback className="text-xl">{cookProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome, {cookProfile.name}!</h2>
            <p className="text-gray-600">{cookProfile.specialty || 'Chef'} • {cookProfile.location?.address}</p>
            <div className="flex items-center gap-2 mt-1">
              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{cookProfile.rating || 0}</span>
              <span className="text-gray-500">({cookProfile.reviews?.length || 0} reviews)</span>
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

        {/* Today's Meal */}
        {todaysMeal && (
          <Card className="mb-8 bg-gradient-to-r from-[#28b26f]/10 to-[#28b26f]/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ChefHatIcon className="w-12 h-12 text-[#28b26f]" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Today's Special</h3>
                  <p className="text-lg text-gray-700">{todaysMeal.dish}</p>
                  <p className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <Badge className="bg-[#28b26f] text-white text-lg px-4 py-2">{cookStats.activeSubscribers} Orders</Badge>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Add Overview Content Here */}
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-[#28b26f]" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                          {/* TODO: Customize icon by type */}
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{notification.message}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.timestamp}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">{notification.type}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">No Notifications Yet</p>
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
