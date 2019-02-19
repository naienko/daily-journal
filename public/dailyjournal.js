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
_data.default.get("moods").then(moodArray => {
  let HTMLcode = "";
  moodArray.forEach(element => {
    HTMLcode += `<option value=${element.id}>${element.mood}</option>
`;
  });
  return HTMLcode;
});

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

_eventListeners.default.entryListener(); //listeners.moodListener();


_eventListeners.default.searchListener();

},{"./data":1,"./entriesDOM":2,"./eventListeners":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEuanMiLCIuLi9zY3JpcHRzL2VudHJpZXNET00uanMiLCIuLi9zY3JpcHRzL2VudHJ5Q29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9lbnRyeUZhY3RvcnkuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9mb3JtQ29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0FBOzs7O0FBS0EsTUFBTSxHQUFHLEdBQUc7QUFDUixFQUFBLEdBQUcsRUFBRSxRQUFRLElBQUk7QUFBRTtBQUNmLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixRQUFTLEVBQW5DLENBQUwsQ0FBMkM7QUFBM0MsS0FDRixJQURFLENBQ0csT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFSLEVBRGQsQ0FBUCxDQURhLENBRXlCO0FBQ3pDLEdBSk87QUFLUixFQUFBLFlBQVksRUFBRSxNQUFNO0FBQ2hCLFdBQU8sS0FBSyxDQUFDLDRDQUFELENBQUwsQ0FDRixJQURFLENBQ0csT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFSLEVBRGQsQ0FBUDtBQUVILEdBUk87QUFTUixFQUFBLE1BQU0sRUFBRSxlQUFlLElBQUk7QUFDdkIsV0FBTyxLQUFLLENBQUMsK0JBQUQsRUFBaUM7QUFDekMsTUFBQSxNQUFNLEVBQUUsTUFEaUM7QUFFekMsTUFBQSxPQUFPLEVBQUU7QUFDTCx3QkFBZ0I7QUFEWCxPQUZnQztBQUt6QyxNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBTCxDQUFlLGVBQWY7QUFMbUMsS0FBakMsQ0FBTCxDQU9GLElBUEUsQ0FPRyxPQUFPLElBQUksT0FBTyxDQUFDLElBQVIsRUFQZCxDQUFQO0FBUUgsR0FsQk87QUFtQlIsRUFBQSxNQUFNLEVBQUUsTUFBTSxJQUFJO0FBQ2QsV0FBTyxLQUFL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QSxvQkFBSSxHQUFKLEdBQVUsSUFBVixDQUNJLGNBQWMsSUFBSTtBQUNkO0FBQ0EsYUFBSyxNQUFNLEtBQVgsSUFBb0IsTUFBTSxDQUFDLE1BQVAsQ0FBYyxjQUFkLENBQXBCLEVBQW1EO0FBQy9DO0FBQ0EsY0FBSSxLQUFLLENBQUMsS0FBTixDQUFZLFFBQVosQ0FBcUIsVUFBckIsQ0FBSixFQUFzQztBQUNsQztBQUNBLFlBQUEsZUFBZSxDQUFDLElBQWhCLENBQXFCLEtBQXJCO0FBQ0g7QUFDSixTQVJhLENBU2Q7OztBQUNBLDRCQUFVLGFBQVYsQ0FBd0IsZUFBeEI7QUFDSCxPQVpMO0FBY0gsS0FwQkQ7QUFxQkg7QUFqRWEsQ0FBbEI7ZUFvRWUsUzs7Ozs7Ozs7Ozs7QUN4RWY7Ozs7QUFMQTs7OztBQU9BLGNBQUksR0FBSixDQUFRLE9BQVIsRUFDSyxJQURMLENBQ1UsU0FBUyxJQUFJO0FBQ2YsTUFBSSxRQUFRLEdBQUcsRUFBZjtBQUNBLEVBQUEsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsT0FBTyxJQUFJO0FBQ3pCLElBQUEsUUFBUSxJQUFLLGlCQUFnQixPQUFPLENBQUMsRUFBRyxJQUFHLE9BQU8sQ0FBQyxJQUFLO0NBQXhEO0FBRUgsR0FIRDtBQUlJLFNBQU8sUUFBUDtBQUNQLENBUkw7O0FBVUEsTUFBTSx3QkFBd0IsR0FBRyxNQUFNO0FBQ25DO0FBQ0EsU0FBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQUFSO0FBc0NILENBeENEOztlQTBDZSx3Qjs7Ozs7O0FDeERmOztBQUNBOztBQUNBOzs7O0FBTEE7QUFDQTtBQU1BLGNBQUksWUFBSixHQUFtQixJQUFuQixDQUF3QixjQUFjLElBQUksb0JBQVUsYUFBVixDQUF3QixjQUF4QixDQUExQzs7QUFFQSxvQkFBVSxpQkFBVjs7QUFDQSx3QkFBVSxhQUFWLEcsQ0FDQTs7O0FBQ0Esd0JBQVUsY0FBViIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qXG5BdXRob3I6IFBhbnlhXG5JbnRlbnQ6IGFsbCBjb250YWN0cyB3aXRoIHRoZSBqc29uIHNlcnZlclxuKi9cblxuY29uc3QgQVBJID0ge1xuICAgIGdldDogZGF0YWJhc2UgPT4geyAvLyB0aGlzIGlzIGEgbWV0aG9kIGRlZmluZWQgb24gdGhlIEFQSSBvYmplY3RcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODEvJHtkYXRhYmFzZX1gKSAvLyBmZXRjaCBmcm9tIHRoZSBKU09OXG4gICAgICAgICAgICAudGhlbihlbnRyaWVzID0+IGVudHJpZXMuanNvbigpKTsgLy8gcGFyc2UgQVMganNvblxuICAgIH0sXG4gICAgZ2V0V2l0aE1vb2RzOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MS9lbnRyaWVzP19leHBhbmQ9bW9vZFwiKVxuICAgICAgICAgICAgLnRoZW4oZW50cmllcyA9PiBlbnRyaWVzLmpzb24oKSk7XG4gICAgfSxcbiAgICBjcmVhdGU6IG5ld0pvdXJuYWxFbnRyeSA9PiB7XG4gICAgICAgIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MS9lbnRyaWVzXCIse1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG5ld0pvdXJuYWxFbnRyeSlcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGVudHJpZXMgPT4gZW50cmllcy5qc29uKCkpO1xuICAgIH0sXG4gICAgZGVsZXRlOiBpdGVtSWQgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6ODA4MS9lbnRyaWVzLyR7aXRlbUlkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIlxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGVkaXQ6IChqb3VybmFsRW50cnlPYmplY3QsIGl0ZW1JZCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6ODA4OC9jb250YWN0cy8ke2l0ZW1JZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShqb3VybmFsRW50cnlPYmplY3QpXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihlbnRyaWVzID0+IGVudHJpZXMuanNvbigpKTtcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBUEk7IiwiLypcbkF1dGhvcjogUGFueWFcbkludGVudDogcmVzcG9uc2libGUgZm9yIG1vZGlmeWluZyB0aGUgRE9NXG4qL1xuXG5pbXBvcnQgbWFrZUpvdXJuYWxGb3JtQ29tcG9uZW50IGZyb20gXCIuL2Zvcm1Db21wb25lbnRcIjtcbmltcG9ydCBtYWtlRW50cmllcyBmcm9tIFwiLi9lbnRyeUNvbXBvbmVudFwiO1xuXG5jb25zdCByZW5kZXJET00gPSB7XG4gICAgY3JlYXRlRW50cmllczogZW50cmllcyA9PiB7XG4gICAgICAgIGxldCBIVE1Mc3F1aXJ0ID0gXCJcIjtcbiAgICAgICAgLy8gcmV2ZXJzZSB0aGUgYXJyYXkgc28gbW9zdCByZWNlbnQgaXMgYXQgdG9wXG4gICAgICAgIC8vIGFkZCBhIHNvcnRpbmcgZnVuY3Rpb24gaW4gY2FzZSB0aGUgZW50cmllcyBhcmVuJ3QgaW4gZGF0YSBvcmRlciBpbiBkYXRhYmFzZT9cbiAgICAgICAgZW50cmllcy5yZXZlcnNlKCkuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgICAvLyBydW4gZWFjaCBlbnRyeSB0aHJvdWdoIGZhY3RvcnkgbWV0aG9kXG4gICAgICAgICAgICBIVE1Mc3F1aXJ0ICs9IG1ha2VFbnRyaWVzLmNyZWF0ZVNpbmdsZUVudHJ5KGVudHJ5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGFkZCBpdCB0byBET01cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkaXNwbGF5RW50cmllc1wiKS5pbm5lckhUTUwgPSBIVE1Mc3F1aXJ0O1xuICAgIH0sXG4gICAgcmVuZGVyRm9ybUVsZW1lbnQ6ICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkaXNwbGF5Rm9ybVwiKS5pbm5lckhUTUwgPSBtYWtlSm91cm5hbEZvcm1Db21wb25lbnQoKTtcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCByZW5kZXJET007IiwiLypcbkF1dGhvcjogUGFueWFcbkludGVudDogIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgam91cm5hbCBlbnRyeSBIVE1MIGNvbXBvbmVudFxuKi9cblxuY29uc3QgbWFrZUVudHJpZXMgPSB7XG4gICAgY3JlYXRlU2luZ2xlRW50cnk6IGpvdXJuYWxFbnRyeSA9PiB7XG4gICAgICAgIHJldHVybiBgPGhlYWRlcj4ke2pvdXJuYWxFbnRyeS5jb25jZXB0c308L2hlYWRlcj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJkYXRlXCI+JHtqb3VybmFsRW50cnkuZGF0ZX08L3NwYW4+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzPVwiZW50cnlcIj5cbiAgICAgICAgICAgIDxwPiR7am91cm5hbEVudHJ5LmVudHJ5fTwvcD5cbiAgICAgICAgICAgIDxwPk1vb2Q6ICR7am91cm5hbEVudHJ5Lm1vb2QubW9vZH08L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgYDtcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBtYWtlRW50cmllczsiLCIvKlxuQXV0aG9yOiBQYW55YVxuSW50ZW50OiBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBlbnRyeSBvYmplY3RcbiovXG5cbmNvbnN0IGNyZWF0ZUpvdXJuYWxFbnRyeSA9IChlbnRyeURhdGUsIGVudHJ5SGVhZGVyLCBlbnRyeUZ1bGwsIGVudHJ5TW9vZCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGRhdGU6IGVudHJ5RGF0ZSxcbiAgICAgICAgY29uY2VwdHM6IGVudHJ5SGVhZGVyLFxuICAgICAgICBlbnRyeTogZW50cnlGdWxsLFxuICAgICAgICBtb29kSWQ6IGVudHJ5TW9vZFxuICAgIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVKb3VybmFsRW50cnk7IiwiLypcbkF1dGhvcjogUGFueWFcbkludGVudDogb2JqZWN0IHdpdGggZXZlbnQgbGlzdGVuZXJzXG4qL1xuXG5pbXBvcnQgQVBJIGZyb20gXCIuL2RhdGFcIjtcbmltcG9ydCByZW5kZXJET00gZnJvbSBcIi4vZW50cmllc0RPTVwiO1xuaW1wb3J0IGNyZWF0ZUpvdXJuYWxFbnRyeSBmcm9tIFwiLi9lbnRyeUZhY3RvcnlcIjtcblxuY29uc3QgbGlzdGVuZXJzID0ge1xuICAgIGVudHJ5TGlzdGVuZXI6ICgpID0+IHtcbiAgICAgICAgY29uc3Qgam91cm5hbEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Bvc3RFbnRyeVwiKTtcbiAgICAgICAgLy8gd2hhdCBoYXBwZW5zIHdoZW4gd2UgY2xpY2sgdGhlICdwb3N0JyBidXR0b24/XG4gICAgICAgIGpvdXJuYWxGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBjb2xsZWN0IGVudHJ5IGRhdGEgZnJvbSB0aGUgZm9ybVxuICAgICAgICAgICAgY29uc3QgZW50cnlEYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsRGF0ZVwiKS52YWx1ZS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBjb25zdCBlbnRyeUhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbExlYXJuXCIpLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgZW50cnlGdWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsRW50cnlcIikudmFsdWU7XG4gICAgICAgICAgICBjb25zdCBlbnRyeU1vb2QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxNb29kXCIpLnZhbHVlO1xuICAgICAgICAgICAgLy8gY29uc3RydWN0IGVudHJ5IG9iamVjdCB3aXRoIGZhY3RvcnkgZnVuY3Rpb25cbiAgICAgICAgICAgIGNvbnN0IG5ld0pvdXJuYWxFbnRyeSA9IGNyZWF0ZUpvdXJuYWxFbnRyeShlbnRyeURhdGUsIGVudHJ5SGVhZGVyLCBlbnRyeUZ1bGwsIGVudHJ5TW9vZCk7XG4gICAgICAgICAgICAvLyBhZGQgdGhlIG5ldyBvYmplY3QgdG8gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICBBUEkuY3JlYXRlKG5ld0pvdXJuYWxFbnRyeSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbW9vZExpc3RlbmVyOiAoKSA9PiB7XG4gICAgICAgIC8vIGdldCB0aGUgbGlzdCBvZiBhbGwgbW9vZHMgaW4gYW4gYXJyYXlcbiAgICAgICAgY29uc3QgbW9vZFN3aXRjaExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShcIm1vb2RTd2l0Y2hcIik7XG4gICAgICAgIC8vIGl0ZXJhdGUgb3ZlciB0aGF0IGFycmF5XG4gICAgICAgIG1vb2RTd2l0Y2hMaXN0LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gZWFjaCByYWRpbyBidXR0b25cbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIG1vb2Qgb2YgdGhlIGNsaWNrZWQgYnV0dG9uXG4gICAgICAgICAgICAgICAgY29uc3QgbW9vZCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBncmFiIGFsbCB0aGUgZW50cmllcyBmcm9tIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgICAgIEFQSS5nZXQoKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICBqb3VybmFsRW50cmllcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaCB0aGUgY2xpY2tlZCBtb29kIHRvIHRoZSBtb29kIHZhbHVlIG9mIGEgZ2l2ZW4gZW50cnlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vb2RFbnRyaWVzID0gam91cm5hbEVudHJpZXMuZmlsdGVyKGVudHJpZXMgPT4gZW50cmllcy5tb29kID09PSBtb29kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vbmUgbWF0Y2ggZG8gdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vb2RFbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlzcGxheUVudHJpZXNcIikuaW5uZXJIVE1MID0gXCJubyBlbnRyaWVzIGZvdW5kIHdpdGggdGhhdCBtb29kXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSB1c2UgdGhlIGZhY3RvcnkgZnVuY3Rpb24gdG8gcHV0IHRoZW0gb24gdGhlIGRvbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckRPTS5jcmVhdGVFbnRyaWVzKG1vb2RFbnRyaWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzZWFyY2hMaXN0ZW5lcjogKCkgPT4ge1xuICAgICAgICAvLyBsaXN0ZW4gZm9yIGtleXByZXNzZXMgaW4gdGhlIHNlYXJjaCBmaWVsZFxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlYXJjaGpvdXJuYWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBkYXRhIGluIHRoZSBzZWFyY2ggZmllbGRcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaFRlcm0gPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBibGFuayBhcnJheSBmb3IgZW50cmllc1xuICAgICAgICAgICAgbGV0IHJldHVybmVkRW50cmllcyA9IFtdO1xuICAgICAgICAgICAgLy8gZ3JhYiBhbGwgdGhlIGVudHJpZXMgZnJvbSB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgIEFQSS5nZXQoKS50aGVuKFxuICAgICAgICAgICAgICAgIGpvdXJuYWxFbnRyaWVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGFsbCB0aGUgdmFsdWVzIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgT2JqZWN0LnZhbHVlcyhqb3VybmFsRW50cmllcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIHNlYXJjaCB0ZXJtIGluIHRoZSBlbnRyeSB2YWx1ZXMgb2YgdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuZW50cnkuaW5jbHVkZXMoc2VhcmNoVGVybSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwdXNoIHRob3NlIGludG8gdGhhdCBibGFuayBhcnJheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybmVkRW50cmllcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIGZhY3RvcnkgZnVuY3Rpb24gdG8gcHV0IHRoZW0gb24gdGhlIGRvbVxuICAgICAgICAgICAgICAgICAgICByZW5kZXJET00uY3JlYXRlRW50cmllcyhyZXR1cm5lZEVudHJpZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RlbmVyczsiLCIvKlxuQXV0aG9yOiBQYW55YVxuSW50ZW50OiAgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBlbnRyeSBmb3JtIEhUTUwgY29tcG9uZW50XG4qL1xuXG5pbXBvcnQgQVBJIGZyb20gXCIuL2RhdGFcIjtcblxuQVBJLmdldChcIm1vb2RzXCIpXG4gICAgLnRoZW4obW9vZEFycmF5ID0+IHtcbiAgICAgICAgbGV0IEhUTUxjb2RlID0gXCJcIjtcbiAgICAgICAgbW9vZEFycmF5LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBIVE1MY29kZSArPSBgPG9wdGlvbiB2YWx1ZT0ke2VsZW1lbnQuaWR9PiR7ZWxlbWVudC5tb29kfTwvb3B0aW9uPlxuYFxuICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBIVE1MY29kZTtcbiAgICB9KVxuXG5jb25zdCBtYWtlSm91cm5hbEZvcm1Db21wb25lbnQgPSAoKSA9PiB7XG4gICAgLy8gQ3JlYXRlIEhUTUwgc3RydWN0dXJlIGZvciB0aGUgZW50cnkgZm9ybVxuICAgIHJldHVybiBgPGZvcm0gYWN0aW9uPVwiXCIgaWQ9XCJqb3VybmFsRm9ybVwiPlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiam91cm5hbERhdGVcIj5EYXRlIG9mIEVudHJ5PC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIG5hbWU9XCJqb3VybmFsRGF0ZVwiIGlkPVwiam91cm5hbERhdGVcIiByZXF1aXJlZCAvPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiam91cm5hbExlYXJuXCI+Q29uY2VwdHMgY292ZXJlZDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiam91cm5hbExlYXJuXCIgaWQ9XCJqb3VybmFsTGVhcm5cIiByZXF1aXJlZCAvPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiam91cm5hbEVudHJ5XCI+Sm91cm5hbCBFbnRyeTwvbGFiZWw+XG4gICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cImpvdXJuYWxFbnRyeVwiIGlkPVwiam91cm5hbEVudHJ5XCIgY29scz1cIjMwXCIgcm93cz1cIjVcIiByZXF1aXJlZD48L3RleHRhcmVhPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiam91cm5hbE1vb2RcIj5Nb29kIGZvciB0aGUgZGF5PC9sYWJlbD5cbiAgICAgICAgICAgIDxzZWxlY3QgbmFtZT1cImpvdXJuYWxNb29kXCIgaWQ9XCJqb3VybmFsTW9vZFwiIHJlcXVpcmVkPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5DaG9vc2UgYSBtb29kIC4uLiA8L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8YnV0dG9uIGlkPVwicG9zdEVudHJ5XCI+UmVjb3JkIEpvdXJuYWwgRW50cnk8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBpZD1cImV4dHJhc1wiPlxuICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgIDxsZWdlbmQ+RmlsdGVyIGpvdXJuYWwgZW50cmllcyBieSBtb29kPC9sZWdlbmQ+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicmFkaW9CdXR0b25zXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImhhcHB5XCI+aGFwcHk8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RTd2l0Y2hcIiB2YWx1ZT1cImhhcHB5XCIgLz48L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJub3QgeWV0XCI+bm90IHlldDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZFN3aXRjaFwiIHZhbHVlPVwibm90IHlldFwiIC8+PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZnJ1c3RyYXRlZFwiPmZydXN0cmF0ZWQ8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RTd2l0Y2hcIiB2YWx1ZT1cImZydXN0cmF0ZWRcIiAvPjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInNhZFwiPnNhZDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZFN3aXRjaFwiIHZhbHVlPVwic2FkXCIgLz48L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJhbnhpb3VzXCI+YW54aW91czxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZFN3aXRjaFwiIHZhbHVlPVwiYW54aW91c1wiIC8+PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZnVyaW91c1wiPmZ1cmlvdXM8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RTd2l0Y2hcIiB2YWx1ZT1cImZ1cmlvdXNcIiAvPjwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvclwic2VhcmNoam91cm5hbFwiPnNlYXJjaDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJzZWFyY2hqb3VybmFsXCIgaWQ9XCJzZWFyY2hqb3VybmFsXCIgLz5cbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxkaXY+XG4gICAgPC9mb3JtPmA7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBtYWtlSm91cm5hbEZvcm1Db21wb25lbnQ7IiwiLy8gIE1haW4gYXBwbGljYXRpb24gbG9naWMgdGhhdCB1c2VzIHRoZSBmdW5jdGlvbnMgYW5kIG9iamVjdHNcbi8vICBkZWZpbmVkIGluIHRoZSBvdGhlciBKYXZhU2NyaXB0IGZpbGVzLlxuXG5pbXBvcnQgQVBJIGZyb20gXCIuL2RhdGFcIjtcbmltcG9ydCByZW5kZXJET00gZnJvbSBcIi4vZW50cmllc0RPTVwiO1xuaW1wb3J0IGxpc3RlbmVycyBmcm9tIFwiLi9ldmVudExpc3RlbmVyc1wiO1xuXG5BUEkuZ2V0V2l0aE1vb2RzKCkudGhlbihqb3VybmFsRW50cmllcyA9PiByZW5kZXJET00uY3JlYXRlRW50cmllcyhqb3VybmFsRW50cmllcykpO1xuXG5yZW5kZXJET00ucmVuZGVyRm9ybUVsZW1lbnQoKTtcbmxpc3RlbmVycy5lbnRyeUxpc3RlbmVyKCk7XG4vL2xpc3RlbmVycy5tb29kTGlzdGVuZXIoKTtcbmxpc3RlbmVycy5zZWFyY2hMaXN0ZW5lcigpOyJdfQ==
