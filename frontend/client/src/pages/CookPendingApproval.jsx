import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AlertCircleIcon, ClockIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CookPendingApproval = () => {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      window.location.replace('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <ClockIcon className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Waiting for Admin Approval</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-lg">
              Thank you for registering as a cook with MealMatch!
            </p>
            <p className="text-gray-500">
              Your account is currently pending admin approval. We'll review your application and notify you once your account has been verified.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm text-blue-800">
                <p className="font-semibold">What happens next?</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Our admin team will review your Aadhar document and profile information</li>
                  <li>Once approved, you'll be able to access your cook dashboard</li>
                  <li>You'll receive an email notification when your account is verified</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.replace('/');
                }
              }}
              className="flex-1 sm:flex-initial"
            >
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex-1 sm:flex-initial"
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookPendingApproval;

