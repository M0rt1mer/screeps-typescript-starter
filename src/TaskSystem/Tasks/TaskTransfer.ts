import { Task, TaskStatus } from "TaskSystem/Task";
import { Strategy } from "Strategy/StrategyInterface";
import { TaskManager } from "../TaskManager";

export class TaskTransfer extends Task {

  targetId: string;
  resource: ResourceConstant;
  remainingAmount: number;

  constructor(target: Creep | StructureSpawn | StructureExtension | StructureStorage, resource: ResourceConstant, amount: number) {
    super();
    this.targetId = target.id;
    this.resource = resource;
    this.remainingAmount = amount;
  }

  CalculateTaskCapacity(): number {
    //let target = Game.getObjectById(this.targetId);

    return this.remainingAmount;

    /*if (target instanceof Creep) {
      return target.carryCapacity - _.sum(target.carry);
    }
    else if (target instanceof StructureSpawn || target instanceof StructureExtension) {
      return target.energyCapacity - target.energy;
    }
    else if (target instanceof StructureStorage) {
      return target.storeCapacity - _.sum(target.store);
    }
    return 0;*/
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

  GetTaskId(): string {
    return this.targetId;
  }
  

}

TaskTransfer.RegisterVirtualClass();
