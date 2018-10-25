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
    let task = MathUtils.PickRandom(Strategy.taskManager.FindTaskTyped(TaskHarvest));
    return task;
  }

}

JobHarvestTask.RegisterVirtualClass();
