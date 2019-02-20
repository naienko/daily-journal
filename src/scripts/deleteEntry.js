/*
Author: Panya
Task: delete entries
*/

const deleteEntry = () => {
    document.querySelector("#contactDisplay").addEventListener("click", event => {
        if(event.target.id.split("--")[0] === "deletebutton") {
            API.deleteContact(event.target.id.split("--")[1])
            .then(createContactList);
        }
    });
};

export default deleteEntry;