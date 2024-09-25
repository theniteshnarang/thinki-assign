import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "./components/Box";
import { BoxType } from "./components/Box";
import { comparePairValue, getMinSecFromTimer } from "./util";

const boxesData = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  value: (i % 6) + 1,
  show: false,
  isMatched: false,
}));

const TIMEOUT_DURATION = 500;
const ONE_SECOND = 1000;

const PicMatchGame = () => {
  const [boxes, setBoxes] = useState(boxesData);
  const [pair, setPair] = useState<BoxType[]>([]);
  const [timer, setTimer] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const intervalId = useRef(0);

  const updateBoxState = useCallback((updatedBox: Partial<BoxType>) => {
    setBoxes((boxes) =>
      boxes.map((box) =>
        box.id === updatedBox.id ? { ...box, ...updatedBox } : box
      )
    );
  }, []);

  const addPair = useCallback(
    (box: BoxType) => setPair((pair) => pair.concat(box)),
    []
  );

  const resetPair = useCallback(() => setPair([]), []);

  const toggleBoxShow = useCallback(
    (box: BoxType, value?: boolean) =>
      updateBoxState({ show: value ?? !box.show, id: box.id }),
    [updateBoxState]
  );

  const toggleBoxMatched = useCallback(
    (box: BoxType, value?: boolean) =>
      updateBoxState({ isMatched: value ?? !box.isMatched, id: box.id }),
    [updateBoxState]
  );

  const boxOnClick = (box: BoxType) => {
    toggleBoxShow(box, true);
    if (pair.length < 2) {
      addPair(box);
    }
    setTimeout(() => {
      toggleBoxShow(box, false);
    }, TIMEOUT_DURATION);
  };

  useEffect(() => {
    if (pair.length === 2) {
      const isSame = comparePairValue(pair);
      if (isSame) {
        toggleBoxMatched(pair[0], true);
        toggleBoxMatched(pair[1], true);
        setMatchedPairs((count) => count + 1);
      }
      resetPair();
    }
  }, [pair, toggleBoxMatched, resetPair]);

  useEffect(() => {
    const tempId = setInterval(() => {
      setTimer((time) => time + 1);
    }, ONE_SECOND);
    intervalId.current = tempId;
    return () => {
      clearInterval(tempId);
    };
  }, []);

  useEffect(() => {
    if (matchedPairs === 6) {
      clearInterval(intervalId.current);
    }
  }, [matchedPairs]);

  const { min, sec } = useMemo(() => getMinSecFromTimer(timer), [timer]);

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
          />
        ))}
      </div>
    </div>
  );
};

export default PicMatchGame;
