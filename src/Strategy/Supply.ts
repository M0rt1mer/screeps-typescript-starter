import { Harvester } from "Roles/Harvester";
import { ISupply, Strategy } from "./StrategyInterface";
import { Transporter } from "Roles/Transporter";
import { JobHarvestTask } from "Jobs/JobHarvestTask";
import { TaskHarvest } from "TaskSystem/Tasks/TaskHarvest";
import { TaskEntry } from "TaskSystem/TaskManager";
import { TaskTransfer } from "TaskSystem/Tasks/TaskTransfer";

export class Supply extends ISupply {

  numHarvesters: number = 0;
  harvesterList: string[] = [];

  transporterList: string[] = [];

  //initialized on first use
  sourcesList: Source[] | undefined;

  Precalculate() : void {

    this.harvesterList = _.filter(Object.keys(Memory.creeps), (creepName: string) => { return Harvester.IsTypeOf(Memory.creeps[creepName]); });
    this.numHarvesters = this.harvesterList.length;
    //console.log(this.numHarvesters);
    this.transporterList = _.filter(Object.keys(Memory.creeps), (creepName: string) => { return Transporter.IsTypeOf(Memory.creeps[creepName]); });
    console.log("precalculate");
    let room = Game.rooms[_(Game.rooms).findLastKey()];
    console.log(room);
    Supply.BuildHarvestTasks(room);
    Supply.BuildTransferTasks(room);
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
    return !this.ShouldSpawnHarvester() && this.transporterList.length < 4;
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
    let extensions = room.find(FIND_MY_STRUCTURES);
    for (let extension of extensions) {
      if (extension instanceof StructureExtension) {
        if (!Strategy.taskManager.HasTaskOfId(extension.id)) {
          Strategy.taskManager.ManageTask(new TaskTransfer(extension, RESOURCE_ENERGY, extension.energyCapacity - extension.energy));
        }
        else {
          let task = (<TaskTransfer>Strategy.taskManager.GetTaskOfId(extension.id));
          task.remainingAmount = extension.energyCapacity - extension.energy;
          Strategy.taskManager.RecalculateTask(task);
        }
      }
    }
  }

}

Strategy.supplyStrategy = new Supply();
