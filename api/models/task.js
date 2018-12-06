const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    content: {type: String, required: true},
    creator: {type: String, required: true},
    deadline: {type:Date, required:true},
    imageFile: {type:String, required:false}
});

module.exports = mongoose.model('Task',taskSchema);