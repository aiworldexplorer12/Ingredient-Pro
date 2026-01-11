
import React, { useState, useCallback } from 'react';
import { AppState, RecipeResponse } from './types';
import { fetchRecipeIngredients } from './services/geminiService';
import RecipeHeader from './components/RecipeHeader';
import IngredientCard from './components/IngredientCard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    loading: false,
    error: null,
    recipe: null,
    query: '',
  });

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!state.query.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchRecipeIngredients(state.query);
      setState(prev => ({ 
        ...prev, 
        recipe: result, 
        loading: false, 
        query: '' // Clear query after search if desired, or keep it. Let's clear it.
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err instanceof Error ? err.message : 'An unexpected error occurred.' 
      }));
    }
  }, [state.query]);

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <RecipeHeader />

        {/* Search Bar Container */}
        <div className="sticky top-4 z-10 mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={state.query}
              onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
              placeholder="What are you cooking today? (e.g., 'Beef Bourguignon')"
              className="w-full px-8 py-5 text-xl bg-white border-2 border-slate-200 rounded-2xl shadow-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all pr-36"
            />
            <button
              type="submit"
              disabled={state.loading || !state.query.trim()}
              className="absolute right-3 top-3 bottom-3 px-8 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 active:scale-95 disabled:bg-slate-300 disabled:scale-100 transition-all flex items-center justify-center min-w-[120px]"
            >
              {state.loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Fetch'}
            </button>
          </form>
        </div>

        {/* Error State */}
        {state.error && (
          <div className="p-6 mb-8 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold">Oops! Something went wrong.</p>
              <p className="text-sm opacity-90">{state.error}</p>
            </div>
          </div>
        )}

        {/* Loading Skeleton (Simplified) */}
        {state.loading && !state.recipe && (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-slate-200 w-1/3 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        {state.recipe && !state.loading && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section of card */}
            <div className="p-8 md:p-12 border-b border-slate-50 bg-gradient-to-br from-white to-orange-50">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                    {state.recipe.recipeName}
                  </h2>
                  <div className="flex items-center text-slate-500 gap-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      {state.recipe.servings}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white">
                <p className="text-slate-600 leading-relaxed italic">
                  "{state.recipe.briefInstructions}"
                </p>
              </div>
            </div>

            {/* Ingredients Grid */}
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                Ingredients
                <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  {state.recipe.ingredients.length} items
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.recipe.ingredients.map((ing, idx) => (
                  <IngredientCard key={idx} ingredient={ing} />
                ))}
              </div>
            </div>

            {/* Chef Tip Section */}
            <div className="p-8 md:p-12 bg-slate-900 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/30">
                  👨‍🍳
                </div>
                <h4 className="text-xl font-bold">Chef's Pro Tip</h4>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">
                {state.recipe.chefTip}
              </p>
            </div>
          </div>
        )}

        {/* Empty State / Prompt */}
        {!state.recipe && !state.loading && !state.error && (
          <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400 text-lg">
              The kitchen is ready. Enter a recipe above to begin.
            </p>
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>
    </div>
  );
};

export default App;
