import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
const Subject = () => {

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
 const res=await axios.put(`http://localhost:5000/api/Subject/${id.id}`,form);
      alert("Updated Successfully");
     }
     else{
       const res=await axios.post('http://localhost:5000/api/Subject',form);
      alert("Added Successfully");
     }
    }
    catch(er){
      alert("Subject not Added");
      console.log(er)
    }
  }
  const [data,setData] = useState([]);
  const handlefetch =async()=>{
    const res = await axios.get('http://localhost:5000/api/Subject');
    setData(res.data)
  }

  useEffect(()=>{
    handlefetch()
  },[])

  const handleDelete = async(id)=>{
    try{
      const res = await axios.delete(`http://localhost:5000/api/Subject/${id}`);
      alert("Subject Deleted Successfully")
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
          <h1>Subject Management</h1>
        </div>

        {/* <!-- Create Subject Form --> */}
        <div className="card">
          <h3>Create New Subject</h3>
          <form method="post" onSubmit={handleSubmit} >
            <label>Subject Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter Subject name" />

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

        {/* <!-- Subjects Table --> */}
        <div className="card">
          <h4>All Subjects</h4>
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

export default Subject