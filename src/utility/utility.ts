import axios,{AxiosPromise} from "axios"

const HOST : string = "http://127.0.0.8000";
const C_WAREHOUSEINFO_API : string = "/warehouseinfo/";

export function create_warehouseInfo(data : any) : AxiosPromise<any> {
    return axios.post(C_WAREHOUSEINFO_API, data);
}