
import React from 'react';

const RecipeHeader: React.FC = () => {
  return (
    <header className="py-12 text-center">
      <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-orange-600 uppercase bg-orange-100 rounded-full">
        The Ultimate Sous-Chef
      </div>
      <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-4">
        Ingredient Pro
      </h1>
      <p className="max-w-2xl mx-auto text-lg text-slate-600 px-4">
        Enter any dish name to get a professional, curated list of ingredients and expert kitchen tips.
      </p>
    </header>
  );
};

export default RecipeHeader;
