const mongoose = require('mongoose')

const AnalyzedTweetTemplate = new mongoose.Schema({
    campo:{
        type:String,
        required:true
    },
    nome:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('prova',AnalyzedTweetTemplate)