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

    const target =
      new Date('2026-11-14T07:00:00+05:30').getTime();

    function updateCountdown() {
      const now = Date.now();
      const distance = target - now;

      if (distance <= 0) {
        countdown.innerHTML =
          '<strong>Tournament Started!</strong>';
        return;
      }

      const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (distance / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (distance / (1000 * 60)) % 60
      );

      const seconds = Math.floor(
        (distance / 1000) % 60
      );

      const dayEl =
        countdown.querySelector('[data-days]');

      const hourEl =
        countdown.querySelector('[data-hours]');

      const minEl =
        countdown.querySelector('[data-minutes]');

      const secEl =
        countdown.querySelector('[data-seconds]');

      if (dayEl) {
        dayEl.textContent =
          String(days).padStart(2, '0');
      }

      if (hourEl) {
        hourEl.textContent =
          String(hours).padStart(2, '0');
      }

      if (minEl) {
        minEl.textContent =
          String(minutes).padStart(2, '0');
      }

      if (secEl) {
        secEl.textContent =
          String(seconds).padStart(2, '0');
      }

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

    setInterval(
      updateCountdown,
      1000
    );
  }

  /* =========================
     TEAMS
  ========================= */

  async function renderTeams() {
    const grid =
      document.getElementById('teamGrid');

    if (!grid) return;

    grid.innerHTML =
      '<p class="section-sub">' +
      'Loading APL 4 teams...' +
      '</p>';

    /*
      IMPORTANT:
      Only load team information here.

      Players are NOT loaded here.
      This keeps the main Teams page light.
    */

    const result =
      await supabaseClient
        .from('teams')
        .select(
          'id, name, captain, vice_captain, logo_url, village_id'
        )
        .order('name');

    const data = result.data;
    const error = result.error;

    if (error) {
      console.error(
        'Supabase teams error:',
        error
      );

      grid.innerHTML =
        '<p class="section-sub">' +
        'Unable to load teams.<br>' +
        escapeHtml(error.message) +
        '</p>';

      return;
    }

    TEAMS = data || [];

    if (TEAMS.length === 0) {
      grid.innerHTML =
        '<p class="section-sub">' +
        'No teams found.' +
        '</p>';

      return;
    }

    grid.innerHTML =
      TEAMS.map(function (team) {

        const logoHtml =
          team.logo_url

            ? '<img src="' +
              escapeHtml(team.logo_url) +
              '" alt="' +
              escapeHtml(team.name) +
              ' logo">'

            : escapeHtml(
                initials(team.name)
              );

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
                  escapeHtml(
                    team.captain || 'TBA'
                  ) +
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

    /*
      Add View Team buttons.
    */

    grid
      .querySelectorAll('.team-card-btn')
      .forEach(function (button) {

        button.addEventListener(
          'click',
          function () {

            const teamId =
              Number(
                button.dataset.teamId
              );

            openTeam(teamId);

          }
        );

      });
  }

  /* =========================
     OPEN TEAM
  ========================= */

  async function openTeam(teamId) {

    const team =
      TEAMS.find(function (t) {
        return Number(t.id) ===
          Number(teamId);
      });

    if (!team) {
      console.error(
        'Team not found:',
        teamId
      );

      return;
    }

    /*
      Prevent opening multiple team
      windows at the same time.
    */

    const oldOverlay =
      document.getElementById(
        'aplTeamOverlay'
      );

    if (oldOverlay) {
      oldOverlay.remove();
    }

    /*
      Create a completely independent
      popup.

      We intentionally do NOT depend
      on .team-modal CSS.
    */

    const overlay =
      document.createElement('div');

    overlay.id =
      'aplTeamOverlay';

    overlay.style.position =
      'fixed';

    overlay.style.inset =
      '0';

    overlay.style.zIndex =
      '99999';

    overlay.style.background =
      'rgba(0,0,0,0.78)';

    overlay.style.display =
      'flex';

    overlay.style.alignItems =
      'center';

    overlay.style.justifyContent =
      'center';

    overlay.style.padding =
      '16px';

    overlay.style.boxSizing =
      'border-box';

    /*
      Popup box
    */

    const modal =
      document.createElement('div');

    modal.style.width =
      '100%';

    modal.style.maxWidth =
      '560px';

    modal.style.maxHeight =
      '90vh';

    modal.style.overflowY =
      'auto';

    modal.style.background =
      '#111827';

    modal.style.color =
      '#ffffff';

    modal.style.borderRadius =
      '20px';

    modal.style.padding =
      '20px';

    modal.style.boxSizing =
      'border-box';

    modal.style.position =
      'relative';

    modal.style.boxShadow =
      '0 20px 60px rgba(0,0,0,0.45)';

    /*
      Close button
    */

    const closeButton =
      document.createElement('button');

    closeButton.type =
      'button';

    closeButton.innerHTML =
      '×';

    closeButton.setAttribute(
      'aria-label',
      'Close'
    );

    closeButton.style.position =
      'absolute';

    closeButton.style.right =
      '12px';

    closeButton.style.top =
      '10px';

    closeButton.style.width =
      '42px';

    closeButton.style.height =
      '42px';

    closeButton.style.border =
      '0';

    closeButton.style.borderRadius =
      '50%';

    closeButton.style.background =
      'rgba(255,255,255,0.12)';

    closeButton.style.color =
      '#ffffff';

    closeButton.style.fontSize =
      '28px';

    closeButton.style.cursor =
      'pointer';

    /*
      Header
    */

    const header =
      document.createElement('div');

    header.style.display =
      'flex';

    header.style.alignItems =
      'center';

    header.style.gap =
      '14px';

    header.style.paddingRight =
      '45px';

    const logo =
      document.createElement('div');

    logo.style.width =
      '64px';

    logo.style.height =
      '64px';

    logo.style.minWidth =
      '64px';

    logo.style.borderRadius =
      '16px';

    logo.style.background =
      'rgba(255,255,255,0.1)';

    logo.style.display =
      'flex';

    logo.style.alignItems =
      'center';

    logo.style.justifyContent =
      'center';

    logo.style.overflow =
      'hidden';

    logo.style.fontWeight =
      '800';

    logo.style.fontSize =
      '18px';

    if (team.logo_url) {

      const logoImage =
        document.createElement('img');

      logoImage.src =
        team.logo_url;

      logoImage.alt =
        team.name + ' logo';

      logoImage.style.width =
        '100%';

      logoImage.style.height =
        '100%';

      logoImage.style.objectFit =
        'cover';

      logo.appendChild(
        logoImage
      );

    } else {

      logo.textContent =
        initials(team.name);

    }

    const headerText =
      document.createElement('div');

    const teamName =
      document.createElement('h2');

    teamName.textContent =
      team.name;

    teamName.style.margin =
      '0 0 5px 0';

    teamName.style.fontSize =
      '20px';

    const teamSubtitle =
      document.createElement('p');

    teamSubtitle.textContent =
      'APL 4 Team';

    teamSubtitle.style.margin =
      '0';

    teamSubtitle.style.opacity =
      '0.7';

    headerText.appendChild(
      teamName
    );

    headerText.appendChild(
      teamSubtitle
    );

    header.appendChild(
      logo
    );

    header.appendChild(
      headerText
    );

    /*
      Leaders
    */

    const leaders =
      document.createElement('div');

    leaders.style.display =
      'grid';

    leaders.style.gridTemplateColumns =
      '1fr 1fr';

    leaders.style.gap =
      '10px';

    leaders.style.margin =
      '20px 0';

    function createLeader(
      label,
      value
    ) {

      const box =
        document.createElement('div');

      box.style.background =
        'rgba(255,255,255,0.06)';

      box.style.borderRadius =
        '12px';

      box.style.padding =
        '12px';

      const labelEl =
        document.createElement('small');

      labelEl.textContent =
        label;

      labelEl.style.display =
        'block';

      labelEl.style.opacity =
        '0.65';

      const valueEl =
        document.createElement('strong');

      valueEl.textContent =
        value || 'TBA';

      valueEl.style.display =
        'block';

      valueEl.style.marginTop =
        '4px';

      box.appendChild(
        labelEl
      );

      box.appendChild(
        valueEl
      );

      return box;
    }

    leaders.appendChild(
      createLeader(
        'Captain',
        team.captain
      )
    );

    leaders.appendChild(
      createLeader(
        'Vice Captain',
        team.vice_captain
      )
    );

    /*
      Squad title
    */

    const squadTitle =
      document.createElement('h3');

    squadTitle.textContent =
      'Squad • Loading...';

    squadTitle.style.margin =
      '10px 0 14px 0';

    /*
      Player container
    */

    const playersContainer =
      document.createElement('div');

    playersContainer.style.display =
      'flex';

    playersContainer.style.flexDirection =
      'column';

    playersContainer.style.gap =
      '8px';

    playersContainer.innerHTML =
      '<p style="opacity:0.7;margin:10px 0;">Loading players...</p>';

    /*
      Build popup
    */

    modal.appendChild(
      closeButton
    );

    modal.appendChild(
      header
    );

    modal.appendChild(
      leaders
    );

    modal.appendChild(
      squadTitle
    );

    modal.appendChild(
      playersContainer
    );

    overlay.appendChild(
      modal
    );

    document.body.appendChild(
      overlay
    );

    document.body.style.overflow =
      'hidden';

    /*
      Close functions
    */

    function closeTeam() {

      if (overlay.parentNode) {
        overlay.remove();
      }

      document.body.style.overflow =
        '';

      document.removeEventListener(
        'keydown',
        escHandler
      );
    }

    function escHandler(event) {

      if (event.key === 'Escape') {
        closeTeam();
      }

    }

    closeButton.addEventListener(
      'click',
      closeTeam
    );

    overlay.addEventListener(
      'click',
      function (event) {

        if (event.target === overlay) {
          closeTeam();
        }

      }
    );

    document.addEventListener(
      'keydown',
      escHandler
    );

    /*
      IMPORTANT:
      Fetch ONLY the players for
      this particular team.
    */

    try {

      const result =
        await supabaseClient
          .from('players')
          .select(
            'id, name, role, photo_url'
          )
          .eq(
            'team_id',
            teamId
          )
          .order(
            'id',
            { ascending: true }
          );

      const players =
        result.data;

      const error =
        result.error;

      if (error) {

        console.error(
          'Supabase players error:',
          error
        );

        squadTitle.textContent =
          'Squad';

        playersContainer.innerHTML =
          '<p style="color:#ff8a8a;margin:10px 0;">' +
          'Unable to load players.<br><small>' +
          escapeHtml(
            error.message
          ) +
          '</small></p>';

        return;
      }

      const squad =
        players || [];

      squadTitle.textContent =
        'Squad • ' +
        squad.length +
        ' Players';

      if (squad.length === 0) {

        playersContainer.innerHTML =
          '<p style="opacity:0.7;margin:10px 0;">' +
          'No players found for this team.' +
          '</p>';

        return;
      }

      /*
        Render players.
      */

      playersContainer.innerHTML =
        '';

      squad.forEach(
        function (player, index) {

          const playerBox =
            document.createElement('div');

          playerBox.style.display =
            'flex';

          playerBox.style.alignItems =
            'center';

          playerBox.style.gap =
            '12px';

          playerBox.style.padding =
            '10px';

          playerBox.style.borderRadius =
            '12px';

          playerBox.style.background =
            'rgba(255,255,255,0.06)';

          /*
            Player photo
          */

          const photoBox =
            document.createElement('div');

          photoBox.style.width =
            '46px';

          photoBox.style.height =
            '46px';

          photoBox.style.minWidth =
            '46px';

          photoBox.style.borderRadius =
            '50%';

          photoBox.style.overflow =
            'hidden';

          photoBox.style.background =
            'rgba(255,255,255,0.12)';

          photoBox.style.display =
            'flex';

          photoBox.style.alignItems =
            'center';

          photoBox.style.justifyContent =
            'center';

          photoBox.style.fontWeight =
            '700';

          if (player.photo_url) {

            const playerImage =
              document.createElement('img');

            playerImage.src =
              player.photo_url;

            playerImage.alt =
              player.name;

            playerImage.loading =
              'lazy';

            playerImage.style.width =
              '100%';

            playerImage.style.height =
              '100%';

            playerImage.style.objectFit =
              'cover';

            photoBox.appendChild(
              playerImage
            );

          } else {

            photoBox.textContent =
              initials(player.name);

          }

          /*
            Player information
          */

          const info =
            document.createElement('div');

          info.style.minWidth =
            '0';

          const name =
            document.createElement('strong');

          name.textContent =
            (index + 1) +
            '. ' +
            player.name;

          name.style.display =
            'block';

          name.style.fontSize =
            '15px';

          const role =
            document.createElement('small');

          if (player.role) {

            role.textContent =
              player.role;

            role.style.display =
              'block';

            role.style.opacity =
              '0.65';

            role.style.marginTop =
              '3px';

          }

          info.appendChild(
            name
          );

          if (player.role) {
            info.appendChild(
              role
            );
          }

          playerBox.appendChild(
            photoBox
          );

          playerBox.appendChild(
            info
          );

          playersContainer.appendChild(
            playerBox
          );

        }
      );

    } catch (error) {

      console.error(
        'Unexpected player loading error:',
        error
      );

      squadTitle.textContent =
        'Squad';

      playersContainer.innerHTML =
        '<p style="color:#ff8a8a;">' +
        'Something went wrong while loading players.<br>' +
        '<small>' +
        escapeHtml(
          error.message ||
          String(error)
        ) +
        '</small></p>';

    }
  }

  /* =========================
     MATCHES
  ========================= */

  function renderMatches(filter) {
    const container =
      document.getElementById('matchesGrid') ||
      document.getElementById('matchGrid');

    if (!container) return;

    const filtered =
      MATCHES.filter(
        function (match) {
          return !filter ||
            match.status === filter;
        }
      );

    if (filtered.length === 0) {

      container.innerHTML =
        '<p class="section-sub">' +
        'No matches found.' +
        '</p>';

      return;
    }

    container.innerHTML =
      filtered.map(
        function (match) {

          return (

            '<article class="match-card">' +

              '<div class="match-status">' +
                escapeHtml(
                  match.status
                ) +
              '</div>' +

              '<div class="match-date">' +
                escapeHtml(
                  match.date
                ) +
              '</div>' +

              '<div class="match-teams">' +

                '<strong>' +
                  escapeHtml(
                    match.teamA
                  ) +
                '</strong>' +

                '<span>VS</span>' +

                '<strong>' +
                  escapeHtml(
                    match.teamB
                  ) +
                '</strong>' +

              '</div>' +

              '<div class="match-info">' +
                escapeHtml(
                  match.time
                ) +
                ' • ' +
                escapeHtml(
                  match.venue
                ) +
              '</div>' +

            '</article>'

          );

        }
      ).join('');
  }

  function initTabs() {

    const tabs =
      document.querySelectorAll(
        '[data-match-tab], .match-tab'
      );

    if (!tabs.length) return;

    tabs.forEach(
      function (tab) {

        tab.addEventListener(
          'click',
          function () {

            tabs.forEach(
              function (item) {
                item.classList.remove(
                  'active'
                );
              }
            );

            tab.classList.add(
              'active'
            );

            const filter =
              tab.dataset.matchTab ||
              tab.dataset.filter ||
              tab.textContent
                .trim()
                .toLowerCase();

            if (
              filter === 'all' ||
              filter === 'matches'
            ) {

              renderMatches();

            } else {

              renderMatches(
                filter
              );

            }

          }
        );

      }
    );
  }

  /* =========================
     LIVE SCORE
  ========================= */

  function renderScorecard() {

    const container =
      document.getElementById(
        'scorecard'
      ) ||
      document.getElementById(
        'liveScore'
      );

    if (!container) return;

    container.innerHTML =

      '<div class="scorecard-inner">' +

        '<div class="score-team">' +

          escapeHtml(
            LIVE_SCORE_DEMO.teamA
          ) +

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

        '<div class="score-vs">' +
          'VS' +
        '</div>' +

        '<div class="score-team">' +

          escapeHtml(
            LIVE_SCORE_DEMO.teamB
          ) +

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
          escapeHtml(
            LIVE_SCORE_DEMO.status
          ) +
        '</div>' +

      '</div>';
  }

  /* =========================
     GALLERY
  ========================= */

  function renderGallery() {

    const gallery =
      document.getElementById(
        'galleryGrid'
      ) ||
      document.getElementById(
        'gallery'
      );

    if (!gallery) return;

    gallery.innerHTML =
      GALLERY.map(
        function (image, index) {

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

        }
      ).join('');
  }

  /* =========================
     LIGHTBOX
  ========================= */

  function initLightbox() {

    document.addEventListener(
      'click',
      function (event) {

        const image =
          event.target.closest(
            '[data-lightbox]'
          );

        if (!image) return;

        const src =
          image.dataset.lightbox ||
          image.src;

        const lightbox =
          document.createElement(
            'div'
          );

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

        document.body.appendChild(
          lightbox
        );

        function closeLightbox() {

          lightbox.remove();

          document.body.style.overflow =
            '';

        }

        document.body.style.overflow =
          'hidden';

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

      }
    );
  }

  /* =========================
     HISTORY
  ========================= */

  function renderHistory() {

    const container =
      document.getElementById(
        'historyGrid'
      ) ||
      document.getElementById(
        'history'
      );

    if (!container) return;

    container.innerHTML =
      HISTORY.map(
        function (item) {

          return (

            '<article class="history-card">' +

              '<h3>' +
                escapeHtml(
                  item.year
                ) +
              '</h3>' +

              '<p>' +
                '<strong>Winner:</strong> ' +
                escapeHtml(
                  item.winner
                ) +
              '</p>' +

              '<p>' +
                '<strong>Runner-up:</strong> ' +
                escapeHtml(
                  item.runner
                ) +
              '</p>' +

            '</article>'

          );

        }
      ).join('');
  }

  /* =========================
     VILLAGES
  ========================= */

  function renderVillages() {

    const container =
      document.getElementById(
        'villagesGrid'
      ) ||
      document.getElementById(
        'villages'
      );

    if (!container) return;

    container.innerHTML =
      VILLAGES.map(
        function (village) {

          return (

            '<article class="village-card">' +

              '<div class="village-icon">' +
                escapeHtml(
                  initials(village)
                ) +
              '</div>' +

              '<h3>' +
                escapeHtml(
                  village
                ) +
              '</h3>' +

            '</article>'

          );

        }
      ).join('');
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
