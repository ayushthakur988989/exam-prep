import React from 'react' // rafce//
import { Link } from 'react-router'
import AdminDashboard from './AdminDashboard'

const Login0 = () => {
  return (
    <div className='Login templet d-flex justify-content-center  align-item-center 100-w vh-100 bg-secondary'>
      <div className='form_container  p-4 rounded  bg-light ' >
        <form method='POST'>
        <h3 className='text-center'>Sign In</h3>
        <div className='mb-2'>
          <label htmlFor="email">Email</label>
          <input type="email" name='email' placeholder=' Enter Email'className='form-control' />
        </div>
        <div className='mb-2'>
          <label htmlFor="name">Password</label>
          <input type="password" name='password' placeholder='Enter Password'className='form-control' />
        </div>
        <div className='mb-2'>
        
          <label htmlFor="check" className='custom-input-label ms-2 p-2'>
            Remember Me
          </label>
          
        </div>
         
        <div className='d-grid'>
          <button className='btn btn-primary' >Sign In</button>
        </div>
        <div className='text-right p-2'>
          <p>
            Forgot <a href="">Password?</a> <a href=""> Sign Up</a>
          </p>
        </div>
      </form>
      </div>
    </div>
  )
}

export default Login0