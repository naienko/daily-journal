
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
        API.saveJournalEntry(newJournalEntry);
    });
};

const moodListener = () => {
    const moodSwitchList = document.getElementsByName("moodSwitch");
    moodSwitchList.forEach(element => {
        element.addEventListener("click", event => {
            const mood = event.target.value;
            API.getJournalEntries().then(
                journalEntries => {
                    const moodEntries = journalEntries.filter(entries => entries.mood === mood);
                    if (moodEntries.length === 0) {
                        document.querySelector("#displayEntries").innerHTML = "no entries found with that mood";
                    } else {
                        renderDOM.createEntries(moodEntries);
                    }
                }
            );
        });
    });
};

const searchListener = () => {
    document.querySelector("#searchjournal").addEventListener("keypress", event => {
        const searchTerm = event.target.value;
        returnedEntries = [];
        API.getJournalEntries().then(
            journalEntries => {
                for (const value of Object.values(journalEntries)) {
                    if(value.entry.includes(searchTerm)) {
                        returnedEntries.push(value);
                    }
                }
            renderDOM.createEntries(returnedEntries);
        });
    });
}