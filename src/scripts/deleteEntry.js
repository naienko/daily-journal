/*
Author: Panya
Task: delete entries
*/

const deleteEntry = () => {
    document.querySelector("#displayEntries").addEventListener("click", event => {
        if(event.target.id.split("--")[1] === "delete") {
            API.delete(event.target.id.split("--")[2])
                .then(
                    journalEntries => renderDOM.createEntries(journalEntries)
                );
        }
    });
};

export default deleteEntry;