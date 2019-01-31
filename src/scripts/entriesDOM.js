// responsible for modifying the DOM

// this is where we put the html
let insertHere = document.querySelector("#display");

// // function for entry display -- pass it an array of objects
// const renderJournalEntries = (entries) => {
//     let HTMLsquirt = "";
//     // reverse the array so most recent is at top
//     entries.reverse().forEach(entry => {
//         // run each entry through factory function
// //        HTMLsquirt += makeJournalEntryComponent(entry);
//         HTMLsquirt += makeEntries.createSingleEntry(entry);
//     });
//     // add it to DOM
//     insertHere.innerHTML = HTMLsquirt;
// };

// function for form display
const renderFormElement = () => {
    let HTMLsquirt = "";
    HTMLsquirt += makeJournalFormComponent();
    insertHere.innerHTML = HTMLsquirt;
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
    insertHere.innerHTML = HTMLsquirt;
};

const formClick = document.querySelector("#getform");
// when we click the form button, create the form then add the listener for new entries
formClick.addEventListener("click", () => {
    renderFormElement();
    entryListener();
});