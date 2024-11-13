import { connect } from '../config/database.config.js';
import { ObjectId } from 'mongodb';

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
    
  applyMethodsToPrototype() {
    // Asigna los métodos al prototipo de la clase
    for (const methodName in this.schema.methods) {
      Model.prototype[methodName] = this.schema.methods[methodName];
    }
  }
  
  async save() {
    await this.init();

    if (this._id) {
      const result = await this.collection.updateOne(
        { _id: this._id },
        { $set: this }
      );
      
      if (result.matchedCount === 0) {
        throw new Error('No se encontró el documento para actualizar');
      }
      return result;
    } else {
      const errors = this.schema.validate(this);
      if (errors.length > 0) {
        console.log(errors);
        throw new Error(errors.join(', '));
      }

      const result = await this.collection.insertOne(this);
      return result;
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
    const doc = await this.collection.findOne(query);
    if (doc) {
      this.schema.applyMethods(doc);
    }
    return doc;
  }

  async findById(id) {
    await this.init();

    // Verifica si el ID es un ObjectId válido
    if (!ObjectId.isValid(id)) {
      throw new Error('El ID proporcionado no es válido');
    }

    // Convierte el ID a un ObjectId de MongoDB
    const objectId = new ObjectId(id);

    // Realiza la búsqueda en la colección
    return this.collection.findOne({ _id: objectId });
  }

  async find(query) {
    await this.init();
    return this.collection.find(query).toArray();
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
