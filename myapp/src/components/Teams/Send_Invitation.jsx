import React, { useState } from 'react'
import styles from '../../styles/Create_Team_Form.module.css';
import axiosInstance from '../../config/axiosInstance';
import Swal from 'sweetalert2'

const Send_Invitation = ({teamId}) => {

    const [email,setEmail] = useState();

    const handleSubmit= async (e)=>{
        e.preventDefault();
        const token = localStorage.getItem('token');
        const response =await axiosInstance.post('/team/add-member/invite',{email:email,teamId:teamId},{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
            if(response.status==200){
                await   Swal.fire({
              
                    icon: "success",
                    title: "Invite Sent succesfully!",
                    showConfirmButton: false,
                    timer: 1000
                  });
            }


    }    

  return (
    <>
    <form  onSubmit={handleSubmit}>
        <label className={styles.label}> Invite a Member</label>
        <input  className={styles.input}
                required type='email' placeholder='Enter Email to Send Invitation' onChange={(e)=>{setEmail(e.target.value); console.log(email)}}></input>
        <button className={styles.button} type='submit'>Send Invite</button>
    </form>
    
    
    </>
  )
}

export default Send_Invitation