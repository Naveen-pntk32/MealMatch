import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const AdminLogin = () => {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('Please enter username and password');
      return;
    }
    setLocation('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Username</label>
              <Input name="username" value={form.username} onChange={handleChange} placeholder="admin" />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full bg-[#28b26f] hover:bg-[#28b26f]/90">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;


