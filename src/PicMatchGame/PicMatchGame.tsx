import { useCallback, useEffect, useRef, useState } from "react";
import Box from "./components/Box";
import { BoxType } from "./components/Box";
import { comparePairValue, getMinSecFromTimer, shuffleArray } from "./util";

const boxesData = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  value: (i % 6) + 1,
  show: false,
  isMatched: false,
}));

const TIMEOUT_DURATION = 400;
const ONE_SECOND = 1000;
const shuffledBoxes = shuffleArray(boxesData);

const PicMatchGame = () => {
  const [boxes, setBoxes] = useState(shuffledBoxes);
  const [pair, setPair] = useState<BoxType[]>([]);
  const [timer, setTimer] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const intervalId = useRef<number>(0);

  const updateBoxState = (updatedBox: Partial<BoxType>) =>
    setBoxes((boxes) =>
      boxes.map((box) =>
        box.id === updatedBox.id ? { ...box, ...updatedBox } : box
      )
    );

  const addPair = (box: BoxType) => setPair((pair) => pair.concat(box));

  const resetPair = useCallback(() => setPair([]), []);

  const toggleBoxShow = (box: BoxType, value?: boolean) =>
    updateBoxState({ show: value ?? !box.show, id: box.id });

  const toggleBoxMatched = useCallback(
    (box: BoxType, value?: boolean) =>
      updateBoxState({ isMatched: value ?? !box.isMatched, id: box.id }),
    []
  );

  const boxOnClick = (box: BoxType) => {
    if (pair.length < 2) {
      toggleBoxShow(box, true);
      addPair(box);
      setTimeout(() => {
        toggleBoxShow(box, false);
      }, TIMEOUT_DURATION);
    }
  };

  useEffect(() => {
    if (pair.length === 2) {
      const isSame = comparePairValue(pair);
      if (isSame) {
        toggleBoxMatched(pair[0], true);
        toggleBoxMatched(pair[1], true);
        setMatchedPairs((count) => count + 1);
        if (matchedPairs + 1 === 6) {
          clearInterval(intervalId.current);
        }
      }
      resetPair();
    }
  }, [pair, toggleBoxMatched, resetPair, matchedPairs]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer((time) => time + 1);
    }, ONE_SECOND);
    intervalId.current = timerId;
    return () => clearInterval(timerId);
  }, []);

  const { min, sec } = getMinSecFromTimer(timer);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="text-3xl pb-7">
        <strong>timer</strong>(min:sec):- {min}:{sec}, &nbsp; matched pairs:-{" "}
        {matchedPairs}
      </div>
      <div className="w-4/6 h-5/6 flex flex-wrap border-t-4 border-l-4">
        {boxes.map((box) => (
          <Box
            key={box.id}
            box={box}
            onClick={boxOnClick}
            showValue={box.isMatched || box.show}
            disabled={box.isMatched}
          />
        ))}
      </div>
    </div>
  );
};

export default PicMatchGame;
