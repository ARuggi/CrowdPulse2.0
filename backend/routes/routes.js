const express = require('express')
const router = express.Router()
const AnalyzedTweetTemplateCopy = require('../models/AnalyzedtwettModels')

router.post('/analyzed',function(request, response) {
    const AnalyzedTweet = new AnalyzedTweetTemplateCopy({
        campo:request.body.campo,
        nome:request.body.nome,
    })
    AnalyzedTweet.save()
    .then( data =>{
        response.json(data)
    } )
   .catch(error =>{
       response.json(error)
   })

})

router.get('/search', (req, res) => {

    AnalyzedTweetTemplateCopy.find({  })
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', daerrorta);
        });
});

module.exports = router