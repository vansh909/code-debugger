const express = require('express');
const app = express();
const port = 3000;  

app.use(express.json());   

const executeRoute = require('./routes/execute.route');
app.use('/api', executeRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

