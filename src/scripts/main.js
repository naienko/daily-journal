//  Main application logic that uses the functions and objects
//  defined in the other JavaScript files.

import API from "./data";
import renderDOM from "./entriesDOM";
import listeners from "./eventListeners";

API.getWithMoods().then(journalEntries => renderDOM.createEntries(journalEntries));

renderDOM.renderFormElement();
listeners.entryListener();
listeners.moodListener();
listeners.searchListener();