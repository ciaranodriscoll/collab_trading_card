
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { CardData, GeneratedCardData } from '../types';
import { BrainCircuitIcon, WandIcon, TelescopeIcon, UsersIcon, DownloadIcon, AtSignIcon, UploadCloudIcon } from './icons';

interface TradingCardProps {
  cardData: CardData;
  generatedData: GeneratedCardData;
}

const CardSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
            {icon}
            <h3 className="font-cinzel text-sm font-bold text-amber-300 tracking-wide">{title}</h3>
        </div>
        <p className="text-slate-300 text-sm leading-normal break-words">{children}</p>
    </div>
);


const TradingCard: React.FC<TradingCardProps> = ({ cardData, generatedData }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const getCanvas = (): Promise<HTMLCanvasElement> => {
        const cardElement = document.getElementById('card-content');
        if (!cardElement) {
            return Promise.reject(new Error('Card element not found'));
        }
        return html2canvas(cardElement, {
            useCORS: true,
            backgroundColor: '#1e2d3b', // Match bg-slate-800
            scale: 2, // Higher resolution
        });
    };

    const handleDownload = async () => {
        try {
            const canvas = await getCanvas();
            const link = document.createElement('a');
            link.download = `${cardData.name.replace(/[\s,'"]+/g, '-')}-card.jpeg`;
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        } catch (error) {
            console.error("Failed to download card:", error);
        }
    };
    
    const handleUpload = async () => {
        setIsUploading(true);
        setUploadStatus('idle');

        try {
            const canvas = await getCanvas();
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            // The API expects a raw base64 string, so we remove the data URL prefix
            const base64Image = dataUrl.split(',')[1];
            
            const payload = {
                image: base64Image,
                mimeType: "image/jpeg",
                cardData: cardData
            };
            
            const response = await fetch("http://194.76.26.55:4567/api/upload-image", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            setUploadStatus('success');

        } catch (error) {
            console.error("Upload failed. This may be due to a server-side CORS policy or network issue. Check the browser's network tab for more details.", error);
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
            // Reset status after a few seconds
            setTimeout(() => setUploadStatus('idle'), 3000);
        }
    };

    const getUploadButtonContent = () => {
        if (isUploading) {
            return 'Uploading...';
        }
        switch (uploadStatus) {
            case 'success':
                return 'Success!';
            case 'error':
                return 'Failed!';
            default:
                return 'Upload';
        }
    };


    return (
        <div id="card-to-print" className="relative w-full h-full p-1.5 bg-gradient-to-br from-amber-500 via-amber-300 to-yellow-500 rounded-2xl shadow-2xl shadow-black/so">
            {/* The actual card content to be captured or printed */}
            <div id="card-content" className="relative w-full h-full bg-slate-800 rounded-xl border-2 border-slate-900 overflow-hidden flex flex-col">
                {/* Image Container */}
                <div className="w-full h-[38%] bg-black">
                    <img src={generatedData.imageUrl} alt={cardData.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>

                {/* Content Container */}
                <div className="p-3 flex-grow flex flex-col">
                    {/* Header */}
                    <div className="text-center mb-2 border-b-2 border-amber-400/50 pb-2">
                        <h2 className="font-cinzel text-xl font-bold text-amber-300 leading-tight">{cardData.name}</h2>
                        <p className="font-cinzel text-sm text-slate-300 tracking-wider">{generatedData.characterClass}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex-grow space-y-2 mt-4">
                        <CardSection title="Skills" icon={<WandIcon />}>
                            {cardData.skills}
                        </CardSection>
                        <CardSection title="Quest" icon={<TelescopeIcon />}>
                            {cardData.question}
                        </CardSection>
                        <CardSection title="Seeking" icon={<UsersIcon />}>
                           {cardData.missingPiece}
                        </CardSection>
                        <CardSection title="Contact" icon={<AtSignIcon />}>
                           {cardData.email}
                        </CardSection>
                    </div>
                </div>

                {/* Footer Symbol */}
                <div className="absolute bottom-1 right-1 text-teal-600 opacity-50">
                    <BrainCircuitIcon />
                </div>
            </div>
            
            {/* Action buttons, positioned on top and excluded from print/capture */}
            <div className="no-print absolute top-3 right-3 flex items-center gap-2">
                <button 
                    onClick={handleUpload} 
                    title="Upload Card" 
                    disabled={isUploading}
                    className={`p-2 bg-slate-900/70 backdrop-blur-sm rounded-full text-amber-300 hover:bg-slate-800/80 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${uploadStatus === 'success' ? '!bg-green-600/80' : ''} ${uploadStatus === 'error' ? '!bg-red-600/80' : ''}`}
                 >
                    <UploadCloudIcon />
                </button>
                 <button onClick={handleDownload} title="Download as JPEG" className="p-2 bg-slate-900/70 backdrop-blur-sm rounded-full text-amber-300 hover:bg-slate-800/80 hover:text-white transition-all">
                    <DownloadIcon />
                </button>
            </div>
            {uploadStatus !== 'idle' && !isUploading && (
              <div className={`no-print absolute top-14 right-3 text-xs px-2 py-1 rounded ${uploadStatus === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {uploadStatus === 'success' ? 'Upload successful!' : 'Upload failed.'}
              </div>
            )}
        </div>
    );
};

export default TradingCard;
