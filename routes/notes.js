// Import our modular routers for /notes 
const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

// GET Route for retrieving all the tips
notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });
  
// POST Route for a new UX/UI notes
notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a new Note !`);
    console.log(req.body);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNotes = {
        title,
        text,
        id: uuid(),
      };
  
      readAndAppend(newNotes, './db/db.json');
      res.json(`Note added successfully 🚀`);
    } else {
      res.error('Error in adding note');
    }
  });
  
  // DELETE Route for a specific note with ID 
  notes.delete('/:id', (req, res) => {
    const notesId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all tips except the one with the ID provided in the URL
        const result = json.filter((notes) => notes.id !== notesId);
  
        // Save that array to the filesystem
        writeToFile('./db/db.json', result);
  
        // Respond to the DELETE request
        res.json(`Item ${notesId} has been deleted 🗑️`);
      });
  });

  module.exports = notes;