import React, { useRef } from 'react';
import Modal from 'react-modal';

interface ProfilePictureModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onUpload: (url: string) => void; // onUpload prop 타입 수정
  }  


const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  onRequestClose,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (fileInputRef.current?.files) {
      const file = fileInputRef.current.files[0];
  
      // FileReader 인스턴스 생성
      const reader = new FileReader();
  
      // 파일 읽기 완료 시 호출되는 콜백 함수
      reader.onload = (event) => {
        const dataURL = event.target?.result as string;
        onUpload(dataURL); // 읽은 파일의 dataURL을 onUpload prop으로 전달
        onRequestClose();
      };
  
      reader.readAsDataURL(file); // 파일 읽기 시작
    }
  };
  

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h3>프로필 사진 변경</h3>
      <input type="file" accept="image/*" ref={fileInputRef} />
      <button className="upload-button" onClick={handleSubmit}>
        업로드
      </button>
      <button className="close-button" onClick={onRequestClose}>
        닫기
      </button>
    </Modal>
  );
};

export default ProfilePictureModal;
