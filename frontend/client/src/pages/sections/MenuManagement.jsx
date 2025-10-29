import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from 'lucide-react';

const MenuManagement = ({ cookId, initialMenu = {}, onSave }) => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => {
      const entry = initialMenu[day];
      const dishVal = typeof entry === 'string' ? entry : (entry?.dish || '');
      const descVal = typeof entry === 'object' ? (entry?.description || '') : '';
      return { day, dish: dishVal, description: descVal };
    });
  });
  const [editingDay, setEditingDay] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [newDish, setNewDish] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState(() => {
    // Try to get monthlyPrice from initialMenu, fallback to empty string
    return initialMenu.monthlyPrice?.toString() || '';
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSave = async (index) => {
    const item = menuItems[index];
    if (!item.dish) {
      toast({
        title: 'Error',
        description: 'Please enter a dish name',
        variant: 'destructive'
      });
      return;
    }

    try {
      const menuItemsForApi = menuItems.map(item => ({
        day: item.day,
        dishName: item.dish,
        description: item.description
      }));

      const response = await fetch(`http://localhost:3000/api/addfood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookId,
          menuItems: menuItemsForApi,
          monthlyPrice: parseFloat(monthlyPrice || 0)
        })
      });

      if (!response.ok) throw new Error('Failed to update menu');

      setEditingDay(null);

      // Notify parent component of the update
      if (onSave) {
        onSave();
      }

      toast({
        title: 'Success',
        description: 'Menu updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update menu. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const toggleDayExpansion = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  const handleUpdateMenuItem = (index, field, value) => {
    const updatedItems = [...menuItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setMenuItems(updatedItems);
  };

  const handleUpdatePrice = async () => {
    if (!monthlyPrice || isNaN(monthlyPrice)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid price',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Convert current menu to menuItems array
      const menuItemsForApi = menuItems.map(item => ({
        day: item.day,
        dishName: item.dish,
        description: item.description
      }));

      const response = await fetch(`http://localhost:3000/api/addfood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookId,
          menuItems: menuItemsForApi,
          monthlyPrice: parseFloat(monthlyPrice)
        })
      });

      if (!response.ok) throw new Error('Failed to update price');

      // Notify parent component of the update
      if (onSave) {
        onSave();
      }

      toast({
        title: 'Success',
        description: 'Monthly price updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update price. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Manage Weekly Menu</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Monthly Price:</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
                className="w-24"
                placeholder="₹"
              />
              <Button onClick={handleUpdatePrice} variant="outline" size="sm">
                Update Price
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {menuItems.map((item, index) => (
            <div key={item.day} className="rounded-lg border border-gray-200">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-[#28b26f] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{item.day.substring(0, 3)}</span>
                  </div>
                  {editingDay === index ? (
                    <div className="flex-1 space-y-2">
                      <Input
                        value={item.dish}
                        onChange={(e) => handleUpdateMenuItem(index, 'dish', e.target.value)}
                        placeholder="Enter dish name"
                      />
                      <Textarea
                        value={item.description}
                        onChange={(e) => handleUpdateMenuItem(index, 'description', e.target.value)}
                        placeholder="Enter description, ingredients, or special notes"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleSave(index)} size="sm">Save</Button>
                        <Button onClick={() => setEditingDay(null)} variant="outline" size="sm">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.dish || 'Not set'}</p>
                          {item.description && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 text-sm p-0 h-auto"
                              onClick={() => toggleDayExpansion(index)}
                            >
                              {expandedDay === index ? (
                                <ChevronUpIcon className="w-4 h-4 mr-1" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4 mr-1" />
                              )}
                              {expandedDay === index ? 'Hide details' : 'Show details'}
                            </Button>
                          )}
                        </div>
                        <Button
                          onClick={() => setEditingDay(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Badge variant="outline" className={item.dish ? 'text-[#28b26f] border-[#28b26f]' : 'text-gray-500'}>
                  {item.dish ? 'Set' : 'Not Set'}
                </Badge>
              </div>
              {expandedDay === index && item.description && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 whitespace-pre-line">{item.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuManagement;