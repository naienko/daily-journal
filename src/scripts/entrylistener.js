/*
Author: Panya
Task: listen to the entry form
*/

import API from "./API";
import createJournalEntry from "./entryFactory";
import makeEntries from "./entryComponent"

const entryListener = () => {
    const journalForm = document.querySelector("#postEntry");
    // what happens when we click the 'post' button?
    journalForm.addEventListener("click", () => {
        const entryDateRaw = new Date(document.querySelector("#journalDate").value);
        entryDateRaw.setHours(0,0,0);
        const timestamp = entryDateRaw.getTime();
        // collect entry data from the form
        const entryDate = timestamp;
        const entryHeader = document.querySelector("#journalLearn").value;
        const entryFull = document.querySelector("#journalEntry").value;
        const entryMood = document.querySelector("#journalMood").value;
        // construct entry object with factory function
        const newJournalEntry = createJournalEntry(entryDate, entryHeader, entryFull, entryMood);
        // check to see if we're editing
        if (document.querySelector("#journalId") !== "") {
            // if not editing add the new object to the database
            API.create(newJournalEntry)
                .then(
                    newEntry => {
                        API.get("moods",`/${newEntry.moodId}`)
                            .then(
                                moodObject => {
                                    newEntry.mood = moodObject;
                                    let newCode = makeEntries.createSingleEntry(newEntry);
                                    document.querySelector("#displayEntries").insertAdjacentHTML("afterbegin", newCode);
                                }
                            );
                        }
                    );
        } else {
            API.edit(newJournalEntry, document.querySelector("#journalId"))
                .then(
                    () => {
                        API.get("entries", "?_expand=mood&_sort=date&_order=desc")
                        .then(journalEntries => renderDOM.createEntries(journalEntries));
                    }
                )
        }
    });
}

export default entryListener;