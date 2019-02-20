/*
Author: Panya
Task: edit entries
*/

import API from "./API";
import renderDOM from "./entriesDOM";

const editEntry = () => {
    document.querySelector("#displayEntries").addEventListener("click", event => {
        if(event.target.id.split("--")[1] === "edit") {
            API.get("entries",`/${event.target.id.split("--")[2]}`)
                .then(
                    returnedEntry => {
                        document.querySelector("#journalLearn").value = returnedEntry.concepts;
                        document.querySelector("#journalEntry").value = returnedEntry.entry;
                        document.querySelector("#journalMood").value = returnedEntry.moodId;
                    }
                );
        }
    });
};

export default editEntry;