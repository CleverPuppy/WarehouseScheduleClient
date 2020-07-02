<template>
  <div class="setup-warehouse">
    <el-container height="600px">
      <el-header height="200px">
        <el-steps :active="steps_activate_index">
          <el-step
            v-for="item in steps_info"
            :key="item.key"
            :title="item.title"
            :description="item.description"
            :icon="item.icon"
          ></el-step>
        </el-steps>
      </el-header>
      <el-main>
        <!-- Main content -->
        <div :id="steps_activate_index">
          <el-form :model="form_info" ref="form" label-width="80px">
            <el-form-item v-if="steps_activate_index == 0" label="项目名称:">
              <el-input v-model="form_info.name"></el-input>
            </el-form-item>
            <template v-if="steps_activate_index == 1">
              <el-form-item label="区块宽度:">
                <el-input-number v-model="form_info.block_width" :min="10" :max="100" label></el-input-number>
              </el-form-item>
              <el-form-item label="区块高度:">
                <el-input-number v-model="form_info.block_height" :min="10" :max="100" label></el-input-number>
              </el-form-item>
            </template>
            <template v-if="steps_activate_index == 2">
              <el-container>
                <el-aside width="200px">
                  <el-table :data="form_info.robots" border stripe>
                    <el-table-column label="机器人名称" prop="name"></el-table-column>
                  </el-table>
                </el-aside>
                <el-main height>
                  <!-- Main content -->
                  <el-form :model="form_robot" ref="form_robot" label-width="80px">
                    <el-form-item label="名称">
                      <el-input v-model="form_robot.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="add_robot()">添加</el-button>
                    </el-form-item>
                  </el-form>
                </el-main>
              </el-container>
            </template>
            <template v-if="steps_activate_index == 3">
              <el-container>
                <el-aside width="200px">
                  <!-- <el-table :data="form_info.stocks" border stripe>
                    <el-table-column label="货物种类" prop="name"></el-table-column>
                    <el-table-column label="可访问性">
                      <template slot-scope="scope">
                        <el-tag
                          type="info"
                          v-for="index in scope.row.access"
                          v-bind:key="index"
                        >{{form_info.robots[index].name}}</el-tag>
                      </template>
                    </el-table-column>
                  </el-table> -->

                  <StockList :stockArr="form_info.stocks" :robotArr="form_info.stocks"></StockList>
                </el-aside>
                <el-main height>
                  <!-- Main content -->
                  <el-form :model="form_robot" ref="form_stock" label-width="auto">
                    <el-form-item label="名称:">
                      <el-input v-model="form_stock.name"></el-input>
                    </el-form-item>

                    <el-form-item label="机器人种类:">
                      <el-checkbox-group v-model="form_stock.access">
                        <el-checkbox-button
                          v-for="(item,index) in form_info.robots"
                          :key="index"
                          :label="index"
                        >{{index + 1}} : {{item.name}}</el-checkbox-button>
                      </el-checkbox-group>
                    </el-form-item>

                    <el-form-item>
                      <el-button type="primary" @click="add_stock()">添加</el-button>
                    </el-form-item>
                  </el-form>
                </el-main>
              </el-container>
            </template>
            <template v-if="steps_activate_index >= 4">
              <el-container>
                <el-aside width="300px">
                  <template v-if="steps_activate_index == 4">
                    <el-alert type="info" show-icon>选择要添加的操作</el-alert>
                    <el-select v-model="map_component_selection" placeholder="选择要添加的组件">
                      <el-option
                        v-for="item in map_components"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </template>
                  <template v-if="steps_activate_index == 5">
                    <el-table :data="form_info.depotArray" border stripe>
                      <el-table-column type="index" label="Depot序号" width="90px"></el-table-column>
                      <el-table-column label="机器人配置">
                        <template slot-scope="scope">
                          <el-form>
                            <el-form-item
                              v-for="(item, item_index) in form_info.depotArray[scope.$index].robotAssignment"
                              :key="item_index"
                              :label="form_info.robots[item.robot_type].name"
                            >
                              <el-input-number
                                size="small"
                                v-model="item.size"
                                :min="0"
                                :max="50"
                                label
                              ></el-input-number>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                  <template v-if="steps_activate_index == 6">
                    <StockList :stockArr="form_info.stocks" 
                    :robotArr="form_info.robots"
                    @row-change="onStockSelection($event)"></StockList>
                  </template>
                  <template v-if="steps_activate_index == steps_info.length - 1">
                      <p>完成了所有的步骤</p>
                  </template>
                </el-aside>
                <el-container>
                  <el-main height>
                    <!-- Main content -->
                    <Map :warehouse_info="form_info" v-on:on_drag="map_on_drag($event)" />
                  </el-main>
                </el-container>
              </el-container>
            </template>
            <template v-if="steps_activate_index == 5"></template>
            <el-form-item>
              <el-button v-if="steps_activate_index != steps_info.length - 1" type="primary" @click="onNextStep()">下一步</el-button>
              <el-button v-if="steps_activate_index == steps_info.length - 1" type="primary" @click="onNextStep()">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts">
export class WarehouseInfoForm implements iWarehouseInfo {
  name: string = "default name";
  block_width: number = 20;
  block_height: number = 20;
  robots: Array<iRobot> = [{ name: "default" }];
  stocks: Array<iStock> = [{ name: "default", access: [0] }];

  obsArray: Array<iObstacle> = [];
  rackArray: Array<iRack> = [];
  depotArray: Array<iDepot> = [];
}

const default_steps_info: Array<StepInfo> = [
  { title: "设置项目名称" },
  { title: "设置区块大小" },
  { title: "设置机器人种类" },
  { title: "设置商品种类" },
  { title: "设置地图组件" },
  { title: "机器人放置" },
  { title: "商品放置" },
  { title: "完成" }
];
enum MapComponent {
  Obs,
  Rack,
  Depot,
  Blank
}

import { Component, Prop, Vue } from "vue-property-decorator";
import Map from "./map.vue";
import StockList from "./stock_list.vue";

@Component({
  components: {
    Map,
    StockList
  }
})
export default class SetupWarehouse extends Vue {
  steps_activate_index: number = 0;
  form_info: WarehouseInfoForm = new WarehouseInfoForm();
  form_robot: iRobot = { name: "" };
  form_stock: iStock = { name: "", access: [] };
  map_components: Array<any> = [
    { label: "障碍物", id: MapComponent["Obs"] },
    { label: "货架", id: MapComponent["Rack"] },
    { label: "装配点", id: MapComponent["Depot"] },
    { label: "清空区块", id: MapComponent["Blank"] }
  ];
  map_component_selection: number = -1; // 默认未选择

  current_select_stock_access : number[] = []; //默认无 

  @Prop({
    type: Array,
    default: () => {
      return default_steps_info;
    }
  })
  steps_info!: Array<StepInfo>;

  add_robot(): void {
    console.log("add_robot");
    if (this.form_robot.name == "") {
      //TODO add some error ui
    } else {
      this.form_info.robots.push(this.form_robot);
      this.form_robot = { name: "" };
    }
  }

  add_stock(): void {
    if (this.form_stock.name == "" || this.form_stock.access.length == 0) {
      // TODO add some error ui
    } else {
      this.form_stock.access.sort();
      this.form_info.stocks.push(this.form_stock);
      this.form_stock = { name: "", access: [] };
    }
  }

  onNextStep(): void {
    let validation: boolean = true;
    if (this.steps_activate_index == 0) {
      if (this.form_info.name == "") {
        // TODO add some error ui
        validation = false;
      }
    }

    if (this.steps_activate_index == 2) {
      if (this.form_info.robots.length == 0) {
        // TODO add some error ui
        console.log("robots.length can;t be 0");
        validation = false;
      }
    }

    if (this.steps_activate_index == 3) {
      if (this.form_info.stocks.length == 0) {
        // TODO  add some error ui
        validation = false;
      }
    }

    if (validation) {
      this.steps_activate_index = Math.min(
        default_steps_info.length - 1,
        this.steps_activate_index + 1
      );
    }
  }

  remove_component(x: number, y: number): void {
    this.form_info.obsArray = this.remove_component_from_arr(
      x,
      y,
      this.form_info.obsArray
    );
    this.form_info.rackArray = this.remove_component_from_arr(
      x,
      y,
      this.form_info.rackArray
    );
    this.form_info.depotArray = this.remove_component_from_arr(
      x,
      y,
      this.form_info.depotArray
    );
  }

  remove_component_from_arr(x: number, y: number, arr: Array<any>): any[] {
    return arr.filter(item => !(item.x == x && item.y == y));
  }

  private getDepot(x: number, y: number): iDepot {
    let depot: iDepot = { x: x, y: y, robotAssignment: [] };
    for (let i = 0; i < this.form_info.robots.length; ++i) {
      depot.robotAssignment.push({ robot_type: i, size: 0 });
    }
    return depot;
  }

  map_on_drag(event: any): void {
    console.log("map :: on_drag", event);
    if (this.steps_activate_index == 4) {
      for (let x = event.x1; x <= event.x2; ++x) {
        for (let y = event.y1; y <= event.y2; ++y) {
          if (this.map_component_selection == MapComponent["Blank"]) {
            this.remove_component(x, y);
          }
          if (this.map_component_selection == MapComponent["Obs"]) {
            this.remove_component(x, y);
            this.form_info.obsArray.push({ x: x, y: y });
          }

          if (this.map_component_selection == MapComponent["Rack"]) {
            this.remove_component(x, y);
            this.form_info.rackArray.push({ x: x, y: y, access: [] });
          }

          if (this.map_component_selection == MapComponent["Depot"]) {
            this.remove_component(x, y);
            this.form_info.depotArray.push(this.getDepot(x, y));
          }
        }
      }
    }

    if(this.steps_activate_index == 6){
        // 商品放置
        // 寻找在这个范围内的货架，然后为可访问性赋值
        for(let item of this.form_info.rackArray){
            if(item.x >= event.x1 && item.x <= event.x2 &&
                item.y >= event.y1 && item.y <= event.y2)
            {
                item.access = this.current_select_stock_access;
            }
        }

    }
  }

  onStockSelection(val:iStock): void{
      console.log(val);
      if(this.steps_activate_index == 6){// 商品放置
        this.current_select_stock_access = val.access;
      } 
  }
}
</script>