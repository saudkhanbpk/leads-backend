const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/automation-route');
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
console.log("hello")
app.use('/api', router);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}
);
