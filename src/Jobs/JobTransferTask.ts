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

  taskId: string | undefined = undefined;

  FindTask(creep: Creep, memory: CreepMemory): [TaskTransfer | undefined, number] {

    let task = MathUtils.PickRandom(Strategy.taskManager.FindTaskTyped(TaskTransfer));
    let capacity = (task && creep.carry[task.resource]) || 0;
    console.log("found task: " + task + " @" + capacity);
    return [task, capacity];

  }

}

JobTransferTask.RegisterVirtualClass();
