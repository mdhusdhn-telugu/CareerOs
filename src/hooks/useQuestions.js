import { useState, useEffect } from 'react';

// Utility function to shuffle an array for random question order
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  
  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

export const useQuestions = ({ limit, tags, difficulty }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't fetch if a category tag isn't provided.
    if (!tags) {
      setLoading(false);
      setQuestions([]);
      return;
    }

    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      
      // Dynamically create the file path from the tag (e.g., "mathematics" -> "/questions/mathematics.json").
      const filePath = `/questions/${tags.toLowerCase()}.json`;

      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Could not find or load the question file: ${filePath}`);
        }
        const categoryQuestions = await response.json();

        // --- FILTERING LOGIC ---
        let filteredQuestions = categoryQuestions;
        
        // Filter by difficulty if the 'difficulty' parameter is provided.
        if (difficulty) {
            filteredQuestions = filteredQuestions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
        }

        // Shuffle the filtered questions to ensure variety each time.
        const shuffled = shuffleArray(filteredQuestions);
        
        // Return only the number of questions requested by the 'limit' parameter.
        const selectedQuestions = shuffled.slice(0, limit);
        
        setQuestions(selectedQuestions);

      } catch (err) {
        setError(err);
        console.error("Failed to fetch questions:", err);
        setQuestions([]); // Ensure questions are cleared out on an error.
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
    
  }, [limit, tags, difficulty]); // This effect re-runs whenever the limit, tag, or difficulty changes.

  return { questions, loading, error };
};