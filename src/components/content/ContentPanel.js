import React, { useRef, useEffect } from 'react'
import HexGridClass from './HexGrid.js'

const ContentPanel = () => {

   const canvas = useRef(null);

   const ctx = useRef(null);

   const s = (num) => {
      return (canvas.current.width / 200) * num;
   }

   useEffect(() => {

      let context = canvas.current.getContext("2d");
      context.scale(2, 2);
      context.lineCap = 'round';
      context.lineWidth = canvas.current.width * 0.003;
      context.font = `${canvas.current.width * 0.01}px Arial`;
      context.textAlign = 'center';
      context.textBaseline = 'middle'

      ctx.current = context;

      let HexGrid = new HexGridClass(ctx.current, s(1), canvas.current.width, canvas.current.height, "medium", 10, "algorithmic");
      HexGrid.createHexMap();
      HexGrid.drawHexGrid();
      

   }, [canvas])


   const mouseDown = ({nativeEvent}) => {
      const {offsetX, offsetY} = nativeEvent;
      
   }

   const mouseUp = ({nativeEvent}) => {
      const {offsetX, offsetY} = nativeEvent;

   }

   const mouseMove = ({nativeEvent}) => {
      const {offsetX, offsetY} = nativeEvent;

   }

   const mouseEnter = ({nativeEvent}) => {
      const {offsetX, offsetY} = nativeEvent;

   }

   const mouseLeave = ({nativeEvent}) => {
      const {offsetX, offsetY} = nativeEvent;

   }


   return (
      <>
         <canvas
            ref={canvas}
            width={window.innerWidth / 3}
            height={window.innerWidth / 3}
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
            onMouseMove={mouseMove}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            style={
               { width: `${window.innerWidth / 6}px` },
               { height: `${window.innerWidth / 6}px` },
               { border: 'solid 2px black' }
            }
         />
      </>
   )
}

export default ContentPanel
