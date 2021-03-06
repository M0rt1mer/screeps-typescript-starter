import { Task, TaskStatus } from "TaskSystem/Task";
import { Strategy } from "Strategy/StrategyInterface";

export class TaskHarvest extends Task {

  sourceId: string;
  creepCapacity: number;

  containerIds: string[];
  lastContainerSearch: number = 0;

  constructor(source: Source) {
    super();
    this.sourceId = source.id;
    this.creepCapacity = 0;
    //preprocess terrain
    let terrain = Game.map.getRoomTerrain(source.room.name);
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        let roomX = source.pos.x + x;
        let roomY = source.pos.y + y;
        //check bounds. 50 is the size of all rooms, it's very much fixed
        if (roomX >= 0 && roomX < 50 && roomY >= 0 && roomY < 50) {
          if (terrain.get(roomX, roomY) != TERRAIN_MASK_WALL) {
            this.creepCapacity++;
          }
        }
      }
    }
    this.containerIds = [];
    this._FindContainers(source);
  }

  _FindContainers(src: Source) {
    this.containerIds = [];
    let containers = src.room.find(FIND_STRUCTURES);
    for (let structure of containers) {
      if (structure instanceof StructureContainer) {
        this.containerIds.push(structure.id);
      }
    }
    this.lastContainerSearch = Game.time;
  }

  CalculateTaskCapacity(): number {
    return 5; //this is average resource renew rate
  }

  GetTaskCreepCapacity(): number {
    return this.creepCapacity;
  }

  PerformTask(creep: Creep): TaskStatus {

    if (_.sum(creep.carry) == creep.carryCapacity) {
      return TaskStatus.Done;
    }

    let source = Game.getObjectById<Source>(this.sourceId);
    if (source) {

      if (this.lastContainerSearch < Game.time) {
        this._FindContainers(source);
      }

      if (source.pos.inRangeTo(creep.pos, 1)) {
        creep.harvest(source);
        for (let containerId of this.containerIds) {
          let container = Game.getObjectById<StructureContainer>(containerId);
          if (!container) {
            continue;
          }
          if (container.pos.inRangeTo(creep.pos,1)) {
            creep.transfer(container, RESOURCE_ENERGY);
          }
        }
      }
      else {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
      return TaskStatus.NotDone;
    }

    //if all else fails
    return TaskStatus.Failed;
  }

  GetTaskId(): string {
    return this.sourceId;
  }

  GetCreepCapacity(creep: Creep): number {
    return _.sum(creep.body, (body: BodyPartDefinition) => { return body.type == WORK ? 1 : 0; });
  }

  CheckStillValid(): boolean {
    return Game.getObjectById(this.sourceId) != undefined;
  }

}

TaskHarvest.RegisterVirtualClass();
