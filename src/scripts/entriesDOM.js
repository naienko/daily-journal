// responsible for modifying the DOM

// function for form display
const renderFormElement = () => {
    // let HTMLsquirt = "";
    // HTMLsquirt += makeJournalFormComponent();
    document.querySelector("#displayForm").innerHTML = makeJournalFormComponent();
};

const renderDOM = Object.create(null);
renderDOM.createEntries = createEntries = entries => {
    let HTMLsquirt = "";
    // reverse the array so most recent is at top
    entries.reverse().forEach(entry => {
        // run each entry through factory method
        HTMLsquirt += makeEntries.createSingleEntry(entry);
    });
    // add it to DOM
    document.querySelector("#displayEntries").innerHTML = HTMLsquirt;
};