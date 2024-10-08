import React from 'react';
import Modal from 'react-modal';
import styles from '../styles/EditModal.module.css'; 
import axiosInstance from '../config/axiosInstance';

const EditModal = ({ isEditModalOpen, setEditModalOpen, editFormData, handleEditChange, fetchTasks, onTaskUpdated, taskId }) => {
  
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/tasks/${taskId}`, editFormData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setEditModalOpen(false);
            onTaskUpdated();
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
  
    return (
        <Modal
            isOpen={isEditModalOpen}
            onRequestClose={() => setEditModalOpen(false)}
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
            ariaHideApp={false}
        >
            <button 
                onClick={() => setEditModalOpen(false)} 
                className={styles.closeButton}
            >
                &times;
            </button>
            <h2 className={styles.header}>Edit Task</h2>
            <form onSubmit={handleEditSubmit}>
                {/* Title Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="title" className={styles.label}>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                        className={styles.inputField}
                    />
                </div>

                {/* Description Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.label}>Description</label>
                    <textarea
                        name="description"
                        value={editFormData.description}
                        className={styles.textArea}
                        onChange={handleEditChange}
                    />
                </div>

                <div className={styles.formRow}>
                    {/* Priority Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="priority" className={styles.label}>Priority</label>
                        <select
                            name="priority"
                            value={editFormData.priority}
                            onChange={handleEditChange}
                            className={styles.selectField}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>

                    {/* Deadline Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="deadline" className={styles.label}>Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={editFormData.deadline ? new Date(editFormData.deadline).toISOString().substr(0, 10) : ''}
                            onChange={handleEditChange}
                            className={styles.inputField}
                        />
                    </div>
                </div>

                {/* Status Field */}
                <div className={styles.formGroup}>
                    <label htmlFor="status" className={styles.label}>Status</label>
                    <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleEditChange}
                        className={styles.selectField}
                    >
                        <option value="To-Do">To-Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.saveButton}>Save</button>
                </div>
            </form>
        </Modal>
    );
};

export default EditModal;

