import React from 'react';

const CustomConfirmModal = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <p>{message}</p>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>Yes</button>
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmModal;
