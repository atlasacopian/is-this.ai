import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            background: white;
          }
          textarea {
            border: none;
            outline: none;
            resize: none;
            font-family: 'Courier', monospace;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}