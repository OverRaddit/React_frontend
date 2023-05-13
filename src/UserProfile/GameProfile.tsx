import { UserImage } from "./UserImage";
import './GameProfile.css';

export function GameProfile(props: any) {
	const {user} = props;
	// img, nickname, mmr, 전적
	return (
		<div className="game-profile" style={{ width: props.widthSize, height: props.heightSize }}>
			<div className="profile-container">
				<div className="image-nickname-container">
					<UserImage className='user-image' width={"50px"} height={"50px"} avatar={user.avatar} alt="Profile picture" />
					<div className="nickname">{user.nickname}</div>
				</div>
				<div className="profile-details">
					<div className="rating">{'MMR : ' + user.rating} </div>
					<div className="history">{'전적 : ' + user.wincount + '승 /' + user.losecount+'패' } </div>
				</div>
			</div>
		</div>
	); // 승패 넣기 
}