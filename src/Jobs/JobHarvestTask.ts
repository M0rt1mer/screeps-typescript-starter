import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { TaskHarvest } from "TaskSystem/Tasks/TaskHarvest";
import { TaskStatus, Task } from "TaskSystem/Task";
import { JobSimpleTask } from "./JobSimpleTask";
import { MathUtils } from "utils/MathUtils";

export class JobHarvestTask extends JobSimpleTask<TaskHarvest> {

  GetJobIcon(): string {
    return "⛏";
  }

  FindTask(creep: Creep, memory: CreepMemory): TaskHarvest | undefined {
    let harvestTasks = Strategy.taskManager.FindTaskTyped(TaskHarvest);
    let closestHarvest = _.min(harvestTasks, (task: TaskHarvest) => {
      return (<Source>Game.getObjectById(task.sourceId)).pos.getRangeTo(creep.pos);
    });
    return closestHarvest;
  }

}

JobHarvestTask.RegisterVirtualClass();
