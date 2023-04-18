const express = require('express')
const app = express()

const Wappalyzer = require('wappalyzer')

app.get('/data',(req, res)=>{
  const url = req.query.url

  const options = {
    debug: false,
    delay: 500,
    headers: {},
    maxDepth: 3,
    maxUrls: 10,
    maxWait: 10000,
    recursive: true,
    probe: true,
    proxy: false,
    userAgent: 'Wappalyzer',
    htmlMaxCols: 2000,
    htmlMaxRows: 2000,
    noScripts: false,
    noRedirect: false,
  };
  
  const wappalyzer = new Wappalyzer(options)
  
  ;(async function() {
    try {
      await wappalyzer.init()
  
      // Optionally set additional request headers
      const headers = {}
  
      // Optionally set local and/or session storage
      const storage = {

      session: {}
      }
  
      const site = await wappalyzer.open(url, headers, storage)
  
      // Optionally capture and output errors
      site.on('error', console.error)
  
      const results = await site.analyze()
      //difening categories
     const categories = results.technologies.map(technologies => technologies.categories[0].name)
       //filtering categories
     const uniqueArray = categories.filter(function(item, pos) {
      return categories.indexOf(item) == pos;
  })

  const finalArray = [];
     for(var i=0;i<uniqueArray.length;i++){
       finalArray.push({
        "category": uniqueArray[i],
        "items": []
       })
      for(j=0;j<categories.length;j++){
  
      if(uniqueArray[i]==categories[j]){
           finalArray[i].items.push({
               name: results.technologies[j].name,
               logo: `https://www.wappalyzer.com/images/icons/${results.technologies[j].icon}`
        })
      }
      }
     }



     return res.json({messege: "success", result: finalArray})

    } catch (error) {
        return res.status(400).json({messege: error.messege})
    }
    await wappalyzer.destroy()
  })()
})

app.listen(3000, ()=>{
  console.log("listening on port 3000")
})