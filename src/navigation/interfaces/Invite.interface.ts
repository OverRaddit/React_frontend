import { MyUser } from "./User.interface";

export interface MyInvite {
    type: number;
    users: MyUser[];
}