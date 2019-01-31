// get the data from the form
const createJournalEntry = (entryDate, entryHeader, entryFull, entryMood) => {
    return {
        date: entryDate,
        concepts: entryHeader,
        entry: entryFull,
        mood: entryMood
    };
};

const entryListener = () => {
    const journalForm = document.querySelector("#postEntry");
    journalForm.addEventListener("click", () => {
        const entryDate = document.querySelector("#journalDate").value;
        const entryHeader = document.querySelector("#journalLearn").value;
        const entryFull = document.querySelector("#journalEntry").value;
        const entryMood = document.querySelector("#journalMood").value;
        const newJournalEntry = createJournalEntry(entryDate, entryHeader, entryFull, entryMood);
        fetch("http://localhost:8088/entries",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newJournalEntry)
        });
    });
};