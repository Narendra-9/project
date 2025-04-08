import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { createContext,  useEffect, useState } from 'react'
import SecureLS from "secure-ls";
import showToast from '../components/CustomToast/CustomToast';

export const UserConext=createContext();
const ls = new SecureLS({ encodingType: 'aes' });

export function UserProvider({children}){
    let [user,setUser]=useState(null);
    let [openLogInPopUp,setOpenLogInPopUp]=useState(false);
    let [loading,setLoading]=useState(true);
    
    function openPopUp(){
      setOpenLogInPopUp(true);
    }
  
    function closePopUp(){
      setOpenLogInPopUp(false);
    }
    
    async function getUserDetails(userId) {

        try {
          const response = await axios.get(`http://localhost:8080/users/${userId}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching user details:', error);
          return null;
        }
      }
      

    async function handleLogout(){

        let userId=user.userId;
        if (userId === undefined || userId === null) {
          showToast("Something Went Wrong ","error")
          console.error('User ID is missing!');
          return;
        }
        await axios.put(`http://localhost:8080/users/logout/${userId}`,{}, {
          headers: {
            'Accept': "application/json",
            "Content-Type": "application/json"
          }
        })
        removeUser();
      }

      
    useEffect(() => {
        const storedUser = ls.get("user");
        if (storedUser) {
            const userId = JSON.parse(storedUser).userId;
            const fetchUser = async () => {
                const fetchedUser = await getUserDetails(userId);

                if(fetchedUser?.loggedIn){
                    setUser(fetchedUser);
                }
                setLoading(false)
            };
            fetchUser();
        }
        else{
          setLoading(false)
        }
    }, []);

    

    function setUserData(userData){
        setUser(userData);
        ls.set("user",JSON.stringify(userData))
    }

    function removeUser(){
        setUser(null);
        window.location.href="/";
        ls.remove("user")
    }

    if (loading) {

        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress />
          </div>
        );
      }



    return (
        <UserConext.Provider value={{user,loading,setUserData,handleLogout,openLogInPopUp,openPopUp,closePopUp}}>
            {children}
        </UserConext.Provider>
    )
    
}