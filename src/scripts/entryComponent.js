/*
Author: Panya
Intent:  responsible for creating the journal entry HTML component
*/

import moment from "moment";

const makeEntries = {
    createSingleEntry: journalEntry => {
        let realDate = moment(journalEntry.date).format("dddd, MMMM Do YYYY");
        return `<header>${journalEntry.concepts}</header>
        <span class="date">${realDate}</span>
        <section class="entry">
            <p>${journalEntry.entry}</p>
            <p>Mood: ${journalEntry.mood.mood}</p>
        </section>
        `;
    }
};

export default makeEntries;