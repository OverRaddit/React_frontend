import MyUser from "./User.interface";

export default interface MyChannel
{
	id: number;
	name: string;
	users: MyUser[];
	showUserList?: boolean;
}
