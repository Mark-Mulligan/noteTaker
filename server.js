const express = require('express');
const uniqid = require('uniqid');
const fs = require('fs');
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/home.html');
})

app.get("/notes", (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
})

app.get("/api/notes", (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        let dataFormatted = JSON.parse(data)
        res.json(dataFormatted);
    });
})

app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    newNote.id = uniqid();

    fs.readFile('./db/db.json', function (err, data) {
        if (err) throw err;
        var notes = JSON.parse(data);
        notes.push(newNote);

         fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.redirect("/notes");
          });  
    })
})

app.delete("/api/notes/:id", (req, res) => {
    let targetId = req.params.id;

    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        let filteredNotes = notes.filter(note => { return note.id !== targetId; });

        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) => {
            if (err) throw err;
            res.send('note deleted');
        }); 
    })
})

app.listen(process.env.PORT || 8000, () => {
    console.log('server has been started on port 8000');
})