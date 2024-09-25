import React, { useEffect } from 'react'
import axiosInstance from '../../config/axiosInstance'

const Team_Members = ({ teamId }) => {

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axiosInstance.post(
          '/team/members',
          { teamId: teamId },
          { headers: { Authorization: token } }
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

  }, [teamId]);





  return (
    <div>Team_Members</div>
  )
}

export default Team_Members