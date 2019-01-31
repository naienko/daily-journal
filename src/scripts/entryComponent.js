// responsible for creating the journal entry HTML component

const makeJournalEntryComponent = (journalEntry) => {
    // Create your own HTML structure for a journal entry
    return `<header>${journalEntry.concepts}</header>
    <span class="date">${journalEntry.date}</span>
    <section class="entry">
        <p>${journalEntry.entry}</p>
        <p>Mood: ${journalEntry.mood}</p>
    </section>
    `;
}