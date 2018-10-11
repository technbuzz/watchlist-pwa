const container = document.querySelector('#contianer');


function createCard() {
  
  let card = document.createElement('div');
  card.className = 'card';
  
  let img = document.createElement('img');
  img.className = "card-img-top";
  img.setAttribute('src', '/src/images/nanga.jpg');
  card.appendChild(img);
  
  let cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  
  let cardTitle = document.createElement('div');
  cardTitle.className = 'card-title';
  cardBody.appendChild(cardTitle);
  
  let cardText = document.createElement('div');
  cardText.className = 'card-text';
  cardText.textContent = "Nanga Parbat, locally known as Diamer, is the ninth highest mountain in the world at 8,126 metres above sea level.";
  cardBody.appendChild(cardText);

  let saveButton = document.createElement('button');
  saveButton.classList.add('btn');
  saveButton.textContent = "Save Card"
  cardBody.appendChild(saveButton);

  saveButton.addEventListener('click', saveCard);

  card.appendChild(cardBody);
  container.appendChild(card);
}

function clearCards(){
  while(container.hasChildNodes()){
    container.removeChild(container.lastChild);
  }
}


// currently not in use, saves post in cache
function saveCard(event){
  console.log('clicked');
  if('caches' in window){
    caches.open('user-requested')
      .then(cache => {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/nanga.jpg');
      })
  }
}

let newtorkDataReceived = false;

const url = 'https://httpbin.org/post';
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    message: 'Some message'
  })
}).then(res => res.json())
  .then(data => { 
    console.log('from server', data);
    newtorkDataReceived = true;
    clearCards();    
    createCard()
  })

if('caches' in window){
  caches.match(url)
    .then(response => {
      if(response) {
        return response.json()
      }
    })
    .then(data => {
      console.log('from cache', data);
      if(newtorkDataReceived) { 
        clearCards();
        createCard();
      }
    })
}