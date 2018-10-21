import { VirtualClass } from "utils/VirtualClass";

export enum JobStatus {
  CONTINUE = 0,
  FINISHED = 1,
  FAILED = 2
}

export abstract class AJob extends VirtualClass {

  abstract Perform(creep: Creep, memory: CreepMemory): JobStatus;

  abstract GetJobIcon(): string;
}
