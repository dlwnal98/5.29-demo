// 미니 도넛 차트 컴포넌트
export const MiniDonutChart = ({
  data,
  size = 60,
}: {
  data: any[];
  size?: number;
}) => {
  const radius = size / 2 - 5;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercentage = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
          className="dark:stroke-gray-700"
        />
        {data.map((item, index) => {
          const strokeDasharray = `${
            (item.percentage / 100) * circumference
          } ${circumference}`;
          const strokeDashoffset =
            (-cumulativePercentage * circumference) / 100;
          cumulativePercentage += item.percentage;

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="4"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
          {data.reduce((sum, item) => sum + item.value, 0)}
        </span>
      </div>
    </div>
  );
};

// 미니 바 차트 컴포넌트
export const MiniBarChart = ({
  data,
  width = 60,
  height = 40,
}: {
  data: any[];
  width?: number;
  height?: number;
}) => {
  const maxValue = Math.max(...data.map((item) => item.value));
  const barWidth = width / data.length - 2;

  return (
    <div
      className="flex items-end justify-center gap-1"
      style={{ width, height }}
    >
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * height;
        return (
          <div
            key={index}
            className="rounded-t transition-all duration-300 hover:opacity-80"
            style={{
              width: barWidth,
              height: barHeight,
              backgroundColor: item.color,
            }}
          />
        );
      })}
    </div>
  );
};
