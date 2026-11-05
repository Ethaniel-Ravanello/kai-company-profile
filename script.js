/**
 * PT KERETA API INDONESIA (PERSERO) - SCRIPT INTERAKTIF
 * Navigation Tab Switcher, Hash Routing & Search Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const navLinks = document.querySelectorAll('.nav-link-item');
  const pageSections = document.querySelectorAll('.page-section');
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  // Available pages (Menu Navigasi)
  const validPages = ['beranda', 'profil', 'berita', 'galeri'];

  /**
   * Navigate to a specific page
   * @param {string} pageId - Target page ID
   */
  window.navigateTo = function(pageId) {
    if (pageId === 'kampanye') pageId = 'berita';
    if (!validPages.includes(pageId)) pageId = 'beranda';

    // 1. Update active tab indicator (Orange bottom line)
    navLinks.forEach(link => {
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 2. Show active page section and hide others
    pageSections.forEach(section => {
      if (section.id === `page-${pageId}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // 3. Update URL hash without jumping
    history.replaceState(null, null, `#${pageId}`);

    // 4. Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Attach click listener to all navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute('data-page');
      navigateTo(targetPage);
    });
  });

  // Handle URL hash on initial page load
  function handleHash() {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (validPages.includes(hash)) {
      navigateTo(hash);
    } else {
      navigateTo('beranda'); // Default to Beranda as requested
    }
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();

  // Search Modal Functionality
  if (searchBtn && searchModal && closeModalBtn) {
    searchBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      searchInput.value = '';
      searchInput.focus();
      renderDefaultSearchResults();
    });

    closeModalBtn.addEventListener('click', () => {
      searchModal.classList.remove('active');
    });

    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        searchModal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        searchModal.classList.remove('active');
      }
    });

    // Search keywords database
    const searchableItems = [
      { title: 'Visi & Misi PT KAI', page: 'profil', desc: 'Mendorong terciptanya ekosistem layanan kereta api kelas dunia' },
      { title: 'Tentang PT KAI (Persero)', page: 'profil', desc: 'Profil BUMN perkeretaapian angkutan penumpang dan barang' },
      { title: 'Struktur Organisasi KAI', page: 'profil', desc: 'Bagan RUPS, Dewan Komisaris, Direksi & Komite' },
      { title: 'Kampanye Berani Peduli, Berani Melindungi', page: 'berita', desc: 'Edukasi pencegahan pelecehan seksual di transportasi publik' },
      { title: 'Bentuk Pelecehan: Verbal, Fisik, Visual', page: 'berita', desc: 'Kenali tindakan pelecehan seksual di lingkungan kereta api' },
      { title: 'Langkah "Kalau Melihat Jangan Diam"', page: 'berita', desc: '4 langkah peduli, laporkan, dan dukung korban' },
      { title: 'Press Release KAI (29 September 2026)', page: 'berita', desc: 'KAI ajak penumpang berani peduli cegah pelecehan seksual' },
      { title: 'Materi Kampanye Brosur', page: 'galeri', desc: 'Unduh dan lihat desain brosur kampanye resmi' },
      { title: 'Foto Dokumentasi Sosialisasi Stasiun', page: 'galeri', desc: 'Dokumentasi penayangan digital di stasiun dan ruang prioritas' }
    ];

    function renderDefaultSearchResults() {
      searchResults.innerHTML = `
        <div style="font-size: 12px; color: #94a3b8; padding: 4px 10px; font-weight: 600;">PENCARIAN POPULER:</div>
        ${searchableItems.slice(0, 4).map(item => `
          <a class="search-item" href="javascript:void(0)" onclick="navigateTo('${item.page}'); document.getElementById('searchModal').classList.remove('active');">
            <strong style="color: #0B346E; display: block; font-size: 14px;">${item.title}</strong>
            <span style="font-size: 12px; color: #64748b;">${item.desc}</span>
          </a>
        `).join('')}
      `;
    }

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        renderDefaultSearchResults();
        return;
      }

      const filtered = searchableItems.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query)
      );

      if (filtered.length === 0) {
        searchResults.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #64748b; font-size: 13.5px;">
            Tidak ditemukan hasil untuk "<strong>${query}</strong>"
          </div>
        `;
      } else {
        searchResults.innerHTML = filtered.map(item => `
          <a class="search-item" href="javascript:void(0)" onclick="navigateTo('${item.page}'); document.getElementById('searchModal').classList.remove('active');">
            <strong style="color: #0B346E; display: block; font-size: 14px;">${item.title}</strong>
            <span style="font-size: 12px; color: #64748b;">${item.desc}</span>
          </a>
        `).join('');
      }
    });
  }
});
