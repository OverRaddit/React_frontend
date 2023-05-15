import { MyUser } from "./User.interface";

// 0: normal , 1: extend , 2: private room
export interface MyInvite {
    type: number;
    user: MyUser;
}