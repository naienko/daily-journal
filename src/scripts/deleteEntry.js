/*
Author: Panya
Task: delete entries
*/

import API from "./API";
import renderDOM from "./entriesDOM";

const deleteEntry = () => {
    document.querySelector("#displayEntries").addEventListener("click", event => {
        if(event.target.id.split("--")[1] === "delete") {
            API.delete(event.target.id.split("--")[2])
                .then(
                    () => {
                        API.get("entries", "?_expand=mood&_sort=date&_order=desc")
                            .then(journalEntries => renderDOM.createEntries(journalEntries));
                    }
                );
        }
    });
};

export default deleteEntry;