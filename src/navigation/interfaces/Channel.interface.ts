import { MyUser } from "./User.interface";

export interface MyChannel
{
	id: number;
	kind: number;
	name: string;
	users: MyUser[];
	showUserList: boolean;
	chatHistory: string[];
}
