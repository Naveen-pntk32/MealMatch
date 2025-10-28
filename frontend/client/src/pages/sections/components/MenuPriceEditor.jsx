import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

const MenuPriceEditor = ({ monthlyPrice, onChangePrice, onUpdatePrice }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">Monthly Price:</span>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={monthlyPrice}
          onChange={(e) => onChangePrice(e.target.value)}
          className="w-24"
          placeholder="₹"
        />
        <Button onClick={onUpdatePrice} variant="outline" size="sm">
          Update Price
        </Button>
      </div>
    </div>
  );
};

export default MenuPriceEditor;


