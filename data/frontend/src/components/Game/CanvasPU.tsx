import React, { useState, useEffect, useRef } from 'react';
import './Canvas.css'
import webSocketManager from '../../webSocket';
import { Button } from '@mui/material';

export default function CanvasPU({playersPU, gameRoomIdPU, setFoundUserPU} : {playersPU: {1: string, 2: string}, gameRoomIdPU: string, setFoundUserPU: any}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rectPositionP1, setRectPositionP1] = useState<{ x: number; y: number }>({ x: 5, y:  175});
  const [rectPositionP2, setRectPositionP2] = useState<{ x: number; y: number }>({ x: 630, y:  175});
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number }>({ x: 320, y:  212});
  const canvasSize = { width: 640, height: 425 }
  const rectWidth = 5;
  const rectHeight = 75;
  const ballWidth = 10;
  const player1 = playersPU[1] < playersPU[2] ? playersPU[1] : playersPU[2];
  const player2 = playersPU[1] < playersPU[2] ? playersPU[2] : playersPU[1];
  const maxScore = 5;

  useEffect(() => {
    // const divID = "canvas";
    // const divElement = document.getElementById(divID);
    // if (divElement)
    //   divElement.style.cursor = "none";
    
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

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.repeat)
        return;
      const { key } = event;
      if (key === 'ArrowUp' || key === 'w') {
        console.log(playersPU[1], gameRoomIdPU);
        webSocketManager.getSocket().emit("pressUpPU", {player: playersPU[1], gameRoomIdPU: gameRoomIdPU});
      }
      if (key === 'ArrowDown' || key === 's') {
        webSocketManager.getSocket().emit("pressDownPU", {player: playersPU[1], gameRoomIdPU: gameRoomIdPU});
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.repeat)
        return;
      const { key } = event;

      if (key === 'ArrowUp' || key === 'w') {
        webSocketManager.getSocket().emit("releaseUpPU", {player: playersPU[1], gameRoomIdPU: gameRoomIdPU});
      }
      if (key === 'ArrowDown' || key === 's') {
        webSocketManager.getSocket().emit("releaseDownPU", {player: playersPU[1], gameRoomIdPU: gameRoomIdPU});
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameRoomIdPU, playersPU]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

		function process(value: any) {
      if (value.coward !== null) {
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx!.fillStyle = 'white';
        ctx!.font = "40px serif";
        ctx!.textAlign = "center";
        ctx?.fillText(value.coward + " left the game", 320, 217);
        return ; 
      } else {
        ctx!.fillStyle = 'white';
        ctx!.font = "20px serif";
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);

        setRectPositionP1((prevPosition) => ({ ...prevPosition, y: value.playerY}));
        ctx?.fillRect(rectPositionP1.x, rectPositionP1.y, rectWidth, rectHeight);
        setRectPositionP2((prevPosition) => ({ ...prevPosition, y: value.enemyY}));
        ctx?.fillRect(rectPositionP2.x, rectPositionP2.y, rectWidth, rectHeight);  

        setBallPosition({x: value.ballX, y: value.ballY});
        ctx?.fillRect(ballPosition.x, ballPosition.y, ballWidth, ballWidth);

        ctx!.textAlign = "start";
        ctx?.fillText(player1 + ": " + value.p1Score, 40, 30);
        ctx!.textAlign = "end";
        ctx?.fillText(player2 + ": " + value.p2Score, 600, 30);

        if (value.p1Score === maxScore) {
          endMatch(player1);
        } else if (value.p2Score === maxScore) {
          endMatch(player2);
        }
      }
    }
    webSocketManager.getSocket().on("gamePU" + gameRoomIdPU, process);
		return () => {
			webSocketManager.getSocket().off("gamePU" + gameRoomIdPU, process);
		};
  }, [rectPositionP1, rectPositionP2, ballPosition, gameRoomIdPU, player1, player2]);

  function endMatch(name: string) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    ctx!.fillStyle = 'white';
    ctx!.font = "40px serif";
    ctx!.textAlign = "center";
    ctx?.fillText(name + " Win the game", 320, 217);
  }

  function quitGame(gameRoomIdPU: string) {
    setFoundUserPU(false);
    const name = playersPU[1];
    webSocketManager.getSocket().emit("leaveGamePU" , { gameRoomIdPU, coward:name });
  }

  return (
    <div className='canvas' id='canvas'>
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height}
              style={{ display: 'block'}}/>
      <Button onClick={() => quitGame(gameRoomIdPU)}>Leave game</Button>
    </div>
  );
};
