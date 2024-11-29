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
      console.log('Sending:', text); // Debug log
      
      const response = await fetch('https://api.gptzero.me/v2/predict/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'abdc84848c7848b8b88fd46bb48d8863'
        },
        body: JSON.stringify({ document: text }),
      });
      
      const data = await response.json();
      console.log('Received:', data); // Debug log
      
      if (response.ok) {
        setResult(data);
      }
    } catch (error) {
      console.error('Error:', error);
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

  // First, let's just show the processed text to verify API response
  const renderContent = () => {
    if (!result?.documents?.[0]?.sentences) {
      return text; // Show original text if no API result
    }

    return result.documents[0].sentences.map((sentence, i) => (
      <span key={i}>
        {sentence.text}
        {sentence.generated_prob > 0.2 && ' [AI] '}
      </span>
    ));
  };

  return (
    <div style={{minHeight: '100vh', padding: '2rem', fontFamily: 'Courier, monospace'}}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        {!result ? (
          <>
            <textarea
              placeholder="ENTER TEXT TO ANALYZE..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                width: '100%',
                minHeight: '400px',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontFamily: 'Courier, monospace',
                fontSize: '18px',
                textTransform: 'uppercase'
              }}
            />
            <div style={{marginTop: '1rem', color: '#666'}}>
              {loading ? 'ANALYZING_' : (
                !isLongEnough ? 
                  `${charactersRemaining} MORE CHARACTERS NEEDED_` : 
                  'PRESS ENTER TO ANALYZE_'
              )}
            </div>
          </>
        ) : (
          <div>
            <div style={{fontSize: '18px', whiteSpace: 'pre-wrap', textTransform: 'uppercase'}}>
              {renderContent()}
            </div>
            <div style={{marginTop: '2rem', textAlign: 'center'}}>
              VERDICT: {result.documents[0].completely_generated_prob > 0.02 ? 
                `${Math.round(result.documents[0].completely_generated_prob * 100)}% AI GENERATED` : 
                'HUMAN WRITTEN'}
              <br /><br />
              <button onClick={() => setResult(null)} 
                      style={{background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontFamily: 'inherit'}}>
                [NEW ANALYSIS]_
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}