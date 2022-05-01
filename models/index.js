const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://user:userpw@localhost:27017/apollo_example');
}

module.exports = {
    Member: require('./member'),
    Student: require('./student'),
}