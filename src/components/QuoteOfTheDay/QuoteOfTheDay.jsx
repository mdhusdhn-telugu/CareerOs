import React, { useState, useEffect } from 'react';

function QuoteOfTheDay() {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      // This will now securely read your key from the .env file
      const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;

      if (!apiKey) {
        console.error("API Key is missing. Make sure it's in your .env file.");
        setError("API Key is not configured.");
        setIsLoading(false);
        return;
      }
      
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch('https://quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com/quote', options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setQuote({ text: data.text, author: data.author });
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch the quote:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, []); // Empty array ensures this runs only once

  if (isLoading) {
    return <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>Loading quote...</p>;
  }

  if (error) {
    // Renders nothing in the footer if there's an error
    return null;
  }

  return (
    <blockquote style={{ margin: 0, padding: 0 }}>
      <p style={{ margin: '0 0 5px 0' }}>"{quote.text}"</p>
      <cite style={{ fontSize: '0.9rem' }}>– {quote.author}</cite>
    </blockquote>
  );
}

export default QuoteOfTheDay;