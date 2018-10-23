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
      let [taskCandidate, myWorkCapacity] = this.FindTask(creep, memory);
      if (taskCandidate && Strategy.taskManager.AssignTask(taskCandidate, creep, myWorkCapacity)) {
        task = taskCandidate;
      }
    }


    if (task) {
      switch (task.PerformTask(creep)) {
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

  abstract FindTask(creep: Creep, memory: CreepMemory): [TaskType | undefined, number];

}

JobSimpleTask.RegisterVirtualClass();
