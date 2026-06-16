import React, { useEffect } from 'react'

const AdminHome = () => {
    const [data, setData] = useState([]);
    const handlefetch = async () => { 
        const res = await axios.get('http://localhost:5000/api/admindashboard');
        setData(res.data);

    }
    useEffect(() => {
        handlefetch();
    }, [])
    console.log(data);

  return (
    <div>
        <div>data.totalexam</div>
        <div>data.examinee</div>
        <div>data.totalexam</div>
        
    </div>
  )
}

export default AdminHome