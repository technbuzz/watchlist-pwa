const dbPromise = idb.open('feed-store', 1, (db) => {
  // objectStore is not created by posts name on then create it
  // without this check the post will be create everytime
  if(!db.objectStoreNames.contains('posts')){
    db.createObjectStore('posts', {
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
    })
}