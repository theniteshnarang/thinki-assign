export interface BoxType {
  id: number;
  value: number;
  show: boolean;
  isMatched: boolean;
}

interface BoxProps {
  box: BoxType;
  onClick: (box: BoxType) => void;
  showValue: boolean;
  disabled?: boolean;
}

const Box = ({ box, onClick, showValue, disabled }: BoxProps) => {
  return (
    <button
      className="border-4 border-t-0 border-l-0 w-[calc(100%/4)] h-[calc(100%/3)] text-8xl flex justify-center items-center"
      onClick={() => onClick(box)}
      disabled={disabled}
    >
      {showValue && box.value}
    </button>
  );
};

export default Box;
