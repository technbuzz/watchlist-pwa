function createCard() {
  const container = document.querySelector('#contianer');
  
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

  // let saveButton = document.createElement('button');
  // saveButton.classList.add('btn');
  // saveButton.textContent = "Save Card"
  // cardBody.appendChild(saveButton);

  // saveButton.addEventListener('click', saveCard);

  card.appendChild(cardBody);
  container.appendChild(card);
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

const url = 'https://httpbin.org/get';
if('caches' in window){
  caches.match(url)
    .then(response => {
      if(response) {
        return response.json()
      }
    })
    .then(data => {
      console.log(data);
      
    })
}
fetch('https://httpbin.org/get')
  .then(res => res.json())
  .then(data => createCard())