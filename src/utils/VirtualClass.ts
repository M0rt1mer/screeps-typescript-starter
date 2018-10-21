let VirtualRegistry: { [id: string]: any } = {};

export type __Constructor<T> = Function & { prototype: T };

export type _VirtualClassConstructor<T extends VirtualClass> = __Constructor<T> & { IsTypeOf<T extends VirtualClass>(this: __Constructor<T>, instance: any): boolean; };

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

  public static Construct<T extends VirtualClass>(this: __Constructor<T>, instance: any): T | undefined { 
    //check if it uses VirtualClass syntax
    if (!instance.classId) {
      return undefined;
    }

    //find and check it's type
    var instanceType = VirtualRegistry[instance.classId];
    if (!instanceType) {
      return undefined;
    }

    //check that it inherits from THIS (which is the return type) => the <T> cast in return is valid
    if (!(instanceType instanceof this) && instanceType.constructor != this) {
      return undefined; 
    }

    //set prototype
    Object.setPrototypeOf(instance, VirtualRegistry[instance.classId]);
    return <T>instance;
  }

  public static IsTypeOf<T extends VirtualClass>(this: __Constructor<T>, instance: any): boolean {
    if (!instance.classId) {
      return false;
    }

    //find and check it's type
    var instanceType = VirtualRegistry[instance.classId];
    if (!instanceType) {
      return false;
    }

    return (instanceType instanceof this) || instanceType.constructor == this;
  }

  public static GetTypeName() {
    return this.name;
  }

  public GetTypeName() {
    return this.classId;
  }

}

export class StaticClass {

  public static Construct<T extends StaticClass>(this: __Constructor<T>, instance: any): T {
    Object.setPrototypeOf(instance, this.prototype);
    return <T>instance;
  }

}
