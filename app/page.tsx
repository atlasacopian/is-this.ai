'use client';
import React, { useState } from 'react';

interface ScanResult {
  documents: Array<{
    completely_generated_prob: number;
    sentences: Array<{
      text: string;
      generated_prob: number;
    }>;
  }>;
}

export default function Page() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const charactersRemaining = Math.max(250 - text.length, 0);
  const isLongEnough = text.length >= 250;

  const handleSubmit = async () => {
    if (!text || text.length < 250) return;
    setLoading(true);
    try {
      const response = await fetch('https://api.gptzero.me/v2/predict/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'abdc84848c7848b8b88fd46bb48d8863'
        },
        body: JSON.stringify({ document: text }),
      });
      
      const data = await response.json();
      console.log('API Response:', {
        text: text,
        result: data,
        sentences: data.documents?.[0]?.sentences?.map(s => ({
          text: s.text,
          prob: s.generated_prob
        }))
      });
      
      if (response.ok) setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isLongEnough) {
        handleSubmit();
      }
    }
  };

  // Helper function to get highlight color based on probability
  const getHighlightColor = (prob: number) => {
    if (prob < 0.2) return 'transparent';
    if (prob < 0.5) return 'rgba(255, 235, 59, 0.3)'; // Light yellow
    if (prob < 0.8) return 'rgba(255, 235, 59, 0.6)'; // Medium yellow
    return 'rgba(255, 235, 59, 0.9)'; // Strong yellow
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-3xl text-center font-mono">
        {!result ? (
          <>
            <textarea
              placeholder="ENTER TEXT TO ANALYZE..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full min-h-[400px] border-none outline-none resize-none 
                       text-gray-700 text-lg uppercase text-center font-mono 
                       bg-transparent"
            />
            <div className="mt-4 text-gray-500 text-sm">
              {loading ? 'ANALYZING_' : (
                !isLongEnough ? 
                  `${charactersRemaining} MORE CHARACTERS NEEDED_` : 
                  'PRESS ENTER TO ANALYZE_'
              )}
            </div>
          </>
        ) : (
          <div className="text-left">
            <div className="text-lg whitespace-pre-wrap text-gray-700 uppercase leading-loose">
              {result.documents[0].sentences.map((sentence, i) => (
                <span 
                  key={i}
                  style={{
                    backgroundColor: getHighlightColor(sentence.generated_prob),
                    transition: 'background-color 0.3s'
                  }}
                >
                  {sentence.text + ' '}
                </span>
              ))}
            </div>
            <div className="text-lg text-center mt-8">
              <div className="mb-4">
                VERDICT: {
                  result.documents[0].completely_generated_prob > 0.5 
                    ? `${Math.round(result.documents[0].completely_generated_prob * 100)}% AI GENERATED` 
                    : 'LIKELY HUMAN WRITTEN'
                }
              </div>
              <button 
                onClick={() => {setText(''); setResult(null);}}
                className="bg-transparent border-none text-gray-500 text-sm 
                          cursor-pointer font-mono hover:text-gray-700 
                          transition-colors"
              >
                [NEW ANALYSIS]_
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}