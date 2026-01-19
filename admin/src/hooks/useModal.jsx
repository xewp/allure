import React, { useState } from 'react';
import AdminModal from '../components/common/AdminModal';

/**
 * Custom hook for easily showing modals in admin panel
 * Replaces browser alert() and confirm() with themed modals
 * 
 * @returns {Object} Modal component and show functions
 * 
 * @example
 * const { Modal, showSuccess, showError, showConfirm } = useModal();
 * 
 * // In JSX
 * return (
 *   <>
 *     {Modal}
 *     <button onClick={() => showSuccess("Action completed!")}>Do Something</button>
 *   </>
 * );
 */
const useModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    showCancel: false,
    onConfirm: null,
    onCancel: null,
  });

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const showModal = (config) => {
    setModalState({
      isOpen: true,
      title: config.title || '',
      message: config.message || '',
      type: config.type || 'info',
      confirmText: config.confirmText || 'OK',
      showCancel: config.showCancel || false,
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null,
    });
  };

  /**
   * Show success message modal
   * @param {string} message - Success message to display
   * @param {string} title - Optional title (default: "Success")
   */
  const showSuccess = (message, title = 'Success') => {
    showModal({
      type: 'success',
      title,
      message,
      confirmText: 'OK',
    });
  };

  /**
   * Show error message modal
   * @param {string} message - Error message to display
   * @param {string} title - Optional title (default: "Error")
   */
  const showError = (message, title = 'Error') => {
    showModal({
      type: 'error',
      title,
      message,
      confirmText: 'OK',
    });
  };

  /**
   * Show warning message modal
   * @param {string} message - Warning message to display
   * @param {string} title - Optional title (default: "Warning")
   */
  const showWarning = (message, title = 'Warning') => {
    showModal({
      type: 'warning',
      title,
      message,
      confirmText: 'OK',
    });
  };

  /**
   * Show info message modal
   * @param {string} message - Info message to display
   * @param {string} title - Optional title (default: "Information")
   */
  const showInfo = (message, title = 'Information') => {
    showModal({
      type: 'info',
      title,
      message,
      confirmText: 'OK',
    });
  };

  /**
   * Show confirmation dialog
   * @param {string} message - Confirmation message
   * @param {function} onConfirm - Callback when user confirms
   * @param {string} title - Optional title (default: "Confirm Action")
   * @param {string} confirmText - Optional confirm button text (default: "Confirm")
   */
  const showConfirm = (message, onConfirm, title = 'Confirm Action', confirmText = 'Confirm') => {
    showModal({
      type: 'warning',
      title,
      message,
      confirmText,
      showCancel: true,
      onConfirm: () => {
        onConfirm();
        closeModal();
      },
      onCancel: closeModal,
    });
  };

  const Modal = (
    <AdminModal
      isOpen={modalState.isOpen}
      onClose={closeModal}
      title={modalState.title}
      message={modalState.message}
      type={modalState.type}
      confirmText={modalState.confirmText}
      showCancel={modalState.showCancel}
      onConfirm={modalState.onConfirm || closeModal}
      onCancel={modalState.onCancel || closeModal}
    />
  );

  return {
    Modal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
};

export default useModal;
