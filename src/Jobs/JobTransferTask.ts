import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { TaskHarvest } from "TaskSystem/Tasks/TaskHarvest";
import { TaskStatus, Task } from "TaskSystem/Task";
import { JobSimpleTask } from "./JobSimpleTask";
import { TaskTransfer } from "TaskSystem/Tasks/TaskTransfer";
import { MathUtils } from "utils/MathUtils";

export class JobTransferTask extends JobSimpleTask<TaskTransfer> {

  GetJobIcon(): string {
    return "⚡";
  }

  FindTask(creep: Creep, memory: CreepMemory): TaskTransfer | undefined {

    let task = MathUtils.PickRandom(Strategy.taskManager.FindTaskTyped(TaskTransfer));
    return task;

  }

}

JobTransferTask.RegisterVirtualClass();
