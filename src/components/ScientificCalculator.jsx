import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import * as math from "mathjs"; // Import math.js for safer evaluations

const ScientificCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [input1, setInput1] = useState("0");
  const [input2, setInput2] = useState("0");
  const [lastNumber, setLastNumber] = useState(false);
  const [openParentheses, setOpenParentheses] = useState(0);
  const [isDegreeMode, setIsDegreeMode] = useState(true); // Add degree/radian mode state

  const handleNumber = (num) => {
    if (display === "0" && num !== ".") {
      setDisplay(num);
    } else if (num === "." && display.includes(".")) {
      return;
    } else {
      setDisplay(display + num);
    }
    setLastNumber(true);
  };

  const handleOperator = (op) => {
    const operators = ["+", "-", "*", "/", "(", ")", "^", "!"];
    const lastChar = display.slice(-1);

    if (op === "(") {
      setOpenParentheses((prev) => prev + 1);
    } else if (op === ")") {
      if (openParentheses <= 0) return;
      setOpenParentheses((prev) => prev - 1);
    }

    if (operators.includes(lastChar) && operators.includes(op)) {
      if (op === "(" || (lastChar === "(" && op === "-")) {
        setDisplay(display + op);
      } else if (op !== "(") {
        setDisplay(display.slice(0, -1) + op);
      }
    } else {
      if (op === "^") {
        setDisplay(display + "**");
      } else {
        setDisplay(display + op);
      }
    }
    setLastNumber(false);
  };

  const calculateResult = () => {
    try {
      let expression = display;
      for (let i = 0; i < openParentheses; i++) {
        expression += ")";
      }

      // Convert degrees to radians if in degree mode
      if (isDegreeMode) {
        expression = expression.replace(/Math\.(sin|cos|tan)\(/g, (match, func) => {
          return `Math.${func}((Math.PI / 180) * `;
        });
      }

      if (!/^[0-9+\-*/().Math\s]*$/.test(expression)) {
        throw new Error("Invalid characters");
      }

      const result = math.evaluate(expression); // Use math.js for safer evaluation

      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid result");
      }

      setDisplay(Number(result.toFixed(8)).toString());
      setOpenParentheses(0);
    } catch (error) {
      setDisplay("Error");
      setTimeout(() => setDisplay("0"), 1000);
    }
  };

  const clear = () => {
    setDisplay("0");
    setEquation("");
    setOpenParentheses(0);
    setLastNumber(false);
  };

  const plotGraph = () => {
    if (!equation) return;

    const data = [];
    const step = (xMax - xMin) / 100;

    try {
      for (let x = xMin; x <= xMax; x += step) {
        let expr = equation.replace(/x/g, `(${x})`);

        if (isDegreeMode) {
          expr = expr.replace(/Math\.(sin|cos|tan)\(/g, (match, func) => {
            return `Math.${func}((Math.PI / 180) * `;
          });
        }

        if (!/^[0-9+\-*/().Math\s]*$/.test(expr)) {
          throw new Error("Invalid characters in equation");
        }

        const y = math.evaluate(expr); // Use math.js for safer evaluation

        if (!isNaN(y) && isFinite(y)) {
          data.push({ x: x, y: y });
        }
      }
      setGraphData(data);
    } catch (error) {
      setGraphData([]);
      setEquation("Error - Invalid equation");
      setTimeout(() => setEquation(""), 1000);
    }
  };

  const performBooleanOperation = (operation) => {
    try {
      const a = parseInt(input1);
      const b = parseInt(input2);

      if (![0, 1].includes(a) || ![0, 1].includes(b)) {
        throw new Error("Inputs must be 0 or 1");
      }

      const operations = {
        AND: () => a && b,
        OR: () => a || b,
        XOR: () => a ^ b,
        NAND: () => !(a && b),
        NOR: () => !(a || b),
        XNOR: () => (a === b ? 1 : 0),
      };

      if (!(operation in operations)) {
        throw new Error("Invalid operation");
      }

      setDisplay(operations[operation]().toString());
    } catch (error) {
      setDisplay("Error");
      setTimeout(() => setDisplay("0"), 1000);
    }
  };

  const handleScientificOperation = (op) => {
    const operations = {
      sin: "Math.sin(",
      cos: "Math.cos(",
      tan: "Math.tan(",
      sqrt: "Math.sqrt(",
      log: "Math.log10(",
      ln: "Math.log(",
      π: "Math.PI",
      e: "Math.E",
    };

    if (!(op in operations)) return;

    if (display === "0") {
      setDisplay(operations[op]);
    } else if (lastNumber) {
      setDisplay(display + "*" + operations[op]);
    } else {
      setDisplay(display + operations[op]);
    }

    if (operations[op].endsWith("(")) {
      setOpenParentheses((prev) => prev + 1);
    }
    setLastNumber(false);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Advanced Scientific Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="scientific">Scientific</TabsTrigger>
            <TabsTrigger value="graphing">Graphing</TabsTrigger>
            <TabsTrigger value="boolean">Boolean Logic</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <div className="grid gap-2">
              <Input
                value={display}
                readOnly
                className="text-right text-xl p-2"
              />

              <div className="grid grid-cols-4 gap-2">
                {["7", "8", "9", "/"].map((btn) => (
                  <Button key={btn} onClick={() => handleNumber(btn)}>
                    {btn}
                  </Button>
                ))}
                {["4", "5", "6", "*"].map((btn) => (
                  <Button key={btn} onClick={() => handleNumber(btn)}>
                    {btn}
                  </Button>
                ))}
                {["1", "2", "3", "-"].map((btn) => (
                  <Button key={btn} onClick={() => handleNumber(btn)}>
                    {btn}
                  </Button>
                ))}
                {["0", ".", "=", "+"].map((btn) => (
                  <Button
                    key={btn}
                    onClick={
                      btn === "=" ? calculateResult : () => handleNumber(btn)
                    }
                  >
                    {btn}
                  </Button>
                ))}
                <Button onClick={clear} className="col-span-4">
                  Clear
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scientific">
            <div className="grid gap-2">
              <Input value={display} readOnly className="text-right text-xl p-2" />
              
              <div className="grid grid-cols-4 gap-2">
                <Button onClick={() => handleScientificOperation('sin')}>sin</Button>
                <Button onClick={() => handleScientificOperation('cos')}>cos</Button>
                <Button onClick={() => handleScientificOperation('tan')}>tan</Button>
                <Button onClick={() => handleScientificOperation('π')}>π</Button>
                <Button onClick={() => handleScientificOperation('sqrt')}>√</Button>
                <Button onClick={() => handleOperator('^')}>x^n</Button>
                <Button onClick={() => handleScientificOperation('ln')}>ln</Button>
                <Button onClick={() => handleScientificOperation('log')}>log</Button>
                <Button onClick={() => handleScientificOperation('e')}>e</Button>
                <Button onClick={() => handleOperator('!')}>!</Button>
                <Button onClick={() => handleOperator('(')}>(</Button>
                <Button onClick={() => handleOperator(')')}>)</Button>
                <Button onClick={calculateResult} className="col-span-2">=</Button>
                <Button onClick={clear} className="col-span-2">Clear</Button>
                <Button onClick={() => setIsDegreeMode(!isDegreeMode)} className="col-span-4">
                  {isDegreeMode ? "Switch to Radians" : "Switch to Degrees"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="graphing">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Enter equation (use 'x' as variable)"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                />
                <Button onClick={plotGraph}>Plot</Button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Input
                  type="number"
                  value={xMin}
                  onChange={(e) => setXMin(Number(e.target.value))}
                  placeholder="X Min"
                />
                <Input
                  type="number"
                  value={xMax}
                  onChange={(e) => setXMax(Number(e.target.value))}
                  placeholder="X Max"
                />
                <Input
                  type="number"
                  value={yMin}
                  onChange={(e) => setYMin(Number(e.target.value))}
                  placeholder="Y Min"
                />
                <Input
                  type="number"
                  value={yMax}
                  onChange={(e) => setYMax(Number(e.target.value))}
                  placeholder="Y Max"
                />
              </div>

              <div className="w-full h-64">
                <LineChart width={600} height={240} data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis domain={[xMin, xMax]} type="number" dataKey="x" />
                  <YAxis domain={[yMin, yMax]} type="number" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke="#8884d8"
                    dot={false}
                  />
                </LineChart>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="boolean">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  placeholder="Input 1 (0 or 1)"
                />
                <Input
                  type="number"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  placeholder="Input 2 (0 or 1)"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["AND", "OR", "XOR", "NAND", "NOR", "XNOR"].map((op) => (
                  <Button key={op} onClick={() => performBooleanOperation(op)}>
                    {op}
                  </Button>
                ))}
              </div>

              <div className="mt-4">
                <Input value={display} readOnly className="text-right" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScientificCalculator;