// create variable to hold db connection
let db;

// Establish a connection to IndexDB database called 'budgetTracker'
const request = indexedDB.open("budgetTracker", 1);

request.onupgradeneeded = function (event) {

  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};


request.onsuccess = function (event) {
 
  db = event.target.result;

  if (navigator.onLine) {
    uploadTransaction();
  }
};

request.onerror = function (event) {
  // log error here
  console.log("OMG!!!" + event.target.errorCode);
};


// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["Pending"], "readwrite");


  const store = transaction.objectStore("new_transaction");


  store.add(record);
}

function checkDatabase() {

  const transaction = db.transaction(["pending"], "readwrite");


  const store = transaction.objectStore("pending");


  const getAll = store.getAll();


  getAll.onsuccess = function () {

    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })

        .then(response => response.json())
        .then(() => {
          
          const transaction = db.transaction(["pending"], "readwrite");

          const store = transaction.objectStore("pending");

          store.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", uploadTransaction);
