import { Task, TaskStatus } from "TaskSystem/Task";
import { Strategy } from "Strategy/StrategyInterface";
import { TaskManager } from "../TaskManager";

/**
 * A generic task that requires WORK parts
 * */
export class TaskTransfer extends Task {

  targetId: string;
  resource: ResourceConstant;
  remainingAmount: number;

  constructor(target: Creep | StructureSpawn | StructureExtension | StructureStorage | StructureTower, resource: ResourceConstant, amount: number) {
    super();
    this.targetId = target.id;
    this.resource = resource;
    this.remainingAmount = amount;
  }

  CalculateTaskCapacity(): number {
    return this.remainingAmount;
  }

  GetTaskCreepCapacity(): number {
    return 3;
  }

  PerformTask(creep: Creep): TaskStatus {

    if (creep.carry[this.resource] == 0) {
      return TaskStatus.Done;
    }

    console.log("transferring to: " + this.targetId)

    let target = Game.getObjectById<Creep | Structure>(this.targetId);
    if (target) {
      let amountBeforeTransfer = creep.carry[this.resource] || 0;
      let result = creep.transfer(target, this.resource);
      switch (result){
        case OK:
          this.remainingAmount -= (amountBeforeTransfer - (creep.carry[this.resource] || 0));
          console.log("remaiing amount: " + (amountBeforeTransfer - (creep.carry[this.resource] || 0)));
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
          break;
        case ERR_FULL:
          console.log("err full")
          this.remainingAmount = 0;
          Strategy.taskManager.RecalculateTask(this);
          return TaskStatus.Done;
      }
      return TaskStatus.NotDone;
    }

    //if all else fails
    return TaskStatus.Failed;
  }

  GetCreepCapacity(creep: Creep): number {
    return creep.carry.energy;
  }

  CheckStillValid(): boolean {
    return Game.getObjectById(this.targetId) != undefined && this.remainingAmount > 0;
  }

  GetTaskId(): string {
    return this.targetId;
  }
  

}

TaskTransfer.RegisterVirtualClass();
