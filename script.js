const SUPABASE_URL = "https://vbketjnmxosrrsccvgxt.supabase.co";
const SUPABASE_KEY = "sb_publishable_fmp6VN0e5KcS6IEUtrfUTg_33yglugF";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

(function () {
  'use strict';

  let TEAMS = [];

  /* =========================
     DEMO MATCH DATA
  ========================= */

  const MATCHES = [
    {
      status: 'upcoming',
      date: '2026-11-14',
      teamA: 'Team A',
      teamB: 'Team B',
      venue: 'Matraji Pal, Bhinmal',
      time: '9:00 AM',
      score: null
    },
    {
      status: 'upcoming',
      date: '2026-11-14',
      teamA: 'Team C',
      teamB: 'Team D',
      venue: 'Matraji Pal, Bhinmal',
      time: '1:00 PM',
      score: null
    },
    {
      status: 'upcoming',
      date: '2026-11-15',
      teamA: 'Team E',
      teamB: 'Team F',
      venue: 'Matraji Pal, Bhinmal',
      time: '9:00 AM',
      score: null
    }
  ];

  const LIVE_SCORE_DEMO = {
    teamA: 'APL Team A',
    teamB: 'APL Team B',
    runsA: 126,
    wicketsA: 4,
    oversA: '15.2',
    runsB: 0,
    wicketsB: 0,
    oversB: '0.0',
    status: 'Match starts soon'
  };

  const GALLERY = [
    'assets/gallery-1.jpg',
    'assets/gallery-2.jpg',
    'assets/gallery-3.jpg',
    'assets/gallery-4.jpg',
    'assets/gallery-5.jpg',
    'assets/gallery-6.jpg'
  ];

  const HISTORY = [
    {
      year: 'APL 1',
      winner: 'Coming Soon',
      runner: 'Coming Soon'
    },
    {
      year: 'APL 2',
      winner: 'Coming Soon',
      runner: 'Coming Soon'
    },
    {
      year: 'APL 3',
      winner: 'Coming Soon',
      runner: 'Coming Soon'
    },
    {
      year: 'APL 4',
      winner: '2026 • Tournament Ahead',
      runner: 'To Be Decided'
    }
  ];

  const VILLAGES = [
    'Aaldi',
    'Gajipura',
    'Savidhar',
    'Datlawas',
    'Pawli',
    'Chitrodi',
    'Goluya',
    'Manoharji Ka Was / Rajikawas',
    'Khanpur',
    'Kodi',
    'Karloo'
  ];

  /* =========================
     HELPERS
  ========================= */

  function initials(name) {
    if (!name) return 'APL';

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(function (word) {
        return word.charAt(0).toUpperCase();
      })
      .join('');
  }

  function escapeHtml(value) {
    if (value === null || value === undefined) return '';

    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* =========================
     NAVIGATION
  ========================= */

  function initNav() {
    const menuButton = document.querySelector(
      '.menu-toggle, .nav-toggle, [data-menu-toggle]'
    );

    const nav = document.querySelector(
      '.nav-links, .navigation, nav ul'
    );

    if (!menuButton || !nav) return;

    menuButton.addEventListener('click', function () {
      nav.classList.toggle('active');
      menuButton.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('active');
        menuButton.classList.remove('active');
      });
    });
  }

  /* =========================
     COUNTDOWN
  ========================= */

  function initCountdown() {
    const countdown =
      document.getElementById('countdown') ||
      document.querySelector('[data-countdown]');

    if (!countdown) return;

    const target = new Date('2026-11-14T07:00:00+05:30').getTime();

    function updateCountdown() {
      const now = Date.now();
      const distance = target - now;

      if (distance <= 0) {
        countdown.innerHTML = '<strong>Tournament Started!</strong>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance / (1000 * 60 * 60)) % 24
      );
      const minutes = Math.floor(
        (distance / (1000 * 60)) % 60
      );
      const seconds = Math.floor(
        (distance / 1000) % 60
      );

      const dayEl = countdown.querySelector('[data-days]');
      const hourEl = countdown.querySelector('[data-hours]');
      const minEl = countdown.querySelector('[data-minutes]');
      const secEl = countdown.querySelector('[data-seconds]');

      if (dayEl) dayEl.textContent = String(days).padStart(2, '0');
      if (hourEl) hourEl.textContent = String(hours).padStart(2, '0');
      if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
      if (secEl) secEl.textContent = String(seconds).padStart(2, '0');

      if (
        !dayEl &&
        !hourEl &&
        !minEl &&
        !secEl
      ) {
        countdown.textContent =
          days + 'd ' +
          hours + 'h ' +
          minutes + 'm ' +
          seconds + 's';
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* =========================
     TEAMS
  ========================= */

async function renderTeams() {
  const grid = document.getElementById('teamGrid');

  if (!grid) return;

  grid.innerHTML =
    '<p class="section-sub">Loading APL 4 teams...</p>';

  const { data, error } = await supabaseClient
    .from('teams')
    .select(`
      id,
      name,
      captain,
      vice_captain,
      logo_url,
      village_id
    `)
    .order('name');

  if (error) {
    console.error('Supabase teams error:', error);

    grid.innerHTML =
      '<p class="section-sub">Unable to load teams: ' +
      escapeHtml(error.message) +
      '</p>';

    return;
  }

  TEAMS = data || [];

  if (TEAMS.length === 0) {
    grid.innerHTML =
      '<p class="section-sub">No teams found.</p>';
    return;
  }

  grid.innerHTML = TEAMS.map(function (team) {

    const logoHtml = team.logo_url
      ? '<img src="' +
        escapeHtml(team.logo_url) +
        '" alt="' +
        escapeHtml(team.name) +
        ' logo">'
      : escapeHtml(initials(team.name));

    return (
      '<article class="team-card">' +

        '<div class="team-card-top">' +

          '<div class="team-logo">' +
            logoHtml +
          '</div>' +

          '<div>' +
            '<h3 class="team-name">' +
              escapeHtml(team.name) +
            '</h3>' +

            '<p class="team-village">' +
              'APL 4 Team' +
            '</p>' +
          '</div>' +

        '</div>' +

        '<div class="team-meta">' +

          '<span>' +
            'Captain: ' +
            '<strong>' +
              escapeHtml(team.captain || 'TBA') +
            '</strong>' +
          '</span>' +

          '<span>' +
            'APL 4 Squad' +
          '</span>' +

        '</div>' +

        '<button ' +
          'class="team-card-btn" ' +
          'type="button" ' +
          'data-team-id="' +
          team.id +
        '">' +
          'View Team' +
        '</button>' +

      '</article>'
    );

  }).join('');

  grid.querySelectorAll('.team-card-btn').forEach(function (button) {

    button.addEventListener('click', function () {

      const teamId = Number(button.dataset.teamId);

      openTeam(teamId);

    });

  });
}
  /* =========================
     OPEN TEAM
  ========================= */

  async function openTeam(teamId) {

  const team = TEAMS.find(function (t) {
    return Number(t.id) === Number(teamId);
  });

  if (!team) {
    console.error('Team not found:', teamId);
    return;
  }

  /*
    Create the popup immediately.
    Players are loaded AFTER the popup appears.
    This prevents the page from freezing.
  */

  const overlay = document.createElement('div');

  overlay.className = 'team-modal';

  overlay.innerHTML =

    '<div class="team-modal-backdrop"></div>' +

    '<div class="team-modal-content">' +

      '<button ' +
        'class="team-modal-close" ' +
        'type="button" ' +
        'aria-label="Close">' +
        '×' +
      '</button>' +

      '<div class="team-modal-header">' +

        '<div class="team-modal-logo">' +

          (
            team.logo_url
              ? '<img src="' +
                escapeHtml(team.logo_url) +
                '" alt="' +
                escapeHtml(team.name) +
                ' logo">'
              : escapeHtml(initials(team.name))
          ) +

        '</div>' +

        '<div>' +

          '<h2>' +
            escapeHtml(team.name) +
          '</h2>' +

          '<p>APL 4 Team</p>' +

        '</div>' +

      '</div>' +

      '<div class="team-leaders">' +

        '<div>' +
          '<span>Captain</span>' +
          '<strong>' +
            escapeHtml(team.captain || 'TBA') +
          '</strong>' +
        '</div>' +

        '<div>' +
          '<span>Vice Captain</span>' +
          '<strong>' +
            escapeHtml(team.vice_captain || 'TBA') +
          '</strong>' +
        '</div>' +

      '</div>' +

      '<h3 class="team-modal-title">' +
        'Squad' +
      '</h3>' +

      '<div class="team-players">' +

        '<p class="section-sub">' +
          'Loading players...' +
        '</p>' +

      '</div>' +

    '</div>';

  document.body.appendChild(overlay);

  document.body.style.overflow = 'hidden';

  const closeButton =
    overlay.querySelector('.team-modal-close');

  const backdrop =
    overlay.querySelector('.team-modal-backdrop');

  const playersContainer =
    overlay.querySelector('.team-players');

  function closeTeam() {

    overlay.remove();

    document.body.style.overflow = '';

    document.removeEventListener(
      'keydown',
      escHandler
    );
  }

  function escHandler(e) {

    if (e.key === 'Escape') {
      closeTeam();
    }

  }

  closeButton.addEventListener(
    'click',
    closeTeam
  );

  backdrop.addEventListener(
    'click',
    closeTeam
  );

  document.addEventListener(
    'keydown',
    escHandler
  );

  /*
    NOW fetch only the players belonging
    to the selected team.
  */

  const { data: players, error } = await supabaseClient

    .from('players')

    .select(
      'id, name, role, photo_url'
    )

    .eq('team_id', teamId)

    .order('id');

  if (error) {

    console.error(
      'Supabase players error:',
      error
    );

    playersContainer.innerHTML =
      '<p class="section-sub">' +
      'Unable to load players.<br>' +
      escapeHtml(error.message) +
      '</p>';

    return;
  }

  const squad = players || [];

  /*
    Update squad count.
  */

  const title =
    overlay.querySelector('.team-modal-title');

  if (title) {

    title.textContent =
      'Squad • ' +
      squad.length +
      ' Players';

  }

  if (squad.length === 0) {

    playersContainer.innerHTML =
      '<p class="section-sub">' +
      'No players found for this team.' +
      '</p>';

    return;
  }

  /*
    Render players.
  */

  playersContainer.innerHTML =
    squad.map(function (player, index) {

      const photo = player.photo_url

        ? '<img src="' +
          escapeHtml(player.photo_url) +
          '" alt="' +
          escapeHtml(player.name) +
          '">'

        : '<span>' +
          escapeHtml(
            initials(player.name)
          ) +
          '</span>';

      return (

        '<div class="team-player">' +

          '<div class="team-player-photo">' +
            photo +
          '</div>' +

          '<div class="team-player-info">' +

            '<strong>' +
              (index + 1) +
              '. ' +
              escapeHtml(player.name) +
            '</strong>' +

            (
              player.role
                ? '<small>' +
                  escapeHtml(player.role) +
                  '</small>'
                : ''
            ) +

          '</div>' +

        '</div>'

      );

    }).join('');
    }
    const overlay = document.createElement('div');

    overlay.className = 'team-modal';

    overlay.innerHTML =

      '<div class="team-modal-backdrop"></div>' +

      '<div class="team-modal-content">' +

        '<button ' +
          'class="team-modal-close" ' +
          'type="button" ' +
          'aria-label="Close">' +
          '×' +
        '</button>' +

        '<div class="team-modal-header">' +

          '<div class="team-modal-logo">' +

            (
              team.logo_url
                ? '<img src="' +
                  escapeHtml(team.logo_url) +
                  '" alt="' +
                  escapeHtml(team.name) +
                  ' logo">'
                : escapeHtml(initials(team.name))
            ) +

          '</div>' +

          '<div>' +

            '<h2>' +
              escapeHtml(team.name) +
            '</h2>' +

            '<p>' +
              'APL 4 Team' +
            '</p>' +

          '</div>' +

        '</div>' +

        '<div class="team-leaders">' +

          '<div>' +
            '<span>Captain</span>' +
            '<strong>' +
              escapeHtml(team.captain || 'TBA') +
            '</strong>' +
          '</div>' +

          '<div>' +
            '<span>Vice Captain</span>' +
            '<strong>' +
              escapeHtml(team.vice_captain || 'TBA') +
            '</strong>' +
          '</div>' +

        '</div>' +

        '<h3 class="team-modal-title">' +
          'Squad • ' +
          players.length +
          ' Players' +
        '</h3>' +

        '<div class="team-players">' +
          playerHtml +
        '</div>' +

      '</div>';

    document.body.appendChild(overlay);

    document.body.style.overflow = 'hidden';

    const closeButton =
      overlay.querySelector('.team-modal-close');

    const backdrop =
      overlay.querySelector('.team-modal-backdrop');

    function closeTeam() {
      overlay.remove();
      document.body.style.overflow = '';

      document.removeEventListener(
        'keydown',
        escHandler
      );
    }

    function escHandler(e) {
      if (e.key === 'Escape') {
        closeTeam();
      }
    }

    if (closeButton) {
      closeButton.addEventListener(
        'click',
        closeTeam
      );
    }

    if (backdrop) {
      backdrop.addEventListener(
        'click',
        closeTeam
      );
    }

    document.addEventListener(
      'keydown',
      escHandler
    );
  }

  /* =========================
     MATCHES
  ========================= */

  function renderMatches(filter) {
    const container =
      document.getElementById('matchesGrid') ||
      document.getElementById('matchGrid');

    if (!container) return;

    const filtered = MATCHES.filter(function (match) {
      return !filter || match.status === filter;
    });

    if (filtered.length === 0) {
      container.innerHTML =
        '<p class="section-sub">No matches found.</p>';
      return;
    }

    container.innerHTML = filtered.map(function (match) {
      return (
        '<article class="match-card">' +

          '<div class="match-status">' +
            escapeHtml(match.status) +
          '</div>' +

          '<div class="match-date">' +
            escapeHtml(match.date) +
          '</div>' +

          '<div class="match-teams">' +

            '<strong>' +
              escapeHtml(match.teamA) +
            '</strong>' +

            '<span>VS</span>' +

            '<strong>' +
              escapeHtml(match.teamB) +
            '</strong>' +

          '</div>' +

          '<div class="match-info">' +
            escapeHtml(match.time) +
            ' • ' +
            escapeHtml(match.venue) +
          '</div>' +

        '</article>'
      );
    }).join('');
  }

  function initTabs() {
    const tabs = document.querySelectorAll(
      '[data-match-tab], .match-tab'
    );

    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (item) {
          item.classList.remove('active');
        });

        tab.classList.add('active');

        const filter =
          tab.dataset.matchTab ||
          tab.dataset.filter ||
          tab.textContent.trim().toLowerCase();

        if (
          filter === 'all' ||
          filter === 'matches'
        ) {
          renderMatches();
        } else {
          renderMatches(filter);
        }
      });
    });
  }

  /* =========================
     LIVE SCORE
  ========================= */

  function renderScorecard() {
    const container =
      document.getElementById('scorecard') ||
      document.getElementById('liveScore');

    if (!container) return;

    container.innerHTML =
      '<div class="scorecard-inner">' +

        '<div class="score-team">' +
          escapeHtml(LIVE_SCORE_DEMO.teamA) +
          '<strong>' +
            LIVE_SCORE_DEMO.runsA +
            '/' +
            LIVE_SCORE_DEMO.wicketsA +
          '</strong>' +
          '<small>' +
            LIVE_SCORE_DEMO.oversA +
            ' overs' +
          '</small>' +
        '</div>' +

        '<div class="score-vs">VS</div>' +

        '<div class="score-team">' +
          escapeHtml(LIVE_SCORE_DEMO.teamB) +
          '<strong>' +
            LIVE_SCORE_DEMO.runsB +
            '/' +
            LIVE_SCORE_DEMO.wicketsB +
          '</strong>' +
          '<small>' +
            LIVE_SCORE_DEMO.oversB +
            ' overs' +
          '</small>' +
        '</div>' +

        '<div class="score-status">' +
          escapeHtml(LIVE_SCORE_DEMO.status) +
        '</div>' +

      '</div>';
  }

  /* =========================
     GALLERY
  ========================= */

  function renderGallery() {
    const gallery =
      document.getElementById('galleryGrid') ||
      document.getElementById('gallery');

    if (!gallery) return;

    gallery.innerHTML = GALLERY.map(function (image, index) {
      return (
        '<div class="gallery-item">' +

          '<img ' +
            'src="' +
            escapeHtml(image) +
            '" ' +
            'alt="APL 4 Gallery ' +
            (index + 1) +
            '" ' +
            'data-lightbox="' +
            escapeHtml(image) +
          '">' +

        '</div>'
      );
    }).join('');
  }

  /* =========================
     LIGHTBOX
  ========================= */

  function initLightbox() {
    document.addEventListener('click', function (event) {
      const image =
        event.target.closest(
          '[data-lightbox]'
        );

      if (!image) return;

      const src =
        image.dataset.lightbox ||
        image.src;

      const lightbox =
        document.createElement('div');

      lightbox.className =
        'image-lightbox';

      lightbox.innerHTML =
        '<div class="image-lightbox-backdrop"></div>' +

        '<div class="image-lightbox-content">' +

          '<button ' +
            'class="image-lightbox-close" ' +
            'type="button">' +
            '×' +
          '</button>' +

          '<img src="' +
            escapeHtml(src) +
            '" alt="APL 4 image">' +

        '</div>';

      document.body.appendChild(lightbox);

      function closeLightbox() {
        lightbox.remove();
        document.body.style.overflow = '';
      }

      document.body.style.overflow = 'hidden';

      const closeButton =
        lightbox.querySelector(
          '.image-lightbox-close'
        );

      const backdrop =
        lightbox.querySelector(
          '.image-lightbox-backdrop'
        );

      if (closeButton) {
        closeButton.addEventListener(
          'click',
          closeLightbox
        );
      }

      if (backdrop) {
        backdrop.addEventListener(
          'click',
          closeLightbox
        );
      }
    });
  }

  /* =========================
     HISTORY
  ========================= */

  function renderHistory() {
    const container =
      document.getElementById('historyGrid') ||
      document.getElementById('history');

    if (!container) return;

    container.innerHTML = HISTORY.map(function (item) {
      return (
        '<article class="history-card">' +

          '<h3>' +
            escapeHtml(item.year) +
          '</h3>' +

          '<p>' +
            '<strong>Winner:</strong> ' +
            escapeHtml(item.winner) +
          '</p>' +

          '<p>' +
            '<strong>Runner-up:</strong> ' +
            escapeHtml(item.runner) +
          '</p>' +

        '</article>'
      );
    }).join('');
  }

  /* =========================
     VILLAGES
  ========================= */

  function renderVillages() {
    const container =
      document.getElementById('villagesGrid') ||
      document.getElementById('villages');

    if (!container) return;

    container.innerHTML = VILLAGES.map(function (village) {
      return (
        '<article class="village-card">' +

          '<div class="village-icon">' +
            escapeHtml(initials(village)) +
          '</div>' +

          '<h3>' +
            escapeHtml(village) +
          '</h3>' +

        '</article>'
      );
    }).join('');
  }

  /* =========================
     START EVERYTHING
  ========================= */

  document.addEventListener(
    'DOMContentLoaded',
    function () {

      initNav();

      initCountdown();

      renderTeams();

      renderMatches('upcoming');

      initTabs();

      renderScorecard();

      renderGallery();

      initLightbox();

      renderHistory();

      renderVillages();

    }
  );

})();
