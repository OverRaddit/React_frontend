import './GameModal.css'

export function GameModal(props:any){
	const {isModalOpen, setIsModalOpen, firstScore, secondScore} = props;

	function closeModal() {
		setIsModalOpen(false);
	}

  return (
		(isModalOpen && (
  		<div className='modal-content'>
    		<h1>'Game Over!'</h1>
				<h2>{firstScore} : {secondScore}</h2>
    		<button id="modal-button" onClick={closeModal}>Back to main</button>
  		</div>
		))
	);
}
