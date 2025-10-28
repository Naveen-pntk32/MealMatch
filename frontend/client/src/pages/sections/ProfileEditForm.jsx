import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const ProfileEditForm = ({ profile, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    mobileNumber: profile?.mobile?.toString() || '',
    address: profile?.location?.address || '',
    foodPreference: profile?.foodPreference || 'VEG'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {};
      if (formData.name) updatedData.name = formData.name;
      if (formData.email) updatedData.email = formData.email;
      if (formData.mobileNumber) updatedData.mobileNumber = parseInt(formData.mobileNumber);
      if (formData.foodPreference) updatedData.foodPreference = formData.foodPreference;
      if (formData.address) updatedData.address = formData.address;

      const response = await fetch(`http://localhost:3000/api/register/user/${profile._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedProfile = {
        ...profile,
        ...data.user,
        mobileNumber: data.user.mobile || data.user.mobileNumber,
        location: data.user.location || profile.location
      };

      onSave(updatedProfile);

      toast({ title: 'Success', description: 'Profile updated successfully' });
    } catch (err) {
      console.error('Profile update error:', err);
      toast({ title: 'Error', description: err.message || 'Failed to update profile', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input id="mobileNumber" name="mobileNumber" type="number" value={formData.mobileNumber} onChange={handleInputChange} placeholder="Enter your mobile number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foodPreference">Food Preference</Label>
              <Select value={formData.foodPreference} onValueChange={(value) => setFormData(prev => ({ ...prev, foodPreference: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VEG">Vegetarian</SelectItem>
                  <SelectItem value="NONVEG">Non-Vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter your address" />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onSave(null)}>Cancel</Button>
            <Button type="submit" className="bg-[#28b26f] hover:bg-[#28b26f]/90">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;