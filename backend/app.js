const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Expense = require('./Model/schema.js')    //schema for my data
const bodyParser = require('body-parser')
const cors = require('cors');

dotenv.config()

const port = process.env.PORT;
const dbUrl = process.env.URL;

const app = express()

app.use(bodyParser.json())
app.use(cors());

//i have connected the database
mongoose.connect(dbUrl)
.then(() => {
  console.log('Connected to MongoDB')})
.catch(err => {
  console.error('Error connecting to MongoDB:', err)})

app.post('/transaction', (req, res)=>{
    const { date, title, amount, type } = req.body;
    
    const newExpense = new Expense({
        date: new Date(date),
        title,
        amount,
        type
    })

    newExpense.save()
        .then(() => res.status(201).json({ message: 'Transaction saved successfully' })) // ✅ JSON response
        .catch(err => res.status(500).json({ error: 'Error saving transaction: ' + err.message })); // ✅ JSON response
})

app.get('/transactions', async(req, res) => {
  try {
      const transactions = await Expense.find().sort({date : -1})
      console.log(transactions);
      res.status(200).json(transactions);
  }catch(error){
    res.status(500).json({error: "error fetching transactions: " + error.message });
  }
})

//this is to delete 
app.delete('/transactions/:id', async (req, res)=>{
  try{
    const deleteExpense = await Expense.findByIdAndDelete(req.params.id);
    if(!deleteExpense)  res.status(404).json({message : "Transaction not found"});
    res.status(200).json(
      {
        message : "Transaction deleted successfully",
        amount: deleteExpense.amount,
        type : deleteExpense.type
      }
  )
  }catch(error){
    res.status(500).json({error : "error deleting transaxtion: " + error.message });
  }
});

app.get('/', (req, res) => {
  res.send('express app is running fine ')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})