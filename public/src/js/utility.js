/// <reference path="/src/js/idb.js">
/// <reference path="/src/js/idb.d.ts">

const dbPromise = idb.open('feed-store', 1, (db) => {
  // objectStore is not created by posts name on then create it
  // without this check the post will be create everytime
  if(!db.objectStoreNames.contains('posts')){
    db.createObjectStore('posts', {
      keyPath: 'id'
    })
  }

  if(!db.objectStoreNames.contains('sync-posts')){
    db.createObjectStore('sync-posts', {
      keyPath: 'id'
    })
  }
});

function writeDate(st, data){
  return dbPromise.then(db => {
    let tx = db.transaction(st, 'readwrite');
    let store = tx.objectStore(st);
    store.put(data);
    // simply make sure that transaction is executed and put is done
    // we have to use transaction even we have one operation
    return tx.complete;
  })
}

function readAllData(st){
  return dbPromise
    .then(db => {
      let tx = db.transaction(st, 'readonly');
      let store = tx.objectStore(st);
      return store.getAll();
      // we need tx.complete only on every write operation
    })
}

/**
 * 
 * @param {string} st Name of the store
 */
function clearAllData(st){
  return dbPromise
          .then(db => {
            const tx = db.transaction(st, 'readwrite');
            const store = tx.objectStore(st);
            store.clear();
            
            return tx.complete;
          })

}


function deleteItemFromData(st, id){
  dbPromise
    .then(db => {
      const tx = db.transaction(st, 'readwrite');
      const store = tx.objectStore(st);
      store.delete(id);
      tx.complete;
    })
    .then(x => console.log('Item deleted!s'))
}

function getRandom(){
  return (Math.floor(Math.random() * 75) + 25).toString();
}