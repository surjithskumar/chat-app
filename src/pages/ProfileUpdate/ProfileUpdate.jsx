import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {

  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const { setUserData } = useContext(AppContext);

  const DEFAULT_AVATAR_URL = assets.avatar_icon; // Use the default avatar from assets.

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      const docRef = doc(db, 'users', uid);
  
      // Determine the avatar URL
      let imgUrl = prevImage || DEFAULT_AVATAR_URL;
      if (image) {
        imgUrl = await Upload(image);
        setPrevImage(imgUrl); // Save the uploaded image URL as the new previous image
      }
  
      // Validate input fields
      if (!name.trim()) {
        toast.error("Name cannot be empty!");
        return;
      }
  
      // Create or update the Firestore document
      await setDoc(docRef, {
        avatar: imgUrl,
        bio: bio || "",
        name: name || "Anonymous",
      }, { merge: true });
  
      // Update app context with the latest user data
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat');
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message);
    }
  };
  

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        // Populate initial form data
        setName(data?.name || "");
        setBio(data?.bio || "");
        setPrevImage(data?.avatar || DEFAULT_AVATAR_URL);
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className='profile'>
      <div className="p-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input 
              onChange={(e) => setImage(e.target.files[0])} 
              type="file" 
              id='avatar' 
              accept='.png,.jpg,.jpeg' 
              hidden 
            />
            <img 
              src={image ? URL.createObjectURL(image) : prevImage} 
              alt="Profile Avatar" 
            />
            Profile picture
          </label>
          <input 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            type="text" 
            placeholder='Your name' 
            required 
          />
          <textarea 
            onChange={(e) => setBio(e.target.value)} 
            value={bio} 
            placeholder='Write profile bio.' 
            required 
          ></textarea>
          <button type='submit'>Save</button>
        </form>
        <img 
          className='profile-pic' 
          src={image ? URL.createObjectURL(image) : prevImage} 
          alt="Profile Display" 
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
