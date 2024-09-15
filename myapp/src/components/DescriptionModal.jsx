import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faRectangleXmark, faHourglassHalf, faFlag,faBookmark } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import styles from '../styles/TaskCard.module.css';
import Swal from 'sweetalert2'


const DescriptionModal = ({isViewModalOpen, setViewModalOpen, description, title, createDate, deadlineDate, RemainingDays, handleDelete, user, setEditModalOpen}) => {
  return (
   <>
   
   <Modal style={{border:'1px solid red'}} isOpen={isViewModalOpen} onRequestClose={() => setViewModalOpen(false)} className={styles.viewModal}>
                        <div className={styles.viewCrossDiv}>
                            <FontAwesomeIcon icon={faRectangleXmark} onClick={() => setViewModalOpen(false)} />

                        </div>
  
                        <div >
                            <div className={styles.viewTitleDiv}>
                               
                                <span>{title}</span>
                            </div>
                            <div className={styles.viewDecDiv}>
                               
                                <span>{description}</span>

                            </div>
                            <div className={styles.viewTimeDiv}>

                                <div className={styles.viewCrtDiv}>
                                    <span style={{ color: 'blue',marginRight:'0.5rem' }}><FontAwesomeIcon icon={faBookmark} /></span>
                                    <span> {createDate} </span>
                                    
                                </div>

                                <div className={styles.viewDeadinfo} >
                                    <span style={{    color: '#2dcc2d',marginRight:'0.5rem'}}> <FontAwesomeIcon icon={faFlag} /> </span>
                                    
                                    <span>{deadlineDate}</span>
                                </div>

                                <div className={styles.viewDeadinfo}>
                                    <span style={{ color: '#ff7153',marginRight:'0.5rem'}}>
                                    <FontAwesomeIcon icon={faHourglassHalf} />
                                        </span>

                                    <span >Only {RemainingDays} Days Left</span>
                                </div>
                               
                            </div>

                        </div>

                        <div className={styles.viewExtraIcons}>
                            {user && (
                                
                                <button className={`${styles.viewbtndiv} ${styles.viewEdit}`} onClick={() => setEditModalOpen(true)}><FontAwesomeIcon icon={faPenToSquare}  style={{ marginRight:'0.5rem' }} />Edit </button>

                            )}

                            <button className={`${styles.viewbtndiv} ${styles.viewDelete}` } onClick={() => {
                                Swal.fire({
                                    title: "Are you sure you want to delete this?",
                                    showCancelButton: true,
                                    confirmButtonText: "Delete",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        handleDelete();

                                    } else if (result.isDenied) {
                                        Swal.fire("Changes are not saved", "", "info");
                                    }
                                });
                            }}>
                            <FontAwesomeIcon icon={faTrash} style={{ marginRight:'0.5rem' }} />Delete</button>
                        </div>

                    </Modal>
   
   
   </>
  )
}

export default DescriptionModal