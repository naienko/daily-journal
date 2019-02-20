/*
Author: Panya
Task: edit entries
*/

import taco from "moment-timezone";
import API from "./API";
import moment from "moment";

const editEntry = () => {
    document.querySelector("#displayEntries").addEventListener("click", event => {
        if(event.target.id.split("--")[1] === "edit") {
            API.get("entries",`/${event.target.id.split("--")[2]}`)
                .then(
                    returnedEntry => {
                        document.querySelector("#journalLearn").value = returnedEntry.concepts;
                        document.querySelector("#journalEntry").value = returnedEntry.entry;
                        document.querySelector("#journalMood").value = returnedEntry.moodId;
                        document.querySelector("#journalId").value = returnedEntry.id;
                        let timestamp = returnedEntry.date;
                        document.querySelector("#journalDate").value = moment(timestamp).tz("America/Chicago").format("YYYY-MM-DD");
                        //entryListener();
                    }
                );
        }
    });
};

export default editEntry;