import React, { useRef, useEffect, useCallback } from "react";
import "./ScrollBox.css";
import { useDraggable } from "react-use-draggable-scroll";

const wordList = [
  "Quirky",
  "Creative",
  "Strong",
  "Nerdy",
  "Open",
  "Cosmic",
  "Playful",
  "Trusted",
  "Invested",
  "Data",
  "Connected",
  "Passionate",
  "Determined",
  "Friendly",
  "Brainy",
  "Green",
  "Serious",
  "Caring",
  "Brave",
];

let firstTimeRun = true;

function findShortestDistance(number, array) {
  let shortestDistance = Infinity;
  let indexOfShortestDistance = -1;

  for (let i = 0; i < array.length; i++) {
    const distance = Math.abs(number - array[i]);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      indexOfShortestDistance = i;
    }
  }

  return indexOfShortestDistance;
}

function denormalize(normalizedVal, min, max) {
  return normalizedVal * (max - min) + min;
}

function normalize(val, min, max, multiplier) {
  const middleValue = (max + min) / 2;
  const normalizedLinear =
    1 - Math.abs(val - middleValue) / Math.abs(max - middleValue);
  return normalizedLinear ** multiplier;
}

const ScrollBox = () => {
  const listWords = wordList.map((word) => (
    <li key={word} className="word">
      {word}
    </li>
  ));

  const ref = useRef();
  const { events } = useDraggable(ref);

  const handleOpacity = useCallback((ele) => {
    for (let i = 0; i < ele.length; i++) {
      const tableChild = ele[i];
      const tableChildPosition = tableChild.getBoundingClientRect().top - 75;
      const normalizedData = normalize(tableChildPosition, -840, 1320, 8);
      tableChild.style.opacity = normalizedData;
    }
  }, []);

  const handleFontSize = useCallback((ele) => {
    for (let i = 0; i < ele.length; i++) {
      const tableChild = ele[i];
      const tableChildPosition = tableChild.getBoundingClientRect().top - 70;
      const normalizedData = normalize(tableChildPosition, -840, 1320, 2);
      tableChild.style.fontSize = denormalize(normalizedData, 0, 4) + "em";
    }
  }, []);

  // The scroll listener
  const handleScroll = useCallback(() => {
    const div = ref.current;
    const children = div.children;
    clearTimeout(div.timer);

    div.timer = setTimeout(() => {
      ScrollToCenter();
    }, 250);

    handleOpacity(children);
    handleFontSize(children);
  }, [handleOpacity, handleFontSize]);

  const ScrollToCenter = useCallback(() => {
    const div = ref.current;

    const childrenPosition = Array.from(
      div.children,
      (tableChild) => tableChild.getBoundingClientRect().top
    );
    const closestIndex = findShortestDistance(300, childrenPosition);

    div.scrollTo({
      top: 90 * closestIndex,
      behavior: "smooth",
    });
    if (div.scrollTop === 90 * closestIndex) {
      // THIS WILL EXECUTE ONCE WHEN POSITION IS CORRECT!
      const selectedElement = div.children[closestIndex];
      // const selectedWord = selectedElement.innerHTML;
      if (firstTimeRun) {
        firstTimeRun = false;
      } else {
        // SEND REQUEST HERE!
        console.log(selectedElement);
      }
      for (let i = 0; i < div.children.length; i++) {
        if (div.children[i] !== selectedElement) {
          div.children[i].classList.remove("selected_word");
        }
      }
      selectedElement.classList.add("selected_word");
    }
  }, []);

  // Attach the scroll listener to the div
  useEffect(() => {
    const div = ref.current;
    div.addEventListener("scroll", handleScroll);
    div.scrollTo({ top: 90 * 9 });
    handleFontSize(div.children);
    handleOpacity(div.children);

    return () => {
      div.removeEventListener("scroll", handleScroll);
      clearTimeout(div.timer);
    };
  }, [handleScroll, handleFontSize, handleOpacity]);

  return (
    <ul ref={ref} {...events} className="list">
      {listWords}
    </ul>
  );
};

export default ScrollBox;
