'use client';
import React, { useState } from 'react';

export default function Page() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
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
      console.log("API Response:", JSON.stringify(data, null, 2));
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isLongEnough) {
        handleSubmit();
      }
    }
  };

  const renderAnalyzedText = () => {
    console.log("Rendering text with data:", JSON.stringify(result?.documents?.[0]?.sentences, null, 2));
    
    if (!result?.documents?.[0]?.sentences) {
      console.log("No sentences data found");
      return null;
    }
    
    return result.documents[0].sentences.map((item, index) => {
      const isAIGenerated = item.generated_prob > 0.2;
      console.log("Sentence:", item.sentence, "Prob:", item.generated_prob, "Highlighted:", isAIGenerated);
      
      return (
        <span 
          key={index}
          style={{
            backgroundColor: isAIGenerated ? '#ffeb3b' : 'transparent',
            padding: '2px 0',
            lineHeight: '2'
          }}
        >
          {item.sentence} 
        </span>
      );
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        textAlign: 'center',
        fontFamily: 'Courier, monospace'
      }}>
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
                color: '#333',
                fontSize: '18px',
                textTransform: 'uppercase',
                textAlign: 'center',
                fontFamily: 'Courier, monospace',
                backgroundColor: 'transparent'
              }}
            />
            <div style={{
              marginTop: '1rem',
              color: '#666',
              fontSize: '14px'
            }}>
              {loading ? 'ANALYZING_' : (
                !isLongEnough ? 
                  `${charactersRemaining} MORE CHARACTERS NEEDED_` : 
                  'PRESS ENTER TO ANALYZE_'
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontSize: '18px',
              whiteSpace: 'pre-wrap',
              color: '#333',
              textTransform: 'uppercase'
            }}>
              {renderAnalyzedText()}
            </div>
            <div style={{
              fontSize: '18px',
              textAlign: 'center',
              marginTop: '2rem'
            }}>
              VERDICT: {Math.round(result.documents[0].completely_generated_prob * 100)}% AI GENERATED
              <br /><br />
              <button 
                onClick={() => {setText(''); setResult(null);}}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Courier, monospace'
                }}
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