
import React from 'react';
import { Ingredient } from '../types';

interface IngredientCardProps {
  ingredient: Ingredient;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <span className="font-semibold text-slate-800 text-lg capitalize">{ingredient.item}</span>
        {ingredient.notes && (
          <span className="text-sm text-slate-500 italic">{ingredient.notes}</span>
        )}
      </div>
      <div className="flex items-center bg-orange-50 px-4 py-2 rounded-lg">
        <span className="text-orange-700 font-bold whitespace-nowrap">{ingredient.amount}</span>
      </div>
    </div>
  );
};

export default IngredientCard;
