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

const Page = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);

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
      if (response.ok) setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charactersRemaining = Math.max(250 - text.length, 0);
  const isLongEnough = text.length >= 250;
  const isAIGenerated = (result?.documents?.[0]?.completely_generated_prob ?? 0) > 0.02;

  return (
    <div className="min-h-screen bg-white p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl text-center" style={{ fontFamily: 'Courier, monospace' }}>
        {!result ? (
          <>
            <textarea
              placeholder="ENTER TEXT TO ANALYZE..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full min-h-[400px] resize-none outline-none text-gray-600 text-lg uppercase text-center"
              style={{ fontFamily: 'Courier, monospace' }}
            />
            <div className="mt-4 text-gray-400 text-sm">
              {!isLongEnough ? (
                `${charactersRemaining} MORE CHARACTERS NEEDED_`
              ) : (
                'PRESS ENTER TO ANALYZE_'
              )}
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <div className="text-gray-800 text-lg whitespace-pre-wrap uppercase text-left" style={{ fontFamily: 'Courier, monospace' }}>
              <span 
                style={{
                  backgroundColor: result.documents[0].completely_generated_prob > 0.5 ? '#ffeb3b' : 'transparent',
                  padding: '2px 0',
                  lineHeight: '2'
                }}
              >
                {text}
              </span>
            </div>
            {result?.documents?.[0] && (
              <div className="text-lg">
                VERDICT: {isAIGenerated ? `${(result.documents[0].completely_generated_prob * 100).toFixed(1)}% AI GENERATED` : 'HUMAN WRITTEN'}
                <br /><br />
                <button 
                  onClick={() => {setText(''); setResult(null);}}
                  className="text-gray-400 hover:text-gray-600"
                >
                  [NEW ANALYSIS]_
                </button>
              </div>
            )}
          </div>
        )}
        {loading && <div className="mt-4 text-gray-400">ANALYZING_</div>}
      </div>
    </div>
  );
};

export default Page;