import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Challenge() {
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState('');
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    fetchNextChallenge();
  }, []);

  const fetchNextChallenge = async () => {
    try {
      const response = await axios.get('/api/challenges/next');
      setChallenge(response.data.challenge);
    } catch (error) {
      toast.error('Failed to fetch challenge');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/challenges/submit', {
        challengeId: challenge._id,
        answer
      });
      
      if (response.data.isCorrect) {
        toast.success('Correct answer!');
      } else {
        toast.error('Incorrect answer. Try again!');
      }
      
      setAnswer('');
      fetchNextChallenge();
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);
        
        try {
          const response = await axios.post('/api/challenges/speech', formData);
          setAnswer(response.data.transcription);
        } catch (error) {
          toast.error('Failed to process speech');
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  if (!challenge) {
    return <div>Loading challenge...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Challenge</h2>
      <div className="mb-6">
        <p className="text-lg mb-2">{challenge.content.question}</p>
        {challenge.content.options && (
          <div className="space-y-2">
            {challenge.content.options.map((option, index) => (
              <label key={index} className="block">
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={answer === option}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="space-x-4">
        {challenge.type === 'pronunciation' && (
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`${
              recording ? 'bg-red-600' : 'bg-blue-600'
            } text-white py-2 px-4 rounded-md hover:opacity-90`}
          >
            {recording ? 'Stop Recording' : 'Start Recording'}
          </button>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          {!challenge.content.options && (
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="block w-full mb-4 p-2 border rounded"
              placeholder="Your answer..."
            />
          )}
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Submit Answer
          </button>
        </form>
      </div>
    </div>
  );
}

export default Challenge;