fetch('http://localhost:3000/posts', {
  headers: { authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS3lsZSIsImlhdCI6MTY3OTQyMDg5NywiZXhwIjoxNjc5NDIyMDk3fQ.YvyTfSI3cGlLORszKqYd2dkKXbPt2YNKdnfrsGAs6y8' }
})
  .then(resp => resp.json())
  .then(json => console.log(JSON.stringify(json)))
  .catch(err=> console.log('Error : ', err))