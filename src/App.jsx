// import { useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// const ScientificCalculator = () => {
//   const [display, setDisplay] = useState('0');
//   const [equation, setEquation] = useState('');
//   const [graphData, setGraphData] = useState([]);
//   const [xMin, setXMin] = useState(-10);
//   const [xMax, setXMax] = useState(10);
//   const [yMin, setYMin] = useState(-10);
//   const [yMax, setYMax] = useState(10);
//   const [input1, setInput1] = useState('0');
//   const [input2, setInput2] = useState('0');

//   // Basic Calculator Functions
//   const handleNumber = (num) => {
//     setDisplay(display === '0' ? num : display + num);
//   };

//   const handleOperator = (op) => {
//     setDisplay(display + op);
//   };

//   const calculateResult = () => {
//     try {
//       setDisplay(eval(display).toString());
//     } catch (error) {
//       setDisplay('Error');
//     }
//   };

//   const clear = () => {
//     setDisplay('0');
//     setEquation('');
//   };

//   // Graphing Functions
//   const plotGraph = () => {
//     const data = [];
//     const step = (xMax - xMin) / 100;
    
//     for (let x = xMin; x <= xMax; x += step) {
//       try {
//         // Replace 'x' in the equation with actual value
//         const expr = equation.replace(/x/g, x);
//         const y = eval(expr);
//         data.push({ x: x, y: y });
//       } catch (error) {
//         continue;
//       }
//     }
//     setGraphData(data);
//   };

//   // Boolean Logic Functions
//   const performBooleanOperation = (operation) => {
//     const a = parseInt(input1);
//     const b = parseInt(input2);
    
//     switch(operation) {
//       case 'AND':
//         return a && b;
//       case 'OR':
//         return a || b;
//       case 'XOR':
//         return a ^ b;
//       case 'NAND':
//         return !(a && b);
//       case 'NOR':
//         return !(a || b);
//       case 'XNOR':
//         return !(a ^ b);
//       default:
//         return 0;
//     }
//   };

//   return (
//     <Card className="w-full max-w-4xl">
//       <CardHeader>
//         <CardTitle>Advanced Scientific Calculator</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Tabs defaultValue="basic">
//           <TabsList>
//             <TabsTrigger value="basic">Basic</TabsTrigger>
//             <TabsTrigger value="scientific">Scientific</TabsTrigger>
//             <TabsTrigger value="graphing">Graphing</TabsTrigger>
//             <TabsTrigger value="boolean">Boolean Logic</TabsTrigger>
//           </TabsList>

//           <TabsContent value="basic">
//             <div className="grid gap-2">
//               <Input value={display} readOnly className="text-right text-xl p-2" />
              
//               <div className="grid grid-cols-4 gap-2">
//                 {['7', '8', '9', '/'].map(btn => (
//                   <Button key={btn} onClick={() => handleOperator(btn)}>{btn}</Button>
//                 ))}
//                 {['4', '5', '6', '*'].map(btn => (
//                   <Button key={btn} onClick={() => handleOperator(btn)}>{btn}</Button>
//                 ))}
//                 {['1', '2', '3', '-'].map(btn => (
//                   <Button key={btn} onClick={() => handleOperator(btn)}>{btn}</Button>
//                 ))}
//                 {['0', '.', '=', '+'].map(btn => (
//                   <Button key={btn} onClick={btn === '=' ? calculateResult : () => handleOperator(btn)}>{btn}</Button>
//                 ))}
//                 <Button onClick={clear} className="col-span-4">Clear</Button>
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="scientific">
//             <div className="grid gap-2">
//               <div className="grid grid-cols-4 gap-2">
//                 <Button onClick={() => handleOperator('Math.sin(')}>sin</Button>
//                 <Button onClick={() => handleOperator('Math.cos(')}>cos</Button>
//                 <Button onClick={() => handleOperator('Math.tan(')}>tan</Button>
//                 <Button onClick={() => handleOperator('Math.PI')}>π</Button>
//                 <Button onClick={() => handleOperator('Math.sqrt(')}>√</Button>
//                 <Button onClick={() => handleOperator('Math.pow(')}>x^n</Button>
//                 <Button onClick={() => handleOperator('Math.log(')}>ln</Button>
//                 <Button onClick={() => handleOperator('Math.log10(')}>log</Button>
//                 <Button onClick={() => handleOperator('Math.E')}>e</Button>
//                 <Button onClick={() => handleOperator('!')}>!</Button>
//                 <Button onClick={() => handleOperator('(')}>(</Button>
//                 <Button onClick={() => handleOperator(')')}>)</Button>
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="graphing">
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <Input 
//                   placeholder="Enter equation (use 'x' as variable)" 
//                   value={equation}
//                   onChange={(e) => setEquation(e.target.value)}
//                 />
//                 <Button onClick={plotGraph}>Plot</Button>
//               </div>
              
//               <div className="grid grid-cols-4 gap-2">
//                 <Input 
//                   type="number" 
//                   value={xMin}
//                   onChange={(e) => setXMin(Number(e.target.value))}
//                   placeholder="X Min"
//                 />
//                 <Input 
//                   type="number" 
//                   value={xMax}
//                   onChange={(e) => setXMax(Number(e.target.value))}
//                   placeholder="X Max"
//                 />
//                 <Input 
//                   type="number" 
//                   value={yMin}
//                   onChange={(e) => setYMin(Number(e.target.value))}
//                   placeholder="Y Min"
//                 />
//                 <Input 
//                   type="number" 
//                   value={yMax}
//                   onChange={(e) => setYMax(Number(e.target.value))}
//                   placeholder="Y Max"
//                 />
//               </div>

//               <div className="w-full h-64">
//                 <LineChart width={600} height={240} data={graphData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis 
//                     domain={[xMin, xMax]} 
//                     type="number" 
//                     dataKey="x" 
//                   />
//                   <YAxis 
//                     domain={[yMin, yMax]} 
//                     type="number" 
//                   />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
//                 </LineChart>
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="boolean">
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <Input 
//                   type="number" 
//                   value={input1}
//                   onChange={(e) => setInput1(e.target.value)}
//                   placeholder="Input 1 (0 or 1)"
//                 />
//                 <Input 
//                   type="number" 
//                   value={input2}
//                   onChange={(e) => setInput2(e.target.value)}
//                   placeholder="Input 2 (0 or 1)"
//                 />
//               </div>
              
//               <div className="grid grid-cols-3 gap-2">
//                 {['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'].map(op => (
//                   <Button 
//                     key={op}
//                     onClick={() => setDisplay(performBooleanOperation(op).toString())}
//                   >
//                     {op}
//                   </Button>
//                 ))}
//               </div>
              
//               <div className="mt-4">
//                 <Input value={display} readOnly className="text-right" />
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   );
// };

// export default ScientificCalculator;



import ScientificCalculator from './components/ScientificCalculator'

function App() {
  return (
    <div className="min-h-screen p-8">
      <ScientificCalculator />
    </div>
  )
}

export default App