import React from 'react';

const Modal = ({ isOpen, onProceed, onCancel }) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-bottom sm:modal-middle" open>
      <div className="modal-box bg-base-100 p-4   rounded">
        <h3 className="font-bold text-lg">Confirm Delete</h3>
        <p className="py-4">Are you sure you want to delete this movie?</p>
        <div className="modal-action">
          <button className=" btn bg-blue-600 text-white rounded border-none hover:bg-blue-500" onClick={onCancel}>Cancel</button>
          <button className="btn btn-error text-primary-content rounded border-none" onClick={onProceed}>Proceed</button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;