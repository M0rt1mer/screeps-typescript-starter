import { Strategy } from "Strategy/StrategyInterface";
import { TaskEntry } from "./TaskManager";
import { TaskStatus } from "./Task";

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
  let activeTask = <TextStyle>{ color: "#ff3300" };
  let fullTask = <TextStyle>{color:"#ffcc00"};


  room.visual.text("Capacity", columns.capacity, 1, alignLeft);
  room.visual.text("Creeps", columns.creepCapacity, 1, alignLeft);

  let debugLine = 2;
  for (let [taskId, taskEntry] of Object.entries(taskManager.managedTasks)) {

    let usedCapacity = _.sum(taskEntry.consumers);
    let maxCapacity = usedCapacity + taskEntry.remainingCapacity;

    let numConsumers = _.size(taskEntry.consumers);

    let style = <TextStyle>{};
    Object.assign(style, alignLeft);
    if (!taskEntry.HasFreeSlots()) {
      Object.assign(style, fullTask);
    }
    else if (numConsumers > 0) {
      Object.assign(style, activeTask);
    }
    

    room.visual.text(taskEntry.task.GetTypeName(), columns.taskType, debugLine, style);
    
    room.visual.text(usedCapacity + "/" + maxCapacity, columns.capacity, debugLine, style);
    
    room.visual.text(numConsumers + "/" + taskEntry.creepCapacity, columns.creepCapacity, debugLine, style);

    room.visual.text(taskEntry.task.GetTaskId(), columns.taskId, debugLine, style);
    debugLine += 1;
  }

  //--------------------------------------------------------------------
  let columns2 = { creepName: 35, taskName: 42 };
  
  let styles = {
    [TaskStatus.Done]: { color: "#00ff00" },
    [TaskStatus.NotDone]: { color: "#00ffff" },
    [TaskStatus.Failed]: { color: "#ff0000" }
  }
  
  debugLine = 2;
  for (let history of taskManager.taskDebugHistory) {
    room.visual.text(history.creepName, columns2.creepName, debugLine, styles[history.event]);
    room.visual.text(history.taskName, columns2.taskName, debugLine, styles[history.event]);
    debugLine += 1;
  }

  console.log(taskManager.taskDebugHistory.length);

}
