import React, { useState, useRef, useEffect } from 'react'
import HexGridClass from './HexGrid.js'
import { Row, Form, Button } from 'react-bootstrap'

import diceSheet from './diceSheet.png';

const ContentPanel = () => {

   const canvas = useRef(null);
   const canvas2 = useRef(null);

   const ctx = useRef(null);
   const ctx2 = useRef(null);

   const [numberOfPlayers, setNumberOfPlayers] = useState(10);
   const [mapSize, setMapSize] = useState("large");
   const [mapGeneration, setMapGeneration] = useState("none");

   const [hexGrid, setHexGrid] = useState(null);

   const updateMap = (e) => {
      e.preventDefault();

      hexGrid.clear();
      let hexGrid_ = new HexGridClass(ctx.current, ctx2.current, s(1), canvas.current.width, canvas.current.height, canvas2.current.width, canvas2.current.height, mapSize, numberOfPlayers, mapGeneration);

      setHexGrid(hexGrid_);

   }

   const s = (num) => {
      return (canvas.current.width / 200) * num;
   }

   useEffect(() => {

      let context = canvas.current.getContext("2d");
      context.lineCap = 'round';
      context.lineWidth = canvas.current.width * 0.0045;

      let context2 = canvas2.current.getContext("2d");
      context2.textAlign = 'center';
      context2.textBaseline = 'middle'
      context2.fillStyle = 'black'

      ctx.current = context;
      ctx2.current = context2;

      let hexGrid_ = new HexGridClass(ctx.current, ctx2.current, s(1), canvas.current.width, canvas.current.height, canvas2.current.width, canvas2.current.height, mapSize, numberOfPlayers, mapGeneration);

      setHexGrid(hexGrid_);

   }, [canvas])

   useEffect(() => {
      if (hexGrid == null) return;
      if (hexGrid.loaded == false) {
         hexGrid.createHexMap();
         return
      }

      hexGrid.drawHexGrid();

   }, [hexGrid])


   const mouseDown = ({ nativeEvent }) => {
      const { offsetX, offsetY } = nativeEvent;

      hexGrid.click(offsetX, offsetY);

   }

   const mouseDown2 = ({ nativeEvent }) => {
      const { offsetX, offsetY } = nativeEvent;

      hexGrid.click2(offsetX, offsetY);

   }


   return (
      <>
         <Row className='py-2'>
            <canvas
               ref={canvas}
               width={window.innerWidth / 3}
               height={window.innerWidth / 3}
               onMouseDown={mouseDown}
               style={
                  { imageRendering: 'crisp-edges' }
               }
               className="mx-auto border"
            />
         </Row>

         <Row className='py-2'>
            <canvas
               ref={canvas2}
               width={window.innerWidth / 3}
               height={window.innerWidth / 11}
               onMouseDown={mouseDown2}
               style={
                  { imageRendering: 'crisp-edges' }
               }
               className="mx-auto border"
            />
         </Row>

         <Form className='mt-5 mb-5 border w-50 mx-auto' onSubmit={updateMap}>

            <Form.Group className='my-4 d-flex justify-content-center'>
               <Form.Label className='my-auto mx-1 w-25 text-right'>Number of Players</Form.Label>
               <Form.Control as="select" className='my-auto mx-1 w-25' value={numberOfPlayers} onChange={(e) => setNumberOfPlayers(e.target.value)}>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                  <option value={10}>10</option>
               </Form.Control>
            </Form.Group>

            <Form.Group className='my-4 d-flex justify-content-center'>
               <Form.Label className='my-auto mx-1 w-25 text-right'>Map Size</Form.Label>
               <Form.Control as="select" className='my-auto mx-1 w-25' value={mapSize} onChange={(e) => setMapSize(e.target.value)}>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
               </Form.Control>
            </Form.Group>

            <Form.Group className='my-4 d-flex justify-content-center'>
               <Form.Label className='my-auto mx-1 w-25 text-right'>Map Generation</Form.Label>
               <Form.Control as="select" className='my-auto mx-1 w-25' value={mapGeneration} onChange={(e) => setMapGeneration(e.target.value)}>
                  <option value="algorithmic">Algorithmic</option>
                  <option value="noise">Noise</option>
                  <option value="none">None</option>
               </Form.Control>
            </Form.Group>

            <Form.Group className='d-flex justify-content-center'>
               <Button className='m-1' type="submit">Generate new map</Button>
            </Form.Group>

         </Form>
      </>
   )
}

export default ContentPanel
