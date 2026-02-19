console.log("1. (Senkron)");

setTimeout(() => {
    console.log("2. (Asenkron - 2 seconds)");
}, 2000);

setTimeout(() => {
    console.log("3. (Asenkron - 0 seconds)");
}, 0);

console.log("4. (Senkron)");

// asenkron build

 /**
  * fs.readFile, fs.writeFile
  * http.request
  * Veritabanı sorguları
  * 
  * setTimeout
  * setInterval
  * 
  * setImmediate
  * process.nextTick
  *  */