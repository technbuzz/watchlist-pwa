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




