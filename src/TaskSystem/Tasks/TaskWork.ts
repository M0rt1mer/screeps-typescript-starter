import { Task, TaskStatus } from "TaskSystem/Task";

/**
 * A generic task that requires WORK parts
 * */
export abstract class TaskWork extends Task {
}

TaskWork.RegisterVirtualClass();
