import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { TaskHarvest } from "TaskSystem/Tasks/TaskHarvest";
import { TaskStatus, Task } from "TaskSystem/Task";

export abstract class JobSimpleTask<TaskType extends Task> extends AJob {

  GetJobIcon(): string {
    return "⚡";
  }

  Perform(creep: Creep, memory: CreepMemory): JobStatus {

    let task: Task | undefined = Strategy.taskManager.GetAssignedTask(creep);
    //find task if no task assigned
    if (!Strategy.taskManager.GetAssignedTask(creep)) {
      let taskCandidate = this.FindTask(creep, memory);
      if (taskCandidate && Strategy.taskManager.AssignTask(taskCandidate, creep)) {
        task = taskCandidate;
      }
      else {
        if (task) {
          Strategy.taskManager.taskDebugHistory.push({ creepName: creep.name, taskName: task.GetTypeName(), event: TaskStatus.Failed });
        }
        else {
          Strategy.taskManager.taskDebugHistory.push({ creepName: creep.name, taskName: "NO TASK FOUND", event: TaskStatus.Failed });
        }
      }
    }


    if (task) {
      let status = task.PerformTask(creep);
      Strategy.taskManager.taskDebugHistory.push({ creepName: creep.name, taskName: task.GetTypeName(), event: status });
      switch (status) {
        case TaskStatus.Done:
          Strategy.taskManager.LeaveTask(creep, task, false);
          return JobStatus.FINISHED;
        case TaskStatus.NotDone:
          return JobStatus.CONTINUE;
        case TaskStatus.Failed:
          return JobStatus.FAILED;
      }
    }

    //if no return was hit so far, something went wrong
    return JobStatus.FAILED;
  }

  abstract FindTask(creep: Creep, memory: CreepMemory): TaskType | undefined;

}

JobSimpleTask.RegisterVirtualClass();
