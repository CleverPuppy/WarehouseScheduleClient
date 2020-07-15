<template>
    <div class="auth overlay">
        <el-form class="center" :model="auth_form" ref="form" label-width="120px">
            <el-form-item required label="用户名: " prop="user_name">
                <el-input v-model="auth_form.user_name"></el-input>
            </el-form-item>
            <el-form-item required label="密码: " prop="user_pwd">
                <el-input v-model="auth_form.user_pwd" show-password ></el-input>
            </el-form-item>
            <el-form-item required v-if="isSignUp" label="再次输入密码：" :error="sec_pwd_error()">
                <el-input  v-model="sec_pwd" show-password ></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button v-if="!isSignUp" type="primary" @click="on_auth">登录</el-button>
                <el-button v-if="isSignUp"  type="primary" @click="on_signup">注册</el-button>
                <el-button v-if="!isSignUp" type="info" @click="isSignUp = true"> 创建账号</el-button>
                <el-button v-if="isSignUp" type="info" @click="isSignUp = false"> 返回登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Emit } from "vue-property-decorator";

@Component
export default class Auth extends Vue {
    auth_form : iAuthForm = {user_name:"",user_pwd:""};
    isSignUp : boolean = false;
    sec_pwd : string = "";
    sec_pwd_error() : string {
        if(this.auth_form.user_pwd != this.sec_pwd){
            return "两次输入密码不一致";
        }
        return "";
    } 

    @Emit() 
    on_auth() : any {
        // TODO check validation
        return this.auth_form;
    }

    @Emit()
    on_signup() : any {
        // TODO check validation 
        return this.auth_form;
    }
}
</script>
<style>
.overlay {
    position: fixed;
    width : 100%;
    height: 100%;
    left: 0;
    right: 0;
    background-color: white;
    z-index: 10;
}

.center {
    border-radius: 20px;
    width: 300px;
    height: 350px;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>