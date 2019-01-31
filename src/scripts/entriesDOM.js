// responsible for modifying the DOM

let insertHere = document.querySelector("#display");

const renderJournalEntries = (entries) => {
    let HTMLsquirt = "";
    for (let i = 0; i < entries.length; i++) {
        const element = entries[i];
        HTMLsquirt += makeJournalEntryComponent(element);
    }
    // let insertHere = document.querySelector(".entryLog");
    insertHere.innerHTML = HTMLsquirt;
};

const renderFormElement = () => {
    let HTMLsquirt = "";
    HTMLsquirt += makeJournalFormComponent();
    // let insertHere = document.querySelector("#formset");
    insertHere.innerHTML = HTMLsquirt;
};

const formClick = document.querySelector("#getform");
formClick.addEventListener("click", () => {
    renderFormElement();
    entryListener();
});

const entryClick = document.querySelector("#getentries");
entryClick.addEventListener("click", showAllEntries);