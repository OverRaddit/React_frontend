type UserStatus = 'online' | 'in-game' | 'in-queue' | 'offline';

export default interface Friend {
	name: string;
	status: UserStatus;
}

export interface MyFriend {
	id: number;
	nickname: string;
	intraid: string;
	sockerid: string;
	status: UserStatus;
}
