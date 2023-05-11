import { UserImage } from "./UserImage";

export function GameProfile(props: any) {
	const {user} = props;
	// img, nickname, mmr, 전적
	return (
		<div style={{ width: props.widthSize, height: props.heightSize }}>
			<div className="profile-container">
				<UserImage width={"40px"} height={"40px"} src={user.avatar} alt="Profile picture" />
				<div className="nickname">{user.nickname}</div>
				<div className="profile-details">
					<div className="rating">{'MMR : ' + user.rating} </div>
					<div className="history">{'전적 : ' + user.wincount + '승 /' + user.losecount+'패' } </div>
				</div>
			</div>
		</div>
	); // 승패 넣기 
}