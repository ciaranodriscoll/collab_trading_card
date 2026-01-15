
import React from 'react';
import { CardData } from '../types';

interface CardFormProps {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  onGenerate: () => void;
  isLoading: boolean;
  generated: boolean;
  onReset: () => void;
}

const FormInput: React.FC<{
  id: keyof CardData;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextarea?: boolean;
  type?: string;
}> = ({ id, label, placeholder, value, onChange, isTextarea = false, type = 'text' }) => {
  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    className: "w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow duration-200",
    required: true,
  };
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-bold text-slate-300 mb-2">{label}</label>
      {isTextarea ? (
        <textarea {...commonProps} rows={3} />
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
};

const CardForm: React.FC<CardFormProps> = ({ cardData, setCardData, onGenerate, isLoading, generated, onReset }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const isFormIncomplete = !cardData.name || !cardData.email || !cardData.skills || !cardData.question || !cardData.missingPiece;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }}>
      <FormInput id="name" label="Your Name / Title" placeholder="e.g., Dr. Evelyn Reed" value={cardData.name} onChange={handleChange} />
      <FormInput id="email" label="Your Email Address" placeholder="So collaborators can reach you" value={cardData.email} onChange={handleChange} type="email" />
      <FormInput id="skills" label="Your Skills" placeholder="e.g., AI ethics, cognitive modeling" value={cardData.skills} onChange={handleChange} isTextarea />
      <FormInput id="question" label="Your Question" placeholder="e.g., developing new therapies for anxiety" value={cardData.question} onChange={handleChange} isTextarea />
      <FormInput id="missingPiece" label="The Missing Piece" placeholder="e.g., statistical analysis, user testing, interface design" value={cardData.missingPiece} onChange={handleChange} isTextarea />
      
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        {generated ? (
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto flex-1 text-center bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Create Another
          </button>
        ) : (
          <button 
            type="submit" 
            disabled={isLoading || isFormIncomplete}
            className="w-full sm:w-auto flex-1 text-center bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg shadow-teal-900/50"
          >
            {isLoading ? 'Conjuring...' : 'Generate Card'}
          </button>
        )}
      </div>
    </form>
  );
};

export default CardForm;
