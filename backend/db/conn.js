const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb://localhost:27017/cinescore')
    console.log('Mongoose conected.')
}

main().catch((err) => console.log(err))

module.exports = mongoose