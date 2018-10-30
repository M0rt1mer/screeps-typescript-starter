import { Strategy } from "Strategy/StrategyInterface";
import { TaskEntry } from "./TaskManager";

export function DebugTasks(){

  let taskManager = Strategy.taskManager;

  if (taskManager.debugTasksRoom.length == 0) {
    return;
  }

  if (!(taskManager.debugTasksRoom in Game.rooms)) {
    return;
  }

  let room = Game.rooms[taskManager.debugTasksRoom];

  let columns = { taskType: 1, capacity: 10, creepCapacity: 15, taskId: 22 };

  let alignLeft = <TextStyle>{ align: "left" };
  let activeTask = <TextStyle>{ color: "#ffff00" };


  room.visual.text("Capacity", columns.capacity, 1, alignLeft);
  room.visual.text("Creeps", columns.creepCapacity, 1, alignLeft);

  let debugLine = 2;
  for (let [taskId, taskEntry] of Object.entries(taskManager.managedTasks)) {

    let usedCapacity = _.sum(taskEntry.consumers);
    let maxCapacity = usedCapacity + taskEntry.remainingCapacity;

    let numConsumers = _.size(taskEntry.consumers);

    let style = <TextStyle>{};
    Object.assign(style, alignLeft);
    if (numConsumers > 0) {
      Object.assign(style, activeTask);
    }

    room.visual.text(taskEntry.task.GetTypeName(), columns.taskType, debugLine, style);
    
    room.visual.text(usedCapacity + "/" + maxCapacity, columns.capacity, debugLine, style);
    
    room.visual.text(numConsumers + "/" + taskEntry.creepCapacity, columns.creepCapacity, debugLine, style);

    room.visual.text(taskEntry.task.GetTaskId(), columns.taskId, debugLine, style);
    debugLine += 1;
  }

}
