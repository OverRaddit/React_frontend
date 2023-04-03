import User from "./User.interface";

export default interface Channel
{
	id: string;
	name: string;
	users: User[];
	showUserList?: boolean;
}
