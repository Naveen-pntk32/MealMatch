import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { useToast } from '../hooks/use-toast';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MenuForm = ({ cookId, initialMenu, onSubmit }) => {
  const { toast } = useToast();
  const [monthlyPrice, setMonthlyPrice] = useState(initialMenu?.monthlyPrice || 0);
  const [menuItems, setMenuItems] = useState(
    daysOfWeek.map(day => ({
      day,
      dishName: initialMenu?.[day]?.dish || '',
      description: initialMenu?.[day]?.description || ''
    }))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/addfood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cookId,
          menuItems,
          monthlyPrice: Number(monthlyPrice)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save menu');
      }

      const data = await response.json();
      toast({
        title: 'Success',
        description: 'Menu updated successfully',
      });

      if (onSubmit) {
        onSubmit(data.menu);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save menu. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMenuItemChange = (index, field, value) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index] = {
      ...newMenuItems[index],
      [field]: value,
    };
    setMenuItems(newMenuItems);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Monthly Subscription Price (₹)</label>
          <Input
            type="number"
            value={monthlyPrice}
            onChange={(e) => setMonthlyPrice(e.target.value)}
            min="0"
            required
          />
        </div>

        {menuItems.map((item, index) => (
          <Card key={item.day}>
            <CardContent className="p-4">
              <div className="grid gap-4">
                <h3 className="font-semibold">{item.day}</h3>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Dish Name</label>
                  <Input
                    value={item.dishName}
                    onChange={(e) => handleMenuItemChange(index, 'dishName', e.target.value)}
                    placeholder={`Enter ${item.day}'s dish`}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => handleMenuItemChange(index, 'description', e.target.value)}
                    placeholder="Enter dish description, ingredients, or special notes"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button type="submit" className="w-full">Save Menu</Button>
    </form>
  );
};

export default MenuForm;