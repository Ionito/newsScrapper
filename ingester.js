const request = require('request')

const apiUrl = 'http://localhost:3000/news'
if (process.env.NODE_ENV === 'production') {
    const apiUrl = 'http://bulbasaur.hackaton.retargetly.com:3000/'
}


module.exports = {
    post,
}

function post(provider, article) {
    return new Promise((resolve, reject) => {
        const payload = {
            provider: provider,
            articles: article,
        }

        request({
            url: apiUrl,
            method: 'POST',
            json: payload
        }, (err, res) => {
            if (err) {
                console.error(err)
                return res.end()
            }
            return resolve()
        })
    })
}