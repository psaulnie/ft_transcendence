import React, { useState, useEffect, useRef } from 'react';
import './Canvas.css'
import webSocketManager from '../../webSocket';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

export default function Canvas({players, gameRoomId, setFoundUser, canvasName} : {players: {1: string, 2: string}, gameRoomId: string, setFoundUser: any, canvasName: string}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rectPositionP1, setRectPositionP1] = useState<{ x: number; y: number }>({ x: 5, y:  175});
  const [rectPositionP2, setRectPositionP2] = useState<{ x: number; y: number }>({ x: 630, y:  175});
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number }>({ x: 320, y:  212});
  const canvasSize = { width: 640, height: 425 }
  const rectWidth = 5;
  const rectHeight = 75;
  const ballWidth = 10;
  const player1 = players[1] < players[2] ? players[1] : players[2];
  const player2 = players[1] < players[2] ? players[2] : players[1];
  const maxScore = 5;
  const navigate = useNavigate();

  useEffect(() => {
    // const divID = "canvas";
    // const divElement = document.getElementById(divID);
    // if (divElement)
    //   divElement.style.cursor = "none";

    const handleResize = () => {
      let scale = window.innerWidth * 0.00075;

      // console.log(scale);
      if (scale > 1)
        scale = 1;
      if (scale < 0.666 && scale > 0.5)
        scale = 0.666;
      if (scale < 0.5)
        scale = 0.5;
      const gameCanvas = document.querySelector('.' + canvasName) as HTMLElement;
      if (gameCanvas) {
        gameCanvas.style.transform = `scale(${scale})`;
      }
      // console.log("end", scale);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat)
        return;
      const { key } = event;

      if (key === 'ArrowUp' || key === 'w') {
        webSocketManager.getSocket().emit("pressUp", {player: players[1], gameRoomId: gameRoomId});
      }
      if (key === 'ArrowDown' || key === 's') {
        webSocketManager.getSocket().emit("pressDown", {player: players[1], gameRoomId: gameRoomId});
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.repeat)
        return;
      const { key } = event;

      if (key === 'ArrowUp' || key === 'w') {
        webSocketManager.getSocket().emit("releaseUp", {player: players[1], gameRoomId: gameRoomId});
      }
      if (key === 'ArrowDown' || key === 's') {
        webSocketManager.getSocket().emit("releaseDown", {player: players[1], gameRoomId: gameRoomId});
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameRoomId, players]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

		function process(value: any) {
      if (value.coward !== null) {
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx!.fillStyle = 'white';
        ctx!.font = "40px serif";
        ctx!.textAlign = "center";
        ctx?.fillText(value.coward + " left the game", 320, 212);
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
    webSocketManager.getSocket().on("game" + gameRoomId, process);
		return () => {
			webSocketManager.getSocket().off("game" + gameRoomId, process);
		};
  }, [rectPositionP1, rectPositionP2, ballPosition, gameRoomId, player1, player2]);

  function endMatch(name: string) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    ctx!.fillStyle = 'white';
    ctx!.font = "40px serif";
    ctx!.textAlign = "center";
    ctx?.fillText(name + " Win the game", 320, 190);
  }

  function quitGame(gameRoomId: string) {
    setFoundUser(false);
    const name = players[1];
    console.log(name);
    webSocketManager.getSocket().emit("leaveGame" , { gameRoomId, coward:name });
    navigate('/home');
  }
  return (
    <div className={canvasName} id='canvas'>
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height}
              style={{ display: 'block'}}/>
      <Button onClick={() => quitGame(gameRoomId)}>Leave game</Button>
    </div>
  );
};
