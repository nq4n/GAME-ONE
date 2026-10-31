// Mars Opportunity 4-Sol Power & Dust Storm Simulator (PZ10-PZ14)
window.MarsOpportunitySim = (function() {
  let currentSol = 1;
  let battery = 600; // Wh (Capacity: 600 Wh)
  let allocated = {
    driving: 120,
    apxs: 80,
    rat: 80,
    heater: 150,
    comms: 120
  };
  let solHistory = [];

  const SOL_DATA = [
    {
      sol: 1,
      title_en: 'Sol 1: Arrival at Meridiani Planum',
      title_ar: 'اليوم 1: الوصول إلى سهل ميريدياني',
      dust_fraction: 0.12,
      solar_clear: 700,
      min_heater: 120,
      description_en: 'Clear Martian sky. Abundant sunlight generating ~616 Wh. Balance science instruments and drive towards Endurance crater.',
      description_ar: 'سماء مريخية صافية وتوليد شمسي وافر (~616 واط/ساعة). وازن بين تشغيل الأجهزة العلمية والتقدم نحو فوهة إندورانس.'
    },
    {
      sol: 2,
      title_en: 'Sol 2: Dust Clouds Rising',
      title_ar: 'اليوم 2: تجمع السحب الغبارية',
      dust_fraction: 0.38,
      solar_clear: 700,
      min_heater: 130,
      description_en: 'Atmospheric opacity increases. Solar generation falls to ~434 Wh. APXS analysis of hematite spheres requires significant power.',
      description_ar: 'ارتفاع عتامة الغلاف الجوي وانخفاض التوليد إلى ~434 واط/ساعة. التحليل الطيفي لكرات الهيماتيت يتطلب طاقة ملحوظة.'
    },
    {
      sol: 3,
      title_en: 'Sol 3: The Gathering Planet-wide Storm',
      title_ar: 'اليوم 3: العاصفة الكوكبية العاتية',
      dust_fraction: 0.70,
      solar_clear: 700,
      min_heater: 150,
      description_en: 'Massive dust storm engulfs the Western Hemisphere. Generation plummets to ~210 Wh. Warning: Heaters must stay above 140 Wh or batteries freeze!',
      description_ar: 'عاصفة ترابية كبرى تجتاح نصف الكوكب. التوليد يهبط إلى ~210 واط/ساعة. تحذير: التدفئة يجب أن لا تقل عن 140 واط لمنع تجمد البطاريات!'
    },
    {
      sol: 4,
      title_en: 'Sol 4: Final Signal at Perseverance Valley',
      title_ar: 'اليوم 4: الإشارة الأخيرة من وادي بيرسيفيرانس',
      dust_fraction: 0.88,
      solar_clear: 700,
      min_heater: 80,
      description_en: 'Dark twilight blankets Mars. Solar generation is only ~84 Wh. Preserve at least 60 Wh to broadcast final telemetry to Earth before sleep.',
      description_ar: 'الظلام يسود المريخ. التوليد الشمسي بالكاد 84 واط/ساعة. احتفظ بـ 60 واط على الأقل لإرسال آخر حزمة بيانات إلى الأرض.'
    }
  ];

  function open() {
    const modal = document.getElementById('marsModal');
    if (!modal) return;
    modal.classList.add('active');
    currentSol = 1;
    battery = 550;
    solHistory = [];
    renderSol();
  }

  function close() {
    const modal = document.getElementById('marsModal');
    if (!modal) return;
    modal.classList.remove('active');
  }

  function calculateSol() {
    const data = SOL_DATA[currentSol - 1];
    const generated = Math.round(data.solar_clear * (1 - data.dust_fraction));
    const totalConsumed = allocated.driving + allocated.apxs + allocated.rat + allocated.heater + allocated.comms;
    const net = generated - totalConsumed;
    const endBattery = Math.max(0, Math.min(600, battery + net));

    return {
      generated,
      totalConsumed,
      net,
      endBattery,
      heaterSafe: allocated.heater >= data.min_heater,
      commsOk: allocated.comms >= 60
    };
  }

  function renderSol() {
    const container = document.getElementById('marsContainer');
    if (!container) return;
    const isAr = document.documentElement.dir === 'rtl';
    const data = SOL_DATA[currentSol - 1];
    const calc = calculateSol();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,114,83,0.3); padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <span style="color: var(--mars-red); font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;">
            ${isAr ? 'محاكاة البقاء وإدارة الطاقة على المريخ' : 'MARS OPPORTUNITY // POWER MANAGEMENT SOL SIM'}
          </span>
          <h2 style="color: #fff; margin-top: 4px;">${isAr ? data.title_ar : data.title_en}</h2>
        </div>
        <button class="btn-chip" id="btnMarsClose">✕ ${isAr ? 'إغلاق' : 'CLOSE'}</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
        <div style="background: rgba(30,15,18,0.8); border: 1px solid rgba(255,114,83,0.3); border-radius: var(--radius-md); padding: 18px;">
          <h4 style="color: var(--gold); margin-bottom: 10px;">${isAr ? 'حالة البيئة والطقس' : 'ENVIRONMENT & SOLAR FLUX'}</h4>
          <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.5; margin-bottom: 14px;">
            ${isAr ? data.description_ar : data.description_en}
          </p>
          <div style="font-size: 13px; color: var(--text-primary); display: flex; flex-direction: column; gap: 6px;">
            <div>${isAr ? 'مستوى حجب الغبار (Dust Tau):' : 'Atmospheric Dust Obscuration:'} <strong style="color: var(--mars-red);">${(data.dust_fraction * 100).toFixed(0)}%</strong></div>
            <div>${isAr ? 'الطاقة الشمسية المتولدة:' : 'Solar Power Generated:'} <strong style="color: var(--cyan);">${calc.generated} Wh</strong></div>
            <div>${isAr ? 'مستوى البطارية الحالي:' : 'Current Battery Level:'} <strong style="color: var(--gold);">${battery} Wh / 600 Wh</strong></div>
          </div>
        </div>

        <div style="background: rgba(30,15,18,0.8); border: 1px solid rgba(255,114,83,0.3); border-radius: var(--radius-md); padding: 18px;">
          <h4 style="color: var(--cyan); margin-bottom: 10px;">${isAr ? 'ميزانية الطاقة المتوقعة' : 'NET SOL PROJECTION'}</h4>
          <div style="margin: 16px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px;">
              <span>${isAr ? 'صافي الطاقة بنهاية اليوم:' : 'End of Sol Battery:'}</span>
              <strong style="color: ${calc.endBattery < 100 ? 'var(--mars-red)' : 'var(--green)'};">${calc.endBattery} Wh</strong>
            </div>
            <div style="height: 10px; background: #261317; border-radius: 5px; overflow: hidden;">
              <div style="height: 100%; width: ${(calc.endBattery / 6).toFixed(0)}%; background: ${calc.endBattery < 100 ? 'var(--mars-red)' : 'var(--cyan)'};"></div>
            </div>
          </div>
          <div style="font-size: 13px; color: ${calc.heaterSafe ? 'var(--green)' : 'var(--mars-red)'}; margin-top: 10px;">
            ${calc.heaterSafe 
              ? (isAr ? '✓ التدفئة كافية لحماية الأجهزة الإلكترونية' : '✓ Internal thermal heaters sufficient')
              : (isAr ? '⚠ خطر: التدفئة منخفضة جداً! قد تتجمد البطاريات' : '⚠ WARNING: Insufficient heating! Electronics at freeze risk')
            }
          </div>
        </div>
      </div>

      <div style="background: rgba(20,10,14,0.7); border: 1px solid rgba(255,114,83,0.25); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px;">
        <h4 style="color: #fff; margin-bottom: 16px;">${isAr ? 'تخصيص الطاقة للأجهزة والمهمات (واط/ساعة)' : 'SUBSYSTEM ENERGY ALLOCATION (Wh)'}</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
              <span>${isAr ? 'محركات الدفع والسير (Driving Wheels):' : 'Drive Wheels Mobility:'}</span>
              <strong style="color: var(--cyan);">${allocated.driving} Wh</strong>
            </label>
            <input type="range" min="0" max="200" step="10" value="${allocated.driving}" data-alloc="driving">
          </div>

          <div>
            <label style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
              <span>${isAr ? 'مطياف أشعة ألفا والجسيمات (APXS):' : 'Alpha Particle Spectrometer (APXS):'}</span>
              <strong style="color: var(--cyan);">${allocated.apxs} Wh</strong>
            </label>
            <input type="range" min="0" max="150" step="10" value="${allocated.apxs}" data-alloc="apxs">
          </div>

          <div>
            <label style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
              <span>${isAr ? 'أداة سحق الصخور وتفتيتها (RAT Tool):' : 'Rock Abrasion Tool (RAT):'}</span>
              <strong style="color: var(--cyan);">${allocated.rat} Wh</strong>
            </label>
            <input type="range" min="0" max="150" step="10" value="${allocated.rat}" data-alloc="rat">
          </div>

          <div>
            <label style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
              <span>${isAr ? 'سخانات التدفئة الحرارية (Survival Heaters):' : 'Thermal Heaters (Survival):'}</span>
              <strong style="color: var(--gold);">${allocated.heater} Wh</strong>
            </label>
            <input type="range" min="40" max="240" step="10" value="${allocated.heater}" data-alloc="heater">
          </div>

          <div style="grid-column: span 2;">
            <label style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
              <span>${isAr ? 'هوائي الاتصال اللاسلكي بالأرض (Deep Space Comms):' : 'Deep Space Network Antenna (Comms):'}</span>
              <strong style="color: var(--cyan);">${allocated.comms} Wh</strong>
            </label>
            <input type="range" min="20" max="180" step="10" value="${allocated.comms}" data-alloc="comms">
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="color: var(--text-muted); font-size: 13px;">${isAr ? `اليوم ${currentSol} من 4` : `Sol ${currentSol} of 4`}</span>
        <button class="btn-primary btn-mars" id="btnExecuteSol">
          ${currentSol < 4 
            ? (isAr ? `تنفيذ قرارات اليوم ${currentSol} والانتقال للتالي →` : `EXECUTE SOL ${currentSol} & ADVANCE →`)
            : (isAr ? 'إرسال الإشارة الأخيرة وفك الشفرة 📡' : 'TRANSMIT FINAL TELEMETRY & CIPHER 📡')
          }
        </button>
      </div>
    `;

    document.getElementById('btnMarsClose').onclick = close;

    container.querySelectorAll('input[data-alloc]').forEach(input => {
      input.oninput = () => {
        allocated[input.dataset.alloc] = Number(input.value);
        renderSol();
      };
    });

    document.getElementById('btnExecuteSol').onclick = () => {
      if (!calc.heaterSafe) {
        alert(isAr 
          ? 'تنبيه حرج! طاقة التدفئة منخفضة جداً عن الحد الأدنى، قد تتجمد بطاريات أوبورتونيتي وتفقد المهمة فوراً. زد طاقة التدفئة (Heater) للمتابعة.' 
          : 'Critical warning! Thermal heater allocation is below safe threshold. Electronics would freeze! Increase heaters to proceed.'
        );
        return;
      }
      if (calc.endBattery <= 20) {
        alert(isAr 
          ? 'نفدت طاقة البطارية تماماً! اضبط استهلاك الأجهزة للحفاظ على شحنة موجبة بنهاية اليوم.' 
          : 'Battery completely drained! Reduce instrument consumption to stay above zero Wh.'
        );
        return;
      }

      battery = calc.endBattery;
      solHistory.push({ sol: currentSol, calc });

      if (currentSol < 4) {
        currentSol++;
        // Set smart default for next sol
        if (currentSol === 3) {
          allocated.driving = 20;
          allocated.rat = 0;
          allocated.apxs = 20;
          allocated.heater = 150;
          allocated.comms = 80;
        } else if (currentSol === 4) {
          allocated.driving = 0;
          allocated.rat = 0;
          allocated.apxs = 0;
          allocated.heater = 80;
          allocated.comms = 60;
        }
        renderSol();
      } else {
        openCipherStage();
      }
    };
  }

  function openCipherStage() {
    const container = document.getElementById('marsContainer');
    if (!container) return;
    const isAr = document.documentElement.dir === 'rtl';

    container.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <span style="font-size: 54px;">📡</span>
        <h2 style="color: var(--mars-red); margin: 12px 0 6px;">${isAr ? 'محطة الاتصال الفضائي العميق: إشارة وادي بيرسيفيرانس' : 'PERSEVERANCE VALLEY: FINAL TRANSMISSION'}</h2>
        <p style="color: var(--text-secondary); max-width: 650px; margin: 0 auto 20px; font-size: 15px; line-height: 1.6;">
          ${isAr 
            ? 'نجحت مركبة أوبورتونيتي في الصمود عبر الأيام الأربعة وحافظت على الاحتياطي الطاقي لإرسال آخر حزمة بيانات علمية. أدخل تردد بث شبكة ناسا (Deep Space Network) الصحيح لفك شفرة الإشارة وتوثيقها في الأرشيف:'
            : 'Opportunity successfully managed its critical power reserves across 4 sols. Enter the correct 3-digit Deep Space Network transmission frequency to decrypt and preserve the archival record:'
          }
        </p>

        <div style="background: rgba(30,15,18,0.85); border: 1px solid rgba(255,114,83,0.3); border-radius: var(--radius-md); padding: 20px; max-width: 480px; margin: 0 auto 24px;">
          <label style="display: block; font-size: 13px; color: var(--gold); margin-bottom: 8px;">
            ${isAr ? 'شفرة التردد المرجعي (Frequency Key):' : 'DSN Channel Key:'}
          </label>
          <div style="display: flex; justify-content: center; gap: 10px;">
            <button class="btn-chip cipher-key" data-val="114">Ch 114 (UHF)</button>
            <button class="btn-chip cipher-key" data-val="511">Ch 511 (X-Band)</button>
            <button class="btn-chip cipher-key" data-val="900">Ch 900 (S-Band)</button>
          </div>
          <div id="cipherResult" style="margin-top: 16px; font-size: 14px; min-height: 24px;"></div>
        </div>

        <button class="btn-primary" id="btnFinishMars" style="display: none;">
          ${isAr ? 'العودة للمنصة وفتح معرض أوبورتونيتي' : 'COMPLETE CHAPTER & ENTER MUSEUM'}
        </button>
      </div>
    `;

    container.querySelectorAll('.cipher-key').forEach(btn => {
      btn.onclick = () => {
        const val = btn.dataset.val;
        const resultElem = document.getElementById('cipherResult');
        const finishBtn = document.getElementById('btnFinishMars');

        if (val === '511') {
          // Correct! Reference to Sol 5111
          resultElem.style.color = 'var(--green)';
          resultElem.innerHTML = `
            <strong>✓ ${isAr ? 'تم فك الشفرة بنجاح!' : 'TELEMETRY DECRYPTED!'}</strong><br>
            <span style="font-size: 13px; color: var(--text-secondary);">
              "${isAr ? 'بطاريتي منخفضة، والظلام يحل' : 'My battery is low and it is getting dark'}" — 10 June 2018 (Sol 5111).
            </span>
          `;
          finishBtn.style.display = 'inline-flex';
          if (window.ExplorerProfile) {
            window.ExplorerProfile.addXp(500, 'Mars Opportunity Sol Simulation Complete');
          }
        } else {
          resultElem.style.color = 'var(--mars-red)';
          resultElem.textContent = isAr 
            ? 'تردد غير مطابق. تذكر أن آخر يوم نشاط تاريخي لأوبورتونيتي كان Sol 5111.' 
            : 'Frequency mismatch. Hint: Opportunity operated up to Sol 5111 on Mars.';
        }
      };
    });

    document.getElementById('btnFinishMars').onclick = () => {
      close();
      if (document.getElementById('museum')) {
        document.getElementById('museum').scrollIntoView({ behavior: 'smooth' });
      }
    };
  }

  return { open, close };
})();
