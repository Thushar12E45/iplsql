const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  // res.send(`<h2> Mark Pearson1</h2>`);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening at port http://localhost:${PORT}/`);
});
