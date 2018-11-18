const cardTemplate = document.querySelector('#card-template');
const movies = document.querySelector('#movies');


const addToPage = ({title}) => {
  const newCard = cardTemplate.content.cloneNode(true);
  debugger
  const cardTitle = newCard.querySelector('.card-title');

  cardTitle.textContent = title;
  movies.appendChild(newCard);
}

addToPage({title: 'New Movie'});