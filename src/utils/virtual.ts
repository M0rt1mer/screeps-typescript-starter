let VirtualRegistry: { [id: string]: any } = {};

interface __Constructor<T> { 
    new(...args: any[]): T;
}

export class VirtualClass {
  // identifier of instance
  classId: string;
  //fake, does nothing, but won't compile without this
  public readonly __proto__: any;

  constructor() {
    this.classId = this.__proto__.constructor.name;
  }

  public static RegisterVirtualClass() : void {
    VirtualRegistry[this.name] = this.prototype;
  }
 
  public static Construct<T extends VirtualClass>(this: __Constructor<T>, instance: any): T { 
    if (!instance.classId) {
      return undefined;
    }
    var instanceType = VirtualRegistry[instance.classId];
    if (!(instanceType instanceof this) && instanceType.constructor != this) {
      return undefined; 
    }
    Object.setPrototypeOf(instance, VirtualRegistry[instance.classId]);
      return <T>instance;
  }
}

export function Construct_cast<T extends VirtualClass>(instance: any): T | undefined {
  if (!instance.classId) {
    return undefined;
  }
  Object.setPrototypeOf(instance, VirtualRegistry[instance.classId]);
  return <T>instance;
}

function Checked_construct_cast<T extends VirtualClass>(instance: any, ctor: __Constructor<T>) : T { 
  if (!instance.classId) {
    return undefined;
    }
    var instanceType = VirtualRegistry[instance.classId]; 
    if (!(instanceType instanceof ctor) && instanceType.constructor != ctor) {
        return undefined; 
    }
    Object.setPrototypeOf(instance, VirtualRegistry[instance.classId]);
    return <T>instance;
}

export function IsTypeOf<T extends VirtualClass>(instance: any, ctor: __Constructor<T>): boolean {
  if (!instance.classId) {
    return false;
  }
  return ctor.prototype.constructor.name === instance.classId;
}
