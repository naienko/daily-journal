/*
Author: Panya
Task: listen to the entry form
*/

import API from "./API";
import createJournalEntry from "./entryFactory";
import makeEntries from "./entryComponent";
import renderDOM from "./entriesDOM";
import moment from "moment";

const entryListener = () => {
    const journalForm = document.querySelector("#postEntry");
    // what happens when we click the 'post' button?
    journalForm.addEventListener("click", () => {
        const entryDateRaw = moment(document.querySelector("#journalDate").value);
        entryDateRaw.set({"hour": 0, "minute": 0});
        const timestamp = entryDateRaw.valueOf();
        // collect entry data from the form
        const entryDate = timestamp;
        const entryHeader = document.querySelector("#journalLearn").value;
        const entryFull = document.querySelector("#journalEntry").value;
        const entryMood = document.querySelector("#journalMood").value;
        const entryId = document.querySelector("#journalId").value;
        // construct entry object with factory function
        const newJournalEntry = createJournalEntry(entryDate, entryHeader, entryFull, entryMood);
        // check to see if we're editing
        if (entryId === "") {
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
            API.edit(newJournalEntry, entryId)
                .then(
                    () => {
                        API.get("entries", "?_expand=mood&_sort=date&_order=desc")
                            .then(journalEntries => renderDOM.createEntries(journalEntries));
                        document.querySelector("#journalLearn").value = "";
                        document.querySelector("#journalEntry").value = "";
                        document.querySelector("#journalMood").value = "";
                        document.querySelector("#journalDate").value = "";
                        document.querySelector("#journalId").value = "";
                    }
                );
        }
    });
};

export default entryListener;