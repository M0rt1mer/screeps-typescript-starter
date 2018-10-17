import { inspect } from "util";

let VirtualRegistry: { [id: string]: any } = {};

export class VirtualClass {
  // identifier of instance
  classId: string;
  //fake???
  public readonly __proto__: any;

  constructor() {
    this.classId = this.__proto__.constructor.name;
  }

  Do() { console.log("tst"); }
  
  public static RegisterVirtualClass() : void {
    VirtualRegistry[this.name] = this.prototype;
  }
 
}

export function Construct_cast<T extends VirtualClass>(instance: any): T | undefined {
  if (!instance.classId) {
    return undefined;
  }
  Object.setPrototypeOf(instance, VirtualRegistry[instance.classId]);
  return <T>instance;
}

export function IsTypeOf<T extends VirtualClass>(instance: any, ctor: { new(...args: any[]): T }): boolean {
  if (!instance.classId) {
    return false;
  }
  return ctor.prototype.constructor.name === instance.classId;
}