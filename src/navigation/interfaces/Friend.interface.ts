type UserStatus = 'online' | 'in-game' | 'in-queue' | 'offline';

export interface MyFriend {
	id: number;
	nickname: string;
	intraid: string;
	socketid: string;
	avatar: string;
	status: UserStatus;
  }
