import { VirtualClass } from "utils/virtual";

export abstract class CreepRole extends VirtualClass implements CreepMemory {

  abstract Update(self: Creep): void;

};

