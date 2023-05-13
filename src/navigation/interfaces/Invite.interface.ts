import { MyUser } from "./User.interface";

// 0: normal , 1: extend , 2: private, 3: DM
export interface MyInvite {
    type: number;
    users: MyUser[];
}