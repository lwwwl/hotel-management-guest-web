// 将秒级时间戳转换为可读时间格式
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// 获取当前时间戳（秒级）
export const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};
