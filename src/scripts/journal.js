//  Main application logic that uses the functions and objects
//  defined in the other JavaScript files.

API.getJournalEntries()
    .then(journalEntries => renderDOM.createEntries(journalEntries));


// get the data from the form
const createJournalEntry = (entryDate, entryHeader, entryFull, entryMood) => {
    return {
        date: entryDate,
        concepts: entryHeader,
        entry: entryFull,
        mood: entryMood
    };
};

renderFormElement();
entryListener();
moodListener();