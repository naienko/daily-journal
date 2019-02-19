/*
Author: Panya
Intent: object with event listeners
*/

import API from "./data";
import renderDOM from "./entriesDOM";
import createJournalEntry from "./entryFactory";

const listeners = {
    entryListener: () => {
        const journalForm = document.querySelector("#postEntry");
        // what happens when we click the 'post' button?
        journalForm.addEventListener("click", () => {
            // collect entry data from the form
            const entryDate = document.querySelector("#journalDate").value.getTime();
            const entryHeader = document.querySelector("#journalLearn").value;
            const entryFull = document.querySelector("#journalEntry").value;
            const entryMood = document.querySelector("#journalMood").value;
            // construct entry object with factory function
            const newJournalEntry = createJournalEntry(entryDate, entryHeader, entryFull, entryMood);
            // add the new object to the database
            API.create(newJournalEntry);
        });
    },
    moodListener: () => {
        // get the list of all moods in an array
        const moodSwitchList = document.getElementsByName("moodSwitch");
        // iterate over that array
        moodSwitchList.forEach(element => {
            // add an event listener to each radio button
            element.addEventListener("click", event => {
                // get the mood of the clicked button
                const mood = event.target.value;
                // grab all the entries from the database
                API.get().then(
                    journalEntries => {
                        // match the clicked mood to the mood value of a given entry
                        const moodEntries = journalEntries.filter(entries => entries.mood === mood);
                        // if none match do this
                        if (moodEntries.length === 0) {
                            document.querySelector("#displayEntries").innerHTML = "no entries found with that mood";
                        } else {
                            // otherwise use the factory function to put them on the dom
                            renderDOM.createEntries(moodEntries);
                        }
                    }
                );
            });
        });
    },
    searchListener: () => {
        // listen for keypresses in the search field
        document.querySelector("#searchjournal").addEventListener("keypress", event => {
            // store the data in the search field
            const searchTerm = event.target.value;
            // create a blank array for entries
            let returnedEntries = [];
            // grab all the entries from the database
            API.get().then(
                journalEntries => {
                    // iterate over all the values from the database
                    for (const value of Object.values(journalEntries)) {
                        // find the search term in the entry values of the database
                        if (value.entry.includes(searchTerm)) {
                            // push those into that blank array
                            returnedEntries.push(value);
                        }
                    }
                    // use the factory function to put them on the dom
                    renderDOM.createEntries(returnedEntries);
                }
            );
        });
    }
};

export default listeners;