import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const CreatorHome = () => {

    const navigate = useNavigate();

    const  isverified = true;

    useEffect(() => {
        if (!isverified) {
            navigate('/verify-profile');
        }
        else{
            navigate('/creator/my-jobs');
        }
    }, [isverified]);
  return (
    <div>

    </div>
  )
}

export default CreatorHome