<template>
    <div id="map">
        <v-stage :config="configKonva()"  v-on="{mousedown: on_mousedown, mouseup: on_mouseup, mousemove: on_mousemove}" >
            <v-layer>
                <v-line v-for="line in gridLines()" :config="line" :key="line.key"></v-line>
            </v-layer>
            <v-layer>
                <v-rect v-for="obs in warehouse_info.obsArray" :key="obs.x * scale + obs.y" :config="getObsConfig(obs)"></v-rect>
            </v-layer>
            <v-layer>
                <v-rect v-for="rack in warehouse_info.rackArray" :key="rack.x * scale + rack.y" :config="getRackConfig(rack)"></v-rect>
            </v-layer>
            <v-layer>
                <v-circle v-for="depot in warehouse_info.depotArray" :key="depot.x * scale + depot.y" :config="getDepotConfig(depot)"></v-circle>
            </v-layer>
            <v-layer>
                <v-rect v-show="isMouseDown" :config="getDragShadow()" ></v-rect>
            </v-layer>
        </v-stage>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import VueKonva from 'vue-konva';
Vue.use(VueKonva)

class WarehouseInfoForm implements iWarehouseInfo {
    name:string = "default name";
    block_width: number = 20;
    block_height: number = 20;
    robots: Array<iRobot> = [];
    stocks: Array<iStock> = [];
}

class GridLine {
    points: number[] = [];
    stroke: string = 'green';
    strokeWidth: number = 0.5;
    lineCap : string = 'round';
    lineJoin: string = 'round';

    constructor(points: number[]){
        this.points = points;
    }
}

class Position{
    x: number = -1;
    y: number = -1;

    max_x : number;
    max_y : number;

    constructor(max_x:number,max_y:number, x:number = -1, y:number = -1){
        this.max_x = max_x;
        this.max_y = max_y;
        this.x = x;
        this.y = y;
    }
    isValid() : boolean{
        if(this.x > -1 && this.y > -1 && this.x < this.max_x && this.y < this.max_y){
            return true;
        }else{
            return false;
        }
    }

    setDefault(): void{
        this.x = -1;
        this.y = -1;
    }

    setGridPos(layer_x:number, layer_y:number, scale:number): void{
        this.x = Math.floor(layer_x / scale);
        this.y = Math.floor(layer_y / scale);
    }
}

@Component
export default class Map extends Vue{
    @Prop({type:Object, default:()=>{return new WarehouseInfoForm()}}) 
        warehouse_info !: iWarehouseInfo;

    scale : number = 30;
    margin : number = 100;
    width : number = this.warehouse_info.block_width;
    height : number = this.warehouse_info.block_height;

    isMouseDown: boolean = false;

    mousedown_pos : Position = new Position(this.width,this.height);
    mouseup_pos : Position = new Position(this.width,this.height);
    mousemove_pos : Position = new Position(this.width,this.height);

    configKonva() : any {
        return {
            width: this.warehouse_info.block_width * this.scale  + this.margin,
            height: this.warehouse_info.block_height * this.scale + this.margin
        }
    }

    gridLines() : any[] {
        let lines : any[] = [];
        let width : number = this.warehouse_info.block_width;
        let height : number = this.warehouse_info.block_height;
        for(let i =0; i < width + 1; ++i)
        {
            lines.push(new GridLine([i* this.scale, 0, i* this.scale, (height)*this.scale]));
        }
        for(let j = 0; j< height + 1; ++j)
        {
            lines.push(new GridLine([0,j*this.scale,(width)*this.scale, j*this.scale]));
        }
        
        return lines;
    }

    getRackConfig(rack : iRack) : any {
        // RECT
        let rect = {
            x: rack.x * this.scale,
            y: rack.y * this.scale,
            width: this.scale,
            height: this.scale,
            fill: 'blue'
        };

        if(rack.access.length != 0){
            rect.fill = 'orange';
        }
        return rect;
    }

    getObsConfig(obs: iObstacle) : any {
        // RECT
        return {
            x: obs.x * this.scale,
            y: obs.y * this.scale,
            width: this.scale,
            height: this.scale,
            fill: 'black'
        }
    }

    getDragShadow() : any {

        if(this.isMouseDown){
        let topleft = new Position(this.width, this.height);
        let width = 1;
        let height = 1;
            if(this.mousedown_pos.isValid() && this.mousemove_pos.isValid())
            {
                topleft.x = Math.min(this.mousedown_pos.x, this.mousemove_pos.x);
                topleft.y = Math.min(this.mousedown_pos.y, this.mousemove_pos.y);
                width = Math.abs(this.mousedown_pos.x - this.mousemove_pos.x) + 1;
                height = Math.abs(this.mousedown_pos.y - this.mousemove_pos.y) + 1;
                return {
                    x : topleft.x * this.scale,
                    y : topleft.y * this.scale,
                    width : width * this.scale,
                    height : height * this.scale,
                    fill : "gray",
                }
            }
        }else{
            return {
                x : 0,
                y: 0,
                width: 0,
                height:0
            }
        }

    }

    getDepotConfig(depot: iDepot) : any {
        // Circle
        return {
            x: depot.x * this.scale + this.scale / 2,
            y: depot.y * this.scale + this.scale / 2,
            radius: this.scale / 2,
            fill : 'green'
        }
    }

    on_click(event : any) : void{
        console.log("on_click: ",event);
    }

    on_mousedown(event:any) : void{
        this.isMouseDown = true;
        this.mousedown_pos.setGridPos(event.evt.layerX, event.evt.layerY, this.scale);
        console.log("on_mousedown:" ,this.mousedown_pos);
    }
    on_mousemove(event:any) : void{

        this.mousemove_pos.setGridPos(event.evt.layerX, event.evt.layerY, this.scale);

        // console.log("on_mousemove:" ,event);
    }

    on_mouseup(event: any) : void {
        this.mouseup_pos.setGridPos(event.evt.layerX, event.evt.layerY, this.scale);
        
        if(this.isMouseDown == true){
            this.isMouseDown = false;
            this.on_drag();
        }
        // console.log("on_mouseup:" , event);
    }

    @Emit() 
    on_drag(): iDragArea {
        let area : iDragArea = {x1:-1,y1:-1,x2:-1,y2:-1};
        if(this.mousedown_pos.isValid() && this.mouseup_pos.isValid()){
            [area.x1, area.x2] = [this.mouseup_pos.x, this.mousedown_pos.x].sort((a,b)=>{return a-b});
            [area.y1, area.y2] = [this.mouseup_pos.y, this.mousedown_pos.y].sort((a,b)=>{return a-b});
        }

        this.mousedown_pos.setDefault();
        this.mouseup_pos.setDefault();
        return area; 
    }

}
</script>