// deals with getting the data

// const showAllEntries = () => {
//     fetch("http://localhost:8088/entries") // Fetch from the API
//         .then(entries => entries.json())  // Parse as JSON
//         .then(journalEntries => {
//             // What should happen when we finally have the array?
//             renderJournalEntries(journalEntries);
//         });
// };

const API = {
    getJournalEntries () { // this is a method defined on the API object
        return fetch("http://localhost:8088/entries") // fetch from the JSON
            .then(entries => entries.json()); // parse AS json
    }
};