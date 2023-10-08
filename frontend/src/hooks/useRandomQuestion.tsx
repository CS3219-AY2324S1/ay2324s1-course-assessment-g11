import { useState, useEffect } from "react";
import { Difficulty } from "../../types/QuestionTypes";

const useRandomQuestion = (difficulty: Difficulty, topics = []) => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = "http://localhost:5002/api/question-service/random-question";

    const fetchRandomQuestion = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          body: JSON.stringify({ difficulty, topics }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setQuestion(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomQuestion();
  }, [difficulty, topics]);

  return { question, loading, error };
};
