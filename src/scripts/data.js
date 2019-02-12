/*
Author: Panya
Intent: all contacts with the json server
*/

const API = {
    get: () => { // this is a method defined on the API object
        return fetch("http://localhost:8088/entries") // fetch from the JSON
            .then(entries => entries.json()); // parse AS json
    },
    create: newJournalEntry => {
        return fetch("http://localhost:8088/entries",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newJournalEntry)
        })
        .then(entries => entries.json()); // parse AS json
    },
    delete: itemId => {
        return fetch(`http://127.0.0.1:8088/entries/${itemId}`, {
                method: "DELETE"
        })
    }
};