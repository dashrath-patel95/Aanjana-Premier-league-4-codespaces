const SUPABASE_URL = "https://yoeavwbeovdhyuqegygp.supabase.co";
const SUPABASE_KEY = "sb_publishable_QUNmCQVaTy1LgKRAb7Yl4A_w01zc0S0";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
supabaseClient
  .from('teams')
  .select('*')
  .then(function(result) {
    if (result.error) {
      alert("❌ Error: " + result.error.message);
    } else {
      alert("Teams returned: " + result.data.length + "\n\n" + JSON.stringify(result.data));
    }
  });
/* ==========================================================================
   APL 4 — script.js
   Supabase-connected version
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. DATA
     ------------------------------------------------------------------ */

  let TEAMS = [];

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
    teamA: {
      name: 'Team A',
      score: '142/6',
      overs: '18.4 overs'
    },
    teamB: {
      name: 'Team B',
      score: 'Yet to bat',
      overs: ''
    },
    status: 'Sample layout only — no live match is in progress.'
  };

  const GALLERY = [
    {
      src: 'assets/images/gallery/photo-01.jpg',
      alt: 'APL match action',
      caption: 'Match action, previous edition'
    },
    {
      src: 'assets/images/gallery/photo-02.jpg',
      alt: 'APL winning team',
      caption: 'Trophy lift, previous edition'
    },
    {
      src: 'assets/images/gallery/photo-03.jpg',
      alt: 'APL crowd',
      caption: 'Crowd at Matraji Pal ground'
    },
    {
      src: 'assets/images/gallery/photo-04.jpg',
      alt: 'APL opening ceremony',
      caption: 'Opening ceremony'
    },
    {
      src: 'assets/images/gallery/photo-05.jpg',
      alt: 'APL players',
      caption: 'Players warming up'
    },
    {
      src: 'assets/images/gallery/photo-06.jpg',
      alt: 'APL village community',
      caption: 'Community gathering'
    }
  ];

  const HISTORY = [
    {
      edition: 'APL 1',
      year: '2023',
      winner: 'Winner TBA',
      runnerUp: 'Runner-up TBA',
      result: 'Final result TBA',
      captain: 'Winning captain TBA'
    },
    {
      edition: 'APL 2',
      year: '2024',
      winner: 'Winner TBA',
      runnerUp: 'Runner-up TBA',
      result: 'Final result TBA',
      captain: 'Winning captain TBA'
    },
    {
      edition: 'APL 3',
      year: '2025',
      winner: 'Winner TBA',
      runnerUp: 'Runner-up TBA',
      result: 'Final result TBA',
      captain: 'Winning captain TBA'
    }
  ];

  const VILLAGES = [
    {
      name: 'Village TBA',
      teams: 2,
      photo: '',
      description: 'Short description of the village.'
    },
    {
      name: 'Village TBA',
      teams: 1,
      photo: '',
      description: 'Short description of the village.'
    },
    {
      name: 'Village TBA',
      teams: 2,
      photo: '',
      description: 'Short description of the village.'
    },
    {
      name: 'Village TBA',
      teams: 1,
      photo: '',
      description: 'Short description of the village.'
    },
    {
      name: 'Village TBA',
      teams: 1,
      photo: '',
      description: 'Short description of the village.'
    }
  ];

  /* ------------------------------------------------------------------
     2. HELPERS
     ------------------------------------------------------------------ */

  function initials(name) {
    if (!name) return 'APL';

    return name
      .split(' ')
      .filter(Boolean)
      .map(function (w) {
        return w[0];
      })
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  /* ------------------------------------------------------------------
     3. TEAMS — LOAD FROM SUPABASE
     ------------------------------------------------------------------ */

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
        villages (
          name
        ),
        players (
          id,
          name,
          role,
          photo_url
        )
      `)
      .order('name');

    if (error) {
      console.error('Supabase teams error:', error);

      grid.innerHTML =
        '<p class="section-sub">Unable to load teams. Please try again.</p>';

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
          team.logo_url +
          '" alt="' +
          team.name +
          ' logo">'
        : initials(team.name);

      const villageName =
        team.villages && team.villages.name
          ? team.villages.name
          : 'Village TBA';

      const playerCount =
        Array.isArray(team.players)
          ? team.players.length
          : 0;

      return (
        '<article class="team-card">' +

          '<div class="team-card-top">' +

            '<div class="team-logo">' +
              logoHtml +
            '</div>' +

            '<div>' +

              '<h3 class="team-name">' +
                team.name +
              '</h3>' +

              '<p class="team-village">' +
                villageName +
              '</p>' +

            '</div>' +

          '</div>' +

          '<div class="team-meta">' +

            '<span>' +
              'Captain: <strong>' +
              (team.captain || 'TBA') +
              '</strong>' +
            '</span>' +

            '<span>' +
              'Players: <strong>' +
              playerCount +
              '</strong>' +
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

    /*
     * View Team buttons
     */

    grid.querySelectorAll('.team-card-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        const teamId = Number(button.dataset.teamId);
        openTeam(teamId);
      });
    });
  }

  /* ------------------------------------------------------------------
     4. TEAM DETAILS
     ------------------------------------------------------------------ */

  function openTeam(teamId) {
    const team = TEAMS.find(function (t) {
      return Number(t.id) === Number(teamId);
    });

    if (!team) return;

    const players = Array.isArray(team.players)
      ? team.players
      : [];

    let playerHtml = '';

    if (players.length === 0) {
      playerHtml =
        '<p class="section-sub">Player information coming soon.</p>';
    } else {
      playerHtml = players.map(function (player, index) {
        const photo = player.photo_url
          ? '<img src="' +
            player.photo_url +
            '" alt="' +
            player.name +
            '">'
          : '<span>' +
            initials(player.name) +
            '</span>';

        const role = player.role
          ? player.role
          : '';

        return (
          '<div class="team-player">' +

            '<div class="team-player-photo">' +
              photo +
            '</div>' +

            '<div class="team-player-info">' +

              '<strong>' +
                (index + 1) +
                '. ' +
                player.name +
              '</strong>' +

              (role
                ? '<small>' + role + '</small>'
                : '') +

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
                  team.logo_url +
                  '" alt="' +
                  team.name +
                  ' logo">'
                : initials(team.name)
            ) +
          '</div>' +

          '<div>' +

            '<h2>' +
              team.name +
            '</h2>' +

            '<p>' +
              (
                team.villages
                  ? team.villages.name
                  : 'Village TBA'
              ) +
            '</p>' +

          '</div>' +

        '</div>' +

        '<div class="team-leaders">' +

          '<div>' +
            '<span>Captain</span>' +
            '<strong>' +
              (team.captain || 'TBA') +
            '</strong>' +
          '</div>' +

          '<div>' +
            '<span>Vice Captain</span>' +
            '<strong>' +
              (team.vice_captain || 'TBA') +
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
    }

    closeButton.addEventListener('click', closeTeam);
    backdrop.addEventListener('click', closeTeam);

    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeTeam();
        document.removeEventListener(
          'keydown',
          escHandler
        );
      }
    });
  }

  /* ------------------------------------------------------------------
     5. MATCHES
     ------------------------------------------------------------------ */

  function formatMatchDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');

    return {
      day: d.getDate(),
      month: d.toLocaleString('en-US', {
        month: 'short'
      })
    };
  }

  function renderMatches(filter) {
    const list =
      document.getElementById('matchList');

    if (!list) return;

    const filtered = MATCHES.filter(function (m) {
      return m.status === filter;
    });

    if (filtered.length === 0) {
      list.innerHTML =
        '<p class="section-sub">No ' +
        filter +
        ' matches to show yet.</p>';

      return;
    }

    list.innerHTML = filtered.map(function (m) {
      const dt = formatMatchDate(m.date);

      const statusHtml =
        m.status === 'upcoming'
          ? '<span class="match-status upcoming">' +
            m.time +
            '</span>'
          : '<span class="match-status completed match-score">' +
            (m.score || 'Result TBA') +
            '</span>';

      return (
        '<div class="match-card">' +

          '<div class="match-date">' +
            '<span class="match-date-day">' +
              dt.day +
            '</span>' +

            '<span class="match-date-month">' +
              dt.month +
            '</span>' +
          '</div>' +

          '<div class="match-teams-wrap">' +

            '<div class="match-teams">' +
              '<span>' + m.teamA + '</span>' +
              '<span class="match-vs">vs</span>' +
              '<span>' + m.teamB + '</span>' +
            '</div>' +

            '<div class="match-info">' +
              m.venue +
            '</div>' +

          '</div>' +

          statusHtml +

        '</div>'
      );
    }).join('');
  }

  /* ------------------------------------------------------------------
     6. SCORECARD
     ------------------------------------------------------------------ */

  function renderScorecard() {
    const el =
      document.getElementById('scorecard');

    if (!el) return;

    const d = LIVE_SCORE_DEMO;

    el.innerHTML =
      '<div class="scorecard-teams">' +

        '<div class="scorecard-team">' +

          '<div class="scorecard-team-name">' +
            d.teamA.name +
          '</div>' +

          '<div class="scorecard-team-score">' +
            d.teamA.score +
          '</div>' +

          '<div class="scorecard-team-overs">' +
            d.teamA.overs +
          '</div>' +

        '</div>' +

        '<div class="scorecard-vs">VS</div>' +

        '<div class="scorecard-team">' +

          '<div class="scorecard-team-name">' +
            d.teamB.name +
          '</div>' +

          '<div class="scorecard-team-score">' +
            d.teamB.score +
          '</div>' +

          '<div class="scorecard-team-overs">' +
            d.teamB.overs +
          '</div>' +

        '</div>' +

      '</div>' +

      '<p class="scorecard-status">' +
        d.status +
      '</p>';
  }

  /* ------------------------------------------------------------------
     7. GALLERY
     ------------------------------------------------------------------ */

  function renderGallery() {
    const grid =
      document.getElementById('galleryGrid');

    if (!grid) return;

    grid.innerHTML = GALLERY.map(function (item, i) {
      return (
        '<button ' +
          'class="gallery-item" ' +
          'type="button" ' +
          'data-index="' +
          i +
          '" ' +
          'aria-label="Open photo: ' +
          item.caption +
          '">' +

          '<img ' +
            'src="' +
            item.src +
            '" ' +
            'alt="' +
            item.alt +
            '" ' +
            'loading="lazy" ' +
            'onerror="this.closest(\'.gallery-item\').classList.add(\'img-missing\')">' +

          '<span class="gallery-caption">' +
            item.caption +
          '</span>' +

        '</button>'
      );
    }).join('');

    grid
      .querySelectorAll('.gallery-item')
      .forEach(function (btn) {

        btn.addEventListener('click', function () {
          openLightbox(
            Number(btn.dataset.index)
          );
        });

      });
  }

  /* ------------------------------------------------------------------
     8. HISTORY
     ------------------------------------------------------------------ */

  function renderHistory() {
    const grid =
      document.getElementById('historyGrid');

    if (!grid) return;

    grid.innerHTML = HISTORY.map(function (h) {
      return (
        '<article class="history-card">' +

          '<div class="history-year">' +
            h.year +
          '</div>' +

          '<div class="history-edition">' +
            h.edition +
          '</div>' +

          '<div class="history-row">' +
            '<span>Winner</span>' +
            '<span>' + h.winner + '</span>' +
          '</div>' +

          '<div class="history-row">' +
            '<span>Runner-up</span>' +
            '<span>' + h.runnerUp + '</span>' +
          '</div>' +

          '<div class="history-row">' +
            '<span>Result</span>' +
            '<span>' + h.result + '</span>' +
          '</div>' +

          '<div class="history-row">' +
            '<span>Winning captain</span>' +
            '<span>' + h.captain + '</span>' +
          '</div>' +

        '</article>'
      );
    }).join('');
  }

  /* ------------------------------------------------------------------
     9. VILLAGES
     ------------------------------------------------------------------ */

  function renderVillages() {
    const grid =
      document.getElementById('villageGrid');

    if (!grid) return;

    grid.innerHTML = VILLAGES.map(function (v) {

      const photoHtml = v.photo
        ? '<img src="' +
          v.photo +
          '" alt="' +
          v.name +
          '">'
        : 'Photo coming soon';

      return (
        '<article class="village-card">' +

          '<div class="village-photo">' +
            photoHtml +
          '</div>' +

          '<div class="village-body">' +

            '<h3 class="village-name">' +
              v.name +
            '</h3>' +

            '<p class="village-teams">' +
              v.teams +
              ' team' +
              (v.teams > 1 ? 's' : '') +
            '</p>' +

            '<p class="village-desc">' +
              v.description +
            '</p>' +

          '</div>' +

        '</article>'
      );
    }).join('');
  }

  /* ------------------------------------------------------------------
     10. MOBILE NAV
     ------------------------------------------------------------------ */

  function initNav() {
    const toggle =
      document.getElementById('navToggle');

    const menu =
      document.getElementById('navMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {

      const isOpen =
        menu.classList.toggle('is-open');

      toggle.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

      toggle.setAttribute(
        'aria-label',
        isOpen
          ? 'Close menu'
          : 'Open menu'
      );
    });

    menu
      .querySelectorAll('.nav-link')
      .forEach(function (link) {

        link.addEventListener('click', function () {

          menu.classList.remove('is-open');

          toggle.setAttribute(
            'aria-expanded',
            'false'
          );

          toggle.setAttribute(
            'aria-label',
            'Open menu'
          );

        });

      });
  }

  /* ------------------------------------------------------------------
     11. MATCH TABS
     ------------------------------------------------------------------ */

  function initTabs() {
    const tabs =
      document.querySelectorAll('.tab');

    if (!tabs.length) return;

    tabs.forEach(function (tab) {

      tab.addEventListener('click', function () {

        tabs.forEach(function (t) {
          t.classList.remove('is-active');

          t.setAttribute(
            'aria-selected',
            'false'
          );
        });

        tab.classList.add('is-active');

        tab.setAttribute(
          'aria-selected',
          'true'
        );

        renderMatches(
          tab.dataset.filter
        );
      });

    });
  }

  /* ------------------------------------------------------------------
     12. LIGHTBOX
     ------------------------------------------------------------------ */

  let currentLightboxIndex = 0;

  function openLightbox(index) {
    currentLightboxIndex = index;

    const item = GALLERY[index];

    const lightbox =
      document.getElementById('lightbox');

    const img =
      document.getElementById('lightboxImg');

    const caption =
      document.getElementById('lightboxCaption');

    if (!lightbox || !img || !caption) return;

    img.src = item.src;
    img.alt = item.alt;

    caption.textContent =
      item.caption;

    lightbox.classList.add('is-open');

    lightbox.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.style.overflow =
      'hidden';
  }

  function closeLightbox() {
    const lightbox =
      document.getElementById('lightbox');

    if (!lightbox) return;

    lightbox.classList.remove(
      'is-open'
    );

    lightbox.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.style.overflow = '';
  }

  function initLightbox() {
    const closeBtn =
      document.getElementById(
        'lightboxClose'
      );

    const lightbox =
      document.getElementById(
        'lightbox'
      );

    if (closeBtn) {
      closeBtn.addEventListener(
        'click',
        closeLightbox
      );
    }

    if (lightbox) {

      lightbox.addEventListener(
        'click',
        function (e) {

          if (e.target === lightbox) {
            closeLightbox();
          }

        }
      );

    }

    document.addEventListener(
      'keydown',
      function (e) {

        if (e.key === 'Escape') {
          closeLightbox();
        }

      }
    );
  }

  /* ------------------------------------------------------------------
     13. COUNTDOWN
     ------------------------------------------------------------------ */

  function initCountdown() {

    const target =
      new Date(
        '2026-11-14T07:00:00+05:30'
      ).getTime();

    const closing =
      new Date(
        '2026-11-18T15:00:00+05:30'
      ).getTime();

    const els = {

      days:
        document.getElementById(
          'cd-days'
        ),

      hours:
        document.getElementById(
          'cd-hours'
        ),

      minutes:
        document.getElementById(
          'cd-minutes'
        ),

      seconds:
        document.getElementById(
          'cd-seconds'
        ),

      message:
        document.getElementById(
          'countdownMessage'
        ),

      grid:
        document.getElementById(
          'countdownGrid'
        )

    };

    if (!els.days) return;

    function pad(n) {
      return String(n).padStart(2, '0');
    }

    function tick() {

      const now =
        Date.now();

      const diff =
        target - now;

      if (diff <= 0) {

        if (now < closing) {

          els.message.textContent =
            'APL 4 is live right now';

        } else {

          els.message.textContent =
            'APL 4 has concluded — see you next edition';

        }

        if (els.grid) {
          els.grid.style.display =
            'none';
        }

        clearInterval(timer);

        return;
      }

      const days =
        Math.floor(
          diff / 86400000
        );

      const hours =
        Math.floor(
          (diff % 86400000) /
          3600000
        );

      const minutes =
        Math.floor(
          (diff % 3600000) /
          60000
        );

      const seconds =
        Math.floor(
          (diff % 60000) /
          1000
        );

      els.days.textContent =
        pad(days);

      els.hours.textContent =
        pad(hours);

      els.minutes.textContent =
        pad(minutes);

      els.seconds.textContent =
        pad(seconds);
    }

    tick();

    const timer =
      setInterval(
        tick,
        1000
      );
  }

  /* ------------------------------------------------------------------
     14. INIT
     ------------------------------------------------------------------ */

  document.addEventListener(
    'DOMContentLoaded',
    function () {

      initNav();

      initCountdown();

      renderTeams();

      renderMatches(
        'upcoming'
      );

      initTabs();

      renderScorecard();

      renderGallery();

      initLightbox();

      renderHistory();

      renderVillages();

    }
  );

})();
