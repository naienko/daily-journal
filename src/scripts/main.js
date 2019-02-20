//  Main application logic that uses the functions and objects
//  defined in the other JavaScript files.

import API from "./API";
import renderDOM from "./entriesDOM";
import deleteEntry from "./deleteEntry";
import editEntry from "./editEntry";

API.get("entries", "?_expand=mood&_sort=date&_order=desc")
    .then(journalEntries => renderDOM.createEntries(journalEntries));

renderDOM.renderFormElement();
editEntry();
deleteEntry();