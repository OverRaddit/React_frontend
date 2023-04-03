type UserStatus = 'online' | 'in-game' | 'offline';

export default interface Friend {
	name: string;
	status: UserStatus;
}
