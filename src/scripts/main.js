//  Main application logic that uses the functions and objects
//  defined in the other JavaScript files.

import API from "./data";
import renderDOM from "./entriesDOM";
import deleteEntry from "./deleteEntry";

API.getWithMoods().then(journalEntries => renderDOM.createEntries(journalEntries));

renderDOM.renderFormElement();
deleteEntry();