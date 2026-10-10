const escapeRegex = (str = '') => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toList = (value) => {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
};

const toLines = (value) => {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(/\r?\n/)
      .map((v) => v.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean);
  }
  return [];
};

const paginate = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

// "3-5" -> [3, 5], "8+" -> [8, Infinity]
const parseRange = (value) => {
  if (!value) return null;
  const str = String(value).trim();
  if (str.endsWith('+')) {
    const min = Number(str.slice(0, -1));
    return Number.isFinite(min) ? [min, Number.MAX_SAFE_INTEGER] : null;
  }
  const [a, b] = str.split('-').map(Number);
  return Number.isFinite(a) && Number.isFinite(b) ? [a, b] : null;
};

module.exports = { escapeRegex, toList, toLines, paginate, parseRange };
