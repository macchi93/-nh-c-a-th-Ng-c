export const TAG_LIST: string[] = [
  'BG',
  'BL',
  'Trai Nga',
  'Trai Nhật',
  'Trai Việt',
  'Dark Romance',
  'Slow Burn',
  'Enemies to Lovers',
  'Green Flag',
  'Slice of life',
  'RomCom',
  'Comedy',
  'Office',
  'BDSM',
  'Taboo',
  'NSFW',
  'SFW',
  'Yandere',
  'Txvt',
  'Gaslight',
  'GL',
  'Open World',
  'Wibu',
];

const BASE_TAG_DESCRIPTIONS: Record<string, string> = {
  'BDSM': 'Sếch bạo, sếch bùng lổ, sếch quằn quại',
  'BG': 'Ngôn tình chụt chụt',
  'BL': 'Đấu kiếm đi các bbi',
  'Comedy': '1001 câu chuyện hề',
  'Dark Romance': 'Bật đèn lên coai, tối cá',
  'Enemies to Lovers': 'Oan gia ngõ hẹp, như chó với mèo',
  'Gaslight': 'Thi túng tâm láo',
  'GL': 'Cắt kéo trên ggai',
  'Green Flag': 'Cờ xanh!!!',
  'NSFW': 'Sếch. Các bbi chưa đủ tuổi thì ra chỗ khác chơi',
  'Office': 'Nô lê tư bản!!!',
  'Open World': 'Thế giới mở',
  'RomCom': 'Nó hề mà nó tình',
  'SFW': 'Lựa chọn cho các bbi muốn chơi theo route Platonic Love (\'chong xáng\', gắn kết tâm hồn)',
  'Slice of life': 'Mỗi ngày thức dậy là 1 niềm zui',
  'Slow Burn': 'Tình cảm phát triển chậm rãi, từng bước thấu hiểu và gắn kết',
  'Taboo': 'Ố xồ ô, cấm kỵ lổ cuần',
  'Trai Nga': 'Gấu Nga thì cũng chỉ là thỏ nâu bigsize mà thôi',
  'Trai Nhật': 'Etou~ suki suki daisuki~',
  'Trai Việt': 'Hàng VN chất lượng cao',
  'Txvt': 'Thanh xuân vườn trường',
  'Wibu': 'Edgy lỏ hoặc bá vl, gacha đi',
  'Yandere': 'Ám ảnh đin cuồng',
};

// Normalize helper to strip '#', spaces, dashes, underscores, and lowercase
function normalizeTagKey(str: string): string {
  return str.replace(/[#\s_-]/g, '').toLowerCase();
}

// Proxy to allow case-insensitive, space-insensitive, and hash-optional lookup
export const TAG_DESCRIPTIONS: Record<string, string> = new Proxy(BASE_TAG_DESCRIPTIONS, {
  get(target, prop: string) {
    if (typeof prop !== 'string') return undefined;
    if (prop in target) return target[prop];
    
    const norm = normalizeTagKey(prop);
    for (const [key, value] of Object.entries(target)) {
      if (normalizeTagKey(key) === norm) {
        return value;
      }
    }
    return undefined;
  }
});


