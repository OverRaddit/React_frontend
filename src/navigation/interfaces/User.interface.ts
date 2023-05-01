type UserStatus = 'online' | 'in-game' | 'in-queue' | 'offline';

export interface MyUser {
	id: number;
	nickname: string;
	intraId: string;
	socketId: string;
    avatar: string;
	status: UserStatus;
	isOwner: boolean;
	isAdmin: boolean;
}
