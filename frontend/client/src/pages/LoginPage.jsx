import React, { useState, useEffect } from 'react';
import { useLocation as useWouterLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { ArrowLeftIcon, UserIcon, ChefHatIcon, CheckCircleIcon } from 'lucide-react';

const LoginPage = () => {
  const [loc, setLocation] = useWouterLocation();
  const location = { state: null };
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  // Configurable API base
  const API_BASE = import.meta?.env?.VITE_API_URL || 'http://localhost:3000';

  const [activeTab, setActiveTab] = useState('login');
  const [selectedRole, setSelectedRole] = useState('student');
  // Fixed admin credentials (frontend-only)
  const ADMIN_EMAIL = 'admin@mealmatch.com';
  const ADMIN_PASSWORD = 'admin123';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    address: '',
    mobileNumber: '',
    foodPreference: '',
    locationName: '',
    locationLatitude: 13.0827,
    locationLongitude: 80.2707,
    // Cook-specific fields
    aadharNumber: '',
    aadharDocument: null
  });
  const [locationSet, setLocationSet] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, aadharDocument: e.target.files?.[0] || null });
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    // Admin login (frontend-only)
    if (selectedRole === 'admin') {
      if (!formData.email || !formData.password) {
        return toast({ title: 'Error', description: 'Please enter admin email and password', variant: 'destructive' });
      }
      if (formData.email !== ADMIN_EMAIL || formData.password !== ADMIN_PASSWORD) {
        return toast({ title: 'Login Failed', description: 'Invalid admin credentials', variant: 'destructive' });
      }
      toast({ title: 'Admin Login', description: 'Welcome, Admin' });
      // Navigate immediately
      setLocation('/admin');
      if (typeof window !== 'undefined') {
        window.location.replace('/admin');
      }
      return;
    }

    if (!formData.email || !formData.password) {
      return toast({ title: 'Error', description: 'Please enter email and password', variant: 'destructive' });
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast({ title: 'Login Successful', description: `Welcome back!` });
      const dashboardPath = result.user.role === 'STUDENT' ? '/student/dashboard' : '/cook/dashboard';
      console.log("[DEBUG] Redirecting to:", dashboardPath, "User:", result.user);
      // Primary SPA navigation
      setLocation(dashboardPath);
      // Hard fallback: ensure redirect even if SPA navigation is blocked
      if (typeof window !== 'undefined') {
        window.location.replace(dashboardPath);
      }
    } else {
      toast({ title: 'Login Failed', description: result.error || 'Invalid credentials', variant: 'destructive' });
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, address, mobileNumber, foodPreference, locationName, locationLatitude, locationLongitude, aadharNumber, aadharDocument } = formData;

    // Validation for cooks
    if (selectedRole === 'cook') {
      if (!aadharNumber) {
        return toast({ title: 'Error', description: 'Aadhar number is required', variant: 'destructive' });
      }
      if (!aadharDocument) {
        return toast({ title: 'Error', description: 'Aadhar document is required', variant: 'destructive' });
      }
    }

    if (!name || !email || !password || !confirmPassword || !address || !mobileNumber) {
      return toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
    }
    if (password !== confirmPassword) {
      return toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
    }

    const backendRole = selectedRole === 'student' ? 'STUDENT' : 'COOK';
    
    // Convert file to base64 if it's a cook registration
    let aadharDocumentBase64 = null;
    if (selectedRole === 'cook' && aadharDocument) {
      try {
        aadharDocumentBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(aadharDocument);
        });
      } catch (error) {
        return toast({ title: 'Error', description: 'Failed to process document', variant: 'destructive' });
      }
    }

    const payload = {
      name,
      email,
      password,
      role: backendRole,
      foodPreference: foodPreference || 'VEG',
      address,
      mobileNumber,
      locationName: locationName || address || 'User Location',
      locationLatitude,
      locationLongitude,
      ...(selectedRole === 'cook' && { aadharNumber, aadharDocument: aadharDocumentBase64 })
    };

    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: 'Registration Successful', description: `Welcome to MealMatch, ${data.user.name}!` });
        setLocation('/login')
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
        <Button variant="outline" size="sm" className="absolute -top-12 left-0 mb-4" onClick={() => setLocation('/') }>
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
              <div className="grid grid-cols-3 gap-3">
                <Button type="button" variant={selectedRole === 'student' ? 'default' : 'outline'} className={`h-16 flex flex-col gap-1 ${selectedRole === 'student' ? 'bg-[#28b26f] hover:bg-[#28b26f]/90' : 'hover:bg-gray-50'}`} onClick={() => { setSelectedRole('student'); }}>
                  <UserIcon className="w-5 h-5" /><span className="text-sm">Student</span>
                </Button>
                <Button type="button" variant={selectedRole === 'cook' ? 'default' : 'outline'} className={`h-16 flex flex-col gap-1 ${selectedRole === 'cook' ? 'bg-[#28b26f] hover:bg-[#28b26f]/90' : 'hover:bg-gray-50'}`} onClick={() => { setSelectedRole('cook'); }}>
                  <ChefHatIcon className="w-5 h-5" /><span className="text-sm">Home Cook</span>
                </Button>
                <Button type="button" variant={selectedRole === 'admin' ? 'default' : 'outline'} className={`h-16 flex flex-col gap-1 ${selectedRole === 'admin' ? 'bg-[#28b26f] hover:bg-[#28b26f]/90' : 'hover:bg-gray-50'}`} onClick={() => { setSelectedRole('admin'); setActiveTab('login'); }}>
                  <UserIcon className="w-5 h-5" /><span className="text-sm">Admin</span>
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`grid w-full ${selectedRole === 'admin' ? 'grid-cols-1' : 'grid-cols-2'} mb-6`}>
                <TabsTrigger value="login">Login</TabsTrigger>
                {selectedRole !== 'admin' && <TabsTrigger value="register">Register</TabsTrigger>}
              </TabsList>

              {/* LOGIN FORM */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {selectedRole === 'admin' ? (
                    <>
                      <Label>Email</Label>
                      <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                      <Label>Password</Label>
                      <Input name="password" type="password" value={formData.password} onChange={handleInputChange} required />
                    </>
                  ) : (
                    <>
                      <Label>Email</Label>
                      <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                      <Label>Password</Label>
                      <Input name="password" type="password" value={formData.password} onChange={handleInputChange} required />
                    </>
                  )}
                  <Button type="submit" className="w-full bg-[#28b26f] hover:bg-[#28b26f]/90 h-11" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</Button>
                </form>
              </TabsContent>

              {/* REGISTER FORM */}
              {selectedRole !== 'admin' && (
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
                  
                  {/* Cook-specific: Aadhar Number */}
                  {selectedRole === 'cook' && (
                    <>
                      <Label>Aadhar Number</Label>
                      <Input name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} required />
                      
                      <Label>Aadhar Card Document</Label>
                      <Input name="aadharDocument" type="file" accept="image/*,.pdf" onChange={handleFileChange} required />
                    </>
                  )}

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
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
