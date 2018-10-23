import { Task } from "./Task";
import { StaticClass, _VirtualClassConstructor } from "utils/VirtualClass";
import { Strategy } from "Strategy/StrategyInterface";


export class TaskEntry extends StaticClass{

  task: Task;
  consumers: { [creepName: string]: number };
  remainingCapacity: number;
  creepCapacity: number;

  constructor(task: Task) {
    super();
    this.task = task;
    this.consumers = {};
    this.remainingCapacity = task.CalculateTaskCapacity();
    this.creepCapacity = task.GetTaskCreepCapacity();
  }

  CheckIfConsumersStillValid(assignedTaskList: AssignedTaskList) {

    let shouldRecalculate = false;
    //clear all dead creeps
    for (var creepName in this.consumers) {
      let creepDead = !(creepName in Game.creeps);
      let creepIsntOnTask = !assignedTaskList[creepName] || (assignedTaskList[creepName] != this.task.GetTaskId());
      if (creepDead || creepIsntOnTask) {
        delete this.consumers[creepName];
        shouldRecalculate = true;
      }
    }
    //recalculate remaining capacity
    if (shouldRecalculate) {
      this.RecalculateCapacity();
    }

  }

  AddConsumer(creep: Creep, consumedCapacity: number) {
    this.consumers[creep.name] = consumedCapacity;
    this.remainingCapacity -= consumedCapacity;
  }

  RemoveConsumer(creep: Creep, taskCompleted : boolean) {
    let consumedCapacity = this.consumers[creep.name];
    delete this.consumers[creep.name];
    this.RecalculateCapacity();
  }

  RecalculateCapacity() {
    this.remainingCapacity = this.task.CalculateTaskCapacity() - _.sum(this.consumers);
  }

  IsCompleted() {
    return this.consumers.length == 0 && this.remainingCapacity == 0;
  }

  HasFreeSlots(): boolean{
    return this.remainingCapacity > 0 && _.size(this.consumers) < this.creepCapacity;
  }

}

type ManagedTaskList = { [taskId: string]: TaskEntry };
type AssignedTaskList = { [creepName: string]: string };

export class TaskManager {

  managedTasks: ManagedTaskList;
  assignedTasks: AssignedTaskList;

  constructor() {
    if (!Memory.taskSystem) {
      Memory.taskSystem = {
        managedTasks: {},
        assignedTasks: {}
      };
    }
    //create local binding for convenient access
    this.managedTasks = Memory.taskSystem.managedTasks;
    this.assignedTasks = Memory.taskSystem.assignedTasks;

    //construct all task entries and their entries
    for (var task in this.managedTasks) {
      TaskEntry.Construct(this.managedTasks[task]);
      Task.Construct(this.managedTasks[task].task);
      //check consumers, update capacities
      this.managedTasks[task].CheckIfConsumersStillValid(this.assignedTasks);
    }

    //check all assignments
    for (var creepName in this.assignedTasks) {
      let assignedTaskId = this.assignedTasks[creepName];
      //invalid task assigned
      if (!(assignedTaskId in this.managedTasks)) {
        delete this.assignedTasks[creepName];
      }
      //task assigned, but creep not registered in consumers
      if (!(creepName in this.managedTasks[assignedTaskId].consumers)) {
        delete this.assignedTasks[creepName];
      }
    }
  }

  ManageTask(task: Task) {
    let taskId = task.GetTaskId();
    this.managedTasks[taskId] = new TaskEntry(task);
  }

  HasTaskOfId(taskId: string): boolean {
    return taskId in this.managedTasks;
  }

  GetTaskOfId(taskId: string): Task | undefined{
    return this.managedTasks[taskId].task;
  }

  FindTask(filter: (task: Task) => boolean): Task[] {
    let found: Task[] = [];
    for (var taskId in this.managedTasks) {
      let taskEntry = this.managedTasks[taskId];
      if (taskEntry.HasFreeSlots()) {
        if (filter(taskEntry.task)) {
          found[found.length] = taskEntry.task;
        }
      }
    }
    return found;
  }

  FindTaskTyped<T extends Task>(ctor: _VirtualClassConstructor<T>, filter?: (task: Task) => boolean | undefined): T[] {
    let found: T[] = [];
    for (var taskId in this.managedTasks) {
      let taskEntry = this.managedTasks[taskId];
      if (taskEntry.HasFreeSlots()) {
        if (ctor.IsTypeOf(taskEntry.task)) {
          if (!filter || filter(taskEntry.task)) {
            found[found.length] = <T>taskEntry.task;
          }
        }
      }
    }
    return found;
  }

  FindTaskEntries<T extends Task>(ctor: _VirtualClassConstructor<T>): TaskEntry[] {
    let result: TaskEntry[] = [];
    for (var taskId in this.managedTasks) {
      let taskEntry = this.managedTasks[taskId];
      if (ctor.IsTypeOf(taskEntry.task)) {
        result[result.length] = taskEntry;
      }
    }
    return result;
  }

  AssignTask(task: Task, creep: Creep, consumedCapacity: number): boolean {
    let taskEntry = this.managedTasks[task.GetTaskId()];
    if (!taskEntry) {
      return false;
    }
    if (!taskEntry.HasFreeSlots()) {
      return false;
    }
    taskEntry.AddConsumer(creep, consumedCapacity);
    this.assignedTasks[creep.name] = task.GetTaskId();
    return true;
  }

  LeaveTask(creep: Creep, task: Task, isCompleted: boolean) {
    let taskEntry = this.managedTasks[task.GetTaskId()];
    taskEntry.RemoveConsumer(creep, isCompleted);
    if (taskEntry.IsCompleted()) {
      delete this.managedTasks[task.GetTaskId()];
    }
  }

  GetAssignedTask(creep: Creep): Task | undefined {

    let assignedTask = this.assignedTasks[creep.name];
    if (!assignedTask) {
      return undefined;
    }
    if (!this.managedTasks[assignedTask]) {
      return undefined;
    }

    return this.managedTasks[this.assignedTasks[creep.name]].task;

  }

  RecalculateTask(task: Task) {
    let taskEntry = this.managedTasks[task.GetTaskId()].RecalculateCapacity();
  }

}

Strategy.taskManager = new TaskManager();
