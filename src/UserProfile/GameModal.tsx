import './GameModal.css'

export function GameModal(props:any){
	const {isModalOpen, setIsModalOpen, navigate, modalMessage, firstScore, secondScore} = props;

	function closeModal() {
		//status 변경이 필요함.
		navigate('/', {replace: true});
		setIsModalOpen(false);
	}

  return (
		(isModalOpen && (
  		<div className='modal-content'>
    		<h1>{modalMessage}</h1>
				<h2>{firstScore} : {secondScore}</h2>
    		<button id="modal-button" onClick={closeModal}>Back to main</button>
  		</div>
		))
	);
}
