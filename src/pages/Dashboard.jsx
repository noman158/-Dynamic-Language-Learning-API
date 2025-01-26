import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Dashboard() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get('/api/progress');
      setProgress(response.data.progress);
    } catch (error) {
      toast.error('Failed to fetch progress');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        {progress ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Total Points</h3>
              <p className="text-2xl">{progress.totalPoints}</p>
            </div>
            <div>
              <h3 className="font-semibold">Average Accuracy</h3>
              <p className="text-2xl">{progress.averageAccuracy}%</p>
            </div>
          </div>
        ) : (
          <p>Loading progress...</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Start Learning</h2>
        <Link
          to="/challenge"
          className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Start New Challenge
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;