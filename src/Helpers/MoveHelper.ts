import { VirtualClass } from "utils/VirtualClass";

export type DONE = -100;

export type ExtendedCreepMoveReturnCode = CreepMoveReturnCode | DONE;

export abstract class MoveHelper extends VirtualClass {

  abstract Update(creep: Creep): ExtendedCreepMoveReturnCode;

}
