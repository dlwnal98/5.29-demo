// mock/systemInfo.ts
export const mockSystemInfo = {
  cpu: {
    brand: "11th Gen Intel(R) Core(TM) i5-1135G7 @ 2.40GHz",
    usage: 23,
    speed: 2.51,
    baseSpeed: 2.42,
    cores: 4,
    threads: 8,
    processes: 271,
    threadsTotal: 3499,
    handles: 118629,
  },
  memory: {
    used: 11.2,
    total: 15.7,
    usagePercent: 71,
  },
  disk: {
    name: "C:",
    type: "SSD (NVMe)",
    usagePercent: 4,
  },
  network: {
    name: "Wi-Fi",
    sent: 0,
    received: 0,
  },
  gpu: {
    name: "Intel(R) Iris(R) Xe Graphics",
    usagePercent: 0,
  },
  uptime: "5:05:17:00", // 일:시간:분:초
};
