const container = document.querySelector('#contianer');

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

// let newtorkDataReceived = false;

const url = 'https://reqres.in/api/users/2';
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

// if('caches' in window){
//   caches.match(url)
//     .then(response => {
//       if(response) {
//         return response.json()
//       }
//     })
//     .then(data => {
//       console.log('from cache', data);
//       if(newtorkDataReceived) {
//         clearCards();
//         createCard();
//       }
//     })
// }

// const db = firebase.firestore(app);
// const postsRef = db.collection('posts');
// postsRef.get().then(querySnapshot => {
//   querySnapshot.forEach(doc => {
//     console.log(doc.data());
//     createCard(doc.data());
//   });
// });

