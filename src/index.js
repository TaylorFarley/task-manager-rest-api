const bcrypt = require('bcryptjs')
const express = require('express')
const app = express();
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
                   require('./db/mongoose.js')
                   const Task = require('./models/task')
                   const User = require('./models/user')
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('server is running yo! its on ' + port)
})



