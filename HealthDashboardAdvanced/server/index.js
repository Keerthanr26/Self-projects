const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

let healthData = [];

app.post('/api/health', (req, res) => {
  const { heartRate, steps, userId } = req.body;
  const entry = { id: Date.now(), heartRate, steps, userId, timestamp: new Date().toISOString() };
  healthData.push(entry);
  console.log(`Received: ${JSON.stringify(entry)}`);
  res.json({ success: true });
});

app.get('/api/health/:userId', (req, res) => {
  const userId = req.params.userId;
  const data = healthData.filter(d => d.userId === userId);
  res.json(data);
});

app.listen(port, () => console.log(`Test server running on port ${port}`));