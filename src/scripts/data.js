/*
Author: Panya
Intent: all contacts with the json server
*/

const API = {
    getJournalEntries () { // this is a method defined on the API object
        return fetch("http://localhost:8088/entries") // fetch from the JSON
            .then(entries => entries.json()); // parse AS json
    },
    saveJournalEntry (newJournalEntry) {
        fetch("http://localhost:8088/entries",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newJournalEntry)
        });
    }
};