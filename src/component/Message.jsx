import React from 'react'
import {HStack , Text , Avatar ,   } from "@chakra-ui/react"

const Message = ({text , uri , user ="other"} ) => {
  return (
    <HStack  alignSelf ={user === "me" ? "flex-end":"flex-start"}  borderRadius ={"Base"} bg = "grey.100" paddingx= {4}  paddingy ={2} 
   >
     
     {
        user==="other" &&  <Avatar src={uri} />
     }
     <Text> {text}</Text>
     {
        user==="me" &&  <Avatar   src={uri}/>
     }
    </HStack>
  )
}

export default Message