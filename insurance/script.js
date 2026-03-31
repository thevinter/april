/* ============================================
   PuggersInsurance.com — Shared JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Mobile Nav Toggle ---
  var toggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.main-nav ul');
  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      navList.classList.toggle('open');
      toggle.textContent = navList.classList.contains('open') ? '✕' : '☰';
    });
  }

  // --- Active nav link highlighting ---
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Claims Status Checker ---
  var statusBtn = document.getElementById('check-status-btn');
  var statusBox = document.getElementById('status-result');
  if (statusBtn && statusBox) {
    statusBtn.addEventListener('click', function () {
      var claimId = document.getElementById('claim-id-input').value.trim();
      if (!claimId) {
        alert('Please enter a Claim ID. (Hint: try any number!)');
        return;
      }

      var statuses = [
        { status: 'Pending Review', tag: 'status-pending', note: 'Your claim is in the queue. Estimated wait: 3-5 business dungeons.' },
        { status: 'Under Investigation', tag: 'status-processing', note: 'An adjuster is reviewing your combat logs. Please do not delete your Warcraft Logs.' },
        { status: 'Approved — Payout Pending', tag: 'status-approved', note: 'Your claim has been approved! Key restoration will occur within 1-2 weekly resets.' },
        { status: 'Denied — Pre-Existing Condition', tag: 'status-denied', note: 'Records show this key was already depleted prior to coverage start date.' },
        { status: 'Approved — Partial Coverage', tag: 'status-approved', note: 'Approved for 60% payout. Deductible applied for "healer was in a BG queue" modifier.' },
        { status: 'Escalated to Senior Adjuster', tag: 'status-processing', note: 'Your case involves a rare "tank pulled boss during RP" scenario. Specialist required.' },
        { status: 'Denied — Act of Blizzard', tag: 'status-denied', note: 'Server crash during your key is classified as an Act of Blizzard and is excluded under Section 7.1.' },
        { status: 'Pending — Awaiting Evidence', tag: 'status-pending', note: 'Please submit your Raider.IO screenshot and Details! damage meters as supporting documentation.' },
      ];

      // Use claim ID to seed a deterministic-ish pick
      var seed = 0;
      for (var i = 0; i < claimId.length; i++) {
        seed += claimId.charCodeAt(i);
      }
      var pick = statuses[seed % statuses.length];

      statusBox.classList.add('visible');
      statusBox.innerHTML =
        '<div class="status-line"><span><strong>Claim ID:</strong> PUG-' + claimId.toUpperCase() + '</span></div>' +
        '<div class="status-line"><span><strong>Status:</strong></span> <span class="status-tag ' + pick.tag + '">' + pick.status + '</span></div>' +
        '<div class="status-line"><span><strong>Filed:</strong> ' + getRandomPastDate() + '</span></div>' +
        '<div class="status-line"><span><strong>Note:</strong> ' + pick.note + '</span></div>';
    });
  }

  function getRandomPastDate() {
    var d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 30 + 2));
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  // --- Premium Calculator ---
  var calcBtn = document.getElementById('calc-btn');
  if (calcBtn) {
    calcBtn.addEventListener('click', calculatePremium);
  }

  function calculatePremium() {
    var keyLevel = parseInt(document.getElementById('key-level').value) || 10;
    var tank = document.getElementById('tank-spec').value;
    var healer = document.getElementById('healer-spec').value;
    var dps1 = document.getElementById('dps1-spec').value;
    var dps2 = document.getElementById('dps2-spec').value;
    var dps3 = document.getElementById('dps3-spec').value;
    var timeOfDay = document.getElementById('time-of-day').value;
    var dayOfWeek = document.getElementById('day-of-week').value;
    var dungeon = document.getElementById('dungeon').value;

    // --- Base rate ---
    var baseRate = 4.99;

    // --- Key level scaling (exponential for high keys) ---
    var keyMultiplier;
    if (keyLevel <= 5) keyMultiplier = 1.0;
    else if (keyLevel <= 10) keyMultiplier = 1.5;
    else if (keyLevel <= 15) keyMultiplier = 2.5;
    else if (keyLevel <= 20) keyMultiplier = 4.0;
    else if (keyLevel <= 25) keyMultiplier = 7.5;
    else keyMultiplier = 15.0;

    // --- Group comp risk ---
    var specs = [tank, healer, dps1, dps2, dps3];
    var meleeCount = 0;
    var meleeSpecs = ['warrior-arms', 'warrior-fury', 'paladin-ret', 'dk-frost', 'dk-unholy', 'demon-hunter-havoc', 'monk-ww', 'rogue-any', 'shaman-enh', 'druid-feral', 'evoker-aug'];
    var hasBL = false;
    var blClasses = ['shaman-enh', 'shaman-ele', 'shaman-resto', 'mage-any', 'evoker-dev', 'evoker-aug', 'evoker-pres', 'hunter-any'];

    specs.forEach(function (s) {
      if (meleeSpecs.indexOf(s) !== -1) meleeCount++;
      if (blClasses.indexOf(s) !== -1) hasBL = true;
    });

    var compMultiplier = 1.0;
    var compNotes = [];

    if (meleeCount >= 3) {
      compMultiplier += 0.8;
      compNotes.push('3+ melee surcharge (+80%)');
    } else if (meleeCount >= 2) {
      compMultiplier += 0.25;
      compNotes.push('Double melee surcharge (+25%)');
    }

    if (!hasBL) {
      compMultiplier += 1.2;
      compNotes.push('No Bloodlust/Heroism (+120%)');
    }

    // Check for no battle rez
    var hasBRez = false;
    var brezClasses = ['dk-frost', 'dk-unholy', 'dk-blood', 'druid-feral', 'druid-balance', 'druid-resto', 'druid-guardian', 'warlock-any'];
    specs.forEach(function (s) {
      if (brezClasses.indexOf(s) !== -1) hasBRez = true;
    });
    if (!hasBRez) {
      compMultiplier += 0.5;
      compNotes.push('No Battle Rez (+50%)');
    }

    // Tank risk
    var tankRisks = {
      'warrior-prot': 0, 'paladin-prot': -0.1, 'dk-blood': 0.05,
      'demon-hunter-veng': 0.15, 'monk-brew': 0.1, 'druid-guardian': 0.2
    };
    var tankAdj = tankRisks[tank] || 0;
    if (tankAdj > 0) compNotes.push('Tank risk adj. (+' + Math.round(tankAdj * 100) + '%)');
    if (tankAdj < 0) compNotes.push('Tank reliability discount (' + Math.round(tankAdj * 100) + '%)');
    compMultiplier += tankAdj;

    // Healer risk
    var healerRisks = {
      'priest-disc': 0.3, 'priest-holy': 0, 'paladin-holy': -0.1,
      'shaman-resto': -0.05, 'druid-resto': -0.05, 'monk-mw': 0.15,
      'evoker-pres': 0.1
    };
    var healerAdj = healerRisks[healer] || 0;
    if (healerAdj > 0) compNotes.push('Healer risk adj. (+' + Math.round(healerAdj * 100) + '%)');
    if (healerAdj < 0) compNotes.push('Healer reliability discount (' + Math.round(healerAdj * 100) + '%)');
    compMultiplier += healerAdj;

    // --- Time of day ---
    var timeMultiplier = 1.0;
    var timeNotes = [];
    var timeFactors = {
      'morning': { mult: 0.85, note: 'Morning discount (-15%)' },
      'afternoon': { mult: 1.0, note: '' },
      'evening': { mult: 1.15, note: 'Peak hours surcharge (+15%)' },
      'late-night': { mult: 1.45, note: 'Late night risk premium (+45%)' },
      'after-midnight': { mult: 1.8, note: '"Nothing good happens after midnight" premium (+80%)' }
    };
    if (timeFactors[timeOfDay]) {
      timeMultiplier = timeFactors[timeOfDay].mult;
      if (timeFactors[timeOfDay].note) timeNotes.push(timeFactors[timeOfDay].note);
    }

    // --- Day of week ---
    var dayMultiplier = 1.0;
    var dayNotes = [];
    var dayFactors = {
      'monday': { mult: 1.0, note: '' },
      'tuesday': { mult: 1.6, note: 'Reset Day surcharge (+60%)' },
      'wednesday': { mult: 1.2, note: 'Post-reset hangover (+20%)' },
      'thursday': { mult: 1.0, note: '' },
      'friday': { mult: 1.1, note: 'Weekend warriors incoming (+10%)' },
      'saturday': { mult: 1.3, note: 'Weekend PUG chaos (+30%)' },
      'sunday': { mult: 1.35, note: '"Last chance vault keys" desperation (+35%)' }
    };
    if (dayFactors[dayOfWeek]) {
      dayMultiplier = dayFactors[dayOfWeek].mult;
      if (dayFactors[dayOfWeek].note) dayNotes.push(dayFactors[dayOfWeek].note);
    }

    // --- Dungeon ---
    var dungeonMultiplier = 1.0;
    var dungeonNotes = [];
    var dungeonFactors = {
      'siege': { mult: 1.4, note: 'Siege of Boralus: routing nightmare (+40%)' },
      'sanguine': { mult: 1.1, note: '' },
      'mists': { mult: 0.9, note: 'Mists: straightforward discount (-10%)' },
      'mechagon-junkyard': { mult: 1.5, note: 'Mechagon Junkyard: nobody knows the route (+50%)' },
      'mechagon-workshop': { mult: 1.3, note: 'Mechagon Workshop: robot hazard (+30%)' },
      'necrotic-wake': { mult: 1.15, note: 'Necrotic Wake: spear disputes (+15%)' },
      'stonevault': { mult: 1.2, note: 'Stonevault: wipe-prone trash (+20%)' },
      'grim-batol': { mult: 1.35, note: 'Grim Batol: dragon breath incidents (+35%)' },
      'city-of-threads': { mult: 1.0, note: '' },
      'dawnbreaker': { mult: 1.25, note: 'Dawnbreaker: airship phase chaos (+25%)' },
      'ara-kara': { mult: 1.1, note: '' },
      'random': { mult: 1.6, note: '"Random dungeon" liability maximum (+60%)' }
    };
    if (dungeonFactors[dungeon]) {
      dungeonMultiplier = dungeonFactors[dungeon].mult;
      if (dungeonFactors[dungeon].note) dungeonNotes.push(dungeonFactors[dungeon].note);
    }

    // --- Calculate final ---
    var subtotal = baseRate * keyMultiplier;
    var afterComp = subtotal * compMultiplier;
    var afterTime = afterComp * timeMultiplier;
    var afterDay = afterTime * dayMultiplier;
    var finalRate = afterDay * dungeonMultiplier;

    // Clamp
    finalRate = Math.max(finalRate, 2.99);
    finalRate = Math.min(finalRate, 9999.99);

    // --- Render ---
    var resultBox = document.getElementById('calc-result');
    if (!resultBox) return;

    var breakdownHTML = '';
    breakdownHTML += buildLine('Base Rate', '$' + baseRate.toFixed(2));
    breakdownHTML += buildLine('Key Level (' + keyLevel + ') Multiplier', '×' + keyMultiplier.toFixed(1));
    breakdownHTML += buildLine('Subtotal', '$' + subtotal.toFixed(2));

    compNotes.forEach(function (n) { breakdownHTML += buildLine(n, ''); });
    breakdownHTML += buildLine('Group Comp Multiplier', '×' + compMultiplier.toFixed(2));

    timeNotes.forEach(function (n) { breakdownHTML += buildLine(n, ''); });
    if (timeMultiplier !== 1.0) breakdownHTML += buildLine('Time Multiplier', '×' + timeMultiplier.toFixed(2));

    dayNotes.forEach(function (n) { breakdownHTML += buildLine(n, ''); });
    if (dayMultiplier !== 1.0) breakdownHTML += buildLine('Day Multiplier', '×' + dayMultiplier.toFixed(2));

    dungeonNotes.forEach(function (n) { breakdownHTML += buildLine(n, ''); });
    if (dungeonMultiplier !== 1.0) breakdownHTML += buildLine('Dungeon Multiplier', '×' + dungeonMultiplier.toFixed(2));

    breakdownHTML += '<div class="calc-breakdown-item total"><span class="label">Monthly Premium</span><span class="value">$' + finalRate.toFixed(2) + '/mo</span></div>';

    resultBox.innerHTML =
      '<div class="price-label">Your Estimated Monthly Premium</div>' +
      '<div class="price">$' + finalRate.toFixed(2) + '</div>' +
      '<div class="price-label">per month &bull; billed in gold equivalent</div>' +
      '<div class="calc-breakdown">' + breakdownHTML + '</div>' +
      '<p style="margin-top:18px;font-size:0.8em;color:rgba(255,255,255,0.45);">* Rates subject to change. Not a binding quote. See <a href="terms.html" style="color:var(--gold-light)">Terms &amp; Conditions</a> for exclusions. Acts of Blizzard not covered.</p>';
    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Also compute a risk rating
    var riskScore = keyMultiplier * compMultiplier * timeMultiplier * dayMultiplier * dungeonMultiplier;
    var riskRating, riskClass;
    if (riskScore < 3) { riskRating = 'Low'; riskClass = 'risk-low'; }
    else if (riskScore < 8) { riskRating = 'Moderate'; riskClass = 'risk-moderate'; }
    else if (riskScore < 20) { riskRating = 'High'; riskClass = 'risk-high'; }
    else if (riskScore < 50) { riskRating = 'Extreme'; riskClass = 'risk-extreme'; }
    else { riskRating = 'Catastrophic'; riskClass = 'risk-catastrophic'; }

    var riskEl = document.getElementById('risk-rating-display');
    if (riskEl) {
      riskEl.innerHTML = 'Overall Risk Assessment: <span class="risk-badge ' + riskClass + '">' + riskRating + '</span>';
      riskEl.style.display = 'block';
    }
  }

  function buildLine(label, value) {
    return '<div class="calc-breakdown-item"><span class="label">' + label + '</span><span class="value">' + value + '</span></div>';
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
