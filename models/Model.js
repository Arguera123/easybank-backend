import { connect } from '../config/database.config.js';

class Model {
  constructor(collectionName, schema) {
    this.collectionName = collectionName;
    this.schema = schema;
  }

  async init() {
    if (!this.collection) {
      const db = await connect();
      this.collection = db.collection(this.collectionName);
    }
  }

  async create(doc) {
    const errors = this.schema.validate(doc);
    if (errors.length > 0) {
      console.log(errors);
      throw new Error(errors.join(', '));
    }

    await this.init();
    return this.collection.insertOne(doc);
  }

  async findOne(query) {
    await this.init();
    return this.collection.findOne(query);
  }

  async updateOne(query, update) {
    await this.init();
    return this.collection.updateOne(query, update);
  }

  async deleteOne(query) {
    await this.init();
    return this.collection.deleteOne(query);
  }
}

export default Model;
