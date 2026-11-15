// Day/Night Color Interpolation Helper
// [Color Gradient Interpolation Helper for Smooth Day/Night Transition]
    // =========================================================================
    function lerpHexColor(hexA, hexB, t) {
      const clamped = Math.max(0, Math.min(1, t));
      const a = parseInt(hexA.replace('#', ''), 16);
      const b = parseInt(hexB.replace('#', ''), 16);
      const rA = (a >> 16) & 255, gA = (a >> 8) & 255, bA = a & 255;
      const rB = (b >> 16) & 255, gB = (b >> 8) & 255, bB = b & 255;
      const r = Math.round(rA + (rB - rA) * clamped);
      const g = Math.round(gA + (gB - gA) * clamped);
      const bl = Math.round(bA + (bB - bA) * clamped);
      return `rgb(${r}, ${g}, ${bl})`;
    }

    function getDayNightPalette(nightFactor) {
      const t = Math.max(0, Math.min(1, nightFactor));
      let skyTop, skyMid, skyBot;
      let mountainFill, groundTop, groundBot, craterFill;
      let starOpacity;

      if (t <= 0.2) {
        const u = t / 0.2;
        skyTop = lerpHexColor('#d97757', '#f5a97f', u);
        skyMid = lerpHexColor('#d9917d', '#f7c49f', u);
        skyBot = lerpHexColor('#c86b49', '#e5885c', u);
        mountainFill = lerpHexColor('#8f4e3c', '#d97a50', u);
        groundTop = lerpHexColor('#ad5b3c', '#e58758', u);
        groundBot = lerpHexColor('#783824', '#c9653b', u);
        craterFill = lerpHexColor('#6e311f', '#b85932', u);
        starOpacity = (1 - u) * 0.15;
      } else if (t <= 0.5) {
        skyTop = '#f5a97f';
        skyMid = '#f7c49f';
        skyBot = '#e5885c';
        mountainFill = '#d97a50';
        groundTop = '#e58758';
        groundBot = '#c9653b';
        craterFill = '#b85932';
        starOpacity = 0;
      } else if (t <= 0.75) {
        const u = (t - 0.5) / 0.25;
        skyTop = lerpHexColor('#f5a97f', '#c26d5c', u);
        skyMid = lerpHexColor('#f7c49f', '#8c5368', u);
        skyBot = lerpHexColor('#e5885c', '#a85548', u);
        mountainFill = lerpHexColor('#d97a50', '#7a423b', u);
        groundTop = lerpHexColor('#e58758', '#9e523f', u);
        groundBot = lerpHexColor('#c9653b', '#6b3323', u);
        craterFill = lerpHexColor('#b85932', '#5e2719', u);
        starOpacity = u * 0.5;
      } else if (t <= 0.9) {
        const u = (t - 0.75) / 0.15;
        skyTop = lerpHexColor('#c26d5c', '#141d30', u);
        skyMid = lerpHexColor('#8c5368', '#23304a', u);
        skyBot = lerpHexColor('#a85548', '#3d2522', u);
        mountainFill = lerpHexColor('#7a423b', '#3d2522', u);
        groundTop = lerpHexColor('#6e3a28', '#6e3a28', u);
        groundBot = lerpHexColor('#6b3323', '#3d1e14', u);
        craterFill = lerpHexColor('#5e2719', '#381810', u);
        starOpacity = 0.5 + u * 0.5;
      } else {
        const u = (t - 0.9) / 0.1;
        skyTop = lerpHexColor('#141d30', '#d97757', u);
        skyMid = lerpHexColor('#23304a', '#d9917d', u);
        skyBot = lerpHexColor('#3d2522', '#c86b49', u);
        mountainFill = lerpHexColor('#3d2522', '#8f4e3c', u);
        groundTop = lerpHexColor('#6e3a28', '#ad5b3c', u);
        groundBot = lerpHexColor('#3d1e14', '#783824', u);
        craterFill = lerpHexColor('#381810', '#6e311f', u);
        starOpacity = (1 - u) * 0.85;
      }

      const domeGlassBlue = lerpHexColor('#79b4e3', '#fde047', t > 0.6 ? (t - 0.6) / 0.35 : 0);
      const powerGlassBlue = lerpHexColor('#6898d8', '#facc15', t > 0.6 ? (t - 0.6) / 0.35 : 0);
      const greenhouseGlass = lerpHexColor('#9be082', '#bef264', t > 0.6 ? (t - 0.6) / 0.35 : 0);

      return {
        skyTop,
        skyMid,
        skyBot,
        mountainFill,
        groundTop,
        groundBot,
        craterFill,
        domeGlassBlue,
        powerGlassBlue,
        greenhouseGlass,
        starOpacity,
      };
    }

    // =========================================================================
