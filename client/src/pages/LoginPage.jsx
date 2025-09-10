// Login and Registration Page for MealMatch
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { ArrowLeftIcon, UserIcon, ChefHatIcon } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('login');
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    // TODO: API Integration - Replace mock login with real authentication API
    const result = await login(formData.email, formData.password, selectedRole);
    
    if (result.success) {
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${result.user.name}!`,
      });
      
      // Redirect to appropriate dashboard
      const redirectPath = selectedRole === 'student' ? '/student/dashboard' : '/cook/dashboard';
      navigate(redirectPath);
    } else {
      toast({
        title: 'Login Failed',
        description: result.error || 'Invalid credentials',
        variant: 'destructive'
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.name || !formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive'
      });
      return;
    }

    // TODO: API Integration - Replace mock registration with real API call
    const result = await register(formData.email, formData.password, formData.name, selectedRole);
    
    if (result.success) {
      toast({
        title: 'Registration Successful',
        description: `Welcome to MealMatch, ${result.user.name}!`,
      });
      
      // Redirect to appropriate dashboard
      const redirectPath = selectedRole === 'student' ? '/student/dashboard' : '/cook/dashboard';
      navigate(redirectPath);
    } else {
      toast({
        title: 'Registration Failed',
        description: result.error || 'Registration failed. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Back to Home Button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute -top-12 left-0 mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="w-full shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img
                className="w-8 h-8"
                alt="MealMatch Logo"
                src="/figmaAssets/frame.svg"
              />
              <h1 className="text-2xl font-bold text-[#28b26f]">MealMatch</h1>
            </div>
            <CardTitle className="text-xl text-gray-800">
              {activeTab === 'login' ? 'Welcome Back!' : 'Join MealMatch'}
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {activeTab === 'login' 
                ? 'Sign in to your account' 
                : 'Create your account to get started'
              }
            </p>
          </CardHeader>

          <CardContent>
            {/* Role Selection */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                I am a:
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={selectedRole === 'student' ? 'default' : 'outline'}
                  className={`h-16 flex flex-col gap-1 ${
                    selectedRole === 'student' 
                      ? 'bg-[#28b26f] hover:bg-[#28b26f]/90' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedRole('student')}
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm">Student</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === 'cook' ? 'default' : 'outline'}
                  className={`h-16 flex flex-col gap-1 ${
                    selectedRole === 'cook' 
                      ? 'bg-[#28b26f] hover:bg-[#28b26f]/90' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedRole('cook')}
                >
                  <ChefHatIcon className="w-5 h-5" />
                  <span className="text-sm">Home Cook</span>
                </Button>
              </div>
            </div>

            {/* Login/Register Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#28b26f] hover:bg-[#28b26f]/90 h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Demo Credentials:</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>Student:</strong> rahul@student.com / password123</div>
                    <div><strong>Cook:</strong> priya@cook.com / password123</div>
                  </div>
                </div>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#28b26f] hover:bg-[#28b26f]/90 h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-gray-600">
              <Link to="/" className="text-[#28b26f] hover:underline">
                ← Back to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;