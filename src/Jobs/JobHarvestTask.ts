import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { TaskHarvest } from "TaskSystem/Tasks/TaskHarvest";
import { TaskStatus, Task } from "TaskSystem/Task";

export class JobHarvestTask extends AJob {

  GetJobIcon(): string {
    return "⛏";
  }

  taskId: string | undefined = undefined;

  Perform(creep: Creep, memory: CreepMemory): JobStatus {

    let task: Task | undefined = Strategy.taskManager.GetAssignedTask(creep);
    //find task if no task assigned
    if (!this.taskId) {
      let taskCandidate = Strategy.taskManager.FindTask((task: Task) => { return TaskHarvest.IsTypeOf(task); })[0];
      console.log(taskCandidate);
      let myWorkCapacity = _.sum(creep.body, (body: BodyPartDefinition) => { return body.type == WORK ? 1 : 0; });
      if (taskCandidate && Strategy.taskManager.AssignTask(taskCandidate, creep, myWorkCapacity)) {
        task = taskCandidate;
      }
    }


    if (task) {
      switch (task.PerformTask(creep)) {
        case TaskStatus.Done:
          Strategy.taskManager.LeaveTask(creep, task, false);
          this.taskId = undefined;
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

}

JobHarvestTask.RegisterVirtualClass();
