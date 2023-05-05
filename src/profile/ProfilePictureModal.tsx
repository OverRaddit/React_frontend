import React, { useRef } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onUpload: (url: string) => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  onRequestClose,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (fileInputRef.current?.files) {
      const file = fileInputRef.current.files[0];

      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post('http://localhost:3000/uploads', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const uploadedImageUrl = response.data.url;
        onUpload(uploadedImageUrl);
        onRequestClose();
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
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
