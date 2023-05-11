import { GameProfile } from "./GameProfile";

export function GameWindow(props: any) {
	const {widthSize, heightSize, leftUser, rightUser} = props;

	console.log("leftUser", leftUser);
	console.log("leftUser", rightUser);

  return (
    <div style={{ width: widthSize, height: heightSize }}>
      <GameProfile user = {leftUser} />
			<GameProfile user = {rightUser}/>
    </div>
  );
	// user1
	// user2
}