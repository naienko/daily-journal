/*
Author: Panya
Intent:  responsible for creating the journal entry HTML component
*/

const makeEntries = {
    createSingleEntry: journalEntry => {
        return `<header>${journalEntry.concepts}</header>
        <span class="date">${journalEntry.date}</span>
        <section class="entry">
            <p>${journalEntry.entry}</p>
            <p>Mood: ${journalEntry.mood.mood}</p>
        </section>
        `;
    }
};

export default makeEntries;