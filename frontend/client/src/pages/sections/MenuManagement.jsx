import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import MenuPriceEditor from './components/MenuPriceEditor';
import DayMenuItem from './components/DayMenuItem';
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
    return days.map(day => ({
      day,
      dish: initialMenu[day]?.dish || initialMenu[day] || '',
      description: initialMenu[day]?.description || ''
    }));
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
          <MenuPriceEditor
            monthlyPrice={monthlyPrice}
            onChangePrice={setMonthlyPrice}
            onUpdatePrice={handleUpdatePrice}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {menuItems.map((item, index) => (
            <DayMenuItem
              key={item.day}
              item={item}
              index={index}
              isEditing={editingDay === index}
              isExpanded={expandedDay === index}
              onEdit={(i) => setEditingDay(i)}
              onCancelEdit={() => setEditingDay(null)}
              onSave={handleSave}
              onToggleExpand={toggleDayExpansion}
              onChangeField={handleUpdateMenuItem}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuManagement;