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
    moodId: entryMood
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
      const entryDate = document.querySelector("#journalDate").value.getTime();
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
  let HTMLcode = "";

  _data.default.get("moods").then(moodArray => {
    moodArray.forEach(element => {
      HTMLcode += `<option value=${element.id}>${element.mood}</option>
            `;
    });
  });

  return HTMLcode;
};

const makeJournalFormComponent = () => {
  // Create HTML structure for the entry form
  let formCode = showAllMoods();
  return formCode;
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

_eventListeners.default.entryListener(); //listeners.moodListener();


_eventListeners.default.searchListener();

},{"./data":1,"./entriesDOM":2,"./eventListeners":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEuanMiLCIuLi9zY3JpcHRzL2VudHJpZXNET00uanMiLCIuLi9zY3JpcHRzL2VudHJ5Q29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9lbnRyeUZhY3RvcnkuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9mb3JtQ29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0FBOzs7O0FBS0EsTUFBTSxHQUFHLEdBQUc7QUFDUixFQUFBLEdBQUcsRUFBRSxRQUFRLElBQUk7QUFBRTtBQUNmLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixRQUFTLEVBQW5DLENBQUwsQ0FBMkM7QUFBM0MsS0FDRixJQURFLENBQ0csT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFSLEVBRGQsQ0FBUCxDQURhLENBRXlCO0FBQ3pDLEdBSk87QUFLUixFQUFBLFlBQVksRUFBRSxNQUFNO0FBQ2hCLFdBQU8sS0FBSyxDQUFDLDRDQUFELENBQUwsQ0FDRixJQURFLENBQ0csT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFSLEVBRGQsQ0FBUDtBQUVILEdBUk87QUFTUixFQUFBLE1BQU0sRUFBRSxlQUFlLElBQUk7QUFDdkIsV0FBTyxLQUFLLENBQUMsK0JBQUQsRUFBaUM7QUFDekMsTUFBQSxNQUFNLEVBQUUsTUFEaUM7QUFFekMsTUFBQSxPQUFPLEVBQUU7QUFDTCx3QkFBZ0I7QUFEWCxPQUZnQztBQUt6QyxNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBTCxDQUFlLGVBQWY7QUFMbUMsS0FBakMsQ0FBTCxDQU9GLElBUEUsQ0FPRyxPQUFPLElBQUksT0FBTyxDQUFDLElBQVIsRUFQZCxDQUFQO0FBUUgsR0FsQk87QUFtQlIsRUFBQSxNQUFNLEVBQUUsTUFBTSxJQUFJO0FBQ2QsV0FBTyxLQUFL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IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKlxuQXV0aG9yOiBQYW55YVxuSW50ZW50OiBhbGwgY29udGFjdHMgd2l0aCB0aGUganNvbiBzZXJ2ZXJcbiovXG5cbmNvbnN0IEFQSSA9IHtcbiAgICBnZXQ6IGRhdGFiYXNlID0+IHsgLy8gdGhpcyBpcyBhIG1ldGhvZCBkZWZpbmVkIG9uIHRoZSBBUEkgb2JqZWN0XG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDgxLyR7ZGF0YWJhc2V9YCkgLy8gZmV0Y2ggZnJvbSB0aGUgSlNPTlxuICAgICAgICAgICAgLnRoZW4oZW50cmllcyA9PiBlbnRyaWVzLmpzb24oKSk7IC8vIHBhcnNlIEFTIGpzb25cbiAgICB9LFxuICAgIGdldFdpdGhNb29kczogKCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODEvZW50cmllcz9fZXhwYW5kPW1vb2RcIilcbiAgICAgICAgICAgIC50aGVuKGVudHJpZXMgPT4gZW50cmllcy5qc29uKCkpO1xuICAgIH0sXG4gICAgY3JlYXRlOiBuZXdKb3VybmFsRW50cnkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODEvZW50cmllc1wiLHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShuZXdKb3VybmFsRW50cnkpXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihlbnRyaWVzID0+IGVudHJpZXMuanNvbigpKTtcbiAgICB9LFxuICAgIGRlbGV0ZTogaXRlbUlkID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vMTI3LjAuMC4xOjgwODEvZW50cmllcy8ke2l0ZW1JZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBlZGl0OiAoam91cm5hbEVudHJ5T2JqZWN0LCBpdGVtSWQpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vMTI3LjAuMC4xOjgwODgvY29udGFjdHMvJHtpdGVtSWR9YCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoam91cm5hbEVudHJ5T2JqZWN0KVxuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oZW50cmllcyA9PiBlbnRyaWVzLmpzb24oKSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQVBJOyIsIi8qXG5BdXRob3I6IFBhbnlhXG5JbnRlbnQ6IHJlc3BvbnNpYmxlIGZvciBtb2RpZnlpbmcgdGhlIERPTVxuKi9cblxuaW1wb3J0IG1ha2VKb3VybmFsRm9ybUNvbXBvbmVudCBmcm9tIFwiLi9mb3JtQ29tcG9uZW50XCI7XG5pbXBvcnQgbWFrZUVudHJpZXMgZnJvbSBcIi4vZW50cnlDb21wb25lbnRcIjtcblxuY29uc3QgcmVuZGVyRE9NID0ge1xuICAgIGNyZWF0ZUVudHJpZXM6IGVudHJpZXMgPT4ge1xuICAgICAgICBsZXQgSFRNTHNxdWlydCA9IFwiXCI7XG4gICAgICAgIC8vIHJldmVyc2UgdGhlIGFycmF5IHNvIG1vc3QgcmVjZW50IGlzIGF0IHRvcFxuICAgICAgICAvLyBhZGQgYSBzb3J0aW5nIGZ1bmN0aW9uIGluIGNhc2UgdGhlIGVudHJpZXMgYXJlbid0IGluIGRhdGEgb3JkZXIgaW4gZGF0YWJhc2U/XG4gICAgICAgIGVudHJpZXMucmV2ZXJzZSgpLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgICAgLy8gcnVuIGVhY2ggZW50cnkgdGhyb3VnaCBmYWN0b3J5IG1ldGhvZFxuICAgICAgICAgICAgSFRNTHNxdWlydCArPSBtYWtlRW50cmllcy5jcmVhdGVTaW5nbGVFbnRyeShlbnRyeSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBhZGQgaXQgdG8gRE9NXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlzcGxheUVudHJpZXNcIikuaW5uZXJIVE1MID0gSFRNTHNxdWlydDtcbiAgICB9LFxuICAgIHJlbmRlckZvcm1FbGVtZW50OiAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlzcGxheUZvcm1cIikuaW5uZXJIVE1MID0gbWFrZUpvdXJuYWxGb3JtQ29tcG9uZW50KCk7XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcmVuZGVyRE9NOyIsIi8qXG5BdXRob3I6IFBhbnlhXG5JbnRlbnQ6ICByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGpvdXJuYWwgZW50cnkgSFRNTCBjb21wb25lbnRcbiovXG5cbmNvbnN0IG1ha2VFbnRyaWVzID0ge1xuICAgIGNyZWF0ZVNpbmdsZUVudHJ5OiBqb3VybmFsRW50cnkgPT4ge1xuICAgICAgICByZXR1cm4gYDxoZWFkZXI+JHtqb3VybmFsRW50cnkuY29uY2VwdHN9PC9oZWFkZXI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZGF0ZVwiPiR7am91cm5hbEVudHJ5LmRhdGV9PC9zcGFuPlxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImVudHJ5XCI+XG4gICAgICAgICAgICA8cD4ke2pvdXJuYWxFbnRyeS5lbnRyeX08L3A+XG4gICAgICAgICAgICA8cD5Nb29kOiAke2pvdXJuYWxFbnRyeS5tb29kLm1vb2R9PC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIGA7XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgbWFrZUVudHJpZXM7IiwiLypcbkF1dGhvcjogUGFueWFcbkludGVudDogZmFjdG9yeSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgZW50cnkgb2JqZWN0XG4qL1xuXG5jb25zdCBjcmVhdGVKb3VybmFsRW50cnkgPSAoZW50cnlEYXRlLCBlbnRyeUhlYWRlciwgZW50cnlGdWxsLCBlbnRyeU1vb2QpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBkYXRlOiBlbnRyeURhdGUsXG4gICAgICAgIGNvbmNlcHRzOiBlbnRyeUhlYWRlcixcbiAgICAgICAgZW50cnk6IGVudHJ5RnVsbCxcbiAgICAgICAgbW9vZElkOiBlbnRyeU1vb2RcbiAgICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlSm91cm5hbEVudHJ5OyIsIi8qXG5BdXRob3I6IFBhbnlhXG5JbnRlbnQ6IG9iamVjdCB3aXRoIGV2ZW50IGxpc3RlbmVyc1xuKi9cblxuaW1wb3J0IEFQSSBmcm9tIFwiLi9kYXRhXCI7XG5pbXBvcnQgcmVuZGVyRE9NIGZyb20gXCIuL2VudHJpZXNET01cIjtcbmltcG9ydCBjcmVhdGVKb3VybmFsRW50cnkgZnJvbSBcIi4vZW50cnlGYWN0b3J5XCI7XG5cbmNvbnN0IGxpc3RlbmVycyA9IHtcbiAgICBlbnRyeUxpc3RlbmVyOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGpvdXJuYWxGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwb3N0RW50cnlcIik7XG4gICAgICAgIC8vIHdoYXQgaGFwcGVucyB3aGVuIHdlIGNsaWNrIHRoZSAncG9zdCcgYnV0dG9uP1xuICAgICAgICBqb3VybmFsRm9ybS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgLy8gY29sbGVjdCBlbnRyeSBkYXRhIGZyb20gdGhlIGZvcm1cbiAgICAgICAgICAgIGNvbnN0IGVudHJ5RGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbERhdGVcIikudmFsdWUuZ2V0VGltZSgpO1xuICAgICAgICAgICAgY29uc3QgZW50cnlIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxMZWFyblwiKS52YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5RnVsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbEVudHJ5XCIpLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgZW50cnlNb29kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsTW9vZFwiKS52YWx1ZTtcbiAgICAgICAgICAgIC8vIGNvbnN0cnVjdCBlbnRyeSBvYmplY3Qgd2l0aCBmYWN0b3J5IGZ1bmN0aW9uXG4gICAgICAgICAgICBjb25zdCBuZXdKb3VybmFsRW50cnkgPSBjcmVhdGVKb3VybmFsRW50cnkoZW50cnlEYXRlLCBlbnRyeUhlYWRlciwgZW50cnlGdWxsLCBlbnRyeU1vb2QpO1xuICAgICAgICAgICAgLy8gYWRkIHRoZSBuZXcgb2JqZWN0IHRvIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgQVBJLmNyZWF0ZShuZXdKb3VybmFsRW50cnkpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG1vb2RMaXN0ZW5lcjogKCkgPT4ge1xuICAgICAgICAvLyBnZXQgdGhlIGxpc3Qgb2YgYWxsIG1vb2RzIGluIGFuIGFycmF5XG4gICAgICAgIGNvbnN0IG1vb2RTd2l0Y2hMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJtb29kU3dpdGNoXCIpO1xuICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhhdCBhcnJheVxuICAgICAgICBtb29kU3dpdGNoTGlzdC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGVhY2ggcmFkaW8gYnV0dG9uXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBtb29kIG9mIHRoZSBjbGlja2VkIGJ1dHRvblxuICAgICAgICAgICAgICAgIGNvbnN0IG1vb2QgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gZ3JhYiBhbGwgdGhlIGVudHJpZXMgZnJvbSB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgICAgICBBUEkuZ2V0KCkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgam91cm5hbEVudHJpZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2ggdGhlIGNsaWNrZWQgbW9vZCB0byB0aGUgbW9vZCB2YWx1ZSBvZiBhIGdpdmVuIGVudHJ5XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb29kRW50cmllcyA9IGpvdXJuYWxFbnRyaWVzLmZpbHRlcihlbnRyaWVzID0+IGVudHJpZXMubW9vZCA9PT0gbW9vZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBub25lIG1hdGNoIGRvIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb29kRW50cmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rpc3BsYXlFbnRyaWVzXCIpLmlubmVySFRNTCA9IFwibm8gZW50cmllcyBmb3VuZCB3aXRoIHRoYXQgbW9vZFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgdXNlIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIHRvIHB1dCB0aGVtIG9uIHRoZSBkb21cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJET00uY3JlYXRlRW50cmllcyhtb29kRW50cmllcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgc2VhcmNoTGlzdGVuZXI6ICgpID0+IHtcbiAgICAgICAgLy8gbGlzdGVuIGZvciBrZXlwcmVzc2VzIGluIHRoZSBzZWFyY2ggZmllbGRcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzZWFyY2hqb3VybmFsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBldmVudCA9PiB7XG4gICAgICAgICAgICAvLyBzdG9yZSB0aGUgZGF0YSBpbiB0aGUgc2VhcmNoIGZpZWxkXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hUZXJtID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgLy8gY3JlYXRlIGEgYmxhbmsgYXJyYXkgZm9yIGVudHJpZXNcbiAgICAgICAgICAgIGxldCByZXR1cm5lZEVudHJpZXMgPSBbXTtcbiAgICAgICAgICAgIC8vIGdyYWIgYWxsIHRoZSBlbnRyaWVzIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICBBUEkuZ2V0KCkudGhlbihcbiAgICAgICAgICAgICAgICBqb3VybmFsRW50cmllcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgb3ZlciBhbGwgdGhlIHZhbHVlcyBmcm9tIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIE9iamVjdC52YWx1ZXMoam91cm5hbEVudHJpZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIHRoZSBzZWFyY2ggdGVybSBpbiB0aGUgZW50cnkgdmFsdWVzIG9mIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmVudHJ5LmluY2x1ZGVzKHNlYXJjaFRlcm0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHVzaCB0aG9zZSBpbnRvIHRoYXQgYmxhbmsgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5lZEVudHJpZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gdXNlIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIHRvIHB1dCB0aGVtIG9uIHRoZSBkb21cbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyRE9NLmNyZWF0ZUVudHJpZXMocmV0dXJuZWRFbnRyaWVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsaXN0ZW5lcnM7IiwiLypcbkF1dGhvcjogUGFueWFcbkludGVudDogIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgZW50cnkgZm9ybSBIVE1MIGNvbXBvbmVudFxuKi9cblxuaW1wb3J0IEFQSSBmcm9tIFwiLi9kYXRhXCI7XG5cbmNvbnN0IHNob3dBbGxNb29kcyA9ICgpID0+IHtcbiAgICBsZXQgSFRNTGNvZGUgPSBcIlwiO1xuICAgIEFQSS5nZXQoXCJtb29kc1wiKVxuICAgIC50aGVuKG1vb2RBcnJheSA9PiB7XG4gICAgICAgIG1vb2RBcnJheS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgSFRNTGNvZGUgKz0gYDxvcHRpb24gdmFsdWU9JHtlbGVtZW50LmlkfT4ke2VsZW1lbnQubW9vZH08L29wdGlvbj5cbiAgICAgICAgICAgIGBcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgICByZXR1cm4gSFRNTGNvZGU7XG59XG5cbmNvbnN0IG1ha2VKb3VybmFsRm9ybUNvbXBvbmVudCA9ICgpID0+IHtcbiAgICAvLyBDcmVhdGUgSFRNTCBzdHJ1Y3R1cmUgZm9yIHRoZSBlbnRyeSBmb3JtXG4gICAgbGV0IGZvcm1Db2RlID0gc2hvd0FsbE1vb2RzKCk7XG4gICAgcmV0dXJuIGZvcm1Db2RlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbWFrZUpvdXJuYWxGb3JtQ29tcG9uZW50OyIsIi8vICBNYWluIGFwcGxpY2F0aW9uIGxvZ2ljIHRoYXQgdXNlcyB0aGUgZnVuY3Rpb25zIGFuZCBvYmplY3RzXG4vLyAgZGVmaW5lZCBpbiB0aGUgb3RoZXIgSmF2YVNjcmlwdCBmaWxlcy5cblxuaW1wb3J0IEFQSSBmcm9tIFwiLi9kYXRhXCI7XG5pbXBvcnQgcmVuZGVyRE9NIGZyb20gXCIuL2VudHJpZXNET01cIjtcbmltcG9ydCBsaXN0ZW5lcnMgZnJvbSBcIi4vZXZlbnRMaXN0ZW5lcnNcIjtcblxuQVBJLmdldFdpdGhNb29kcygpLnRoZW4oam91cm5hbEVudHJpZXMgPT4gcmVuZGVyRE9NLmNyZWF0ZUVudHJpZXMoam91cm5hbEVudHJpZXMpKTtcblxucmVuZGVyRE9NLnJlbmRlckZvcm1FbGVtZW50KCk7XG5saXN0ZW5lcnMuZW50cnlMaXN0ZW5lcigpO1xuLy9saXN0ZW5lcnMubW9vZExpc3RlbmVyKCk7XG5saXN0ZW5lcnMuc2VhcmNoTGlzdGVuZXIoKTsiXX0=
