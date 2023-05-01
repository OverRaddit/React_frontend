type UserStatus = 'online' | 'in-game' | 'in-queue' | 'offline';

export default interface User {
	id: string;
	name: string;
}

export interface MyUser {
	id: number;
	nickname: string;
	intraId: string;
	sockerId: string;
    avatar: string;
	status: UserStatus;
	isOwner: boolean;
	isAdmin: boolean;
}
