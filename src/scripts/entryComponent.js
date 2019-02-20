/*
Author: Panya
Intent:  responsible for creating the journal entry HTML component
*/

const makeEntries = {
    createSingleEntry: journalEntry => {
        return `<article id="entry--${journalEntry.id}">
        <header>${journalEntry.concepts}</header>
        <span class="date">${journalEntry.date}</span>
        <section class="entry">
            <p>${journalEntry.entry}</p>
            <p>Mood: ${journalEntry.mood.mood}</p>
        </section>
        <button id="entry--edit--${journalEntry.id}">edit</button> <button id="entry--delete--${journalEntry.id}">delete</button>
        </article>
        `;
    }
};

export default makeEntries;