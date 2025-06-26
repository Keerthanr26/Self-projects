import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [heartRate, setHeartRate] = useState('');
  const [steps, setSteps] = useState('');
  const [userId, setUserId] = useState('user1');
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = async () => {
    const response = await axios.get(`http://localhost:4000/api/health/${userId}`);
    setData(response.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:4000/api/health', { heartRate, steps, userId });
    if (response.data.alert) setAlert(response.data.alert.message);
    setHeartRate(''); setSteps('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Health Monitoring Dashboard</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <input type="text" value={userId} onChange={e => setUserId(e.target.value)} className="mb-4 p-2 border rounded w-full" placeholder="User ID" />
        <input type="number" value={heartRate} onChange={e => setHeartRate(e.target.value)} className="mb-4 p-2 border rounded w-full" placeholder="Heart Rate" />
        <input type="number" value={steps} onChange={e => setSteps(e.target.value)} className="mb-4 p-2 border rounded w-full" placeholder="Steps" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
      </form>
      {alert && <div className="bg-red-100 p-4 mb-4 rounded">{alert}</div>}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Health Data</h2>
        <ul>
          {data.map(entry => (
            <li key={entry.id} className="mb-2">{`Heart Rate: ${entry.heartRate}, Steps: ${entry.steps}, Time: ${new Date(entry.timestamp).toLocaleString()}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;