// utils/cookieParser.ts (Tạo một file helper nhỏ)
export const parseCookies = (cookieString) => {
  if (!cookieString) return {};
  return cookieString.split(';').reduce((res, c) => {
    const [key, val] = c.trim().split('=').map(decodeURIComponent);
    try {
      return Object.assign(res, { [key]: JSON.parse(val) });
    } catch (e) {
      return Object.assign(res, { [key]: val });
    }
  }, {} );
};