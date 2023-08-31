import React, { useState, useEffect, useRef } from 'react';
// import Canvas from './Canvas';
import './Canvas.css'
import { webSocket } from '../../webSocket';
// import { exit } from 'process';
// import { WidthFull } from '@mui/icons-material';
// import Matchmaking from './Matchmaking';
// import { StyledEngineProvider } from '@mui/material';
// import { wait } from '@testing-library/user-event/dist/utils';

// interface InterfaceProps{
//   WidthFrame:string;
//   Heigth:string;
// }

export default function Canvas({players} : {players: {1: string, 2: string}}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rectPositionP1, setRectPositionP1] = useState<{ x: number; y: number }>({ x: 20, y:  0});
  const [rectPositionP2, setRectPositionP2] = useState<{ x: number; y: number }>({ x: 0, y:  0});
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 640, height: 425 });
  const [divSize, setDivSize] = useState<{width: any; height: any}>({width:0, height: 0})
  const [setUp, setSetUp] = useState(false);
  const rectWidth = 5;
  const rectHeight = 50;
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext('2d');
  
  useEffect(() => {
    const divID = "canvas"
    const divElement = document.getElementById(divID);
    if (divElement)
      divElement.style.cursor = "none";
    const divWidth = divElement!.offsetWidth; // Largeur de la div en pixels
    const divHeight = divElement!.offsetHeight; // Hauteur de la div en pixels
    setDivSize({width: divWidth, height: divHeight});

    setRectPositionP1({x:20, y: divHeight / 2});
    setRectPositionP2({x: divHeight - 20, y: divHeight / 2});

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    ctx!.fillStyle = 'white';
    ctx?.fillRect(divWidth - 20 - rectWidth / 2, divHeight / 2 - rectHeight / 2, rectWidth, rectHeight);

    
    const handleResize = () => {
      let scale = 0;

      if (window.innerHeight * 0.0033 >= window.innerWidth * 0.00008) {
        scale = window.innerWidth * 0.00075;
        // console.log("width");
      }
      else {
          scale = window.innerHeight * 0.0033;
          // console.log("Height");
      }
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
    const canvas = canvasRef.current;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas?.getBoundingClientRect();
      // const mouseX = event.clientX - rect!.left;
      const mouseY = event.clientY - rect!.top;
      // console.log(mouseY);
      // console.log(webSocket.connected);
      webSocket.emit("game", {player: players[1], opponent: players[2], y: mouseY});
      setRectPositionP1({x:20, y: mouseY});
    };

    canvas?.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [players]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // a utilier pour KeyDown et utiliser le serv
      // if (event.repeat)
      //   return;
      const { key } = event;
      const speed = 5;

      if (key === 'ArrowUp') {
        setRectPositionP1((prevPosition) => ({ ...prevPosition, y: prevPosition.y - speed }));
      } else if (key === 'ArrowDown') {
        console.log("en bas");
        // setRectPositionP1({x: 20, y: rectPositionP1.y + speed});
        setRectPositionP1((prevPosition) => ({ ...prevPosition, y: prevPosition.y + speed }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const animate = () => {
      ctx!.fillStyle = 'white';
      ctx?.clearRect(0, 0, canvas!.width / 2, canvas!.height);
      ctx?.fillRect(rectPositionP1.x - rectWidth / 2, rectPositionP1.y - rectHeight / 2, rectWidth, rectHeight);
      requestAnimationFrame(animate);
    };

    animate();
  }, [rectPositionP1, divSize]);

  useEffect(() => {
      function process(value: any) {    
        ctx!.fillStyle = 'white';
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
        setRectPositionP2({x: divSize.width - 20, y: value.mouseY});
        ctx?.fillRect(canvasSize.width - 20 - rectWidth / 2, rectPositionP2.y - rectHeight / 2, rectWidth, rectHeight);
      
    }

    webSocket.on(players[1], process);
    return () => {
      webSocket.off(players[1], process);
    }
  }, [rectPositionP2.y, canvas, ctx, canvasSize, players, divSize]);

  return (
    <div className='canvas' id='canvas'>
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height}
              style={{ display: 'block'}}/>
    </div>
  );
};