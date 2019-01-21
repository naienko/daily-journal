fetch("http://localhost:8088/entries") // Fetch from the API
    .then(entries as entries.json)  // Parse as JSON
    .then(entries => {
        // What should happen when we finally have the array?
        renderJournalEntries(journalEntries);
    })

const makeJournalEntryComponent = (journalEntry) => {
    // Create your own HTML structure for a journal entry
    return `<hr /><header>${journalEntry.concepts}</header>
    <span class="date">${journalEntry.date}</span>
    <section class="entry">
        <p>${journalEntry.entry}</p>
        <p>Mood: ${journalEntry.mood}</p>
    </section>
    `;
}

const renderJournalEntries = (entries) => {
    let HTMLsquirt = "";
    for (let i = 0; i < entries.length; i++) {
        const element = entries[i];
        HTMLsquirt += makeJournalEntryComponent(element);
    }
    let location = document.querySelector(".entryLog");
    location.innerHTML = HTMLsquirt;
}

// Invoke the render function
// renderJournalEntries(journalEntries);