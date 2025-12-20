import React from 'react'
import { Routes,Route,Navigate } from 'react-router';
import HomePage  from './pages/HomePage.jsx';
import LoginPage  from './pages/LoginPage.jsx';
import SignUpPage  from './pages/SignUpPage.jsx';
import NotificationsPage  from './pages/NotificationsPage.jsx';
import ChatPage  from './pages/ChatPage.jsx';
import CallPage  from './pages/CallPage.jsx';
import FriendsPage  from './pages/FriendsPage.jsx';
import OnboradingPage  from './pages/OnboradingPage.jsx';
import {Toaster} from "react-hot-toast";
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import { axiosInstance }  from './lib/axios.js';
import PageLoader from './component/PageLoader.jsx';
import { getAuthUser } from './lib/api.js';
import useAuthUser from './hooks/useAuthUser.js';
import  Layout  from './component/Layout.jsx';
import {useThemeStore} from './store/useThemeStore.jsx';


const App = () => {

const {isLoading,authUser} = useAuthUser();

const {theme}=useThemeStore();
const isAuthenticated = Boolean(authUser);
const isOnboarding = authUser?.isOnboarding

  if(isLoading) return <PageLoader/>
  //console.log(data);
    // console.log({isLoading});
    //   console.log({error});
  return (
    <div   className="h-screen "data-theme={theme}>
      <Routes>
      <Route path="/" element={isAuthenticated &&isOnboarding ?(
        <Layout showSidebar={true}>
          <HomePage/>
        </Layout>


      ):(
        <Navigate to={!isAuthenticated? "/login":"/onboarding"}/>
      )} />
      <Route path="/login" element={!isAuthenticated?<LoginPage />:<Navigate to={isOnboarding?"/":"/onboarding"}/>} />
      <Route path="/signup" element={!isAuthenticated?<SignUpPage />:<Navigate to={isOnboarding?"/":"/onboarding"}/>} />
      <Route path="/notifications" element={isAuthenticated&&isOnboarding?
    (  <Layout showSidebar={true}>
          <NotificationsPage/>
        </Layout>):<Navigate to={!isAuthenticated?"/login":"/onboarding"}/>

      }

        />



        <Route path="/friends" element={isAuthenticated?<Layout showSidebar={true}>
          <FriendsPage/>
        </Layout>:<Navigate to="/login"/>} />


    <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarding ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

      <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarding ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

       <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarding ? (
                <OnboradingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <Toaster/>
 </div>
  )
}

export default App
