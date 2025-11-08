import './SpeechBubble.css'

interface SpeechBubbleProps {
  message: string
}

const SpeechBubble = ({ message }: SpeechBubbleProps) => {
  return (
    <div className="speech-bubble-container">
      <div className="speech-bubble">
        <p className="speech-text">{message}</p>
        <div className="speech-arrow"></div>
      </div>
    </div>
  )
}

export default SpeechBubble

