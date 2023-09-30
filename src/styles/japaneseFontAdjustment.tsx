import { useEffect } from 'react';

const JapaneseFontAdjustment = () => {
  useEffect(() => {
    if (navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0) {
      const bodyElement = document.body;
      (bodyElement.style as any).webkitFontFeatureSettings = '"palt" 1';
      bodyElement.style.fontFeatureSettings = '"palt" 1';
      bodyElement.style.letterSpacing = '.04em';
    }
  }, []);

  return null;  // このコンポーネントは何もレンダリングしません
}

export default JapaneseFontAdjustment
