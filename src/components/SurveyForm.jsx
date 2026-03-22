import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import axios from 'axios'; // 1. Axios import kiya

const questions = [
  { id: 'q1', text: "1. How was the quality of the product?", type: 'rating' },
  { id: 'q2', text: "2. Did the product match its description?", type: 'rating' },
  { id: 'q3', text: "3. How was the delivery speed?", type: 'rating' },
  { id: 'q4', text: "4. How was your overall experience?", type: 'rating' },
  { id: 'q5', text: "5. Do you have any other comments or feedback?", type: 'text' }
];

const SurveyForm = () => {
  const { token } = useParams();
  const [ratings, setRatings] = useState({ q1: 0, q2: 0, q3: 0, q4: 0 });
  const [hover, setHover] = useState({});
  const [comment, setComment] = useState(""); 
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (qid, value) => {
    setRatings(prev => ({ ...prev, [qid]: value }));
  };

  // 2. Updated handleSubmit with Backend Connection
  const handleSubmit = async () => {
    if (!ratings.q1 || !ratings.q2 || !ratings.q3 || !ratings.q4) {
      alert("Please answer all rating questions!");
      return;
    }

    const finalData = {
      token,
      responses: {
        ...ratings,
        q5: comment
      }
    };

    try {
      // Backend (Node.js) ko data bhej rahe hain
      const response = await axios.post('http://localhost:5002/api/submit-review', finalData);
      
      if (response.data.success) {
        setSubmitted(true); // Success hone par Thank You screen dikhao
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#28a745', fontSize: '48px' }}>Thank You! ❤️</h1>
        <p style={{ fontSize: '18px' }}>Your feedback has been successfully recorded.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '60px auto', 
      padding: '40px', 
      textAlign: 'center', 
      boxShadow: '0 15px 35px rgba(0,0,0,0.1)', 
      borderRadius: '20px',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>YourBrand</div>
      <p style={{ color: '#666', marginBottom: '40px' }}>Please share your feedback for Order: <b>ORD-12345</b></p>
      
      {questions.map((question) => (
        <div key={question.id} style={{ textAlign: 'left', marginBottom: '35px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '15px' }}>{question.text}</h3>
          
          {question.type === 'rating' ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  size={38}
                  onMouseEnter={() => setHover(prev => ({ ...prev, [question.id]: num }))}
                  onMouseLeave={() => setHover(prev => ({ ...prev, [question.id]: 0 }))}
                  onClick={() => handleRating(question.id, num)}
                  fill={(hover[question.id] || ratings[question.id]) >= num ? "#FFD700" : "none"}
                  stroke={(hover[question.id] || ratings[question.id]) >= num ? "#FFD700" : "#ccc"}
                  style={{ cursor: 'pointer', transition: '0.2s' }}
                />
              ))}
              <span style={{ marginLeft: '10px', fontSize: '16px', color: '#888' }}>
                {ratings[question.id] > 0 ? `${ratings[question.id]} Stars` : "Select"}
              </span>
            </div>
          ) : (
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comments here..."
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ccc', 
                borderRadius: '8px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          )}
        </div>
      ))}

      <button 
        onClick={handleSubmit}
        style={{ 
          padding: '15px 50px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '30px', 
          fontSize: '20px', 
          cursor: 'pointer',
          fontWeight: 'bold',
          width: '100%',
          marginTop: '20px'
        }}
      >
        Submit Review
      </button>
    </div>
  );
};

export default SurveyForm;