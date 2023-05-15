type UserStatus = 'online' | 'in-game' | 'in-queue' | 'offline';

export interface MyUser {
	id: number;
	nickname: string;
	intraid: string;
	socketId: string;
    avatar: string;
	status: UserStatus;
	isowner: boolean;
	isadmin: boolean;
}
