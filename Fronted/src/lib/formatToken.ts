function formatToken(token: string): string {
    if (token.length <= 8) {
      return token; // 如果 token 长度小于或等于 8，返回原始 token
    }
    const start = token.slice(0, 4);
    const end = token.slice(-4);
    return `${start}****${end}`;
  }

export default formatToken;