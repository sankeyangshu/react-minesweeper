import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import './index.less';

interface blockStateType {
  x: number;
  y: number;
  revealed: boolean; // 是否被揭晓
  bomb?: boolean; // 是否是地雷
  flagged?: boolean; // 是否被标记
  adjacentBombs: number; // 相邻地雷数
}

const Home = () => {
  const WIDTH = 5;
  const HIGHT = 5;

  const [state, setState] = useState(
    Array.from({ length: HIGHT }, (_, y) =>
      Array.from(
        { length: WIDTH },
        (_, x): blockStateType => ({
          x,
          y,
          adjacentBombs: 0,
          revealed: false,
        })
      )
    )
  );

  // 生成地雷
  const generateBombs = (initState: blockStateType) => {
    for (const row of state) {
      for (const block of row) {
        if (Math.abs(initState.x - block.x) <= 1) continue;
        if (Math.abs(initState.y - block.y) <= 1) continue;
        block.adjacentBombs = 0; // 初始化 adjacentBombs 为 0
        block.bomb = Math.random() < 0.2;
      }
    }
    updatNumbers();
  };

  // 方向
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  // 数字颜色
  const numberColors = [
    'text-transparent',
    'text-yellow-500',
    'text-green-500',
    'text-blue-500',
    'text-purple-500',
    'text-pink-500',
    'text-red-500',
    'text-orange-500',
  ];

  // 获取炸弹的方向
  const getSiblings = (block: blockStateType) => {
    return directions
      .map(([dx, dy]) => {
        const x2 = block.x + dx;
        const y2 = block.y + dy;

        // 检查相邻方块是否越界
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HIGHT) return undefined;

        return state[y2][x2];

        // 或者使用下面这种方法检查相邻方块是否越界
        // if (x2 >= 0 && x2 < WIDTH && y2 >= 0 && y2 < HIGHT) {
        //   if (state[y2][x2].bomb) {
        //     block.adjacentBombs += 1;
        //   }
        // }
      })
      .filter(Boolean) as blockStateType[];
  };

  // 更新炸弹周围的数字
  const updatNumbers = () => {
    state.forEach((row) => {
      row.forEach((block) => {
        if (block.bomb) return; // 如果当前方块是地雷，直接跳过计算相邻方块的逻辑

        getSiblings(block).forEach((item) => {
          block.adjacentBombs += item.bomb ? 1 : 0;
        });
      });
    });
  };

  const expendZero = (block: blockStateType) => {
    if (block.adjacentBombs) return;

    getSiblings(block).forEach((item) => {
      if (!item.revealed) {
        item.revealed = true;
        expendZero(item);
      }
    });
  };

  // 判断炸弹是否生成
  const [bombGenerated, setBombGenerated] = useState(false);

  useEffect(() => {
    if (!bombGenerated) {
      const initState = state[0][0];
      generateBombs(initState);
      setBombGenerated(true);
    }
  }, []);

  // 是否是开发模式
  const isDev = false;

  // 右键点击事件
  const onRightClick = (block: blockStateType) => {
    if (block.revealed) return;
    const updatedBlock = { ...block, flagged: !block.flagged };
    setState((prevState) => {
      const updatedState = prevState.map((row) =>
        row.map((item) => (item === block ? updatedBlock : item))
      );
      return updatedState;
    });
    checkGameState();
  };

  const onClickBtn = (block: blockStateType) => {
    // 创建一个新的block对象，将revealed属性设置为true
    const updatedBlock = { ...block, revealed: true };
    setState((prevState) => {
      const updatedState = prevState.map((row) =>
        row.map((item) => (item === block ? updatedBlock : item))
      );
      return updatedState;
    });
    if (updatedBlock.bomb) {
      alert('Game Over');
    }
    expendZero(updatedBlock);
    checkGameState();
  };

  const getBlockClass = (block: blockStateType) => {
    if (block.flagged) {
      return 'bg-gray-500/10';
    }
    if (!block.revealed) {
      return 'bg-gray-500/10 hover:bg-gray-500/20';
    }
    return block.bomb ? 'bg-red-500/50' : numberColors[block.adjacentBombs];
  };

  // 检查是否胜利
  const checkGameState = () => {
    // 判断地雷是否生成
    if (!bombGenerated) return;

    const blocks = state.flat();
    if (blocks.every((item) => item.revealed || (item.flagged && item.bomb))) {
      if (blocks.some((item) => item.flagged && !item.bomb)) {
        alert('You cheat');
      } else {
        alert('You Win');
      }
    }
  };

  return (
    <>
      Minesweepr
      <div className="p5">
        {state.map((row, y) => (
          <div key={y} className="flex justify-center items-center">
            {row.map((item, x) => (
              <button
                key={x}
                className={`w-10 h-10 m0.5 border-gray-400/10 border-1 flex justify-center items-center ${getBlockClass(
                  item
                )}`}
                onClick={() => onClickBtn(item)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  onRightClick(item);
                }}
              >
                {item.flagged ? (
                  <Icon icon="mdi:flag" className="text-red" />
                ) : item.revealed || isDev ? (
                  item.bomb ? (
                    <Icon icon="mdi:mine" />
                  ) : (
                    <div>{item.adjacentBombs}</div>
                  )
                ) : null}
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
