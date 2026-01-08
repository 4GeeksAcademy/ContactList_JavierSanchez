import React from "react";

export const DeleteContact = ({ show, onClose, onConfirm, message }) => {
    if (!show) return null; // Do not render the modal if 'show' is false

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    {/* Modal title and close button */}
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    {/* Confirmation message */}
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    {/* Action buttons */}
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}