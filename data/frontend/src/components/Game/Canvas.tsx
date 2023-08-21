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
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 800, height: 500 });
  const rectWidth = 5;
  const rectHeight = 50;
  const [divSize, setDivSize] = useState<{width: number; height: number}>({width:0, height: 0})
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext('2d');
  const [setUp, setSetUp] = useState(false);
  
  useEffect(() => {
    const divID = "Canvas"
    const divElement = document.getElementById(divID);
    if (divElement)
      divElement.style.cursor = "none";
    const divWidth = divElement!.offsetWidth; // Largeur de la div en pixels
    const divHeight = divElement!.offsetHeight; // Hauteur de la div en pixels
    setDivSize({width: divWidth, height: divHeight});
    setRectPositionP1({x:20, y: divHeight / 2});
    setRectPositionP2({x: divHeight - 20, y: divHeight / 2});
    
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = canvas?.parentElement;
      
      if (container) {
        setCanvasSize({ width: container.clientWidth, height: container.clientHeight});
      }
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas?.getBoundingClientRect();
      // const mouseX = event.clientX - rect!.left;
      const mouseY = event.clientY - rect!.top;
      console.log(mouseY);
      console.log(webSocket.connected);
      webSocket.emit("game", {player: players[1], opponent: players[2], y: mouseY});
      setRectPositionP1({x:20, y: mouseY});
    };

    canvas?.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [players]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const animate = () => {
      // if (rectPositionP1.y + rectWidth / 2 < 0 || rectPosition.y + rectWidth / 2 > divSize.height)
      // console.log(rectPosition.y);
      ctx!.fillStyle = 'white';
      ctx?.clearRect(0, 0, canvas!.width / 2, canvas!.height);
      if (setUp.valueOf() == false) {
        ctx?.fillRect(divSize.width - 20 - rectWidth / 2, rectPositionP2.y - rectHeight / 2, rectWidth, rectHeight);
        setSetUp(true);
      }
      ctx?.fillRect(rectPositionP1.x - rectWidth / 2, rectPositionP1.y - rectHeight / 2, rectWidth, rectHeight);
      requestAnimationFrame(animate);
      
    };

    animate();
  }, [rectPositionP1, divSize, rectPositionP2, setUp]);

  useEffect(() => {
      function process(value: any) {    
        console.log(value);
        ctx!.fillStyle = 'white';
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
        setRectPositionP2({x: divSize.width - 20, y: value.mouseY});
        console.log(divSize.width - 20);
        ctx?.fillRect(divSize.width - 20 - rectWidth / 2, rectPositionP2.y - rectHeight / 2, rectWidth, rectHeight);
      
    }

    webSocket.on(players[1], process);
    return () => {
      webSocket.off(players[1], process);
    }
  }, [rectPositionP2, canvas, ctx, divSize, players]);

  return (
    <div className='Canvas' id='Canvas'>
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height}
              style={{ display: 'block'}}/>
    </div>
  );
};
