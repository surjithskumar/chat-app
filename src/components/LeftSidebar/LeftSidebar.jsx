import React, { useContext } from 'react'
import './LeftSidebar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { AppContext } from '../../context/AppContext'
import { db } from '../../config/firebase'

const LeftSidebar = () => {

  const navigate = useNavigate();

  const {userData} = useContext(AppContext);

  const inputHandler = async (e)=> {
    try {
      const input = e.target.value;
      const userRef = collection(db,'users');
      const q = query(userRef,where("username","==",input.toLowerCase()));
      const querySnap = await getDocs(q);
      if(!querySnap.empty && querySnap.docs[0].data().id !== userData.id){
        console.log(querySnap.docs[0].data());
      }
    } catch (error) {
      
    }
  }

  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
            <img src={assets.logo} alt="" className='logo' />
            <div className="menu">
                <img src={assets.menu_icon} alt="" />
                <div className="sub-menu">
                  <p onClick={()=>navigate('/profile')}>Edit Profile</p>
                  <hr />
                  <p>Logout</p>
                </div>
            </div>
        </div>
        <div className="ls-search">
            <img src={assets.search_icon} alt="" />
            <input onChange={inputHandler} type="text" placeholder='Search Here' />
        </div>
      </div>
      <div className="ls-list">
        {Array(12).fill("").map((item,index)=>(
            <div key={index} className="friends">
            <img src={assets.profile_img} alt="" />
            <div>
                <p>Richard Stranford</p>
                <span>Hello How are you</span>
            </div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default LeftSidebar
