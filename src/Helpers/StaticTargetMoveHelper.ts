import { MoveHelper, ExtendedCreepMoveReturnCode } from "./MoveHelper";


interface HasRoomPosition {
  pos: RoomPosition;
}

export class StaticTargetMoveHelper extends MoveHelper {
  
  target: RoomPosition;

  constructor(target: RoomPosition ) {
    super();
    this.target = target;
  }

  Update(creep: Creep): ExtendedCreepMoveReturnCode {
    let result = creep.moveTo(target);

    if(result==ERR_)
  }



}
