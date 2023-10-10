const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const uuid = require('uuid');

// Route to get all saved notes
router.get('/notes', (req, res) => {
  fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading notes.' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Route to save a note
router.post('/notes', (req, res) => {
    const newNote = req.body;
  
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error reading notes.' });
      }
  
      const notes = JSON.parse(data);
      newNote.id = uuid(); // Generate a unique ID using uuid/v1
      notes.push(newNote);
  
      fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error writing notes.' });
        }
        res.json(newNote);
      });
    });
  });

module.exports = router;
