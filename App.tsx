
import React, { useState, useCallback } from 'react';
import { CardData, GeneratedCardData } from './types';
import { generateCardDetails } from './geminiService';
import CardForm from './components/CardForm';
import TradingCard from './components/TradingCard';
import LoadingSpinner from './components/LoadingSpinner';
import { ScrollIcon } from './components/icons';

const App: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    email: '',
    skills: '',
    question: '',
    missingPiece: '',
  });
  const [generatedData, setGeneratedData] = useState<GeneratedCardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedData(null);
    try {
      const result = await generateCardDetails(cardData);
      setGeneratedData(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate card. The ancient spirits are not pleased. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [cardData]);

  const handleReset = () => {
    setCardData({ name: '', email: '', skills: '', question: '', missingPiece: '' });
    setGeneratedData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-amber-300 tracking-wider">Collaboration Trading Cards</h1>
          <p className="text-lg text-slate-300 mt-2 max-w-3xl mx-auto">Forge your research identity. Define your quest. Summon your collaborators.</p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 flex flex-col">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex-grow">
              <div className="flex items-center gap-3 mb-4">
                <ScrollIcon />
                <h2 className="font-cinzel text-2xl font-bold text-amber-400">Craft Your Legend</h2>
              </div>
              <p className="mb-6 text-slate-400">Complete your "Collaboration Trading Card". You can swap cards and we’ll place them on the board over lunch for others to see.</p>
              <CardForm 
                cardData={cardData} 
                setCardData={setCardData} 
                onGenerate={handleGenerateClick} 
                isLoading={isLoading} 
                generated={!!generatedData}
                onReset={handleReset}
              />
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="sticky top-8">
              <div className="aspect-[3/4.2] max-w-md mx-auto bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center p-4">
                {isLoading ? (
                  <LoadingSpinner />
                ) : error ? (
                  <div className="text-center text-red-400">
                    <h3 className="font-cinzel text-xl mb-2">An Error Occurred</h3>
                    <p>{error}</p>
                  </div>
                ) : generatedData ? (
                  <TradingCard cardData={cardData} generatedData={generatedData} />
                ) : (
                  <div className="text-center text-slate-500">
                    <h3 className="font-cinzel text-2xl font-bold text-slate-400 mb-2">Your Card Awaits</h3>
                    <p>Fill out the form to reveal your researcher persona.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <footer className="text-center text-slate-500 mt-12 py-4">
            <p>UCL Digital Mental Health Hub. For scholarly adventurers.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
