interface StepInfo{
    title:string,
    description?:string,
    icon?:string,
}

interface iRobot {
    name:string,
}
interface iStock{
    name:string,
    access:Array<number>
}

interface iWarehouseInfo{
    name:string,
    block_width: number,
    block_height: number,
    robots?: Array<iRobot>,
    stocks?: Array<iStock>
}

interface iRobotPack{
    robot_type: number,
    size : number
}

interface iDepot{
    name?:string,
    x: number,
    y: number,
    robotAssignment: Array<iRobotPack>
}

interface iRack{
    x: number,
    y: number,
    access: Array<number>
}

interface iObstacle{
    x: number,
    y: number
}

interface iDragArea{
// top left -> bottom right
// x1 <= x2 && y1<=y2
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

interface iUserInfo {
    user_name : string,
    user_pwd : string,
    user_id ?: string,
    warehouse_info_id ?: string
}

interface iAuthForm {
    user_name : string,
    user_pwd : string
}