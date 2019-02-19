/*
Author: Panya
Intent: all contacts with the json server
*/

const API = {
    get: database => { // this is a method defined on the API object
        return fetch(`http://localhost:8081/${database}`) // fetch from the JSON
            .then(entries => entries.json()); // parse AS json
    },
    getWithMoods: () => {
        return fetch("http://localhost:8081/entries?_expand=mood")
            .then(entries => entries.json());
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