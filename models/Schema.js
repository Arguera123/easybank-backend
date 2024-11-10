import { ObjectId } from 'mongodb';

class Schema {
  constructor(definition, options = {}) {
    this.definition = definition;
    this.options = options;
    this.virtuals = {};
    this.methods = {};

    if (this.options.timestamps) {
      this.definition.createdAt = {
        type: Date,
        default: Date.now(),
      };
      this.definition.updatedAt = {
        type: Date,
        default: Date.now(),
      };
    }

  }

  virtual(name) {
    this.virtuals[name] = {}
    return {
      get: (fn) => { this.virtuals[name].get = fn; },
      set: (fn) => { this.virtuals[name].set = fn; }
    };
  }

  method(name, fn) {
    this.methods[name] = fn;
  }

  applyMethods(instance) {
    for (const methodName in this.methods) {
      instance[methodName] = this.methods[methodName];
    }
  }
 
  // Metodos para validar los datos segun el Schema
  validate(data) {

    this.applyMethods(data);
    const errors = [];
    for (const field in this.definition) {
      const rules = this.definition[field];
      const value = data[field];

      // Validacion de requerido
      if (rules.required && (value === undefined || value === null)) { 
        errors.push(`${field} es requerido.`);
      }
      
      // Validación de ObjectId
      if (rules.type === ObjectId && value !== undefined && !ObjectId.isValid(value)) {
        errors.push(`${field} debe ser un ObjectId valido.`);
      }

      // Validación de tipo de dato
      if (rules.type && value !== undefined && typeof value !== rules.type.name.toLowerCase()) {
        errors.push(`${field} debe ser de tipo ${rules.type.name.toLowerCase()}.`);
      }
      
    }
    
    this.setDefaults(data);
    this.applyVirtualGetters(data);
    this.applyVirtualSetters(data);

    return errors;
  }

  // Metodo para asignar valores por defecto
  setDefaults(data) {
    for(const field in this.definition) {
      const rules = this.definition[field];
      if (rules.default && (data[field] === undefined || data[field] === null)) {
        data[field] = typeof rules.default === 'function' ? rules.default() : rules.default;
      }
    }
    return data;
  }

  async applyVirtualSetters(data) {
    for (const field in this.virtuals) {
      if (this.virtuals[field].set && data[field] !== undefined) {
        await this.virtuals[field].set.call(data, data[field]);
      }
    }
  } 

  applyVirtualGetters(data) {
    for (const field in this.virtuals) {
      if (this.virtuals[field].get) {
        Object.defineProperty(data, field, {
          get: () => this.virtuals[field].get.call(data),
          enumerable: true,
        });
      }
    }
  }

}

export default Schema;
