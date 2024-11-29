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
     // Debug logging
     console.log('Raw API Response:', JSON.stringify(data, null, 2));
     console.log('Sentences:', data?.documents?.[0]?.sentences);
     
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
               !isLongEnough ? (
                 `${charactersRemaining} MORE CHARACTERS NEEDED_`
               ) : (
                 'PRESS ENTER TO ANALYZE_'
               )
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
             {result.documents[0]?.sentences?.map((sentence, i) => (
               <span 
                 key={i}
                 style={{
                   backgroundColor: sentence?.generated_prob > 0.2 ? '#ffeb3b' : 'transparent',
                   padding: '2px 0',
                   lineHeight: '2'
                 }}
               >
                 {sentence?.text || ''} 
               </span>
             ))}
           </div>
           <div style={{
             fontSize: '18px',
             textAlign: 'center',
             marginTop: '2rem'
           }}>
             VERDICT: {result.documents[0].completely_generated_prob > 0.02 ? 
               `${Math.round(result.documents[0].completely_generated_prob * 100)}% AI GENERATED` : 
               'HUMAN WRITTEN'}
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