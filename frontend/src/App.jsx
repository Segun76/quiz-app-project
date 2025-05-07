import './App.css';
import React, { useState, useEffect } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // New state to manage the welcome screen

  useEffect(() => {
    fetch("http://localhost:4000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Failed to fetch questions:", err));
  }, []);

  const handleNext = () => {
    if (selected === questions[currentIndex].ans) {
      setScore(score + 1);
    }
    setSelected(null);
    setSubmitted(false);
    setCurrentIndex(currentIndex + 1);
  };

  // If quiz has not started, show the welcome page
  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <h1>Welcome to the Bible Quiz!</h1>
        <button onClick={() => setQuizStarted(true)}>Start Quiz</button>
      </div>
    );
  }

  if (questions.length === 0) return <div className="quiz-container">Loading questions...</div>;
  if (currentIndex >= questions.length)
    return (
      <div className="quiz-container">
        <h1>Quiz Complete!</h1>
        <p>Your Score: {score} / {questions.length}</p>
      </div>
    );

  const q = questions[currentIndex];

  return (
    <div className="quiz-container">
      <h2>Question {currentIndex + 1} of {questions.length}</h2>
      <h3>{q.question}</h3>
      <form>
        {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
          <div key={i} className="options">
            <label>
              <input
                type="radio"
                value={i + 1}
                checked={selected === i + 1}
                onChange={() => setSelected(i + 1)}
              />
              {` ${opt}`}
            </label>
          </div>
        ))}
      </form>
      <button
        disabled={selected === null}
        onClick={() => {
          setSubmitted(true);
          handleNext();
        }}
      >
        {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next"}
      </button>
    </div>
  );
}

export default App;
