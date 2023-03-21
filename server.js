require('dotenv').config()
// let {parsed:{ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET}} = require('dotenv').config()
// console.log('ACCESS_TOKEN_SECRET : ', ACCESS_TOKEN_SECRET)
// console.log('REFRESH_TOKEN_SECRET : ', REFRESH_TOKEN_SECRET)
const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Another Post'
  },
  {
    username: 'Kyle',
    title: 'New Post'
  },
]
app.get('/', (req, res)=>{
  console.log('hello world')
  res.send('<h1>Hello World</h1>')
})

app.get('/posts', authenticateToken, (req, res) => {
  console.log('/posts req.user : ', req.user)
  res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
  console.log('authenticateToken req.headers: ', req.headers)
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    console.log('authenticateToken req.user: ', req.user)
    next()
  })
}

const PORT = 3000
app.listen(PORT, () => { console.log(`server is listening on port ${PORT}`) })