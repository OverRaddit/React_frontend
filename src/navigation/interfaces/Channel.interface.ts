import { MyUser } from "./User.interface";

export interface MyChannel
{
	id: number;
	kind: number;
	name: string; // key
	owner: string;
	users: MyUser[];
	showUserList: boolean;
	chatHistory: string[];
	roompassword : string;
}
