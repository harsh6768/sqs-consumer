const express =require('express');
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(require('./routes/routes'));
let PORT=3002;

app.listen(PORT,()=>{
    console.log(`Server is up and running in port ${PORT}`);
})