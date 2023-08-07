import { exit } from 'process';
import React, { useState, useEffect, useRef } from 'react';
// import Canvas from './Canvas';
import './Canvas.css'
import { webSocket } from '../../webSocket';
import { WidthFull } from '@mui/icons-material';
import Matchmaking from './Matchmaking';

// interface InterfaceProps{
//   WidthFrame:string;
//   Heigth:string;
// }

export default function Canvas({opponent}: {opponent: string}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rectPosition, setRectPosition] = useState<{ x: number; y: number }>({ x: 20, y:  0});
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 800, height: 500 });
  const rectWidth = 5;
  const rectHeight = 50;
  const [divSize, setDivSize] = useState<{width: number; height: number}>({width:0, height: 0})
  
  
  useEffect(() => {
    const divID = "Canvas"
    const divElement = document.getElementById(divID);
    if (divElement)
      divElement.style.cursor = "none";
    const divWidth = divElement!.offsetWidth; // Largeur de la div en pixels
    const divHeight = divElement!.offsetHeight; // Hauteur de la div en pixels
    setDivSize({width: divWidth, height: divHeight});
    setRectPosition({x:20, y: divHeight / 2});
  
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
    const ctx = canvas?.getContext('2d');

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas?.getBoundingClientRect();
      // const mouseX = event.clientX - rect!.left;
      const mouseY = event.clientY - rect!.top;
      console.log(mouseY);
      console.log(webSocket.connected);
      webSocket.emit("game", {/*player: '', opponent: '', */y: mouseY});
      setRectPosition({x:20, y: mouseY});
    };

    canvas?.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const animate = () => {
      if (rectPosition.y + rectWidth / 2 < 0 || rectPosition.y + rectWidth / 2 > divSize.height)
        // console.log(rectPosition.y);
        ctx!.fillStyle = 'white';
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx?.fillRect(rectPosition.x - rectWidth / 2, rectPosition.y - rectHeight / 2, rectWidth, rectHeight);
      requestAnimationFrame(animate);
    };

    animate();
  }, [rectPosition]);

  return (
    <div className='Canvas' id='Canvas'>
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height}
              style={{ display: 'block'}}/>
    </div>
  );
};
