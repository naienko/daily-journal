/*
Author: Panya
Intent:  responsible for creating the journal entry HTML component
*/

import moment from "moment";

const makeEntries = {
    createSingleEntry: journalEntry => {
        let realDate = moment(journalEntry.date).format("dddd, MMMM Do YYYY");
        return `<article id="entry--${journalEntry.id}" class="single-entry">
        <header>${journalEntry.concepts}</header>
        <span class="date">${realDate}</span>
        <section class="entry">
            <p>${journalEntry.entry}</p>
            <p>Mood: ${journalEntry.mood.mood}</p>
        </section>
        <div class="entry--buttons"><button id="entry--edit--${journalEntry.id}">edit</button> <button id="entry--delete--${journalEntry.id}">delete</button></div>
        </article>
        `;
    }
};

export default makeEntries;