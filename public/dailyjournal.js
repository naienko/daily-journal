(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
Author: Panya
Intent: all contacts with the json server
*/
const API = {
  get: database => {
    // this is a method defined on the API object
    return fetch(`http://localhost:8081/${database}`) // fetch from the JSON
    .then(entries => entries.json()); // parse AS json
  },
  getWithMoods: () => {
    return fetch("http://localhost:8081/entries?_expand=mood").then(entries => entries.json());
  },
  create: newJournalEntry => {
    return fetch("http://localhost:8081/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newJournalEntry)
    }).then(entries => entries.json());
  },
  delete: itemId => {
    return fetch(`http://127.0.0.1:8081/entries/${itemId}`, {
      method: "DELETE"
    });
  },
  edit: (journalEntryObject, itemId) => {
    return fetch(`http://127.0.0.1:8088/contacts/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(journalEntryObject)
    }).then(entries => entries.json());
  }
};
var _default = API;
exports.default = _default;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formComponent = _interopRequireDefault(require("./formComponent"));

var _entryComponent = _interopRequireDefault(require("./entryComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Author: Panya
Intent: responsible for modifying the DOM
*/
const renderDOM = {
  createEntries: entries => {
    let HTMLsquirt = ""; // reverse the array so most recent is at top
    // add a sorting function in case the entries aren't in data order in database?

    entries.reverse().forEach(entry => {
      // run each entry through factory method
      HTMLsquirt += _entryComponent.default.createSingleEntry(entry);
    }); // add it to DOM

    document.querySelector("#displayEntries").innerHTML = HTMLsquirt;
  },
  renderFormElement: () => {
    document.querySelector("#displayForm").innerHTML = (0, _formComponent.default)();
  }
};
var _default = renderDOM;
exports.default = _default;

},{"./entryComponent":3,"./formComponent":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
Author: Panya
Intent:  responsible for creating the journal entry HTML component
*/
const makeEntries = {
  createSingleEntry: journalEntry => {
    return `<header>${journalEntry.concepts}</header>
        <span class="date">${journalEntry.date}</span>
        <section class="entry">
            <p>${journalEntry.entry}</p>
            <p>Mood: ${journalEntry.mood.mood}</p>
        </section>
        `;
  }
};
var _default = makeEntries;
exports.default = _default;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
Author: Panya
Intent: factory function that creates a new entry object
*/
const createJournalEntry = (entryDate, entryHeader, entryFull, entryMood) => {
  return {
    date: entryDate,
    concepts: entryHeader,
    entry: entryFull,
    mood: entryMood
  };
};

var _default = createJournalEntry;
exports.default = _default;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _data = _interopRequireDefault(require("./data"));

var _entriesDOM = _interopRequireDefault(require("./entriesDOM"));

var _entryFactory = _interopRequireDefault(require("./entryFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Author: Panya
Intent: object with event listeners
*/
const listeners = {
  entryListener: () => {
    const journalForm = document.querySelector("#postEntry"); // what happens when we click the 'post' button?

    journalForm.addEventListener("click", () => {
      // collect entry data from the form
      const entryDate = document.querySelector("#journalDate").value;
      const entryHeader = document.querySelector("#journalLearn").value;
      const entryFull = document.querySelector("#journalEntry").value;
      const entryMood = document.querySelector("#journalMood").value; // construct entry object with factory function

      const newJournalEntry = (0, _entryFactory.default)(entryDate, entryHeader, entryFull, entryMood); // add the new object to the database

      _data.default.create(newJournalEntry);
    });
  },
  moodListener: () => {
    // get the list of all moods in an array
    const moodSwitchList = document.getElementsByName("moodSwitch"); // iterate over that array

    moodSwitchList.forEach(element => {
      // add an event listener to each radio button
      element.addEventListener("click", event => {
        // get the mood of the clicked button
        const mood = event.target.value; // grab all the entries from the database

        _data.default.get().then(journalEntries => {
          // match the clicked mood to the mood value of a given entry
          const moodEntries = journalEntries.filter(entries => entries.mood === mood); // if none match do this

          if (moodEntries.length === 0) {
            document.querySelector("#displayEntries").innerHTML = "no entries found with that mood";
          } else {
            // otherwise use the factory function to put them on the dom
            _entriesDOM.default.createEntries(moodEntries);
          }
        });
      });
    });
  },
  searchListener: () => {
    // listen for keypresses in the search field
    document.querySelector("#searchjournal").addEventListener("keypress", event => {
      // store the data in the search field
      const searchTerm = event.target.value; // create a blank array for entries

      let returnedEntries = []; // grab all the entries from the database

      _data.default.get().then(journalEntries => {
        // iterate over all the values from the database
        for (const value of Object.values(journalEntries)) {
          // find the search term in the entry values of the database
          if (value.entry.includes(searchTerm)) {
            // push those into that blank array
            returnedEntries.push(value);
          }
        } // use the factory function to put them on the dom


        _entriesDOM.default.createEntries(returnedEntries);
      });
    });
  }
};
var _default = listeners;
exports.default = _default;

},{"./data":1,"./entriesDOM":2,"./entryFactory":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _data = _interopRequireDefault(require("./data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Author: Panya
Intent:  responsible for creating the entry form HTML component
*/
const showAllMoods = () => {
  _data.default.get("moods").then(moodArray => {
    let HTMLcode = "";
    moodArray.forEach(element => {
      HTMLcode += `<option value=${element.id}>${element.mood}</option>
            `;
    });
    return HTMLcode;
  });
};

const makeJournalFormComponent = () => {
  // Create HTML structure for the entry form
  return `<form action="" id="journalForm">
        <fieldset>
            <label for="journalDate">Date of Entry</label>
            <input type="date" name="journalDate" id="journalDate" required />
        </fieldset>
        <fieldset>
            <label for="journalLearn">Concepts covered</label>
            <input type="text" name="journalLearn" id="journalLearn" required />
        </fieldset>
        <fieldset>
            <label for="journalEntry">Journal Entry</label>
            <textarea name="journalEntry" id="journalEntry" cols="30" rows="5" required></textarea>
        </fieldset>
        <fieldset>
            <label for="journalMood">Mood for the day</label>
            <select name="journalMood" id="journalMood" required>
                <option value="">Choose a mood ... </option>
            </select>
        </fieldset>
        <button id="postEntry">Record Journal Entry</button>
        <div id="extras">
            <fieldset>
                <legend>Filter journal entries by mood</legend>
            <div id="radioButtons">
                <label for="happy">happy<input type="radio" name="moodSwitch" value="happy" /></label>
                <label for="not yet">not yet<input type="radio" name="moodSwitch" value="not yet" /></label>
                <label for="frustrated">frustrated<input type="radio" name="moodSwitch" value="frustrated" /></label>
                <label for="sad">sad<input type="radio" name="moodSwitch" value="sad" /></label>
                <label for="anxious">anxious<input type="radio" name="moodSwitch" value="anxious" /></label>
                <label for="furious">furious<input type="radio" name="moodSwitch" value="furious" /></label>
            </div>
            </fieldset>
            <fieldset>
                <label for"searchjournal">search:</label>
                <input type="text" name="searchjournal" id="searchjournal" />
            </fieldset>
        <div>
    </form>`;
};

var _default = makeJournalFormComponent;
exports.default = _default;

},{"./data":1}],7:[function(require,module,exports){
"use strict";

var _data = _interopRequireDefault(require("./data"));

var _entriesDOM = _interopRequireDefault(require("./entriesDOM"));

var _eventListeners = _interopRequireDefault(require("./eventListeners"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  Main application logic that uses the functions and objects
//  defined in the other JavaScript files.
_data.default.getWithMoods().then(journalEntries => _entriesDOM.default.createEntries(journalEntries));

_entriesDOM.default.renderFormElement();

_eventListeners.default.entryListener();

_eventListeners.default.moodListener();

_eventListeners.default.searchListener();

},{"./data":1,"./entriesDOM":2,"./eventListeners":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEuanMiLCIuLi9zY3JpcHRzL2VudHJpZXNET00uanMiLCIuLi9zY3JpcHRzL2VudHJ5Q29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9lbnRyeUZhY3RvcnkuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9mb3JtQ29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0FBOzs7O0FBS0EsTUFBTSxHQUFHLEdBQUc7QUFDUixFQUFBLEdBQUcsRUFBRSxRQUFRLElBQUk7QUFBRTtBQUNmLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixRQUFTLEVBQW5DLENBQUwsQ0FBMkM7QUFBM0MsS0FDRixJQURFLENBQ0csT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFSLEVBRGQsQ0FBUCxDQURhLENBRXlCO0FBQ3pDLEdBSk87QUFLUixFQUFBLFlBQVksRUFBRSxNQUFNO0FBQ2hCLFdBQU8sS0FBSyxDQUFDLDRDQUFELENBQUwsQ0FDRixJQURFLENBQ0csT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFSLEVBRGQsQ0FBUDtBQUVILEdBUk87QUFTUixFQUFBLE1BQU0sRUFBRSxlQUFlLElBQUk7QUFDdkIsV0FBTyxLQUFLLENBQUMsK0JBQUQsRUFBaUM7QUFDekMsTUFBQSxNQUFNLEVBQUUsTUFEaUM7QUFFekMsTUFBQSxPQUFPLEVBQUU7QUFDTCx3QkFBZ0I7QUFEWCxPQUZnQztBQUt6QyxNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBTCxDQUFlLGVBQWY7QUFMbUMsS0FBakMsQ0FBTCxDQU9GLElBUEUsQ0FPRyxPQUFPLElBQUksT0FBTyxDQUFDLElBQVIsRUFQZCxDQUFQO0FBUUgsR0FsQk87QUFtQlIsRUFBQSxNQUFNLEVBQUUsTUFBTSxJQUFJO0FBQ2QsV0FBTyxLQUFL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InNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKlxuQXV0aG9yOiBQYW55YVxuSW50ZW50OiBhbGwgY29udGFjdHMgd2l0aCB0aGUganNvbiBzZXJ2ZXJcbiovXG5cbmNvbnN0IEFQSSA9IHtcbiAgICBnZXQ6IGRhdGFiYXNlID0+IHsgLy8gdGhpcyBpcyBhIG1ldGhvZCBkZWZpbmVkIG9uIHRoZSBBUEkgb2JqZWN0XG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDgxLyR7ZGF0YWJhc2V9YCkgLy8gZmV0Y2ggZnJvbSB0aGUgSlNPTlxuICAgICAgICAgICAgLnRoZW4oZW50cmllcyA9PiBlbnRyaWVzLmpzb24oKSk7IC8vIHBhcnNlIEFTIGpzb25cbiAgICB9LFxuICAgIGdldFdpdGhNb29kczogKCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODEvZW50cmllcz9fZXhwYW5kPW1vb2RcIilcbiAgICAgICAgICAgIC50aGVuKGVudHJpZXMgPT4gZW50cmllcy5qc29uKCkpO1xuICAgIH0sXG4gICAgY3JlYXRlOiBuZXdKb3VybmFsRW50cnkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODEvZW50cmllc1wiLHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShuZXdKb3VybmFsRW50cnkpXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihlbnRyaWVzID0+IGVudHJpZXMuanNvbigpKTtcbiAgICB9LFxuICAgIGRlbGV0ZTogaXRlbUlkID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vMTI3LjAuMC4xOjgwODEvZW50cmllcy8ke2l0ZW1JZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBlZGl0OiAoam91cm5hbEVudHJ5T2JqZWN0LCBpdGVtSWQpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vMTI3LjAuMC4xOjgwODgvY29udGFjdHMvJHtpdGVtSWR9YCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoam91cm5hbEVudHJ5T2JqZWN0KVxuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oZW50cmllcyA9PiBlbnRyaWVzLmpzb24oKSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQVBJOyIsIi8qXG5BdXRob3I6IFBhbnlhXG5JbnRlbnQ6IHJlc3BvbnNpYmxlIGZvciBtb2RpZnlpbmcgdGhlIERPTVxuKi9cblxuaW1wb3J0IG1ha2VKb3VybmFsRm9ybUNvbXBvbmVudCBmcm9tIFwiLi9mb3JtQ29tcG9uZW50XCI7XG5pbXBvcnQgbWFrZUVudHJpZXMgZnJvbSBcIi4vZW50cnlDb21wb25lbnRcIjtcblxuY29uc3QgcmVuZGVyRE9NID0ge1xuICAgIGNyZWF0ZUVudHJpZXM6IGVudHJpZXMgPT4ge1xuICAgICAgICBsZXQgSFRNTHNxdWlydCA9IFwiXCI7XG4gICAgICAgIC8vIHJldmVyc2UgdGhlIGFycmF5IHNvIG1vc3QgcmVjZW50IGlzIGF0IHRvcFxuICAgICAgICAvLyBhZGQgYSBzb3J0aW5nIGZ1bmN0aW9uIGluIGNhc2UgdGhlIGVudHJpZXMgYXJlbid0IGluIGRhdGEgb3JkZXIgaW4gZGF0YWJhc2U/XG4gICAgICAgIGVudHJpZXMucmV2ZXJzZSgpLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgICAgLy8gcnVuIGVhY2ggZW50cnkgdGhyb3VnaCBmYWN0b3J5IG1ldGhvZFxuICAgICAgICAgICAgSFRNTHNxdWlydCArPSBtYWtlRW50cmllcy5jcmVhdGVTaW5nbGVFbnRyeShlbnRyeSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBhZGQgaXQgdG8gRE9NXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlzcGxheUVudHJpZXNcIikuaW5uZXJIVE1MID0gSFRNTHNxdWlydDtcbiAgICB9LFxuICAgIHJlbmRlckZvcm1FbGVtZW50OiAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlzcGxheUZvcm1cIikuaW5uZXJIVE1MID0gbWFrZUpvdXJuYWxGb3JtQ29tcG9uZW50KCk7XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcmVuZGVyRE9NOyIsIi8qXG5BdXRob3I6IFBhbnlhXG5JbnRlbnQ6ICByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGpvdXJuYWwgZW50cnkgSFRNTCBjb21wb25lbnRcbiovXG5cbmNvbnN0IG1ha2VFbnRyaWVzID0ge1xuICAgIGNyZWF0ZVNpbmdsZUVudHJ5OiBqb3VybmFsRW50cnkgPT4ge1xuICAgICAgICByZXR1cm4gYDxoZWFkZXI+JHtqb3VybmFsRW50cnkuY29uY2VwdHN9PC9oZWFkZXI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZGF0ZVwiPiR7am91cm5hbEVudHJ5LmRhdGV9PC9zcGFuPlxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImVudHJ5XCI+XG4gICAgICAgICAgICA8cD4ke2pvdXJuYWxFbnRyeS5lbnRyeX08L3A+XG4gICAgICAgICAgICA8cD5Nb29kOiAke2pvdXJuYWxFbnRyeS5tb29kLm1vb2R9PC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIGA7XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgbWFrZUVudHJpZXM7IiwiLypcbkF1dGhvcjogUGFueWFcbkludGVudDogZmFjdG9yeSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgZW50cnkgb2JqZWN0XG4qL1xuXG5jb25zdCBjcmVhdGVKb3VybmFsRW50cnkgPSAoZW50cnlEYXRlLCBlbnRyeUhlYWRlciwgZW50cnlGdWxsLCBlbnRyeU1vb2QpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBkYXRlOiBlbnRyeURhdGUsXG4gICAgICAgIGNvbmNlcHRzOiBlbnRyeUhlYWRlcixcbiAgICAgICAgZW50cnk6IGVudHJ5RnVsbCxcbiAgICAgICAgbW9vZDogZW50cnlNb29kXG4gICAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUpvdXJuYWxFbnRyeTsiLCIvKlxuQXV0aG9yOiBQYW55YVxuSW50ZW50OiBvYmplY3Qgd2l0aCBldmVudCBsaXN0ZW5lcnNcbiovXG5cbmltcG9ydCBBUEkgZnJvbSBcIi4vZGF0YVwiO1xuaW1wb3J0IHJlbmRlckRPTSBmcm9tIFwiLi9lbnRyaWVzRE9NXCI7XG5pbXBvcnQgY3JlYXRlSm91cm5hbEVudHJ5IGZyb20gXCIuL2VudHJ5RmFjdG9yeVwiO1xuXG5jb25zdCBsaXN0ZW5lcnMgPSB7XG4gICAgZW50cnlMaXN0ZW5lcjogKCkgPT4ge1xuICAgICAgICBjb25zdCBqb3VybmFsRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcG9zdEVudHJ5XCIpO1xuICAgICAgICAvLyB3aGF0IGhhcHBlbnMgd2hlbiB3ZSBjbGljayB0aGUgJ3Bvc3QnIGJ1dHRvbj9cbiAgICAgICAgam91cm5hbEZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbGxlY3QgZW50cnkgZGF0YSBmcm9tIHRoZSBmb3JtXG4gICAgICAgICAgICBjb25zdCBlbnRyeURhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxEYXRlXCIpLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgZW50cnlIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxMZWFyblwiKS52YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5RnVsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbEVudHJ5XCIpLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgZW50cnlNb29kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsTW9vZFwiKS52YWx1ZTtcbiAgICAgICAgICAgIC8vIGNvbnN0cnVjdCBlbnRyeSBvYmplY3Qgd2l0aCBmYWN0b3J5IGZ1bmN0aW9uXG4gICAgICAgICAgICBjb25zdCBuZXdKb3VybmFsRW50cnkgPSBjcmVhdGVKb3VybmFsRW50cnkoZW50cnlEYXRlLCBlbnRyeUhlYWRlciwgZW50cnlGdWxsLCBlbnRyeU1vb2QpO1xuICAgICAgICAgICAgLy8gYWRkIHRoZSBuZXcgb2JqZWN0IHRvIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgQVBJLmNyZWF0ZShuZXdKb3VybmFsRW50cnkpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG1vb2RMaXN0ZW5lcjogKCkgPT4ge1xuICAgICAgICAvLyBnZXQgdGhlIGxpc3Qgb2YgYWxsIG1vb2RzIGluIGFuIGFycmF5XG4gICAgICAgIGNvbnN0IG1vb2RTd2l0Y2hMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJtb29kU3dpdGNoXCIpO1xuICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhhdCBhcnJheVxuICAgICAgICBtb29kU3dpdGNoTGlzdC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGVhY2ggcmFkaW8gYnV0dG9uXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBtb29kIG9mIHRoZSBjbGlja2VkIGJ1dHRvblxuICAgICAgICAgICAgICAgIGNvbnN0IG1vb2QgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gZ3JhYiBhbGwgdGhlIGVudHJpZXMgZnJvbSB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgICAgICBBUEkuZ2V0KCkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgam91cm5hbEVudHJpZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2ggdGhlIGNsaWNrZWQgbW9vZCB0byB0aGUgbW9vZCB2YWx1ZSBvZiBhIGdpdmVuIGVudHJ5XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb29kRW50cmllcyA9IGpvdXJuYWxFbnRyaWVzLmZpbHRlcihlbnRyaWVzID0+IGVudHJpZXMubW9vZCA9PT0gbW9vZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBub25lIG1hdGNoIGRvIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb29kRW50cmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rpc3BsYXlFbnRyaWVzXCIpLmlubmVySFRNTCA9IFwibm8gZW50cmllcyBmb3VuZCB3aXRoIHRoYXQgbW9vZFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgdXNlIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIHRvIHB1dCB0aGVtIG9uIHRoZSBkb21cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJET00uY3JlYXRlRW50cmllcyhtb29kRW50cmllcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgc2VhcmNoTGlzdGVuZXI6ICgpID0+IHtcbiAgICAgICAgLy8gbGlzdGVuIGZvciBrZXlwcmVzc2VzIGluIHRoZSBzZWFyY2ggZmllbGRcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzZWFyY2hqb3VybmFsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBldmVudCA9PiB7XG4gICAgICAgICAgICAvLyBzdG9yZSB0aGUgZGF0YSBpbiB0aGUgc2VhcmNoIGZpZWxkXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hUZXJtID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgLy8gY3JlYXRlIGEgYmxhbmsgYXJyYXkgZm9yIGVudHJpZXNcbiAgICAgICAgICAgIGxldCByZXR1cm5lZEVudHJpZXMgPSBbXTtcbiAgICAgICAgICAgIC8vIGdyYWIgYWxsIHRoZSBlbnRyaWVzIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICBBUEkuZ2V0KCkudGhlbihcbiAgICAgICAgICAgICAgICBqb3VybmFsRW50cmllcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgb3ZlciBhbGwgdGhlIHZhbHVlcyBmcm9tIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIE9iamVjdC52YWx1ZXMoam91cm5hbEVudHJpZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIHRoZSBzZWFyY2ggdGVybSBpbiB0aGUgZW50cnkgdmFsdWVzIG9mIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmVudHJ5LmluY2x1ZGVzKHNlYXJjaFRlcm0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHVzaCB0aG9zZSBpbnRvIHRoYXQgYmxhbmsgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5lZEVudHJpZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gdXNlIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIHRvIHB1dCB0aGVtIG9uIHRoZSBkb21cbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyRE9NLmNyZWF0ZUVudHJpZXMocmV0dXJuZWRFbnRyaWVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsaXN0ZW5lcnM7IiwiLypcbkF1dGhvcjogUGFueWFcbkludGVudDogIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgZW50cnkgZm9ybSBIVE1MIGNvbXBvbmVudFxuKi9cblxuaW1wb3J0IEFQSSBmcm9tIFwiLi9kYXRhXCI7XG5cbmNvbnN0IHNob3dBbGxNb29kcyA9ICgpID0+IHtcbiAgICBBUEkuZ2V0KFwibW9vZHNcIilcbiAgICAudGhlbihtb29kQXJyYXkgPT4ge1xuICAgICAgICBsZXQgSFRNTGNvZGUgPSBcIlwiO1xuICAgICAgICBtb29kQXJyYXkuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIEhUTUxjb2RlICs9IGA8b3B0aW9uIHZhbHVlPSR7ZWxlbWVudC5pZH0+JHtlbGVtZW50Lm1vb2R9PC9vcHRpb24+XG4gICAgICAgICAgICBgXG4gICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIEhUTUxjb2RlO1xuICAgIH0pXG59XG5cbmNvbnN0IG1ha2VKb3VybmFsRm9ybUNvbXBvbmVudCA9ICgpID0+IHtcbiAgICAvLyBDcmVhdGUgSFRNTCBzdHJ1Y3R1cmUgZm9yIHRoZSBlbnRyeSBmb3JtXG4gICAgcmV0dXJuIGA8Zm9ybSBhY3Rpb249XCJcIiBpZD1cImpvdXJuYWxGb3JtXCI+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJqb3VybmFsRGF0ZVwiPkRhdGUgb2YgRW50cnk8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgbmFtZT1cImpvdXJuYWxEYXRlXCIgaWQ9XCJqb3VybmFsRGF0ZVwiIHJlcXVpcmVkIC8+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJqb3VybmFsTGVhcm5cIj5Db25jZXB0cyBjb3ZlcmVkPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJqb3VybmFsTGVhcm5cIiBpZD1cImpvdXJuYWxMZWFyblwiIHJlcXVpcmVkIC8+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJqb3VybmFsRW50cnlcIj5Kb3VybmFsIEVudHJ5PC9sYWJlbD5cbiAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwiam91cm5hbEVudHJ5XCIgaWQ9XCJqb3VybmFsRW50cnlcIiBjb2xzPVwiMzBcIiByb3dzPVwiNVwiIHJlcXVpcmVkPjwvdGV4dGFyZWE+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJqb3VybmFsTW9vZFwiPk1vb2QgZm9yIHRoZSBkYXk8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCBuYW1lPVwiam91cm5hbE1vb2RcIiBpZD1cImpvdXJuYWxNb29kXCIgcmVxdWlyZWQ+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPkNob29zZSBhIG1vb2QgLi4uIDwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxidXR0b24gaWQ9XCJwb3N0RW50cnlcIj5SZWNvcmQgSm91cm5hbCBFbnRyeTwvYnV0dG9uPlxuICAgICAgICA8ZGl2IGlkPVwiZXh0cmFzXCI+XG4gICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgPGxlZ2VuZD5GaWx0ZXIgam91cm5hbCBlbnRyaWVzIGJ5IG1vb2Q8L2xlZ2VuZD5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJyYWRpb0J1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaGFwcHlcIj5oYXBweTxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZFN3aXRjaFwiIHZhbHVlPVwiaGFwcHlcIiAvPjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm5vdCB5ZXRcIj5ub3QgeWV0PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJtb29kU3dpdGNoXCIgdmFsdWU9XCJub3QgeWV0XCIgLz48L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmcnVzdHJhdGVkXCI+ZnJ1c3RyYXRlZDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZFN3aXRjaFwiIHZhbHVlPVwiZnJ1c3RyYXRlZFwiIC8+PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwic2FkXCI+c2FkPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJtb29kU3dpdGNoXCIgdmFsdWU9XCJzYWRcIiAvPjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImFueGlvdXNcIj5hbnhpb3VzPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJtb29kU3dpdGNoXCIgdmFsdWU9XCJhbnhpb3VzXCIgLz48L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmdXJpb3VzXCI+ZnVyaW91czxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZFN3aXRjaFwiIHZhbHVlPVwiZnVyaW91c1wiIC8+PC9sYWJlbD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yXCJzZWFyY2hqb3VybmFsXCI+c2VhcmNoOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInNlYXJjaGpvdXJuYWxcIiBpZD1cInNlYXJjaGpvdXJuYWxcIiAvPlxuICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGRpdj5cbiAgICA8L2Zvcm0+YDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG1ha2VKb3VybmFsRm9ybUNvbXBvbmVudDsiLCIvLyAgTWFpbiBhcHBsaWNhdGlvbiBsb2dpYyB0aGF0IHVzZXMgdGhlIGZ1bmN0aW9ucyBhbmQgb2JqZWN0c1xuLy8gIGRlZmluZWQgaW4gdGhlIG90aGVyIEphdmFTY3JpcHQgZmlsZXMuXG5cbmltcG9ydCBBUEkgZnJvbSBcIi4vZGF0YVwiO1xuaW1wb3J0IHJlbmRlckRPTSBmcm9tIFwiLi9lbnRyaWVzRE9NXCI7XG5pbXBvcnQgbGlzdGVuZXJzIGZyb20gXCIuL2V2ZW50TGlzdGVuZXJzXCI7XG5cbkFQSS5nZXRXaXRoTW9vZHMoKS50aGVuKGpvdXJuYWxFbnRyaWVzID0+IHJlbmRlckRPTS5jcmVhdGVFbnRyaWVzKGpvdXJuYWxFbnRyaWVzKSk7XG5cbnJlbmRlckRPTS5yZW5kZXJGb3JtRWxlbWVudCgpO1xubGlzdGVuZXJzLmVudHJ5TGlzdGVuZXIoKTtcbmxpc3RlbmVycy5tb29kTGlzdGVuZXIoKTtcbmxpc3RlbmVycy5zZWFyY2hMaXN0ZW5lcigpOyJdfQ==
