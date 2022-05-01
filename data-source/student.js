const { MongoDataSource } = require('apollo-datasource-mongodb');

class Students extends MongoDataSource {
  get(Id) {
    return this.findOneById(Id)
  }
  getAll() {
      return this.model.find();
  }
}

module.exports = Students;