import { MyUser } from "./User.interface";

export interface MyChannel
{
	id: number;
	name: string;
	users: MyUser[];
	showUserList?: boolean;
}
