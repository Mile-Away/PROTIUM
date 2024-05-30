export function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export const formatTime = (
  time: string | Date,
  format?: string,
  interval?: boolean,
) => {
  const dt = new Date(time);
  // 显示到分钟
  //   if (format === 'YYYY-MM-DD HH:mm') {
  //     return `${dt.getFullYear()}-${
  //       dt.getMonth() + 1
  //     }-${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}`;
  //   }

  if (interval) {
    // 计算时间间隔
    const now = new Date();
    const diff = now.getTime() - dt.getTime();
    const days = Math.floor(diff / (24 * 3600 * 1000));
    const leave1 = diff % (24 * 3600 * 1000);
    const hours = Math.floor(leave1 / (3600 * 1000));
    const leave2 = leave1 % (3600 * 1000);
    const minutes = Math.floor(leave2 / (60 * 1000));
    const leave3 = leave2 % (60 * 1000);
    const seconds = Math.round(leave3 / 1000);
    if (days > 30) {
      return dt.toLocaleDateString([], {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      // ' ' +
      // dt.toLocaleTimeString([], {
      //   hour12: false,
      //   hour: '2-digit',
      //   minute: '2-digit',
      //   second: '2-digit',
      // })
    } else if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else return `${seconds} seconds ago`;
  }

  if (format) {
    // 转化成 January 1，2021 13:00 格式
    if (format === 'long') {
      return dt
        .toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
        .replace('at', '');
    }

    return format
      .replace('YYYY', dt.getFullYear().toString())
      .replace('MM', (dt.getMonth() + 1).toString())
      .replace('DD', dt.getDate().toString())
      .replace('HH', dt.getHours().toString())
      .replace('mm', dt.getMinutes().toString())
      .replace('ss', dt.getSeconds().toString());
  }

  // 默认显示到秒
  return (
    dt.toLocaleDateString([], {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }) +
    ' ' +
    dt.toLocaleTimeString([], {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  );
};
