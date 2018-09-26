let deferredPrompt;
const installBtn = document.querySelector('button');

if('serviceWorker' in navigator){
  navigator.serviceWorker
    .register('/sw.js')
    .then(()=>{
      console.log('Service Worker Registered!')
    })
}

window.addEventListener("beforeinstallprompt", (event) => {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
})

installBtn.addEventListener('click', () => {
  if(deferredPrompt){
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((result)=>{
      console.log(result.outcome);
      if(result.outcome === 'dismissed'){
        console.log('User cancelled installation');
      } else {
        console.log('Use added to Home Screen');
        
      }

      deferredPrompt = null;
    })
  }
})

fetch('https://httpbin.org/post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: "no-cors",
  body: JSON.stringify({message: 'Does this works'})
})
.then(response => {
  return response.json();
})
.then(data => console.log(data))
.catch(error => console.log(error))

// const promise = new Promise((resolve, reject) => {
//   setTimeout(()=>{
//     // resolve('This is executed once the timer is done!');
//     reject({code: 500, message: 'Failed the promise'})
//   }, 3000)
// })

// promise.then((event)=>{
//   console.log(event)
// }).catch(err => console.error(err.code, err.message))