<template>
  <div class="stock-list">
    <el-table :data="stockArr" highlight-current-row @current-change="RowChange" border stripe>
      <el-table-column label="货物种类" prop="name"></el-table-column>
      <el-table-column label="可访问性">
        <template slot-scope="scope">
          <el-tag
            type="info"
            v-for="index in scope.row.access"
            v-bind:key="index"
          >{{robotArr[index].name}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Emit } from "vue-property-decorator";

@Component
export default class StockList extends Vue {
  @Prop({ default: [] }) stockArr!: iStock[];
  @Prop({ default: [] }) robotArr!: iRobot[];

  @Emit()
  RowChange(val : any): void {
      return val;
  } 
}
</script>