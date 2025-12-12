const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name:{
    type:String,
    required: true,
  },
  email:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true
  } });

  const User =  mongoose.model('User', UserSchema);

  const ExpenseSchema = new Schema({
    title:{
      type:String,
      required: true,
    },
    amount:{
      type:Number,
      required:true,
    },
    category:{
      type:String,
      required:true,
    },
    date:{
      type:Date,
      default: Date.now()
    
    },
    user:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });

const Expense = mongoose.model('Expense', ExpenseSchema);
module.exports = { User, Expense };
