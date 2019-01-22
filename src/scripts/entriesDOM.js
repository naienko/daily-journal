// responsible for modifying the DOM

const renderJournalEntries = (entries) => {
    let HTMLsquirt = "";
    for (let i = 0; i < entries.length; i++) {
        const element = entries[i];
        HTMLsquirt += makeJournalEntryComponent(element);
    }
    let location = document.querySelector(".entryLog");
    location.innerHTML = HTMLsquirt;
}

const renderFormElement = () => {
    let HTMLsquirt = "";
    HTMLsquirt += makeJournalFormComponent();
    let location = document.querySelector("#formset");
    location.innerHTML = HTMLsquirt;
}