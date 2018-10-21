import { VirtualClass } from "utils/VirtualClass";

export abstract class CreepRole extends VirtualClass implements CreepMemory {

  abstract Update(self: Creep): void;

};

