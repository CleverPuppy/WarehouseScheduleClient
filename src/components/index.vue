<template>
    <div id="index">
        <Auth v-if="!isAuthed()" @on_auth="onAuth" @on_signup="onSignup" />
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
                    <SetupWarehouse @on-done="createWarehouseInfo($event)"/>
                </template>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Emit } from "vue-property-decorator";
import SetupWarehouse, { WarehouseInfoForm } from '../components/SetupWarehouse.vue';
import {retrieve_warehouseInfo, 
        retrieve_warehouseInfo_by_user_id,auth_userInfo, 
        create_userInfo,
        create_warehouseInfo} from "../utility/utility";
import Auth from "./auth.vue";

interface iMenuItem {
    name : string
}

const default_nav_menu : iMenuItem[] = [
    {name:"主页"},
    {name:"设置"}
]


@Component({
    components:{
        SetupWarehouse,
        Auth
    }
})
export default class Index extends Vue{
    @Prop({default:()=>default_nav_menu}) nav_menu !: iMenuItem[];
    current_nav_index : number = 0;
    warehouseInfo : any = {};
    user_id :string =  "";
    warehouseInfo_id: string = "";


    isAuthed() : boolean {
        if(this.user_id != ""){
            return true;
        }else{
            return false;
        }
    };

    onMenuClick(index:number) : void {
        this.current_nav_index = index;
    };

    getWarehouseInfoFromDB(id: string) : void {
        retrieve_warehouseInfo(id)
            .then(value => {
                console.log("success", value);
            })
            .catch(err => {
                console.log("failed:" , err);
            })
    };

    getWarehouseInfo(info : iWarehouseInfo) : void {
        this.warehouseInfo = info;
    };

    onAuth (user_info : iAuthForm) : void {
        auth_userInfo(user_info)
            .then(value=>{
                this.user_id = value.data.user_id;
                if(this.user_id != ''){
                    retrieve_warehouseInfo_by_user_id(this.user_id)
                    .then(value => {
                        console.log("retrieve_warehouseInfo_by_user_id", value);
                        if(value.data.length > 0 ){
                            // 存在仓库
                            this.warehouseInfo = value.data[0];
                            this.warehouseInfo_id = value.data[0]._id;
                        }else{
                            // TODO ADD REDIRECT LOGIC
                            this.current_nav_index = 1; 
                            console.log('不存在仓库，转到设置去创建仓库');
                        }
                    })
                    .catch(err => {
                        console.log("[error] retrieve_warehouseInfo_by_user_id", err);
                    })
                }
                console.log(value);
            })
            .catch(err =>{
                console.log(err);
            })
    };

    onSignup(user_info: iAuthForm) : void {
        create_userInfo(user_info)
            .then(value=>{
                console.log(value);
            })
            .catch(err => {
                console.log(err);
            })
    }

    createWarehouseInfo(warehouse_info: WarehouseInfoForm) : void {
        this.warehouseInfo = warehouse_info;
        if(this.user_id && this.user_id != ''){
            create_warehouseInfo({...this.warehouseInfo, user_id:this.user_id})
                .then(value => {
                    console.log('create warehouse info, success : ',value);
                })
                .catch(err => {
                    console.log('create warehouse info , failed :', err);
                })
        }else {
            console.log('未登陆');
        }   
    }
}


</script>