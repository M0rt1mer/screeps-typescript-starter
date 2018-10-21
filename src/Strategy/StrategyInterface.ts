import { TaskManager } from "TaskSystem/TaskManager";


export class Strategy {

  static supplyStrategy: ISupply;
  static taskManager: TaskManager;

}

export abstract class ISupply {

  abstract Precalculate(): void;
  abstract ShouldSpawnHarvester(): boolean;
  abstract ShouldUpgrade(): boolean;

  abstract ShouldSpawnTransporter(): boolean;
  abstract ShouldHarvesterMove(): boolean;
  //filtered worker lists
  abstract GetHarvesterList(): string[];
  abstract GetTransporterList(): string[];

}
