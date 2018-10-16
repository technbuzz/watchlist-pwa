const container = document.querySelector('#contianer');
const clearDB = document.querySelector('#clearDB');

function createCard(data) {
  let card = document.createElement('div');
  card.className = 'card';

  let img = document.createElement('img');
  img.className = 'card-img-top';
  img.setAttribute('src', data.avatar);
  card.appendChild(img);

  let cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  let cardTitle = document.createElement('h5');
  cardTitle.className = 'card-title';
  cardTitle.textContent = data.first_name;
  cardBody.appendChild(cardTitle);

  let cardText = document.createElement('div');
  cardText.className = 'card-text';
  cardText.textContent = data.last_name;
  cardBody.appendChild(cardText);

  let saveButton = document.createElement('button');
  saveButton.classList.add('btn');
  saveButton.textContent = 'Save Card';
  cardBody.appendChild(saveButton);

  saveButton.addEventListener('click', saveCard);

  card.appendChild(cardBody);
  container.appendChild(card);
}

function clearCards() {
  while (container.hasChildNodes()) {
    container.removeChild(container.lastChild);
  }
}

/**
 * @description It refershed the UI by clearing and regenrating by looping over
 * provided cards
 * @param {array} cards Array of Cards
 */
function updateUI(cards){
  setTimeout(() => {
    console.log('Clearing out the cards');
  }, 250);
  
  setTimeout(() => {
    clearCards();
  }, 1000);
  
  setTimeout(() => {
    console.log('Adding new cards');
  }, 1250);
  
  setTimeout(() => {
    cards.forEach(card => {
      createCard(card);
    })
  }, 2500);
  
}

function killSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(r => {
      r.unregister();
    });
  }
}

// currently not in use, saves post in cache
function saveCard(event) {
  console.log('clicked');
  if ('caches' in window) {
    caches.open('user-requested').then(cache => {
      cache.add('https://httpbin.org/get');
      cache.add('/src/images/nanga.jpg');
    });
  }
  // killSW();
}

let newtorkDataReceived = false;

const url = 'https://reqres.in/api/users/1';
fetch(url
//   , {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   },
//   body: JSON.stringify({
//     message: 'Some message'
//   })
// }
).then(res => res.json())
  .then(response => {
    console.log('from server', response);
    newtorkDataReceived = true;
    clearCards();
    createCard(response.data)
  })
  .catch(error => console.log(error))

if ('indexedDB' in window) {
  readAllData('posts')
    .then(storedData => {
      if (!newtorkDataReceived) {
        console.log('storedData: ', storedData)
        updateUI(storedData);
      }
    })

}

// const db = firebase.firestore(app);
// const postsRef = db.collection('posts');
// postsRef.get().then(querySnapshot => {
//   querySnapshot.forEach(doc => {
//     console.log(doc.data());
//     createCard(doc.data());
//   });
// });

// clearDB.addEventListener('click', x => {
//   clearAllData('posts');
// })

function sendData(){
  fetch('https://stdapi.herokuapp.com/createStudent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: form.student.value,
      math: getRandom(),
      science: getRandom(),
      english: getRandom()
    })
  })
  .then(res => console.log(`Sent Data ${res}`))
}



$('#add-student').on('click', x => {
  $('#newStudent').modal('show')
})

const form = document.forms.new;
form.addEventListener('submit', e=>{
  e.preventDefault();
  if(form.student.value.trim() === ''){
    return false;
  }
  console.log(form.student.value);
  
  $('#newStudent').modal('hide');
  // The reason is that the event that triggers the sync happens in feed.js
  // I can listen to that event in SW or form submission of feeds.js in SW
  if('serviceWorker' in navigator && 'SyncManager' in window){
    navigator.serviceWorker.ready
      .then(sw => {
        console.log(sw);
        const post = {
          id: getRandom(),
          name: form.student.value,
          math: getRandom(),
          science: getRandom(),
          english: getRandom()
        };
        console.log(post)
        writeDate('sync-posts', post)
          .then(x => {
            sw.sync.register('sync-new-posts');
          })
          .then(x => {
            //show alert code
            $('.alert').show();
            setTimeout(() => {
              $('.alert').hide();
            }, 3000);
          })
          .catch(error => console.log(error))
      })
  } else {// browse rsupport
    sendData()
  }
})

