/*
Author: Panya
Intent: all contacts with the json server
*/

const API = {
    get: (database, query) => { // this is a method defined on the API object
        return fetch(`http://localhost:8081/${database}${query}`) // fetch from the JSON
            .then(entries => entries.json()); // parse AS json
    },
    create: newJournalEntry => {
        return fetch("http://localhost:8081/entries",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newJournalEntry)
        })
            .then(entries => entries.json());
    },
    delete: itemId => {
        return fetch(`http://127.0.0.1:8081/entries/${itemId}`, {
            method: "DELETE"
        });
    },
    edit: (journalEntryObject, itemId) => {
        return fetch(`http://127.0.0.1:8088/contacts/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(journalEntryObject)
        })
            .then(entries => entries.json());
    }
};

export default API;