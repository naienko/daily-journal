const journalEntries = [
    {
        date: "01/10/2019",
        concepts: "Objects and notations",
        entry: "today we learned about objects, dot notation, and bracket notation",
        mood: "happy"
    },
    {
        date: "01/08/2019",
        concepts: "group project",
        entry: "I should not have lied about how the group project made me feel",
        mood: "frustrated"
    }
];

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
renderJournalEntries(journalEntries);