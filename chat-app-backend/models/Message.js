const mongoose = require('mongoose');

const messageSchema = new  mongoose.Schema({
    room:{
        type: String,
        required : true
    } ,
    sender: {
        id : String,
        username: String
    },
    content : {
        type : String,
        required : true
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }

})

module.exports = mongoose.model('Message', messageSchema);
