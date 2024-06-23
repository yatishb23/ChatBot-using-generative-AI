import {  useRef, useState } from "react";
import "./App.css";
import Message from "./Message";
import { FaUser, FaRobot } from "react-icons/fa";

function App() {
  // const [length, setLength] = useState(8);
  // const [numberAllowed, setNumberAllowed] = useState(false);
  // const [charAllowed, setCharAllowed] = useState(false);
  // const [password, setPassword] = useState("");

  // const passwordRef=useRef(null)

  // const copyPassOnClipboard =useCallback(()=>{
  //   passwordRef.current?.select()
  //   window.navigator.clipboard.writeText(password)
  // },[password])
  // const passwordGenerator = useCallback(() => {
  //   let pass = "";
  //   let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  //   if (numberAllowed) str += "0123456789";
  //   if (charAllowed) str += "!@#$%^&*()-_+={}[]~`";
  //   for (let i = 0; i < length; i++) {
  //     let char = Math.floor(Math.random() * str.length + 1);
  //     pass += str.charAt(char);
  //   }
  //   setPassword(pass);
  // }, [charAllowed, numberAllowed, setPassword, length]);

  // useEffect(()=>{
  //   passwordGenerator()
  // },[length,numberAllowed,charAllowed,passwordGenerator])
  
 

  const [message,setMessage]=useState([]);
  const [newMessage,setNewMessage]=useState('')
  const divForScroll = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSend=()=>{
    if(newMessage.trim()){
      setMessage([...message,{text:newMessage,sender:'user'}])
      botMessage(newMessage);
      setNewMessage('')
      setTimeout(() => {
        divForScroll.current.scrollIntoView({ behavior: "smooth" });
      }, 0);
      // botMessage(newMessage);
    }
  }

  const handleKeyPress =(e)=>{
    if(e.key==='Enter'){
      setNewMessage('')
      setTimeout(() => {
        divForScroll.current.scrollIntoView({ behavior: "smooth" });
      }, 0);
      handleSend()
      
    }
  }
  
  const botMessage = async (userMessage) => {
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const genAI = new GoogleGenerativeAI("Your API KEY");

    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(userMessage);
      const responseText = result.response.text();

      const botResponse = { text: responseText, sender: 'bot' };
      setMessage((newMessage) => [...newMessage, botResponse]);
      setTimeout(() => {
        divForScroll.current.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } catch (error) {
      console.error('Error generating bot response:', error);
    }finally {
      setLoading(false);
    }
  };


  return (
    
    <div className="container">
      <div className="Box">
        <h2>ChatBot</h2>
        <div  className="messageBox">
        {message.map((message,index)=>(
          <div key={index} className={message.sender==='user' ? 'user-message-container':'bot-message-container'}>
          
          
              {/* {message.sender === 'bot' && <FaRobot className="icon bot-icon" />} */}
              <Message text={message.text} />
              {message.sender === 'user' && <FaUser className="icon user-icon" />}
        </div>
        ))}
        <div ref={divForScroll}></div>
        {loading && (
            <div className="bot-message-container loading-container">
              <FaRobot className="icon bot-icon" />
              <div className="loading-spinner"></div>
              <Message text="AI is generating a response..." />
            </div>
          )}
        </div>
        <div className="field">
          <input
            type="text"
            className="input"
            placeholder="Message ChatBot"
            onChange={(e)=> setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSend}>send</button>
        </div>
        
      </div>
    </div>
  );
}

export default App;
