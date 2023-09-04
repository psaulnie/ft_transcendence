import React, { useState, useEffect, useRef } from 'react';
// import Canvas from './Canvas';
import './Canvas.css'
import { webSocket } from '../../webSocket';
import { BlobOptions } from 'buffer';
// import { exit } from 'process';
// import { WidthFull } from '@mui/icons-material';
// import Matchmaking from './Matchmaking';
// import { StyledEngineProvider } from '@mui/material';
// import { wait } from '@testing-library/user-event/dist/utils';

// interface InterfaceProps{
//   WidthFrame:string;
//   Heigth:string;
// }

export default function Canvas({players, gameRoomId} : {players: {1: string, 2: string}, gameRoomId: string}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rectPositionP1, setRectPositionP1] = useState<{ x: number; y: number }>({ x: 20, y:  175});
  const [rectPositionP2, setRectPositionP2] = useState<{ x: number; y: number }>({ x: 620, y:  175});
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number }>({ x: 320, y:  212});
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 640, height: 425 });
  const [divSize, setDivSize] = useState<{width: any; height: any}>({width:0, height: 0});
  const rectWidth = 5;
  const rectHeight = 75;
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext('2d');
  const isP1 = (players[1] < players[2]) ? true : false;
  const upPress = useRef<boolean>(false);
  const downPress = useRef<boolean>(false);

  useEffect(() => {
    const divID = "canvas";
    const divElement = document.getElementById(divID);
    if (divElement)
      divElement.style.cursor = "none";
    const divWidth = divElement!.offsetWidth; // Largeur de la div en pixels
    const divHeight = divElement!.offsetHeight; // Hauteur de la div en pixels
    setDivSize({width: divWidth, height: divHeight});

    // setRectPositionP1({x:20, y: divHeight / 2});
    // setRectPositionP2({x: divHeight - 20, y: divHeight / 2});

    // const canvas = canvasRef.current;
    // const ctx = canvas?.getContext('2d');
    // ctx!.fillStyle = 'white';
    // ctx?.fillRect(divWidth - 20 - rectWidth / 2, divHeight / 2 - rectHeight / 2, rectWidth, rectHeight);

    
    const handleResize = () => {
      let scale = window.innerWidth * 0.00075;

      if (scale > 1)
        scale = 1;
      else if (scale < 0.666)
        scale = 0.666;
      const gameCanvas = document.querySelector('.canvas') as HTMLElement;
      if (gameCanvas) {
        gameCanvas.style.transform = `scale(${scale})`;
      }
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ctx]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat)
        return;
      const { key } = event;

      if (key === 'ArrowUp' || key === 'w') {
        console.log("up press");
        // upPress.current = true;
        webSocket.emit("pressUp", {player: players[1], gameRoomId: gameRoomId});
      }
      if (key === 'ArrowDown' || key === 's') {
        // downPress.current = true;
        webSocket.emit("pressDown", {player: players[1], gameRoomId: gameRoomId});
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.repeat)
        return;
      const { key } = event;

      if ((key === 'ArrowUp' || key === 'w') && downPress.current === false) {
        // upPress.current = false;
        // downPress.current = false;
        webSocket.emit("releaseUp", {player: players[1], gameRoomId: gameRoomId});
      }
      if ((key === 'ArrowDown' || key === 's') && upPress.current === false) {
        // downPress.current = false;
        // upPress.current = false;
        webSocket.emit("releaseDown", {player: players[1], gameRoomId: gameRoomId});
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

		function process(value: any) {
      // const animate = () => {
        // console.log("dans animate", value);
        ctx!.fillStyle = 'white';
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
        if (isP1 == true) {
          // console.log("je suis P1");
          setRectPositionP1((prevPosition) => ({ ...prevPosition, y: value.playerY}));
          ctx?.fillRect(rectPositionP1.x /*- rectWidth / 2*/, rectPositionP1.y/* - rectHeight / 2*/, rectWidth, rectHeight);
          setRectPositionP2((prevPosition) => ({ ...prevPosition, y: value.enemyY}));
          ctx?.fillRect(canvasSize.width - 20/* - rectWidth / 2*/, rectPositionP2.y/* - rectHeight / 2*/, rectWidth, rectHeight);  
        } else {
          // console.log("je suis P2");
          setRectPositionP2((prevPosition) => ({ ...prevPosition, y: value.enemyY}));
          ctx?.fillRect(rectPositionP1.x/* - rectWidth / 2*/, rectPositionP1.y /*- rectHeight / 2*/, rectWidth, rectHeight);
          setRectPositionP1((prevPosition) => ({ ...prevPosition, y: value.playerY}));
          ctx?.fillRect(canvasSize.width - 20/* - rectWidth / 2*/, rectPositionP2.y/* - rectHeight / 2*/, rectWidth, rectHeight);  
        }
        setBallPosition({x: value.ballX, y: value.ballY});
        ctx?.fillRect(ballPosition.x, ballPosition.y, 10, 10);

      //   requestAnimationFrame(animate);
      // };
      // animate();
    }
    webSocket.on("game" + gameRoomId, process);
		return () => {
			webSocket.off("game" + gameRoomId, process);
		};
  }, [rectPositionP1, divSize]);

  return (
    <div className='canvas' id='canvas'>
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height}
              style={{ display: 'block'}}/>
    </div>
  );
};