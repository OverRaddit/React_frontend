import { GameProfile } from "./GameProfile";
import './GameWidow.css'

export function GameWindow(props: any) {
	const {widthSize, heightSize, leftUser, rightUser} = props;

	// console.log("leftUser", leftUser);
	// console.log("leftUser", rightUser);

  return (
    <div className="game-profile-container" style={{ width: widthSize, height: heightSize }}>
      <GameProfile user = {leftUser} className="game-profile"/>
			<GameProfile user = {rightUser} className="game-profile"/>
    </div>
  );
	// user1
	// user2
}