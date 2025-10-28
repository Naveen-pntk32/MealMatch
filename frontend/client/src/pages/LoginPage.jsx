import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { ArrowLeftIcon, UserIcon, ChefHatIcon, CheckCircleIcon } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('login');
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    address: '',
    mobileNumber: '',
    foodPreference: 'VEG',
    locationName: 'Chennai',
    locationLatitude: 13.0827,
    locationLongitude: 80.2707
  });
  const [locationSet, setLocationSet] = useState(false); // ✅ track if location is set

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast({ title: 'Error', description: 'Please enter email and password', variant: 'destructive' });
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast({ title: 'Login Successful', description: `Welcome back!` });
      // Use the role from the returned user object
      const dashboardPath = result.user.role === 'STUDENT' ? '/student/dashboard' : '/cook/dashboard';
      console.log("[DEBUG] Redirecting to:", dashboardPath, "User:", result.user);
      navigate(dashboardPath);
    } else {
      toast({ title: 'Login Failed', description: result.error || 'Invalid credentials', variant: 'destructive' });
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, address, mobileNumber, foodPreference, locationName, locationLatitude, locationLongitude } = formData;

    if (!name || !email || !password || !confirmPassword || !address || !mobileNumber) {
      return toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
    }
    if (password !== confirmPassword) {
      return toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
    }

    const backendRole = selectedRole === 'student' ? 'STUDENT' : 'COOK';

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: backendRole, foodPreference, address, mobileNumber, locationName, locationLatitude, locationLongitude })
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: 'Registration Successful', description: `Welcome to MealMatch, ${data.user.name}!` });
        // navigate(backendRole === 'STUDENT' ? '/student/dashboard' : '/cook/dashboard');
        navigate('/login')
      } else {
        toast({ title: 'Registration Failed', description: data.message || 'Something went wrong', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Server Error', description: 'Unable to connect to backend', variant: 'destructive' });
    }
  };

  // GET USER LOCATION
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      return toast({ title: 'Error', description: 'Geolocation not supported', variant: 'destructive' });
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({ ...formData, locationLatitude: position.coords.latitude, locationLongitude: position.coords.longitude });
        setLocationSet(true); // ✅ mark location as set
        toast({ title: 'Location Set', description: `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}` });
      },
      () => toast({ title: 'Error', description: 'Unable to get location', variant: 'destructive' })
    );
  };

  // If navigated here with an initialTab in location.state, open that tab
  useEffect(() => {
    if (location && location.state && location.state.initialTab) {
      setActiveTab(location.state.initialTab);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <Button variant="outline" size="sm" className="absolute -top-12 left-0 mb-4" onClick={() => navigate('/')}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        <Card className="w-full shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img className="w-8 h-8" alt="MealMatch Logo" src="/figmaAssets/frame.svg" />
              <h1 className="text-2xl font-bold text-[#28b26f]">MealMatch</h1>
            </div>
            <CardTitle className="text-xl text-gray-800">{activeTab === 'login' ? 'Welcome Back!' : 'Join MealMatch'}</CardTitle>
            <p className="text-gray-600 text-sm">{activeTab === 'login' ? 'Sign in to your account' : 'Create your account to get started'}</p>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">I am a:</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant={selectedRole === 'student' ? 'default' : 'outline'} className={`h-16 flex flex-col gap-1 ${selectedRole === 'student' ? 'bg-[#28b26f] hover:bg-[#28b26f]/90' : 'hover:bg-gray-50'}`} onClick={() => setSelectedRole('student')}>
                  <UserIcon className="w-5 h-5" /><span className="text-sm">Student</span>
                </Button>
                <Button type="button" variant={selectedRole === 'cook' ? 'default' : 'outline'} className={`h-16 flex flex-col gap-1 ${selectedRole === 'cook' ? 'bg-[#28b26f] hover:bg-[#28b26f]/90' : 'hover:bg-gray-50'}`} onClick={() => setSelectedRole('cook')}>
                  <ChefHatIcon className="w-5 h-5" /><span className="text-sm">Home Cook</span>
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* LOGIN FORM */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <Label>Email</Label>
                  <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  <Label>Password</Label>
                  <Input name="password" type="password" value={formData.password} onChange={handleInputChange} required />
                  <Button type="submit" className="w-full bg-[#28b26f] hover:bg-[#28b26f]/90 h-11" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</Button>
                </form>
              </TabsContent>

              {/* REGISTER FORM */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <Label>Full Name</Label>
                  <Input name="name" value={formData.name} onChange={handleInputChange} required />
                  <Label>Email Address</Label>
                  <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  <Label>Mobile Number</Label>
                  <Input name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleInputChange} required />
                  <Label>Address</Label>
                  <Input name="address" value={formData.address} onChange={handleInputChange} required />

                  {/* Location Button with Green Tick */}
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={handleGetLocation}>
                      Use My Location
                    </Button>
                    {locationSet && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                  </div>

                  <Label>Food Preference</Label>
                  <select name="foodPreference" value={formData.foodPreference} onChange={handleInputChange} className="border rounded-md p-2 w-full">
                    <option value="VEG">Vegetarian</option>
                    <option value="NONVEG">Non-Vegetarian</option>
                  </select>

                  <Label>Password</Label>
                  <Input name="password" type="password" value={formData.password} onChange={handleInputChange} required />
                  <Label>Confirm Password</Label>
                  <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />

                  <Button type="submit" className="w-full bg-[#28b26f] hover:bg-[#28b26f]/90 h-11" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
