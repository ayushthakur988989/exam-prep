import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
const Session = () => {

  const[form,setform] = useState({
    name:'',
    description:''
  })
  const handleChange = (e)=>{
    setform({...form,[e.target.name]:e.target.value})
  }
const[id,setId] =useState({
  id:''
});
const [edit, setEdit] =useState(null);


  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
     if(edit){
 const res=await axios.put(`https://exam-prep-1v8x.onrender.com/api/session/${id.id}`,form);
      alert("Updated Successfully");
      window.location.reload();
     }
     else{
       const res=await axios.post('https://exam-prep-1v8x.onrender.com/api/session',form);
      alert("Added Successfully");
     }
    }
    catch(er){
      alert("Session not Added");
      console.log(er)
    }
  }
  const [data,setData] = useState([]);
  const handlefetch =async()=>{
    const res = await axios.get('https://exam-prep-1v8x.onrender.com/api/session');
    setData(res.data)
  }

  useEffect(()=>{
    handlefetch()
  },[])

  const handleDelete = async(id)=>{
    try{
      const res = await axios.delete(`https://exam-prep-1v8x.onrender.com/api/session/${id}`);
      alert("session Deleted Successfully")
    }
    catch(er){
      alert("Sorry Try Again Later")
      console.log(er);
    }
  }

const handleEdit =(item)=>{
setform({
  name:item.name,
  description:item.description
})
setEdit(true)
setId({
  id:item._id
});
}
  return (
    <>
     <div className="header">
          <h1>Session Management</h1>
        </div>

        {/* <!-- Create Session Form --> */}
        <div className="card">
          <h3>Create New Session</h3>
          <form method="post" onSubmit={handleSubmit} >
            <label>Session Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter session name" />

            <label>Description</label>
            <textarea placeholder="Enter description" value={form.description} name="description" onChange={handleChange} >{form.description}</textarea>

            <div className="buttons">
              <button type="button" className="cancel">
                Cancel
              </button>
              <button type="submit" className="submit">
                Save
              </button>
            </div>
          </form>
        </div>

        {/* <!-- Sessions Table --> */}
        <div className="card">
          <h4>All Sessions</h4>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Description</th>
                
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item,i)=>(
                <tr key={item._id}>
                  <td>{i+1}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>
                    <button className="btn-danger btn" onClick={()=>{handleDelete(item._id)}}>Delete</button>
                    <button className="btn btn-success" onClick={()=>{handleEdit(item)}}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      
      
    </>
  )
}

export default Session