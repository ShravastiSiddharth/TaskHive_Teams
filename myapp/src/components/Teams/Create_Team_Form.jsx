import React, { useState } from 'react';
import styles from '../../styles/Create_Team_Form.module.css';
import axiosInstance from '../../config/axiosInstance';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';




const Create_Team_Form = () => {


    const [teamName, setTeamName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
       
        const token = localStorage.getItem('token');
        
        try{
        const response = await axiosInstance.post('/team/create',{title:teamName},{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response.status == 200){
            await   Swal.fire({
              
                icon: "success",
                title: "Team created succesfully!",
                showConfirmButton: false,
                timer: 1000
              });
                navigate('/teams', {state:{myComponent:'dashboard'}});

        }
    }
    catch(error){
            console.log("Something went wrong",error)
    }

        
    };


  return (
   <>
    <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="teamName" className={styles.label}>
                Team Name:
            </label>
            <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={styles.input}
                required
            />
            <button type="submit" className={styles.button}>
                Submit
            </button>
        </form>
   </>
  )
}

export default Create_Team_Form