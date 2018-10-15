## EX 1.1

### Clear indexedDB before writing it in sw.js

```
fetch(event.request)
  .then(res => {
    let clonedRes = res.clone();
    //check EX1.1 at /src/code-examples.md
    clearAllData('posts')
      .then(x => clonedRes.json())
      .then(response => {
        writeDate('posts', response.data)
        console.log('SW:', response)
      })
    return res
  })
```
