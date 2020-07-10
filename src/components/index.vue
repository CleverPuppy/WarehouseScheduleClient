<template>
    <div id="index">
        <el-row align="100">
            <el-col :span="2">
                <el-menu mode="vertical" :default-active="current_nav_index.toString()">
                    <template v-for="(item,index) in nav_menu">
                        <el-menu-item v-bind:index="index.toString()" :key="index" @click="onMenuClick(index)">
                            {{ item.name }}
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-col>
            <el-col :span="22">
                <template v-if="current_nav_index == 1" >
                    <SetupWarehouse @done="current_nav_index = 0"/>
                </template>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Emit } from "vue-property-decorator";
import SetupWarehouse from '../components/SetupWarehouse.vue';

interface iMenuItem {
    name : string
}

const default_nav_menu : iMenuItem[] = [
    {name:"主页"},
    {name:"设置"}
]


@Component({
    components:{
        SetupWarehouse
    }
})
export default class Index extends Vue{
    @Prop({default:()=>default_nav_menu}) nav_menu !: iMenuItem[];
    
    current_nav_index : number = 0;

    onMenuClick(index:number) : void {
        this.current_nav_index = index;
    }
}

</script>