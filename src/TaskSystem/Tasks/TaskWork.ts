import { Task, TaskStatus } from "TaskSystem/Task";

/**
 * A generic task that requires WORK parts
 * */
export abstract class TaskWork extends Task {

  abstract GetTargetPos(): RoomPosition;

}

TaskWork.RegisterVirtualClass();
