
import * as React from 'react';

interface DynamicEmailProps {
  title: string;
  body: React.ReactElement;
}

export const DynamicEmail: React.FC<Readonly<DynamicEmailProps>> = ({ title, body }) => {
  return (
    <html lang="en">
      <head>
          <style>{`
             body { font-family: sans-serif; line-height: 1.6; }
             .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
             h1 { font-size: 24px; }
          `}</style>
      </head>
      <body>
        <div className="container">
          <h1>{title}</h1>
          {body}
        </div>
      </body>
    </html>
  );
};
