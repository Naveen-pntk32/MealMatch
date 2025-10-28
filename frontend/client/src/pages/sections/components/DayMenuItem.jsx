import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
import { PencilIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

const DayMenuItem = ({
  item,
  index,
  isEditing,
  isExpanded,
  onEdit,
  onCancelEdit,
  onSave,
  onToggleExpand,
  onChangeField
}) => {
  return (
    <div className="rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-[#28b26f] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{item.day.substring(0, 3)}</span>
          </div>
          {isEditing ? (
            <div className="flex-1 space-y-2">
              <Input
                value={item.dish}
                onChange={(e) => onChangeField(index, 'dish', e.target.value)}
                placeholder="Enter dish name"
              />
              <Textarea
                value={item.description}
                onChange={(e) => onChangeField(index, 'description', e.target.value)}
                placeholder="Enter description, ingredients, or special notes"
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={() => onSave(index)} size="sm">Save</Button>
                <Button onClick={onCancelEdit} variant="outline" size="sm">Cancel</Button>
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
                      onClick={() => onToggleExpand(index)}
                    >
                      {isExpanded ? (
                        <ChevronUpIcon className="w-4 h-4 mr-1" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 mr-1" />
                      )}
                      {isExpanded ? 'Hide details' : 'Show details'}
                    </Button>
                  )}
                </div>
                <Button onClick={() => onEdit(index)} variant="ghost" size="sm">
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
      {isExpanded && item.description && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-600 whitespace-pre-line">{item.description}</p>
        </div>
      )}
    </div>
  );
};

export default DayMenuItem;


