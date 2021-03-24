import React from 'react'
import Webcam from "react-webcam";

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

function Camara() {

    const webcamRef = React.useRef(null);

    const capture = React.useCallback(
        () => {
          const imageSrc = webcamRef.current.getScreenshot();
          console.log(imageSrc)
        },
        [webcamRef]
    );

    return (
        <div>
            <Webcam
                audio={false}
                height={200}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={420}
                videoConstraints={videoConstraints}
            />
            <button onClick={capture}>Tomar Foto</button>
        </div>
    )
}

export default Camara
