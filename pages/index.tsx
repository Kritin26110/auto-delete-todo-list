import { useState, useEffect, useRef } from "react";

type Item = {
  type: "Fruit" | "Vegetable";
  name: string;
};

export default function Home() {
  const [mainList, setMainList] = useState<Item[]>([
    { type: "Fruit", name: "Apple" },
    { type: "Vegetable", name: "Broccoli" },
    { type: "Vegetable", name: "Mushroom" },
    { type: "Fruit", name: "Banana" },
    { type: "Vegetable", name: "Tomato" },
    { type: "Fruit", name: "Orange" },
    { type: "Fruit", name: "Mango" },
    { type: "Fruit", name: "Pineapple" },
    { type: "Vegetable", name: "Cucumber" },
    { type: "Fruit", name: "Watermelon" },
    { type: "Vegetable", name: "Carrot" },
  ]);
  const [fruitList, setFruitList] = useState<Item[]>([]);
  const [vegetableList, setVegetableList] = useState<Item[]>([]);
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});
  useEffect(() => {
    const timer = timersRef.current;
    return () => {
      Object.values(timer).forEach((t) => clearTimeout(t));
    };
  }, []);

  const moveSeparatedByType = (index: number) => {
    const item = mainList[index];
    const newMainList = [...mainList];
    newMainList.splice(index, 1);
    setMainList(newMainList);

    if (item.type === "Fruit") {
      setFruitList([...fruitList, item]);

      const timerKey = `${item.name}-${Date.now()}`;
      timersRef.current[timerKey] = setTimeout(() => {
        setFruitList((currentFruitList) =>
          currentFruitList.filter(
            (fruit) =>
              fruit.name !== item.name ||
              currentFruitList.indexOf(fruit) !==
                currentFruitList.findIndex((f) => f.name === item.name)
          )
        );
        setMainList((currentMainList) => [...currentMainList, item]);
        delete timersRef.current[timerKey];
      }, 5000);
    } else {
      setVegetableList([...vegetableList, item]);

      const timerKey = `${item.name}-${Date.now()}`;
      timersRef.current[timerKey] = setTimeout(() => {
        setVegetableList((currentVegList) =>
          currentVegList.filter(
            (veg) =>
              veg.name !== item.name ||
              currentVegList.indexOf(veg) !==
                currentVegList.findIndex((v) => v.name === item.name)
          )
        );
        setMainList((currentMainList) => [...currentMainList, item]);
        delete timersRef.current[timerKey];
      }, 5000);
    }
  };

  const moveBackToMainList = (item: Item, fromFruit: boolean) => {
    if (fromFruit) {
      setFruitList(
        fruitList.filter(
          (_, idx) =>
            idx !== fruitList.findIndex((fruit) => fruit.name === item.name)
        )
      );
    } else {
      setVegetableList(
        vegetableList.filter(
          (_, idx) =>
            idx !== vegetableList.findIndex((veg) => veg.name === item.name)
        )
      );
    }
    setMainList([...mainList, item]);
    const timerKeys = Object.keys(timersRef.current).filter((key) =>
      key.startsWith(`${item.name}-`)
    );
    timerKeys.forEach((key) => {
      clearTimeout(timersRef.current[key]);
      delete timersRef.current[key];
    });
  };

  const moveLastItemBackToMain = (fromFruit: boolean) => {
    const list = fromFruit ? fruitList : vegetableList;
    if (list.length > 0) {
      const lastItem = list[list.length - 1];
      moveBackToMainList(lastItem, fromFruit);
    }
  };

  return (
    <div className="flex flex-row gap-4 p-4 w-full h-screen box-border">
      <div className="w-4/12 border border-gray-300 rounded-lg overflow-auto">
        <div className="border-b border-gray-300">
          <h2 className="text-xl font-bold text-center p-4">Lists</h2>
        </div>
        <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-grow">
          {mainList.map((item, index) => (
            <button
              key={`main-${item.name}-${index}`}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded text-white transition-colors duration-200"
              onClick={() => moveSeparatedByType(index)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Fruits */}
      <div
        className="w-4/12 border border-gray-300 rounded-lg bg-red-50 overflow-auto"
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            moveLastItemBackToMain(true);
          }
        }}
      >
        <div className="border-b border-black">
          <h2 className="text-xl font-bold text-red-600 text-center p-4">
            Fruits
          </h2>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {fruitList.map((item, index) => (
            <button
              key={`fruit-${item.name}-${index}`}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded text-white"
              onClick={() => moveBackToMainList(item, true)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Vegetables */}
      <div
        className="w-4/12 border border-gray-300 rounded-lg bg-green-50 overflow-auto"
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            moveLastItemBackToMain(false);
          }
        }}
      >
        <div className="border-b border-black">
          <h2 className="text-xl font-bold text-green-600 text-center p-4">
            Vegetables
          </h2>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {vegetableList.map((item, index) => (
            <button
              key={`veg-${item.name}-${index}`}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded text-white"
              onClick={() => moveBackToMainList(item, false)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
