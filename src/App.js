import "./App.css"
import { useState, useEffect } from "react"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Papa from "papaparse";
import DropFileInput from './components/dnd-file-input/DropFileInput';
import speakerPng from './assets/speaker.png';
import microphoneSvg from './assets/bx-microphone.svg'
import { Audio } from 'react-loader-spinner'


function App() {
  const [data, setData] = useState([]);
  const [isLearning, setIsLearning] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentWord, setCurrentWord] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState("");

  const msg = new SpeechSynthesisUtterance()

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition();

  useEffect(() => {
    if (finalTranscript !== '') {
      console.log('Got final result:', finalTranscript);
      resetTranscript();
    }
  }, [interimTranscript, finalTranscript]);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
  }

  const listenContinuously = () => {
    setIsRecording(!isRecording)

    console.log(isRecording)

    if (isRecording) {
      SpeechRecognition.startListening({
        continuous: true,
        language: 'en-GB',
      });
    } else{
      console.log('stop')
      SpeechRecognition.stopListening()
    }
  };

  const parseCSV = (file) => {
    if (!file) return setError("Enter a valid file");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setData(results.data);
        console.log(data)
      },
    });
  };

  const randomWord = () => {
    if (data.length === 0) {
      setError('Файл порожній')
    }

    const rand = Math.floor(Math.random() * (data.length));
    console.log(rand)
    setCurrentWord(data[rand])
  }

  const onFileChange = (file) => {
    setFile(file)
    parseCSV(file);
    console.log(file);
  }

  const startHandler = () => {
    randomWord();
    setIsLearning(true)
    console.log(currentWord)
  }

  const speechHandler = (msg) => {
    msg.text = currentWord.english
    window.speechSynthesis.speak(msg)
  }

  const showContent = () => {
    if (isLearning == true) {
      return (
        <div className="container">
          <h3>Словник: {file.name}</h3>
          <div>
            <img className="speaker-img" src={speakerPng} alt="" onClick={() => speechHandler(msg)} />
            <h1>{currentWord.english}</h1>
          </div>
          <button className="start-btn" onClick={() => randomWord()}>Далі</button>
          <div className="speaker">
            <img className="speaker-img" src={microphoneSvg} alt="" onClick={listenContinuously} />
            {/* {isRecording &&
              <Audio
                height="15"
                width="100"
                radius="10"
                color='green'
                ariaLabel='three-dots-loading'
                wrapperStyle
                wrapperClass
              />
            } */}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <DropFileInput
            onFileChange={(file) => onFileChange(file)}
          />
          {file && <button className="start-btn" onClick={() => startHandler()}>Розпочати</button>}
        </div>
      );
    }
  }

  return (
    <div className='App'>
      <h1 className="title">Вивчення англійських слів зі словника</h1>
      <div className='body'>
        <div className="content">
          {showContent()}
        </div>
      </div>
    </div>
  )
}

export default App