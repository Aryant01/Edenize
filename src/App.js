import React, { useEffect, useState } from "react";
import axios from 'axios';

function App() {
  const [listening, setListening] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);
  const wakeWord = 'destroy';

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log('Heard: ', transcript);
        if (transcript === wakeWord) {
          setWakeWordDetected(true);
          console.log("wake word detected! Triggering action...");
          triggerSMS();
        }
      };

      recognition.start();
      return () => recognition.stop();
    } else {
      console.error("Speech recognition is not supported in this browser.");
    }
  }, []);

  const triggerSMS = async () => {
    try {
      const response = await axios.post('http://localhost:3001/send-sms', {
        user: 'user1',
        message: 'This is an emergency! Please help me!'
      });
      console.log(response.data.message);
      setEmergencyTriggered(true);
    } catch (error) {
      console.error('Error triggering action: ', error);
    }
  };
  
  return (
    <div className="App">
      <h1>Edenize</h1>
      <p>{listening ? 'Listening...' : 'Not listening'}</p>
      {wakeWordDetected && <p>Wake word detected! Performing action...</p>}
    </div>
  );
}

export default App;
