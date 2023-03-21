require('dotenv').config()
const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  console.log('/token - refreshToken : ', refreshToken);
  if (refreshToken == null) {
    console.log('/token - refresh token is not given')
    return res.sendStatus(401)
  }
  if (!refreshTokens.includes(refreshToken)) {
    console.log('/token - refresh token is not in the list');
    return res.sendStatus(403)
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log('/token - refresh token is not verified')
      return res.sendStatus(403)
    }
    console.log('/token user : ', user);
    const accessToken = generateAccessToken({ name: user.name }, '20m')
    console.log('/token - accessToken : ', accessToken);
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username }
  console.log('/login user : ', user);
  const accessToken = generateAccessToken(user, '20m')
  const refreshToken = generateRefreshToken(user)
  refreshTokens.push(refreshToken)
  console.log('/login - refreshToken number : ', refreshTokens.length)  // 동일인이 계속 login해도 계속 refreshToken이 생성된다. 개선필요
  res.json({ accessToken: accessToken, refreshToken })
})

function generateAccessToken(user, expire) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expire })
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
}

const PORT = 5000
app.listen(PORT, () => { console.log(`server is listening on port ${PORT}`) })