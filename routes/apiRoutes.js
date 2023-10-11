const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const uuid = require('uuid');

const dbFilePath = path.join(__dirname, '../db/db.json');

// Route to get all saved notes
router.get('/notes', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
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
  
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error reading notes.' });
      }
  
      const notes = JSON.parse(data);
      newNote.id = uuid(); 
      notes.push(newNote);
  
      fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error writing notes.' });
        }
        res.json(newNote);
      });
    });
  });

// Route to delete a note
router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error reading notes.' });
      }
  
      const notes = JSON.parse(data);
  
      const noteIndex = notes.findIndex((note) => note.id === noteId);
  
      if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      notes.splice(noteIndex, 1);
  
      fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error writing notes.' });
        }
        res.json({ message: 'Note deleted' });
      });
    });
  });


module.exports = router;
