import { Harvester } from "Roles/Harvester";
import { ISupply, Strategy } from "./StrategyInterface";
import { Transporter } from "Roles/Transporter";
import { JobHarvestTask } from "Jobs/JobHarvestTask";
import { TaskHarvest } from "TaskSystem/Tasks/TaskHarvest";
import { TaskEntry } from "TaskSystem/TaskManager";

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
    TaskHarvest.BuildHarvestTasks(room);
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

}

Strategy.supplyStrategy = new Supply();
