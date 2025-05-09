/**
 * CustomConfirmModal
 * A reusable modal that asks the user to confirm or cancel an action.
 * Calls `onConfirm()` or `onCancel()` based on user interaction.
 *
 * Properties:
 * - message (string): The confirmation text to display.
 * - onConfirm (function): Callback when user confirms.
 * - onCancel (function): Callback when user cancels or closes the modal.
 */

import React from 'react';

const CustomConfirmModal = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        {/* Message prompt */}
        <p>{message}</p>

        {/* Action buttons */}
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmModal;
