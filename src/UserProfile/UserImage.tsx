export function UserImage(props: any) {
	const {width, height, avatar, alt} = props;
	// img, nickname, mmr, 전적
	return (
		<img width={width} height={height} src={avatar} alt={alt} style={{borderRadius: '50%'}}/>
    ); // 승패 넣기 
}