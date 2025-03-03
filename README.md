## Synq - A simple local-first web application

### What is a local-first web application?

A local-first web application co-locates the data with its UI. The data is stored locally on the user's device and works as usual even when the device is offline. The data is synchronized with the server when they are online.

### Why local-first?

Local-first web applications are more reliable and faster than traditional web applications. They work offline and are more secure because the data is stored locally on the user's device.

### Components of a local-first web application

1. **Local data store**: Where to store the data. It can be a database, a file system, or a browser's local storage. Modern browsers support IndexedDB, which is a powerful database for storing large amounts of data.

2. **Sync engine**: How to synchronize the data with the server. The sync engine is responsible for sending the local changes to the server and fetching the server changes to update the local data.

3. **Conflict resolution**: How to handle conflicts when the same data is modified on multiple devices. The conflict resolution strategy determines which changes should be kept and which should be discarded.

4. **State management**: How to manage the application state. How to keep the UI in sync with the data and how to handle user interactions.

5. **User interface**: How to present the data to the user. The user interface should be responsive and easy to use. (I mean, come-on, you obviously need a good UI)

---

### Implementation

This is a simple local-first web application using React and IndexedDB. The application will be a simple note-taking app where users can create, read, update, and delete notes. The data will be stored locally on the user's device using IndexedDB and will be synchronized with the server when they are online.

**Steps**

1. Store a local copy of the data in the IndexedDB
2. Maintain an in-memory copy of the data (state) on the frontend.
3. Maintain an action queue of all the actions performed by the user (in-order)
4. In a pre-defined time interval, execute actions in this queue one by one (or batched) in the order they were performed
5. On page load, fetch the data from IndexedDB and display it in the UI
6. At the same time, push an entry to the action queue to fetch the data from the server
7. When the user performs any action, push an entry to the action queue
8. In the execution of the action queue:
   - Update the in-memory data (state) and notify the UI
   - [Background] Fetch the data from the server
   - [Background] Update the local copy of the data in the IndexedDB
   - In case of any error, undo the action (state) and notify the user
   - Remove the action from the queue
