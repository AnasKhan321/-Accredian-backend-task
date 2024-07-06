require('dotenv').config();
const express = require('express')
const app = express()
const cors = require("cors")
const port = process.env.PORT ||  8000
const nodemailer = require('nodemailer');
const {PrismaClient }  = require("@prisma/client")


const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())


const SendMail = (email )=>{

    return new Promise((resolve, reject) => {
   
        let transporter = nodemailer.createTransport({
            service: 'gmail', // Replace with your email service provider
            auth: {
                user: process.env.HOST_EMAIL, // Your email address
                pass: process.env.EMAIL_PASSWORD // Your password or app-specific password
            }
        });

        const mailOptions = {
            from: process.env.HOST_EMAIL, // Sender address
            to: email, // List of recipients
            subject: 'From Accerdian  ', // Subject line
            text: `You successfully register to refer&earn in accerdian ` // Plain text body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("reject")
                reject({ error});
            } else {
                console.log("resolved")
                resolve({ error: null });
            }
        });
    });
}


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/postdata'  , async(req,res)=>{
    console.log("calling")

    try{
        const data = req.body 
        const newuser = await prisma.refer.create({
    
            data : {
        
                    email : data.email , 
                    phone_number : data.phone, 
                    course_id  : data.courseid
            }
        
          
        }); 

        await  SendMail(data.email)
    
    
        res.json({success : true  , data  : newuser })

    }catch(e){
        console.log(e)
        res.json({success : false   , error : e })
    }

  

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


