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

router.get('/getAnalyzedData', (req, res) => {

    AnalyzedTweetTemplateCopy.find({  })
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.get('/getAnalyzedSentiment', (req, res) => {

    AnalyzedTweetTemplateCopy.find({  })
        .then((data) => {
            negative = 0
            positive = 0
            neutral = 0
            i=0
            while(i<data.length){
                if (data[i].sentiment['sent-it'].sentiment=='negative')
                    negative++
                else if (data[i].sentiment['sent-it'].sentiment=='positive')
                    positive ++
                else
                    neutral ++

                i++
            }

            var sentCounter = {
                positive: positive,
                negative: negative,
                neutral: neutral,
             }

            console.log('sent: ', sentCounter);
            res.json(sentCounter);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.get('/getAnalyzedSentimentDates', (req, res) => {

    AnalyzedTweetTemplateCopy.find({  })
        .then((data) => {
            negative = 0
            positive = 0
            neutral = 0
            i=0
            while(i<data.length){
                if (data[i].sentiment['sent-it'].sentiment=='negative')
                    negative++
                else if (data[i].sentiment['sent-it'].sentiment=='positive')
                    positive ++
                else
                    neutral ++

                i++
            }

            var sentCounter = {
                positive: positive,
                negative: negative,
                neutral: neutral,
             }

            console.log('sent: ', sentCounter);
            res.json(sentCounter);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

module.exports = router