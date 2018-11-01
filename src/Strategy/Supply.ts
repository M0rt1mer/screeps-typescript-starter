import { Harvester } from "Roles/Harvester";
import { ISupply, Strategy } from "./StrategyInterface";
import { Transporter } from "Roles/Transporter";
import { JobHarvestTask } from "Jobs/JobHarvestTask";
import { TaskHarvest } from "TaskSystem/Tasks/TaskHarvest";
import { TaskEntry } from "TaskSystem/TaskManager";
import { TaskTransfer } from "TaskSystem/Tasks/TaskTransfer";
import { TaskRepair } from "TaskSystem/Tasks/TaskRepair";
import { TaskUpgrade } from "TaskSystem/Tasks/TaskUpgrade";
import { TaskBuild } from "TaskSystem/Tasks/TaskBuild";
import { Worker } from "Roles/Worker";

export class Supply extends ISupply {

  numHarvesters: number = 0;
  harvesterList: string[] = [];

  transporterList: string[] = [];

  workerList: string[] = [];

  //initialized on first use
  sourcesList: Source[] | undefined;

  Precalculate() : void {

    this.harvesterList = _.filter(Object.keys(Memory.creeps), (creepName: string) => { return Harvester.IsTypeOf(Memory.creeps[creepName]); });
    this.numHarvesters = this.harvesterList.length;
    //console.log(this.numHarvesters);
    this.transporterList = _.filter(Object.keys(Memory.creeps), (creepName: string) => { return Transporter.IsTypeOf(Memory.creeps[creepName]); });
    this.workerList = _.filter(Object.keys(Memory.creeps), (creepName: string) => { return Worker.IsTypeOf(Memory.creeps[creepName]); });;


    let room = Game.rooms[_(Game.rooms).findLastKey()];
    console.log(room);
    Supply.BuildHarvestTasks(room);
    Supply.BuildTransferTasks(room);
    Supply.BuildRepairTasks(room);
    Supply.BuildUpgradeTasks(room);
    Supply.BuildBuildTasks(room);
  }

  ShouldSpawnHarvester(): boolean{
    let harvestTasks = Strategy.taskManager.FindTaskEntries(TaskHarvest);
    let missingCreepCount = _.sum(harvestTasks, (te: TaskEntry) => { return te.creepCapacity - _.sum(te.consumers); });
    let missingCapacity = _.sum(harvestTasks, (te: TaskEntry) => { return te.remainingCapacity; });

    console.log("missding cc: " + missingCreepCount + "; missing cap: " + missingCapacity);

    for (var creepName in this.harvesterList.values) {
      let harvester = <Harvester>(Memory.creeps[creepName]);
      if (!JobHarvestTask.IsTypeOf(harvester.job)){
        missingCreepCount--;
        missingCapacity -= _.sum(Game.creeps[creepName].body, (body: BodyPartDefinition) => { return body.type == WORK ? 1 : 0; });
      }
    }
    console.log("should spawn harvesters: " + (missingCreepCount > 0 && missingCapacity > 0));
    return missingCreepCount > 0 && missingCapacity > 0;

  }

  ShouldSpawnTransporter(): boolean {
    return !this.ShouldSpawnHarvester() && this.workerList.length > this.transporterList.length && this.transporterList.length < 2;
  }

  ShouldSpawnWorker(): boolean {
    return !this.ShouldSpawnHarvester() && this.workerList.length <= this.transporterList.length + 1 && this.workerList.length < 2;
  }

  //only build/upgrade after all spawners and extensions are filled
  ShouldUpgrade(): boolean {
    let room = Game.rooms[ _(Game.rooms).findLastKey() ];
    return room.energyAvailable == room.energyCapacityAvailable;
  }

  GetHarvesterList(): string[] {
    return this.harvesterList;
  }

  GetTransporterList(): string[] {
    return this.transporterList;
  }

  ShouldHarvesterMove(): boolean {
    return this.transporterList.length < 4;
  }



  static BuildHarvestTasks(room: Room) {
    let sources = room.find(FIND_SOURCES);
    for (let source of sources) {
      if (!Strategy.taskManager.HasTaskOfId(source.id)) {
        Strategy.taskManager.ManageTask(new TaskHarvest(source));
      }
    }
  }

  static BuildTransferTasks(room: Room) {
    let spawns = room.find(FIND_MY_SPAWNS);
    for (let spawn of spawns) {
      if (!Strategy.taskManager.HasTaskOfId(spawn.id)) {
        Strategy.taskManager.ManageTask(new TaskTransfer(spawn, RESOURCE_ENERGY, spawn.energyCapacity - spawn.energy));
      }
      else {
        console.log("setting remaining capacity: " + (spawn.energyCapacity - spawn.energy));
        let task = (<TaskTransfer>Strategy.taskManager.GetTaskOfId(spawn.id));
        task.remainingAmount = spawn.energyCapacity - spawn.energy;
        Strategy.taskManager.RecalculateTask(task);
      }
    }
    let structures = room.find(FIND_MY_STRUCTURES);
    for (let structure of structures) {
      if (structure instanceof StructureExtension || structure instanceof StructureTower ) {
        if (!Strategy.taskManager.HasTaskOfId(structure.id)) {
          if (structure.energy < structure.energyCapacity) {
            Strategy.taskManager.ManageTask(new TaskTransfer(structure, RESOURCE_ENERGY, structure.energyCapacity - structure.energy));
          }
        }
        else {
          let task = (<TaskTransfer>Strategy.taskManager.GetTaskOfId(structure.id));
          task.remainingAmount = structure.energyCapacity - structure.energy;
          Strategy.taskManager.RecalculateTask(task);
        }
      }
    }
  }

  static BuildRepairTasks(room: Room) {
    let structures = room.find(FIND_STRUCTURES);

    for (let structure of structures) {
      if (structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL) {
        let taskId = TaskRepair.GetTaskIdFromStructure(structure);
        if (!Strategy.taskManager.HasTaskOfId(taskId)) {
          Strategy.taskManager.ManageTask(new TaskRepair(structure));
        }
      }
    }
  }

  static BuildUpgradeTasks(room: Room) {
    if (room.controller) {
      if (!Strategy.taskManager.HasTaskOfId(TaskUpgrade.GetTaskIdFromController(room.controller))){
        Strategy.taskManager.ManageTask(new TaskUpgrade(room.controller));
      }
    }
  }

  static BuildBuildTasks(room: Room) {
    let constructions = room.find(FIND_CONSTRUCTION_SITES);

    for (let construction of constructions) {
      let taskId = TaskBuild.GetTaskIdFromConstructionSite(construction);
      if (!Strategy.taskManager.HasTaskOfId(taskId)) {
        Strategy.taskManager.ManageTask(new TaskBuild(construction));
      }
    }
  }

}

Strategy.supplyStrategy = new Supply();
