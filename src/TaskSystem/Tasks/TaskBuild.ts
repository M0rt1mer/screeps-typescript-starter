import { Task, TaskStatus } from "TaskSystem/Task";
import { TaskWork } from "./TaskWork";

let energyToBuildRatio = 5;

export class TaskBuild extends TaskWork {

  constructionSiteId: string;

  constructor(site: ConstructionSite) {
    super();
    this.constructionSiteId = site.id;
  }

  CalculateTaskCapacity(): number {
    let site = <ConstructionSite>Game.getObjectById(this.constructionSiteId);
    return (site.progressTotal - site.progress) / energyToBuildRatio;
  }

  GetTaskCreepCapacity(): number {
    return 1;
  }

  PerformTask(creep: Creep): TaskStatus {

    if (creep.carry.energy == 0) {
      return TaskStatus.Done;
    }

    let cSite = Game.getObjectById<ConstructionSite>(this.constructionSiteId);
    if (cSite) {
      if (creep.build(cSite) === ERR_NOT_IN_RANGE) {
        creep.moveTo(cSite, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
      return TaskStatus.NotDone;
    }

    //if all else fails
    console.log("Failed finding game object: " + this.constructionSiteId);
    return TaskStatus.Failed;
  }

  GetCreepCapacity(creep: Creep): number {
    return creep.carry.energy;
  }

  CheckStillValid(): boolean {
    return Game.getObjectById(this.constructionSiteId) != undefined;
  }

  GetTargetPos(): RoomPosition {
    return (<ConstructionSite>Game.getObjectById(this.constructionSiteId)).pos;
  }

  // TASK ID
  GetTaskId(): string {
    return TaskBuild.GetTaskIdFromConstructionSiteId(this.constructionSiteId);
  }

  static GetTaskIdFromConstructionSite(site: ConstructionSite) {
    return this.GetTaskIdFromConstructionSiteId(site.id);
  }

  static GetTaskIdFromConstructionSiteId(siteId: string) {
    return siteId;
  }


}

TaskBuild.RegisterVirtualClass();
