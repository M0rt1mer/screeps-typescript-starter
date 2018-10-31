import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { TaskHarvest } from "TaskSystem/Tasks/TaskHarvest";
import { TaskStatus, Task } from "TaskSystem/Task";
import { JobSimpleTask } from "./JobSimpleTask";
import { MathUtils } from "utils/MathUtils";
import { TaskWork } from "TaskSystem/Tasks/TaskWork";
import { TaskUpgrade } from "TaskSystem/Tasks/TaskUpgrade";

export class JobTaskWork extends JobSimpleTask<TaskWork> {

  GetJobIcon(): string {
    return "⚒";
  }

  FindTask(creep: Creep, memory: CreepMemory): TaskWork | undefined {

    let tasksUpgrade = Strategy.taskManager.FindTaskTyped(TaskUpgrade);
    if (tasksUpgrade.length > 0) {
      let taskUpgrade = tasksUpgrade[0]
      if (taskUpgrade.IsPriority()) {
        return taskUpgrade;
      }
    }

    let task = MathUtils.PickRandom(Strategy.taskManager.FindTaskTyped(TaskWork));
    return task;
  }

}

JobTaskWork.RegisterVirtualClass();
