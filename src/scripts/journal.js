//  Main application logic that uses the functions and objects
//  defined in the other JavaScript files.

const entryClick = document.querySelector("#getentries");
// when we click the entries button, create the entries
entryClick.addEventListener("click", () => {
    API.getJournalEntries()
        .then(journalEntries => renderDOM.createEntries(journalEntries));
});

// get the data from the form
const createJournalEntry = (entryDate, entryHeader, entryFull, entryMood) => {
    return {
        date: entryDate,
        concepts: entryHeader,
        entry: entryFull,
        mood: entryMood
    };
};

// function to add the event listener
const entryListener = () => {
    const journalForm = document.querySelector("#postEntry");
    // what happens when we click the 'post' button?
    journalForm.addEventListener("click", () => {
        const entryDate = document.querySelector("#journalDate").value;
        const entryHeader = document.querySelector("#journalLearn").value;
        const entryFull = document.querySelector("#journalEntry").value;
        const entryMood = document.querySelector("#journalMood").value;
        // construct entry object with factory function
        const newJournalEntry = createJournalEntry(entryDate, entryHeader, entryFull, entryMood);
        // add it to JSON
        fetch("http://localhost:8088/entries",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newJournalEntry)
        });
    });
};