import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ConfirmInvite = () => {
  const { projectId, userId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Processing invitation...');

  useEffect(() => {
    const confirmInvite = async () => {
      try {
        const response = await fetch(`http://localhost:9999/users/confirm-invite/${projectId}/${userId}`, {
          method: 'POST',
        });

        const data = await response.json();
        if (response.ok) {
          setMessage(data.message || 'Successfully joined the project!');
          setTimeout(() => navigate(`/project/${projectId}`), 2000);
        } else {
          setMessage(data.message || 'Invitation failed!');
        }
      } catch (error) {
        setMessage('Error processing invitation.');
      }
    };

    confirmInvite();
  }, [projectId, userId, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Successfully joined the project!</h2>
    </div>
  );
};

export default ConfirmInvite;
