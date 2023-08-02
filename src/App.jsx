import React, { useRef } from "react"
import { useState } from "react";
import { useEffect } from "react";
import { Box, Button, Input, Container, VStack, HStack } from "@chakra-ui/react";
import Message from "./component/Message";
import  {app } from "./firebase";
import { onAuthStateChanged, signOut, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { getFirestore , addDoc , serverTimestamp, collection , onSnapshot , query , orderBy} from "firebase/firestore"


const auth = getAuth(app);
const db = getFirestore(app);

// login handler function 
const loginhandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)

}
const logouthandler = () => signOut(auth);


function App() {
 
  const [user, setuser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divforScrolll =useRef(null)
 
  const subbmithandler =async(e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db,"Messages"), {
        text:  message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
       });
       setMessage("");
       divforScrolll.current.scrollIntoView({behavior:"smooth"})

     

    } catch (error) {
      alert(error)
    }
   
  };
  useEffect(() => {

    const q = query(collection(db,"Messages"),orderBy("createdAt","asc"))
    const unsubscribe = onAuthStateChanged(auth, (data) => {
    
      setuser(data);

    });
const unsubscribebeforemessage =    onSnapshot(q,(snap)=>{
      setMessages(snap.docs.map((item)=>{
        const id = item.id;
        return {id , ...item.data()};
      }));
    
      
     })
    return () =>{
     unsubscribe();
 unsubscribebeforemessage ();
    };
  } ,[])

  

  return (

    <Box bg={"blackAlpha.50"} >
      {
        user ? (
          <Container h={"100vh"} bg={"white"}>
            <VStack h={"full"}>
              <Button w={"full "} colorScheme="red" onClick={logouthandler}>Logout</Button>

              <VStack h="full" w="full" paddingy={4} overflowY={"auto"}  css={{"&::-webkit-scrollbar":{display:"none"}}}>
             {

              messages.map (item=>(

              <Message
              key ={item.id}
              user={item.uid ===user.uid?"me":"other"} 
              text={item.text}
              uri ={item.uri}/>

              ))
             }
           
           <div ref={divforScrolll}> </div>


              </VStack>
          
              <form onSubmit={subbmithandler} style={{ width: "100%" }}>

                <HStack>
                  <Input value={ message}   onChange={(e)=> setMessage(e.target.value)} placeholder="Type a message...." />
                  <Button colorScheme="green" type="submit">Send</Button>
                </HStack>
              </form>

            </VStack>
          </Container>


        ) : <VStack h="100vh" backgroundColor={"blackAlpha.500"} justifyContent={"center"}>
          <h1>Welcome Rohit's Chat-APP</h1>
          <Button  bg={"purple"} onClick={loginhandler}
            color={"white.100"}> sign in with google </Button>
        </VStack>
      }

    </Box>

  )
}

export default App;
