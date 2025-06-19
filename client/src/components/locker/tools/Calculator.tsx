import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator as CalculatorIcon, Trash2, Equal } from "lucide-react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const buttons = [
    { label: "C", onClick: clear, className: "bg-red-500 hover:bg-red-600 text-white" },
    { label: "±", onClick: () => setDisplay(String(-parseFloat(display))), className: "bg-gray-200 hover:bg-gray-300" },
    { label: "%", onClick: () => setDisplay(String(parseFloat(display) / 100)), className: "bg-gray-200 hover:bg-gray-300" },
    { label: "÷", onClick: () => performOperation("÷"), className: "bg-blue-500 hover:bg-blue-600 text-white" },
    
    { label: "7", onClick: () => inputNumber("7"), className: "bg-white hover:bg-gray-50" },
    { label: "8", onClick: () => inputNumber("8"), className: "bg-white hover:bg-gray-50" },
    { label: "9", onClick: () => inputNumber("9"), className: "bg-white hover:bg-gray-50" },
    { label: "×", onClick: () => performOperation("×"), className: "bg-blue-500 hover:bg-blue-600 text-white" },
    
    { label: "4", onClick: () => inputNumber("4"), className: "bg-white hover:bg-gray-50" },
    { label: "5", onClick: () => inputNumber("5"), className: "bg-white hover:bg-gray-50" },
    { label: "6", onClick: () => inputNumber("6"), className: "bg-white hover:bg-gray-50" },
    { label: "-", onClick: () => performOperation("-"), className: "bg-blue-500 hover:bg-blue-600 text-white" },
    
    { label: "1", onClick: () => inputNumber("1"), className: "bg-white hover:bg-gray-50" },
    { label: "2", onClick: () => inputNumber("2"), className: "bg-white hover:bg-gray-50" },
    { label: "3", onClick: () => inputNumber("3"), className: "bg-white hover:bg-gray-50" },
    { label: "+", onClick: () => performOperation("+"), className: "bg-blue-500 hover:bg-blue-600 text-white" },
    
    { label: "0", onClick: () => inputNumber("0"), className: "bg-white hover:bg-gray-50 col-span-2" },
    { label: ".", onClick: inputDecimal, className: "bg-white hover:bg-gray-50" },
    { label: "=", onClick: handleEquals, className: "bg-green-500 hover:bg-green-600 text-white" },
  ];

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalculatorIcon className="h-5 w-5 text-blue-600" />
          Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display */}
        <div className="bg-gray-900 text-white p-4 rounded-lg text-right">
          <div className="text-2xl font-mono overflow-hidden">
            {display}
          </div>
          {operation && previousValue !== null && (
            <div className="text-sm text-gray-400">
              {previousValue} {operation}
            </div>
          )}
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              className={`h-12 text-lg font-semibold ${button.className} ${
                button.label === "0" ? "col-span-2" : ""
              }`}
              variant="outline"
            >
              {button.label}
            </Button>
          ))}
        </div>

        {/* Scientific Functions */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <Button
            onClick={() => setDisplay(String(Math.sqrt(parseFloat(display))))}
            variant="outline"
            className="text-sm bg-purple-100 hover:bg-purple-200"
          >
            √
          </Button>
          <Button
            onClick={() => setDisplay(String(Math.pow(parseFloat(display), 2)))}
            variant="outline"
            className="text-sm bg-purple-100 hover:bg-purple-200"
          >
            x²
          </Button>
          <Button
            onClick={() => setDisplay(String(1 / parseFloat(display)))}
            variant="outline"
            className="text-sm bg-purple-100 hover:bg-purple-200"
          >
            1/x
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}