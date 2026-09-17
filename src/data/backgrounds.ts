export interface BackgroundImage {
  id: string;
  name: string;
  driveId: string;
  localUrl: string;
  fallbackUrl: string;
}

export const BACKGROUND_IMAGES: BackgroundImage[] = [
  {
    id: 'bg-01',
    name: '4e37bf2e4edb9152e51e057ab548a0e7.jpg',
    driveId: '1juDSJ0m3t8RgAq2vmXfsrpceI25Tp43J',
    localUrl: '/backgrounds/bg-01.jpg',
    fallbackUrl: 'https://drive.google.com/thumbnail?id=1juDSJ0m3t8RgAq2vmXfsrpceI25Tp43J&sz=w1920',
  },
  {
    id: 'bg-02',
    name: '7e0342ba6b5082b46b77126c76aed0b8.jpg',
    driveId: '1XNNCpSMbORAy0aSIZzWCVFxEHAN4S6qe',
    localUrl: '/backgrounds/bg-02.jpg',
    fallbackUrl: 'https://drive.google.com/thumbnail?id=1XNNCpSMbORAy0aSIZzWCVFxEHAN4S6qe&sz=w1920',
  },
  {
    id: 'bg-03',
    name: '81e6617e074221bff279ad01e5724664.jpg',
    driveId: '1uJYhrpOE-SuBJJLyWwED1c__Wcil-xzI',
    localUrl: '/backgrounds/bg-03.jpg',
    fallbackUrl: 'https://drive.google.com/thumbnail?id=1uJYhrpOE-SuBJJLyWwED1c__Wcil-xzI&sz=w1920',
  },
  {
    id: 'bg-04',
    name: 'AJKoC4ITyNpRYcGMqQh7.jpg',
    driveId: '1Ak1tsE0ktJ-0t2s-l_XWLC1fyMYTJozp',
    localUrl: '/backgrounds/bg-04.jpg',
    fallbackUrl: 'https://drive.google.com/thumbnail?id=1Ak1tsE0ktJ-0t2s-l_XWLC1fyMYTJozp&sz=w1920',
  },
  {
    id: 'bg-05',
    name: 'c0623c84fa1c32a1bbac49093930f1dc.jpg',
    driveId: '1_npYdshSKx8z0LFxvb_eZo8oimOElXFk',
    localUrl: '/backgrounds/bg-05.jpg',
    fallbackUrl: 'https://drive.google.com/thumbnail?id=1_npYdshSKx8z0LFxvb_eZo8oimOElXFk&sz=w1920',
  },
  {
    id: 'bg-06',
    name: 'captivating-tapestry-hydrangea-blooms.jpg',
    driveId: '1YFxlck8-TZT3x52Sy9qO7qHtystW_SWw',
    localUrl: '/backgrounds/bg-06.jpg',
    fallbackUrl: 'https://drive.google.com/thumbnail?id=1YFxlck8-TZT3x52Sy9qO7qHtystW_SWw&sz=w1920',
  },
  {
    id: 'bg-07',
    name: 'f78201c228217282c79ba257105fe633.jpg',
    driveId: '1Rbqn3ymu7mcXMIk_jQPeyAcVTcsv4rAU',
    localUrl: '/backgrounds/bg-07.jpg',
    fallbackUrl: 'https://drive.google.com/thumbnail?id=1Rbqn3ymu7mcXMIk_jQPeyAcVTcsv4rAU&sz=w1920',
  },
  {
    id: 'bg-08',
    name: 'hydragenas5.jpg',
    driveId: '1BQDVzxYdfdSCWLEK6aeAqN40oXLK40MJ',
    localUrl: '/backgrounds/bg-08.jpg',
    fallbackUrl: 'https://drive.google.com/thumbnail?id=1BQDVzxYdfdSCWLEK6aeAqN40oXLK40MJ&sz=w1920',
  },
  {
    id: 'bg-09',
    name: 'hydrangea-watercolor-art-stockcake.jpg',
    driveId: '1C_PvwLeuzJezDM_Ftu7xZ9MM5-2eM98M',
    localUrl: '/backgrounds/bg-09.jpg',
    fallbackUrl: 'https://drive.google.com/thumbnail?id=1C_PvwLeuzJezDM_Ftu7xZ9MM5-2eM98M&sz=w1920',
  },
  {
    id: 'bg-10',
    name: 'understanding-hydrangea-meaning.jpg',
    driveId: '1OZLtVwHenX2hKu73Ki4UjQ3cxyvswefg',
    localUrl: '/backgrounds/bg-10.jpg',
    fallbackUrl: 'https://drive.google.com/thumbnail?id=1OZLtVwHenX2hKu73Ki4UjQ3cxyvswefg&sz=w1920',
  },
];

export function getRandomBackground(): BackgroundImage {
  const index = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
  return BACKGROUND_IMAGES[index];
}
