import axios,{AxiosPromise} from "axios"

// import {iAuthForm}  from "../components/auth.vue";

const HOST : string = "http://127.0.0.8000";
const C_WAREHOUSEINFO_API : string = "/warehouseinfo/create/";
const R_WAREHOUSEINFO_API : string = "/warehouseinfo/id/"  // +id
const R_WAREHOUSEINFO_BY_USER_API : string = "/warehouseinfo/userid/" // get '/warehouseinfo/userid/:userid'

const R_AUTH_API : string = "/auth/signin/" ; // POST {user_name:"", user_pwd :""}
const C_AUTH_API : string = "/auth/signup/";  // POST {user_name:"", user_pwd :""}

export function create_warehouseInfo(data : any) : AxiosPromise<any> {
    return axios.post(C_WAREHOUSEINFO_API, data);
}

export function retrieve_warehouseInfo(id: string) : AxiosPromise<any>{
    return axios.get(R_WAREHOUSEINFO_API + id);
}

export function retrieve_warehouseInfo_by_user_id(user_id: string) :AxiosPromise<any>{
    return axios.get(R_WAREHOUSEINFO_BY_USER_API + user_id);
}

export function auth_userInfo(data: iAuthForm) : AxiosPromise<any>{
    return axios.post(R_AUTH_API,data);
}

export function create_userInfo(data: iAuthForm) : AxiosPromise<any>{
    return axios.post(C_AUTH_API,data);
}