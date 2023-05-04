const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => {
  // const body = req.body;

  console.log(req.body);

  res.send(201);
});

module.exports = router;
