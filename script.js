document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabInputs = document.querySelectorAll('input[name="healthcare-tab"]');

  const syncTabs = (targetId) => {
    tabButtons.forEach((button) => {
      const isActive = button.getAttribute('for') === targetId;
      button.classList.toggle('active', isActive);
    });

    tabInputs.forEach((input) => {
      input.checked = input.id === targetId;
    });
  };

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('for');
      syncTabs(targetId);
    });
  });

  const unionFilters = document.querySelectorAll('.union-filter');

  const applyAmbulanceFilter = (selectedUnion) => {
    const ambulanceCards = document.querySelectorAll('.ambulance-card');
    ambulanceCards.forEach((card) => {
      const matches = selectedUnion === 'all' || card.dataset.union === selectedUnion;
      card.style.display = matches ? 'block' : 'none';
    });
  };

  unionFilters.forEach((button) => {
    button.addEventListener('click', () => {
      unionFilters.forEach((item) => item.classList.toggle('active', item === button));
      applyAmbulanceFilter(button.dataset.union);
    });
  });

  const bloodFilters = document.querySelectorAll('.blood-filter');
  const bloodSearch = document.querySelector('.blood-search');

  const applyBloodFilter = () => {
    const selectedGroup = document.querySelector('.blood-filter.active')?.dataset.blood ?? 'all';
    const searchValue = (bloodSearch?.value || '').trim().toLowerCase();

    const donorCards = document.querySelectorAll('.donor-card');
    donorCards.forEach((card) => {
      const matchesGroup = selectedGroup === 'all' || card.dataset.blood === selectedGroup;
      const searchText = (card.dataset.search || '').toLowerCase();
      const matchesSearch = !searchValue || searchText.includes(searchValue);
      const shouldShow = matchesGroup && matchesSearch;
      card.style.display = shouldShow ? 'block' : 'none';
    });
  };

  bloodFilters.forEach((button) => {
    button.addEventListener('click', () => {
      bloodFilters.forEach((item) => item.classList.toggle('active', item === button));
      applyBloodFilter();
    });
  });

  bloodSearch?.addEventListener('input', applyBloodFilter);

  const doctorFilters = document.querySelectorAll('.doctor-filter');
  const doctorCards = document.querySelectorAll('.doctor-card');

  const applyDoctorFilter = (selectedSpecialty) => {
    doctorCards.forEach((card) => {
      const matches = selectedSpecialty === 'all' || card.dataset.specialty === selectedSpecialty;
      card.style.display = matches ? 'block' : 'none';
    });
  };

  doctorFilters.forEach((button) => {
    button.addEventListener('click', () => {
      doctorFilters.forEach((item) => item.classList.toggle('active', item === button));
      applyDoctorFilter(button.dataset.specialty);
    });
  });

  const eduTabs = document.querySelectorAll('.edu-tab');
  const eduInputs = document.querySelectorAll('input[name="edu-tab"]');

  const syncEduTabs = (targetId) => {
    eduTabs.forEach((button) => {
      const isActive = button.getAttribute('for') === targetId;
      button.classList.toggle('active', isActive);
    });

    eduInputs.forEach((input) => {
      input.checked = input.id === targetId;
    });
  };

  eduTabs.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('for');
      syncEduTabs(targetId);
    });
  });

  const noticeFilters = document.querySelectorAll('.notice-filter');
  const noticeCards = document.querySelectorAll('.notice-card');

  const applyNoticeFilter = (selectedCategory) => {
    noticeCards.forEach((card) => {
      const matches = selectedCategory === 'all' || card.dataset.category === selectedCategory;
      card.style.display = matches ? 'block' : 'none';
    });
  };

  noticeFilters.forEach((button) => {
    button.addEventListener('click', () => {
      noticeFilters.forEach((item) => item.classList.toggle('active', item === button));
      applyNoticeFilter(button.dataset.category);
    });
  });

  const routeFilters = document.querySelectorAll('.route-filter');
  const scheduleCards = document.querySelectorAll('.schedule-card');

  const applyRouteFilter = (selectedRoute) => {
    scheduleCards.forEach((card) => {
      const matches = selectedRoute === 'all' || card.dataset.route === selectedRoute;
      card.style.display = matches ? 'block' : 'none';
    });
  };

  routeFilters.forEach((button) => {
    button.addEventListener('click', () => {
      routeFilters.forEach((item) => item.classList.toggle('active', item === button));
      applyRouteFilter(button.dataset.route);
    });
  });

  const driverFilters = document.querySelectorAll('.driver-filter');
  const driverCards = document.querySelectorAll('.driver-card');

  const applyDriverFilter = (selectedType) => {
    driverCards.forEach((card) => {
      const matches = selectedType === 'all' || card.dataset.type === selectedType;
      card.style.display = matches ? 'block' : 'none';
    });
  };

  driverFilters.forEach((button) => {
    button.addEventListener('click', () => {
      driverFilters.forEach((item) => item.classList.toggle('active', item === button));
      applyDriverFilter(button.dataset.type);
    });
  });

  const marketFilters = document.querySelectorAll('.market-filter');
  const marketCards = document.querySelectorAll('.product-card');
  const marketSearch = document.querySelector('.marketplace-search');
  const marketplaceEmpty = document.getElementById('marketplaceEmpty');

  const applyMarketplaceFilter = () => {
    const selectedCategory = document.querySelector('.market-filter.active')?.dataset.category ?? 'all';
    const searchValue = (marketSearch?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    marketCards.forEach((card) => {
      const matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
      const searchText = (card.dataset.search || '').toLowerCase();
      const matchesSearch = !searchValue || searchText.includes(searchValue);
      const shouldShow = matchesCategory && matchesSearch;
      card.style.display = shouldShow ? 'flex' : 'none';
      if (shouldShow) visibleCount += 1;
    });

    if (marketplaceEmpty) {
      marketplaceEmpty.hidden = visibleCount !== 0;
    }
  };

  marketFilters.forEach((button) => {
    button.addEventListener('click', () => {
      marketFilters.forEach((item) => item.classList.toggle('active', item === button));
      applyMarketplaceFilter();
    });
  });

  marketSearch?.addEventListener('input', applyMarketplaceFilter);

  // --- Dynamic union loader ---
  const ambulanceGrid = document.querySelector('.ambulance-grid');
  const donorGrid = document.querySelector('.donor-grid');

  const renderAmbulanceEntry = (unionId, entry) => `
    <article class="ambulance-card" data-union="${unionId}" data-search="${entry.search || ''}">
      <div class="service-meta">
        <span class="status-dot"></span>
        <span>${entry.availability || '২৪/৭'}</span>
      </div>
      <h4>${entry.name}</h4>
      <p>${entry.union || ''}</p>
      <small>${entry.role || ''}</small>
      <a href="tel:${entry.phone}">${entry.phone}</a>
    </article>
  `;

  const renderDonorEntry = (unionId, donor) => `
    <article class="donor-card" data-blood="${donor.blood || 'Unknown'}" data-search="${donor.search || ''}">
      <div class="donor-head">
        <span class="blood-badge">${donor.blood || ''}</span>
        <span class="donor-status">সক্রিয়</span>
      </div>
      <h4>${donor.name}</h4>
      <p>শেষ দান: ${donor.last_donated || ''}</p>
      <small>${donor.union || ''}</small>
      <a href="tel:${donor.phone}">কল করুন</a>
    </article>
  `;

  const fetchAndRenderUnion = async (path) => {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const unionId = data.union_id || data.union || path;
      const unionName = data.union_name || '';

      if (Array.isArray(data.ambulance) && ambulanceGrid) {
        ambulanceGrid.insertAdjacentHTML('beforeend', data.ambulance.map((a) => renderAmbulanceEntry(unionId, Object.assign({ union: unionName }, a))).join(''));
      }

      if (Array.isArray(data.donors) && donorGrid) {
        donorGrid.insertAdjacentHTML('beforeend', data.donors.map((d) => renderDonorEntry(unionId, d)).join(''));
      }
    } catch (e) {
      console.warn('Could not load union file', path, e.message);
    }
  };

  // Load known union files (created earlier)
  fetchAndRenderUnion('index.borohatia');
  fetchAndRenderUnion('index.amirabad');

  const eventData = [
    {
      title: 'লোহাগাড়া ইউনিয়ন স্পোর্টস ফেস্ট',
      category: 'Sports',
      categoryTone: 'bg-emerald-100 text-emerald-700',
      date: '১২ অক্টোবর ২০২৬',
      time: 'সকাল ৮:০০ AM',
      venue: '৬নং লোহাগাড়া মাঠ',
      description: 'ফুটবল, ক্রিকেট, ভলিবল ও শিশু-কিশোর বিভাগে আন্তঃইউনিয়ন টুর্নামেন্ট আয়োজন করা হবে।',
      target: '2026-10-12T08:00:00+06:00'
    },
    {
      title: 'বড় ওয়াজ মাহফিল ও দোয়া সমাবেশ',
      category: 'Religious',
      categoryTone: 'bg-violet-100 text-violet-700',
      date: '২২ অক্টোবর ২০২৬',
      time: 'সন্ধ্যা ৬:৩০ PM',
      venue: 'লোহাগাড়া জামিয়া মাঠ',
      description: 'ইসলামিক বক্তব্য, দোয়া, সামাজিক উন্নয়ন ও বোনাস বিতরণ অনুষ্ঠানের আয়োজন।',
      target: '2026-10-22T18:30:00+06:00'
    },
    {
      title: 'মুক্ত রক্তদান ও স্বাস্থ্য ক্যাম্প',
      category: 'Health Camp',
      categoryTone: 'bg-rose-100 text-rose-700',
      date: '২৮ অক্টোবর ২০২৬',
      time: 'বিকাল ৩:০০ PM',
      venue: 'লোহাগাড়া উপজেলা কমিউনিটি সেন্টার',
      description: 'রক্তদান, ব্লাড প্রেসার, ডায়াবেটিস স্ক্রিনিং এবং পরামর্শ সেশন অনুষ্ঠিত হবে।',
      target: '2026-10-28T15:00:00+06:00'
    },
    {
      title: 'বৃত্তি ও ভর্তি প্রস্তুতি পরীক্ষা',
      category: 'Education',
      categoryTone: 'bg-amber-100 text-amber-700',
      date: '১৫ নভেম্বর ২০২৬',
      time: 'সকাল ৯:০০ AM',
      venue: 'লোহাগাড়া কলেজ কমপ্লেক্স',
      description: 'বৃত্তি প্রার্থী, SSC/HSC প্রস্তুতি ও ভর্তি পরীক্ষার জন্য মতবিনিময় সভা।',
      target: '2026-11-15T09:00:00+06:00'
    }
  ];

  const initializeEventTicker = () => {
    const ticker = document.querySelector('.events-ticker-track');
    if (!ticker) return;

    const content = ticker.innerHTML;
    ticker.innerHTML = `${content}${content}`;
  };

  const updateCountdowns = () => {
    document.querySelectorAll('.events-countdown').forEach((element) => {
      const target = element.dataset.target;
      if (!target) return;

      const distance = new Date(target).getTime() - Date.now();
      if (distance <= 0) {
        element.querySelector('.countdown-value').textContent = 'Live';
        return;
      }

      const totalSeconds = Math.floor(distance / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      element.querySelector('.countdown-value').textContent = `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
    });
  };

  initializeEventTicker();
  updateCountdowns();
  setInterval(updateCountdowns, 60000);

  const grievanceData = [
    {
      name: 'আনোয়ার হোসেন',
      area: '৬নং লোহাগাড়া',
      category: 'রাস্তাঘাট ও যোগাযোগ',
      description: 'বাজার সড়কে ভাঙা রাস্তার কারণে যান চলাচলে অসুবিধা হচ্ছে। দ্রুত মেরামত করা দরকার।',
      status: 'বিবেচনাধীন',
      statusTone: 'amber',
      date: '২০২৬-০৯-২৩'
    },
    {
      name: 'নাজমা বেগম',
      area: '২নং আমিরাবাদ',
      category: 'জলাবদ্ধতা',
      description: 'বর্ষার সময় মসজিদ মাঠে পানি জমে থাকে, শিশুদের হাঁটতে অসুবিধা হয়।',
      status: 'চলমান',
      statusTone: 'blue',
      date: '২০২৬-০৯-২১'
    },
    {
      name: 'মোহাম্মদ রফিক',
      area: '৪নং চরম্বা',
      category: 'বিদ্যুৎ সরবরাহ',
      description: 'বিকালে বিদ্যুৎ চলে যায় বেশিক্ষণ, ব্যবসার ক্ষতি হচ্ছে।',
      status: 'সমাধানকৃত',
      statusTone: 'green',
      date: '২০২৬-০৯-১৮'
    },
    {
      name: 'অন্য ব্যক্তি',
      area: '৮নং চুনতি',
      category: 'শিক্ষা / স্বাস্থ্য',
      description: 'দু’টি উপজেলা প্রশিক্ষণ কেন্দ্রের জন্য আরও স্যানিটেশন ব্যবস্থা প্রয়োজন।',
      status: 'বিবেচনাধীন',
      statusTone: 'amber',
      date: '২০২৬-০৯-১৭'
    }
  ];

  const grievanceFeed = document.getElementById('grievanceFeed');
  const grievanceList = document.getElementById('grievanceList');
  const grievanceSearch = document.getElementById('grievanceSearch');
  const grievanceModal = document.getElementById('grievanceModal');
  const openGrievanceModal = document.getElementById('openGrievanceModal');
  const closeGrievanceModal = document.getElementById('closeGrievanceModal');
  const cancelGrievanceModal = document.getElementById('cancelGrievanceModal');
  const grievanceForm = document.getElementById('grievanceForm');

  const statusStyles = {
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-sky-100 text-sky-700',
    green: 'bg-emerald-100 text-emerald-700'
  };

  const renderGrievanceFeed = () => {
    if (!grievanceFeed) return;

    grievanceFeed.innerHTML = grievanceData.slice(0, 3).map((item) => `
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div class="mb-2 flex items-center justify-between gap-3">
          <span class="text-xs font-bold text-slate-500">${item.area}</span>
          <span class="inline-flex rounded-full ${statusStyles[item.statusTone]} px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em]">${item.status}</span>
        </div>
        <p class="text-sm font-bold text-slate-800">${item.category}</p>
        <p class="mt-1 text-xs leading-5 text-slate-600">${item.description}</p>
      </div>
    `).join('');
  };

  const renderGrievanceList = () => {
    if (!grievanceList) return;

    const query = (grievanceSearch?.value || '').trim().toLowerCase();
    const filtered = grievanceData.filter((item) => {
      const haystack = `${item.name} ${item.area} ${item.category} ${item.description}`.toLowerCase();
      return !query || haystack.includes(query);
    });

    grievanceList.innerHTML = filtered.map((item) => `
      <article class="rounded-[22px] border border-slate-200 bg-slate-50 p-3 shadow-sm">
        <div class="mb-2 flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-extrabold text-slate-900">${item.name}</p>
            <p class="text-[11px] text-slate-500">${item.area}</p>
          </div>
          <span class="inline-flex rounded-full ${statusStyles[item.statusTone]} px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em]">${item.status}</span>
        </div>

        <div class="mb-2 inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-sky-700">${item.category}</div>

        <p class="text-sm leading-6 text-slate-600">${item.description}</p>
        <div class="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>📅 ${item.date}</span>
          <span>Anonymous: No</span>
        </div>
      </article>
    `).join('');
  };

  grievanceSearch?.addEventListener('input', renderGrievanceList);

  const openModal = () => {
    grievanceModal?.classList.remove('hidden');
    grievanceModal?.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  };

  const closeModal = () => {
    grievanceModal?.classList.add('hidden');
    grievanceModal?.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  };

  openGrievanceModal?.addEventListener('click', openModal);
  closeGrievanceModal?.addEventListener('click', closeModal);
  cancelGrievanceModal?.addEventListener('click', closeModal);

  grievanceModal?.addEventListener('click', (event) => {
    if (event.target === grievanceModal) closeModal();
  });

  grievanceForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('grievanceName')?.value?.trim();
    const phone = document.getElementById('grievancePhone')?.value?.trim();
    const area = document.getElementById('grievanceArea')?.value?.trim();
    const category = document.getElementById('grievanceCategory')?.value || 'অন্যান্য';
    const description = document.getElementById('grievanceDescription')?.value?.trim();

    if (!name || !phone || !area || !description) {
      alert('অনুগ্রহ করে সব প্রয়োজনীয় ফিল্ড পূরণ করুন।');
      return;
    }

    grievanceData.unshift({
      name,
      area,
      category,
      description,
      status: 'বিবেচনাধীন',
      statusTone: 'amber',
      date: new Date().toISOString().slice(0, 10)
    });

    grievanceForm.reset();
    closeModal();
    renderGrievanceFeed();
    renderGrievanceList();

    alert('আপনার অভিযোগ সফলভাবে জমা হয়েছে।');
  });

  renderGrievanceFeed();
  renderGrievanceList();

  const artisanDirectory = [
    {
      name: 'আমিনুর রহমান',
      area: '৪নং চরম্বা',
      category: 'craft',
      badge: 'হস্তশিল্প',
      skill: 'বাঁশ ও বেতের কাজ',
      description: 'কাঠের আসবাব, ঝুড়ি, টিফিন বক্স, সাজসজ্জা ও পারিবারিক ব্যবহার্য বাঁশের জিনিস তৈরি করি।',
      phone: '+8801700003001',
      avatar: '🧺'
    },
    {
      name: 'মাসুমা খাতুন',
      area: '৬নং লোহাগাড়া',
      category: 'craft',
      badge: 'হস্তশিল্প',
      skill: 'নকশী কাঁথা ও embroidery',
      description: 'কাজের গুনগত মান দিয়ে নকশী কাঁথা, কাপড়ের ডিজাইন, আলংকারিক বুটিক কাজ করি।',
      phone: '+8801700003002',
      avatar: '🧵'
    },
    {
      name: 'সেলিম মিয়া',
      area: '২নং আমিরাবাদ',
      category: 'artisan',
      badge: 'কারিগর',
      skill: 'দর্জি ও ফ্যাশন',
      description: 'পুরুষ, নারী ও শিশুদের কাস্টম ফিট ড্রেস, জরুরি মেরামত ও কাপড়ের সেলাই সেবা দিই।',
      phone: '+8801700003003',
      avatar: '🧥'
    },
    {
      name: 'আবু বক্কর',
      area: '১নং বড়হাতিয়া',
      category: 'artisan',
      badge: 'কারিগর',
      skill: 'ফ্রিজ ও মোটর মেরামত',
      description: 'লোকাল গৃহস্থালি ইলেকট্রিক কাজ, মোটর, ফ্যান, ওয়াশিং মেশিন ও ছোটখাটো মেরামত করি।',
      phone: '+8801700003004',
      avatar: '🔧'
    },
    {
      name: 'জাহিদুল ইসলাম',
      area: '৯নং আধুনগর',
      category: 'expert',
      badge: 'বিশেষজ্ঞ',
      skill: 'ডিজিটাল ও IT সেবা',
      description: 'মোবাইল রিকভারি, কম্পিউটার সেটআপ, নেটওয়ার্কিং, ডিজিটাল সেবা ও ছোট প্রতিষ্ঠানকে অনলাইন দিকনির্দেশনা দিই।',
      phone: '+8801700003005',
      avatar: '💻'
    },
    {
      name: 'শামীম আহমেদ',
      area: '৭নং পুটিবিলা',
      category: 'expert',
      badge: 'বিশেষজ্ঞ',
      skill: 'ভাস্কর্য ও পেইন্টিং',
      description: 'ফেস-লিফট, হোম ডেকোরেশন, ইন্ডোর পেইন্টিং ও গ্রাফিক ডিজাইন সেবা দিয়ে থাকি।',
      phone: '+8801700003006',
      avatar: '🎨'
    }
  ];

  const artisanFilters = document.querySelectorAll('.artisan-filter');
  const artisanGrid = document.getElementById('artisanGrid');
  const artisanModal = document.getElementById('artisanModal');
  const openArtisanModal = document.getElementById('openArtisanModal');
  const closeArtisanModal = document.getElementById('closeArtisanModal');
  const cancelArtisanModal = document.getElementById('cancelArtisanModal');
  const artisanForm = document.getElementById('artisanForm');

  const renderArtisanCards = () => {
    if (!artisanGrid) return;

    const activeCategory = document.querySelector('.artisan-filter.active')?.dataset.category || 'all';
    const items = artisanDirectory.filter((item) => activeCategory === 'all' || item.category === activeCategory);

    artisanGrid.innerHTML = items.map((artisan) => `
      <article class="artisan-card" data-category="${artisan.category}">
        <div class="artisan-card-top">
          <div class="artisan-avatar" aria-hidden="true">${artisan.avatar}</div>
          <div class="artisan-name-wrap">
            <h3 class="artisan-name">${artisan.name}</h3>
            <div class="artisan-area">${artisan.area}</div>
          </div>
        </div>

        <span class="artisan-badge badge-${artisan.category}">${artisan.badge}</span>

        <div class="artisan-description">
          <strong style="display:block; margin-bottom:6px; color:#111827;">${artisan.skill}</strong>
          ${artisan.description}
        </div>

        <div class="artisan-meta">
          <span class="artisan-status">এখন খোলা</span>
          <div class="artisan-actions">
            <a href="tel:${artisan.phone}" class="artisan-call">কল করুন</a>
            <a href="https://wa.me/${artisan.phone.replace(/\D/g, '')}" target="_blank" rel="noreferrer" class="artisan-whatsapp">WhatsApp</a>
          </div>
        </div>
      </article>
    `).join('');
  };

  artisanFilters.forEach((button) => {
    button.addEventListener('click', () => {
      artisanFilters.forEach((item) => item.classList.toggle('active', item === button));
      renderArtisanCards();
    });
  });

  const openArtisanDialog = () => {
    artisanModal?.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };

  const closeArtisanDialog = () => {
    artisanModal?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  openArtisanModal?.addEventListener('click', openArtisanDialog);
  closeArtisanModal?.addEventListener('click', closeArtisanDialog);
  cancelArtisanModal?.addEventListener('click', closeArtisanDialog);
  artisanModal?.addEventListener('click', (event) => {
    if (event.target === artisanModal) closeArtisanDialog();
  });

  artisanForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('artisanName')?.value?.trim();
    const phone = document.getElementById('artisanPhone')?.value?.trim();
    const category = document.getElementById('artisanCategory')?.value || 'craft';
    const area = document.getElementById('artisanArea')?.value?.trim();
    const skill = document.getElementById('artisanSkill')?.value?.trim();
    const bio = document.getElementById('artisanBio')?.value?.trim();

    if (!name || !phone || !area || !skill || !bio) {
      alert('অনুগ্রহ করে সব তথ্য লিখে আবার জমা দিন।');
      return;
    }

    const badgeMap = {
      craft: 'হস্তশিল্প',
      artisan: 'কারিগর',
      expert: 'বিশেষজ্ঞ'
    };

    artisanDirectory.unshift({
      name,
      area,
      category,
      badge: badgeMap[category] || 'কারিগর',
      skill,
      description: bio,
      phone,
      avatar: category === 'expert' ? '💡' : category === 'artisan' ? '🛠️' : '✨'
    });

    artisanForm.reset();
    closeArtisanDialog();
    renderArtisanCards();
    alert('আপনার দক্ষতা সফলভাবে যোগ করা হয়েছে।');
  });

  renderArtisanCards();

  const oxygenInventory = [
    {
      name: 'অক্সিজেন সিলিন্ডার',
      type: 'oxygen',
      icon: '🫁',
      status: 'available',
      provider: 'লোহাগাড়া যুব ফোরাম',
      area: '৬নং লোহাগাড়া',
      details: '৫ L cylinder • ১,২০০ টাকা ডিপোজিট • ফিল্ড সেবা উপলব্ধ',
      phone: '+8801700005001',
      note: 'বিপদাপন্ন অবস্থায় দ্রুত ডেলিভারি দেওয়া হয়।'
    },
    {
      name: 'হুইলচেয়ার',
      type: 'wheelchair',
      icon: '♿',
      status: 'available',
      provider: 'পদুয়া স্বেচ্ছাসেবী দল',
      area: 'পদুয়া',
      details: 'উচ্চতা-সহনশীল • ৭ দিনের জন্য ধার দেওয়া হয়',
      phone: '+8801700005002',
      note: 'কোনো ডিপোজিট ছাড়া পরিবারকে সহায়তা করা হয়।'
    },
    {
      name: 'নেবুলাইজার',
      type: 'nebulizer',
      icon: '💨',
      status: 'booked',
      provider: 'চুনতি স্বাস্থ্য কমিটি',
      area: 'চুনতি',
      details: 'মেশিন + নাল + কনুই • ধার ২৪ ঘণ্টা',
      phone: '+8801700005003',
      note: 'বর্তমানে একটি পরিবার স্ট্যাটাসে সংরক্ষিত রয়েছে।'
    },
    {
      name: 'স্ট্রেচার',
      type: 'stretcher',
      icon: '🩺',
      status: 'available',
      provider: 'কালাইয়া সামাজিক সাহায্য কেন্দ্র',
      area: 'কালাইয়া',
      details: 'স্ট্যান্ডার্ড ব্যাক-up stretcher • ২৪ ঘণ্টা ব্যবহারের শর্ত',
      phone: '+8801700005004',
      note: 'বাস্তব জরুরি অবস্থায় সঙ্গে নিয়ে যাওয়ার ব্যবস্থা আছে।'
    },
    {
      name: 'অক্সিজেন সিলিন্ডার',
      type: 'oxygen',
      icon: '🫧',
      status: 'booked',
      provider: 'ইমামপুর জনস্বাস্থ্য ফোরাম',
      area: 'ইমামপুর',
      details: '১০ L cylinder • ২৪ ঘণ্টা রিজার্ভ • ডিপোজিট ১৫০০ টাকা',
      phone: '+8801700005005',
      note: 'একটি রেফারেল কেসে বরাদ্দ করা হয়েছে।'
    },
    {
      name: 'হুইলচেয়ার',
      type: 'wheelchair',
      icon: '🦽',
      status: 'available',
      provider: 'লোহাগাড়া প্রবাসী পরিবার',
      area: '৮নং চুনতি',
      details: 'কমপ্যাক্ট রোলার • ৩ দিন ধার • জরুরি প্রয়োজনে সেবা',
      phone: '+8801700005006',
      note: 'খুব দ্রুত হ্যান্ড-ওভার করা যাবে।'
    }
  ];

  const oxygenFilters = document.querySelectorAll('.oxygen-filter');
  const oxygenGrid = document.getElementById('oxygenGrid');
  const oxygenModal = document.getElementById('oxygenModal');
  const openOxygenModal = document.getElementById('openOxygenModal');
  const closeOxygenModal = document.getElementById('closeOxygenModal');
  const cancelOxygenModal = document.getElementById('cancelOxygenModal');
  const oxygenForm = document.getElementById('oxygenForm');

  const renderOxygenInventory = () => {
    if (!oxygenGrid) return;

    const activeCategoryButton = document.querySelector('.oxygen-filter[data-category].active') || document.querySelector('.oxygen-filter[data-category="all"]');
    const activeStatusButton = document.querySelector('.oxygen-filter[data-status].active');

    const activeCategory = activeCategoryButton?.dataset.category || 'all';
    const activeStatus = activeStatusButton?.dataset.status || 'all';

    const filteredItems = oxygenInventory.filter((item) => {
      const categoryMatch = activeCategory === 'all' || item.type === activeCategory;
      const statusMatch = activeStatus === 'all' || item.status === activeStatus;
      return categoryMatch && statusMatch;
    });

    oxygenGrid.innerHTML = filteredItems.map((item) => `
      <article class="oxygen-card">
        <div class="oxygen-card-header">
          <div class="oxygen-icon" aria-hidden="true">${item.icon}</div>
          <span class="oxygen-status ${item.status === 'available' ? 'status-available' : 'status-booked'}">${item.status === 'available' ? 'উপলব্ধ' : 'সংরক্ষিত'}</span>
        </div>

        <h3 class="oxygen-name">${item.name}</h3>
        <p class="oxygen-provider">${item.provider}</p>
        <p class="oxygen-area">${item.area}</p>

        <div class="oxygen-details">
          ${item.details}<br />
          ${item.note}
        </div>

        <div class="oxygen-actions">
          <a href="tel:${item.phone}" class="oxygen-call">কল করুন</a>
          <a href="https://wa.me/${item.phone.replace(/\D/g, '')}" target="_blank" rel="noreferrer" class="oxygen-whatsapp">WhatsApp</a>
        </div>
      </article>
    `).join('');
  };

  oxygenFilters.forEach((button) => {
    button.addEventListener('click', () => {
      const hasCategory = !!button.dataset.category;
      const hasStatus = !!button.dataset.status;

      if (hasCategory) {
        oxygenFilters.forEach((item) => {
          if (item.dataset.category) item.classList.toggle('active', item === button);
        });
      }

      if (hasStatus) {
        oxygenFilters.forEach((item) => {
          if (item.dataset.status) item.classList.toggle('active', item === button);
        });
      }

      renderOxygenInventory();
    });
  });

  const openOxygenDialog = () => {
    oxygenModal?.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };

  const closeOxygenDialog = () => {
    oxygenModal?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  openOxygenModal?.addEventListener('click', openOxygenDialog);
  closeOxygenModal?.addEventListener('click', closeOxygenDialog);
  cancelOxygenModal?.addEventListener('click', closeOxygenDialog);
  oxygenModal?.addEventListener('click', (event) => {
    if (event.target === oxygenModal) closeOxygenDialog();
  });

  oxygenForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const type = document.getElementById('equipmentType')?.value || 'oxygen';
    const status = document.getElementById('equipmentStatus')?.value || 'available';
    const provider = document.getElementById('equipmentProvider')?.value?.trim();
    const phone = document.getElementById('equipmentPhone')?.value?.trim();
    const area = document.getElementById('equipmentArea')?.value?.trim();
    const details = document.getElementById('equipmentDetails')?.value?.trim();
    const note = document.getElementById('equipmentNote')?.value?.trim();

    if (!provider || !phone || !area || !note) {
      alert('অনুগ্রহ করে প্রয়োজনীয় তথ্য লিখে আবার জমা দিন।');
      return;
    }

    const typeMap = {
      oxygen: { label: 'অক্সিজেন সিলিন্ডার', icon: '🫁' },
      wheelchair: { label: 'হুইলচেয়ার', icon: '♿' },
      nebulizer: { label: 'নেবুলাইজার', icon: '💨' },
      stretcher: { label: 'স্ট্রেচার', icon: '🩺' }
    };

    oxygenInventory.unshift({
      name: typeMap[type]?.label || 'সরঞ্জাম',
      type,
      icon: typeMap[type]?.icon || '🩺',
      status,
      provider,
      area,
      details: details || 'বিস্তারিত লিখিত নেই',
      phone,
      note
    });

    oxygenForm.reset();
    closeOxygenDialog();
    renderOxygenInventory();
    alert('আপনার সরঞ্জাম সফলভাবে রেজিস্টার হয়েছে।');
  });

  renderOxygenInventory();

  const marketPriceData = [
    { name: 'পান পাতা', unit: '১০০টি', price: '৳ ৫৮০', trend: 'up', category: 'hill', market: 'লোহাগাড়া বাজার' },
    { name: 'আম', unit: 'কেজি', price: '৳ ৪৮', trend: 'up', category: 'fruit', market: 'পদুয়া বাজার' },
    { name: 'লেবু', unit: 'কেজি', price: '৳ ৬২', trend: 'down', category: 'fruit', market: 'লোহাগাড়া বাজার' },
    { name: 'শাকসবজি', unit: 'কেজি', price: '৳ ৩০', trend: 'flat', category: 'market', market: 'বড়হাতিয়া বাজার' },
    { name: 'বীজ', unit: 'কেজি', price: '৳ ১৮৫', trend: 'up', category: 'seed', market: 'উপজেলা কৃষি অফিস' },
    { name: 'সার', unit: 'ব্যাগ', price: '৳ ৮৫০', trend: 'flat', category: 'seed', market: 'লোহাগাড়া বাজার' },
    { name: 'আলু', unit: 'কেজি', price: '৳ ২৮', trend: 'down', category: 'market', market: 'চুনতি বাজার' },
    { name: 'কুমড়া', unit: 'কেজি', price: '৳ ৩৬', trend: 'up', category: 'hill', market: 'লোহাগাড়া বাজার' }
  ];

  const krishiFilterButtons = document.querySelectorAll('.krishi-filter');
  const krishiPriceSearch = document.getElementById('krishiPriceSearch');
  const marketPriceGrid = document.getElementById('marketPriceGrid');
  const refreshMarketBtn = document.getElementById('refreshMarketBtn');

  const renderMarketPrices = () => {
    if (!marketPriceGrid) return;

    const activeFilter = document.querySelector('.krishi-filter.active')?.dataset.filter || 'all';
    const query = (krishiPriceSearch?.value || '').trim().toLowerCase();

    const filteredItems = marketPriceData.filter((item) => {
      const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
      const matchesSearch = !query || `${item.name} ${item.market}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    if (!filteredItems.length) {
      marketPriceGrid.innerHTML = `
        <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <p class="text-base font-extrabold text-slate-700">কোনো দাম পাওয়া যায়নি</p>
          <p class="mt-1 text-sm text-slate-500">অন্য ক্যাটাগরি বা পণ্যের নাম দিয়ে আবার খুঁজুন।</p>
        </div>
      `;
      return;
    }

    marketPriceGrid.innerHTML = filteredItems.map((item) => `
      <div class="market-price-row">
        <div class="market-price-row-inner">
          <div class="price-product">
            <strong>${item.name}</strong>
            <small>${item.market}</small>
          </div>
          <span class="price-unit">${item.unit}</span>
          <span class="price-price">${item.price}</span>
          <span class="price-trend ${item.trend === 'up' ? 'trend-up' : item.trend === 'down' ? 'trend-down' : 'trend-flat'}">${item.trend === 'up' ? '↑ Up' : item.trend === 'down' ? '↓ Down' : '→ Flat'}</span>
          <span class="price-market">${item.market}</span>
        </div>
      </div>
    `).join('');
  };

  krishiFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      krishiFilterButtons.forEach((item) => item.classList.toggle('active', item === button));
      renderMarketPrices();
    });
  });

  krishiPriceSearch?.addEventListener('input', renderMarketPrices);

  refreshMarketBtn?.addEventListener('click', () => {
    renderMarketPrices();
    refreshMarketBtn.textContent = 'Updated';
    setTimeout(() => {
      refreshMarketBtn.textContent = 'Refresh';
    }, 1200);
  });

  renderMarketPrices();

  const bloodDonorPool = [
    { name: 'মোঃ রাকিব', bloodGroup: 'A+', union: '৬নং লোহাগাড়া', lastDonated: '২০২৬-০১-১৫', phone: '+8801711223344', active: true },
    { name: 'মোঃ সোহেল', bloodGroup: 'O+', union: '২নং আমিরাবাদ', lastDonated: '২০২৬-০২-১২', phone: '+8801811223344', active: true },
    { name: 'মোঃ আতিক', bloodGroup: 'B-', union: '৩নং পদুয়া', lastDonated: '২০২৬-০২-১৮', phone: '+8801911223344', active: true },
    { name: 'মোঃ জুবায়ের', bloodGroup: 'AB+', union: '৪নং চরম্বা', lastDonated: '২০২৬-০৩-০৮', phone: '+8801611223344', active: true },
    { name: 'মোঃ ইব্রাহিম', bloodGroup: 'O-', union: '৫নং কলাউজান', lastDonated: '২০২৬-০৪-০১', phone: '+8801511223344', active: true },
    { name: 'মোঃ নাঈম', bloodGroup: 'A-', union: '১নং বড়হাতিয়া', lastDonated: '২০২৬-০৪-২০', phone: '+8801411223344', active: true },
    { name: 'নাসরিন আক্তার', bloodGroup: 'B+', union: '৬নং লোহাগাড়া', lastDonated: '২০২৬-০৫-১০', phone: '+8801723344556', active: true },
    { name: 'মোঃ রেহমান', bloodGroup: 'AB-', union: '৮নং চুনতি', lastDonated: '২০২৬-০৬-০৩', phone: '+8801788990011', active: true },
    { name: 'মোঃ হেলাল', bloodGroup: 'A+', union: '৭নং পুটিবিলা', lastDonated: '২০২৬-০৬-১২', phone: '+8801700998811', active: true },
    { name: 'মোঃ নুরুল', bloodGroup: 'O+', union: '৯নং আধুনগর', lastDonated: '২০২৬-০৭-০৮', phone: '+8801898877665', active: true }
  ];

  const bloodCompatibility = {
    'A+': ['A+', 'O+'],
    'A-': ['A+', 'A-', 'O+', 'O-'],
    'B+': ['B+', 'O+'],
    'B-': ['B+', 'B-', 'O+', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+'],
    'O-': ['O-']
  };

  const bloodRequestModal = document.getElementById('bloodRequestModal');
  const openBloodRequestModal = document.getElementById('openBloodRequestModal');
  const closeBloodRequestModal = document.getElementById('closeBloodRequestModal');
  const cancelBloodRequestModal = document.getElementById('cancelBloodRequestModal');
  const bloodRequestForm = document.getElementById('bloodRequestForm');
  const bloodMatchList = document.getElementById('bloodMatchList');
  const alertStatus = document.getElementById('bloodAlertStatus');
  const registerDonorBtn = document.getElementById('registerDonorBtn');

  const setAlertStatus = (text, busy = false) => {
    if (!alertStatus) return;
    const spinner = alertStatus.querySelector('.status-spinner');
    if (spinner) spinner.style.display = busy ? 'inline-block' : 'none';
    const label = alertStatus.querySelector('span:last-child');
    if (label) label.textContent = text;
  };

  const triggerEmergencyTone = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const tones = [880, 660, 990];
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.04;
    gainNode.connect(audioContext.destination);

    tones.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = frequency;
      oscillator.connect(gainNode);
      oscillator.start(audioContext.currentTime + index * 0.12);
      oscillator.stop(audioContext.currentTime + index * 0.12 + 0.1);
    });
  };

  const openBloodModal = () => {
    bloodRequestModal?.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };

  const closeBloodModal = () => {
    bloodRequestModal?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  openBloodRequestModal?.addEventListener('click', openBloodModal);
  closeBloodRequestModal?.addEventListener('click', closeBloodModal);
  cancelBloodRequestModal?.addEventListener('click', closeBloodModal);
  bloodRequestModal?.addEventListener('click', (event) => {
    if (event.target === bloodRequestModal) closeBloodModal();
  });

  const renderBloodMatches = (requestedGroup) => {
    if (!bloodMatchList) return;

    const sortedMatches = [...bloodDonorPool]
      .filter((donor) => donor.active)
      .map((donor) => {
        const isExact = donor.bloodGroup === requestedGroup;
        const compatibility = bloodCompatibility[requestedGroup] || [requestedGroup];
        const isCompatible = compatibility.includes(donor.bloodGroup);
        const priority = isExact ? 0 : isCompatible ? 1 : 2;
        return { ...donor, priority };
      })
      .sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name))
      .slice(0, 6);

    if (!sortedMatches.length) {
      bloodMatchList.innerHTML = `
        <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
          <p class="text-base font-extrabold text-slate-700">No active donor match found</p>
          <p class="mt-1 text-sm text-slate-500">Please try another compatible blood group or request wider community support.</p>
        </div>
      `;
      return;
    }

    bloodMatchList.innerHTML = sortedMatches.map((donor, index) => `
      <div class="match-card">
        <div class="match-rank">${index + 1}</div>
        <div class="match-info">
          <h4>${donor.name}</h4>
          <p>${donor.union} • ${donor.bloodGroup} • Last donated: ${donor.lastDonated}</p>
          <div class="match-actions">
            <a class="match-call" href="tel:${donor.phone.replace(/\s+/g, '')}">Call</a>
            <a class="match-sms" href="sms:${donor.phone.replace(/\s+/g, '')}?body=Hello%20${encodeURIComponent(donor.name)},%20can%20you%20help%20with%20a%20blood%20donation%20request?">SMS</a>
          </div>
        </div>
        <span class="priority-badge">${donor.bloodGroup === requestedGroup ? 'Exact' : 'Compatible'}</span>
      </div>
    `).join('');
  };

  bloodRequestForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const patientName = document.getElementById('patientName')?.value?.trim();
    const requestedGroup = document.getElementById('bloodGroup')?.value || 'O+';
    const location = document.getElementById('requestLocation')?.value?.trim();
    const phone = document.getElementById('requestPhone')?.value?.trim();
    const units = document.getElementById('unitsNeeded')?.value || '2';

    if (!patientName || !location || !phone) {
      alert('Please fill in patient and contact details before sending the emergency alert.');
      return;
    }

    const candidates = [...bloodDonorPool].filter((donor) => donor.active).length;
    setAlertStatus(`Sending SMS / Browser alerts to ${candidates} active donors in Lohagara...`, true);
    triggerEmergencyTone();
    closeBloodModal();

    setTimeout(() => {
      renderBloodMatches(requestedGroup);
      setAlertStatus(`Emergency alert sent for ${patientName} • ${requestedGroup} • ${units} units • ${location}`, false);
    }, 1600);
  });

  registerDonorBtn?.addEventListener('click', () => {
    const donorName = document.getElementById('donorName')?.value?.trim() || 'Community Donor';
    const donorPhone = document.getElementById('donorPhone')?.value?.trim();
    const donorBloodGroup = document.getElementById('donorBloodGroup')?.value || 'O+';
    const donorUnion = document.getElementById('donorUnion')?.value || '৬নং লোহাগাড়া';

    if (!donorPhone) {
      alert('Please provide your phone number to activate donor status.');
      return;
    }

    const alreadyExists = bloodDonorPool.some((donor) => donor.phone === donorPhone);
    if (alreadyExists) {
      const donor = bloodDonorPool.find((entry) => entry.phone === donorPhone);
      donor.active = true;
      donor.bloodGroup = donorBloodGroup;
      donor.union = donorUnion;
      donor.lastDonated = '২০২৬-০৮-২০';
      donor.name = donorName;
    } else {
      bloodDonorPool.unshift({
        name: donorName,
        bloodGroup: donorBloodGroup,
        union: donorUnion,
        lastDonated: '২০২৬-০৮-২০',
        phone: donorPhone,
        active: true
      });
    }

    renderBloodMatches(donorBloodGroup);
    setAlertStatus(`Donor activated successfully for ${donorBloodGroup} in ${donorUnion}.`, false);
    document.getElementById('donorName').value = '';
    document.getElementById('donorPhone').value = '';
  });

  renderBloodMatches('O+');
  syncTabs('tab-ambulance');
  applyAmbulanceFilter('all');
  applyBloodFilter();
  applyDoctorFilter('all');
  syncEduTabs('edu-library');
  applyNoticeFilter('all');
  applyRouteFilter('all');
  applyDriverFilter('all');
  applyMarketplaceFilter();
  renderLostFoundCards();
  renderJobBoard();

  const unionLabelMap = {
    all: 'সব এলাকা',
    bighatia: '১নং বড়হাতিয়া',
    amirabad: '২নং আমিরাবাদ',
    padua: '৩নং পদুয়া',
    chormba: '৪নং চরম্বা',
    kolaizan: '৫নং কলাউজান',
    lohagara: '৬নং লোহাগাড়া',
    putibila: '৭নং পুটিবিলা',
    chunati: '৮নং চুনতি',
    adhunagar: '৯নং আধুনগর'
  };

  const serviceDirectory = [
    {
      title: 'লোহাগাড়া জরুরি অ্যাম্বুলেন্স',
      category: 'অ্যাম্বুলেন্স ও পরিবহন',
      union: 'lohagara',
      area: '৬নং লোহাগাড়া',
      phone: '০১৭০০-০০০০০১',
      description: 'জরুরি রোগী পরিবহন, হাসপাতালে পাঠানো ও রোগীর নিরাপদ স্থানান্তর সেবা।'
    },
    {
      title: 'গ্রীন লাইফ মেডিকেল',
      category: 'চিকিৎসক ও স্বাস্থ্য',
      union: 'padua',
      area: '৩নং পদুয়া',
      phone: '০১৭০০-০০০০০২',
      description: 'ডাক্তার, ডায়াগনস্টিক, ভ্যাকসিন ও সাধারণ চিকিৎসা সেবা।'
    },
    {
      title: 'ভিজিট ডাক্তারের কনসালটেশন',
      category: 'চিকিৎসক ও স্বাস্থ্য',
      union: 'chunati',
      area: '৮নং চুনতি',
      phone: '০১৭০০-০০০০০৩',
      description: 'ফিজিশিয়ান, চক্ষু, শিশু ও পরিবার-ভিত্তিক কনসালটেশন।'
    },
    {
      title: 'ইউনিয়ন ব্লাড ডোনার নেটওয়ার্ক',
      category: 'রক্তদাতা গ্রুপ',
      union: 'lohagara',
      area: '৬নং লোহাগাড়া',
      phone: '০১৭০০-০০০০০৪',
      description: 'প্লাজমা, রক্ত ও জরুরি রক্তদাতা খুঁজে দেওয়ার সেবা।'
    },
    {
      title: 'জল-সংশ্লিষ্ট জরুরি মেরামত',
      category: 'জরুরি সাহায্য',
      union: 'amirabad',
      area: '২নং আমিরাবাদ',
      phone: '০১৭০০-০০০০০৫',
      description: 'নল, পানি লিকেজ, ড্রেন ও অস্থায়ী জরুরি কাজে সহায়তা।'
    },
    {
      title: 'সদর ইলেকট্রিক ও সার্ভিসিং',
      category: 'জরুরি সাহায্য',
      union: 'lohagara',
      area: '৬নং লোহাগাড়া',
      phone: '০১৭০০-০০০০০৬',
      description: 'ফ্যান, লাইট, সংযোগ, সোলার ও হোম ইলেকট্রিক মেরামত।'
    },
    {
      title: 'দাদা বাচ্চা মোটর ও ফিটিং',
      category: 'অ্যাম্বুলেন্স ও পরিবহন',
      union: 'bighatia',
      area: '১নং বড়হাতিয়া',
      phone: '০১৭০০-০০০০০৭',
      description: 'সিএনজি, মোটরসাইকেল, ছোট যন্ত্রপাতির দ্রুত ফিটিং সেবা।'
    },
    {
      title: 'কৃষক হেল্পলাইন',
      category: 'জরুরি সাহায্য',
      union: 'chormba',
      area: '৪নং চরম্বা',
      phone: '০১৭০০-০০০০০৮',
      description: 'বীজ, সার, ফসলের সমস্যা, পানির জন্য কৃষক সহায়তা।'
    },
    {
      title: 'স্কুল স্টুডেন্ট সাপোর্ট',
      category: 'চিকিৎসক ও স্বাস্থ্য',
      union: 'kolaizan',
      area: '৫নং কলাউজান',
      phone: '০১৭০০-০০০০০৯',
      description: 'শিক্ষার্থী ও পরিবারকে স্বাস্থ্য, ভিটামিন ও প্রাথমিক সেবা।'
    },
    {
      title: 'ডিজিটাল সেবা কেন্দ্র',
      category: 'চিকিৎসক ও স্বাস্থ্য',
      union: 'putibila',
      area: '৭নং পুটিবিলা',
      phone: '০১৭০০-০০০০১০',
      description: 'নথি, ডিজিটাল সার্ভিস, অনলাইন আবেদন ও ই-সার্ভিস সহায়তা।'
    },
    {
      title: 'মোবাইল রিকভারি ও সেটআপ',
      category: 'চিকিৎসক ও স্বাস্থ্য',
      union: 'adhunagar',
      area: '৯নং আধুনগর',
      phone: '০১৭০০-০০০০১১',
      description: 'মোবাইল, ট্যাব, ল্যাপটপ ও কম্পিউটার সেটআপ ও রিকভারি।'
    },
    {
      title: 'বাড়ির ছাদ ও রং সার্ভিস',
      category: 'জরুরি সাহায্য',
      union: 'bighatia',
      area: '১নং বড়হাতিয়া',
      phone: '০১৭০০-০০০০১২',
      description: 'ছাদ মেরামত, রং করা, ছোট সাজসজ্জা ও ঘর সংস্কার।'
    },
    {
      title: 'সাহায্যকামী নৌকা ও ভ্রমণ',
      category: 'অ্যাম্বুলেন্স ও পরিবহন',
      union: 'chormba',
      area: '৪নং চরম্বা',
      phone: '০১৭০০-০০০০১৩',
      description: 'নৌকা ভাড়া, গ্রামের ভেতর চলাচল, জরুরি যাত্রী পরিবহন।'
    },
    {
      title: 'সামাজিক বিচার ও আইন সহায়তা',
      category: 'জরুরি সাহায্য',
      union: 'lohagara',
      area: '৬নং লোহাগাড়া',
      phone: '০১৭০০-০০০০১৪',
      description: 'আইনি পরামর্শ, দলিল ও নথি সহায়তা ও স্থানীয় সংলাপ।'
    },
    {
      title: 'স্টার ফার্নিচার ও সেলাই',
      category: 'চিকিৎসক ও স্বাস্থ্য',
      union: 'padua',
      area: '৩নং পদুয়া',
      phone: '০১৭০০-০০০০১৫',
      description: 'দর্জি, কাপড় সেলাই, পারিবারিক সাজসজ্জা ও কাস্টম মেরামত।'
    },
    {
      title: 'গৃহস্থালি নার্সিং সাপোর্ট',
      category: 'চিকিৎসক ও স্বাস্থ্য',
      union: 'amirabad',
      area: '২নং আমিরাবাদ',
      phone: '০১৭০০-০০০০১৬',
      description: 'বাড়িতে প্রাথমিক চিকিৎসা, নার্সিং ও নিবিড় সেবার দিকনির্দেশনা।'
    },
    {
      title: 'জরুরি কবরস্থানে কফিন ও শেষযাত্রায় সহায়তা',
      category: 'জরুরি সাহায্য',
      union: 'putibila',
      area: '৭নং পুটিবিলা',
      phone: '০১৭০০-০০০০১৭',
      description: 'সামাজিক সহায়তা, কফিন, পরিবহন ও দাফনের সহায়তা।'
    }
  ];

  const serviceList = document.getElementById('serviceList');
  const searchInput = document.getElementById('searchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const addServiceForm = document.getElementById('addServiceForm');

  const renderServices = () => {
    if (!serviceList) return;

    const activeUnion = document.querySelector('.filter-btn.active')?.dataset.union || 'all';
    const query = (searchInput?.value || '').trim().toLowerCase();

    const filteredServices = serviceDirectory.filter((service) => {
      const matchesUnion = activeUnion === 'all' || service.union === activeUnion;
      const haystack = `${service.title} ${service.category} ${service.area} ${service.description}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesUnion && matchesQuery;
    });

    if (!filteredServices.length) {
      serviceList.innerHTML = `
        <div class="empty-state">
          <strong>কোনো সেবা খুঁজে পাওয়া যায়নি</strong>
          <span>আলাদা শব্দ বা অন্য এলাকা বেছে নিয়ে আবার চেষ্টা করুন।</span>
        </div>
      `;
      return;
    }

    serviceList.innerHTML = filteredServices.map((service) => `
      <article class="service-card">
        <div class="card-topline">
          <span class="category-tag">${service.category}</span>
        </div>
        <h4>${service.title}</h4>
        <p class="location">${service.area} • ${unionLabelMap[service.union] || 'লোকাল সেবা'}</p>
        <p class="location" style="margin-top: 8px; font-size: 12px; line-height: 1.6; color: var(--muted);">${service.description}</p>
        <div class="card-footer">
          <span>${service.phone}</span>
          <a href="tel:${service.phone.replace(/\D/g, '')}">কল করুন</a>
        </div>
      </article>
    `).join('');
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));
      renderServices();
    });
  });

  searchInput?.addEventListener('input', renderServices);

  addServiceForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('newTitle')?.value?.trim();
    const category = document.getElementById('newCategory')?.value || 'জরুরি সাহায্য';
    const union = document.getElementById('newUnion')?.value || 'lohagara';
    const phone = document.getElementById('newPhone')?.value?.trim();

    if (!title || !phone) {
      alert('সেবার নাম ও ফোন নম্বর লিখে আবার সাবমিট করুন।');
      return;
    }

    const areaMap = {
      bighatia: '১নং বড়হাতিয়া',
      amirabad: '২নং আমিরাবাদ',
      padua: '৩নং পদুয়া',
      chormba: '৪নং চরম্বা',
      kolaizan: '৫নং কলাউজান',
      lohagara: '৬নং লোহাগাড়া',
      putibila: '৭নং পুটিবিলা',
      chunati: '৮নং চুনতি',
      adhunagar: '৯নং আধুনগর'
    };

    serviceDirectory.unshift({
      title,
      category,
      union,
      area: areaMap[union] || '৬নং লোহাগাড়া',
      phone,
      description: 'কমিউনিটির নতুন সেবা • দ্রুত হেল্প ও যোগাযোগের জন্য এই তালিকায় যুক্ত হয়েছে।'
    });

    addServiceForm.reset();
    renderServices();
    alert('নতুন সেবা সফলভাবে তালিকায় যোগ হয়েছে।');
  });

  renderServices();

  const archiveEntries = [
    {
      title: 'লোহাগাড়ার ১৯৭১: একাত্তরের স্মৃতি ও মুক্তিসংগ্রাম',
      category: 'freedom',
      source: 'মোঃ ফজলুল হক, ৬নং ইউনিয়ন, প্রাবন্ধিক',
      excerpt: 'বিজয় শহীদদের নাম, বীরবন্দনা, স্থানীয় বুদ্ধিজীবীদের উদ্যোগ, আর গ্রামবাসীর আত্মত্যাগের গল্প এখনো আমাদের হৃদয়ে জ্বলজ্বলে।',
      tags: ['১৯৭১', 'মুক্তিযুদ্ধ', 'শহীদ স্মৃতি'],
      icon: '⚔️'
    },
    {
      title: 'পদুয়া পুকুর ও পুরোনো মাদ্রাসার গল্প',
      category: 'landmark',
      source: 'হাসান আলী, পদুয়া ইউনিয়ন, ঐতিহাসিক',
      excerpt: 'এই পুকুর ও মাদ্রাসা ঘিরে এলাকার শিক্ষা, সামাজিক মিলন, নৌকা আয়োজনে বহু গল্প বেঁচে আছে। পীরের দরগাহ থেকে শুরু করে গ্রামের পাঠশালা পর্যন্ত এক সময় ছিল শিক্ষা ও সংস্কৃতির কেন্দ্র।',
      tags: ['ঐতিহাসিক স্থান', 'শিক্ষা', 'পুকুর'],
      icon: '🏛️'
    },
    {
      title: 'বড়হাতিয়ার মাটির ঘর, গল্পের কাঁথা ও শস্যের স্মৃতি',
      category: 'elders',
      source: 'আসাদুজ্জামান, বড়হাতিয়া, প্রবীণ',
      excerpt: 'বাল্যকালে কাঁচা ঘরের দেয়ালে শ্যাওলার গন্ধ, মাটির হাঁড়ির চাউল, রবি-শীতের মেলা—এগুলো শুধু বস্তু নয়, বরং আমাদের গ্রামের নান্দনিক স্মৃতি।',
      tags: ['প্রবীণদের গল্প', 'পারিবারিক স্মৃতি'],
      icon: '🧺'
    },
    {
      title: 'লোকনৃত্য, মেলা ও আহ্বানকারীর কণ্ঠ',
      category: 'culture',
      source: 'আলী আহমেদ, চুনতি, সংস্কৃতি কর্মী',
      excerpt: 'নেপা, দোল পূর্ণিমা, জগন্নাথ মেলা, বাউল গানের কণ্ঠ—সবই একসাথে গ্রামের জীবনকে আনন্দময় করে তুলত। এই সংস্কৃতি আমাদের ভাষা, ব্যাকরণ ও আত্মপরিচয় বাঁচিয়ে রাখে।',
      tags: ['লোকসংস্কৃতি', 'মেলা', 'গান'],
      icon: '🎶'
    },
    {
      title: 'চরম্বা সড়কের যুদ্ধকালীন শরণার্থী পথ',
      category: 'freedom',
      source: 'রফিকুল ইসলাম, ৪নং চরম্বা, একজন মুক্তিযোদ্ধার পরিবার',
      excerpt: 'যুদ্ধের সময় এ সড়ক দিয়ে মানুষ শরণার্থী শিবিরে ছুটে যেত, গোপন জায়গায় খাদ্য লুকিয়ে রাখত, আর বিভিন্ন পরিবারের সাহস অগণিত মানুষকে বাঁচিয়েছিল।',
      tags: ['চরম্বা', 'শরণার্থী', 'গোপন পথ'],
      icon: '🛤️'
    },
    {
      title: 'বাবার গল্পে বেঁচে আছে কিশোরগঞ্জের নৌকা ও বর্ষা',
      category: 'elders',
      source: 'মমতাজ বেগম, ২নং আমিরাবাদ, গল্পকার',
      excerpt: 'বর্ষার সময়ে নৌকায় চড়ে বাড়ির বাজারে যাওয়া, ডাঙায় হাঁটতে না পারা, এ ফসলভিত্তিক জীবনের গল্প আজও আমাদের স্মৃতিচিত্রে ভেসে ওঠে।',
      tags: ['বর্ষা', 'নৌকা', 'বাড়ির গল্প'],
      icon: '🌧️'
    }
  ];

  const archiveGrid = document.getElementById('archiveGrid');
  const archiveSearch = document.getElementById('archiveSearch');
  const archiveFilters = document.querySelectorAll('.archive-filter');
  const archiveModal = document.getElementById('archiveModal');
  const openArchiveModal = document.getElementById('openArchiveModal');
  const closeArchiveModal = document.getElementById('closeArchiveModal');
  const cancelArchiveModal = document.getElementById('cancelArchiveModal');
  const archiveForm = document.getElementById('archiveForm');

  const renderArchiveEntries = () => {
    if (!archiveGrid) return;

    const activeCategory = document.querySelector('.archive-filter.active')?.dataset.category || 'all';
    const query = (archiveSearch?.value || '').trim().toLowerCase();

    const filteredEntries = archiveEntries.filter((entry) => {
      const matchesCategory = activeCategory === 'all' || entry.category === activeCategory;
      const haystack = `${entry.title} ${entry.source} ${entry.excerpt} ${entry.tags.join(' ')} ${entry.category}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesCategory && matchesQuery;
    });

    if (!filteredEntries.length) {
      archiveGrid.innerHTML = `
        <div class="col-span-full rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-6 text-center">
          <p class="text-lg font-extrabold text-amber-900">কোনো আর্কাইভ খুঁজে পাওয়া যায়নি</p>
          <p class="mt-2 text-sm text-amber-700">ভিন্ন ক্যাটাগরি বা শব্দ দিয়ে আবার চেষ্টা করুন।</p>
        </div>
      `;
      return;
    }

    archiveGrid.innerHTML = filteredEntries.map((entry) => `
      <article class="archive-card">
        <div class="archive-card-top">
          <span class="archive-category ${entry.category}">${
            entry.category === 'freedom' ? 'মুক্তিযুদ্ধ' :
            entry.category === 'landmark' ? 'ঐতিহাসিক স্থান' :
            entry.category === 'elders' ? 'প্রবীণদের গল্প' : 'লোকসংস্কৃতি'}
          </span>
          <div class="archive-icon" aria-hidden="true">${entry.icon}</div>
        </div>

        <div>
          <h3>${entry.title}</h3>
          <div class="archive-source mt-3">
            <span class="archive-source-dot"></span>
            <span>${entry.source}</span>
          </div>
        </div>

        <p class="archive-excerpt">${entry.excerpt}</p>

        <div class="archive-meta">
          ${entry.tags.map((tag) => `<span class="archive-tag">${tag}</span>`).join('')}
        </div>

        <div class="archive-actions">
          <button type="button" class="archive-read-btn">বিস্তারিত পড়ুন</button>
          <button type="button" class="archive-audio-btn">অডিও শুনুন</button>
        </div>
      </article>
    `).join('');
  };

  archiveFilters.forEach((button) => {
    button.addEventListener('click', () => {
      archiveFilters.forEach((item) => item.classList.toggle('active', item === button));
      renderArchiveEntries();
    });
  });

  archiveSearch?.addEventListener('input', renderArchiveEntries);

  const openArchive = () => {
    archiveModal?.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };

  const closeArchive = () => {
    archiveModal?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  openArchiveModal?.addEventListener('click', openArchive);
  closeArchiveModal?.addEventListener('click', closeArchive);
  cancelArchiveModal?.addEventListener('click', closeArchive);
  archiveModal?.addEventListener('click', (event) => {
    if (event.target === archiveModal) closeArchive();
  });

  archiveForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('archiveTitle')?.value?.trim();
    const category = document.getElementById('archiveCategory')?.value || 'freedom';
    const source = document.getElementById('archiveSource')?.value?.trim();
    const excerpt = document.getElementById('archiveExcerpt')?.value?.trim();
    const contributor = document.getElementById('archiveContributor')?.value?.trim();
    const area = document.getElementById('archiveArea')?.value?.trim();

    if (!title || !source || !excerpt || !contributor || !area) {
      alert('সবগুলো ফিল্ড পূরণ করুন, তারপর আপনার গল্প ভল্টে জমা দিন।');
      return;
    }

    archiveEntries.unshift({
      title,
      category,
      source: `${source} • ${area}`,
      excerpt,
      tags: [area, contributor],
      icon: category === 'freedom' ? '⚔️' : category === 'landmark' ? '🏛️' : category === 'elders' ? '🧓' : '🎭'
    });

    archiveForm.reset();
    closeArchive();
    renderArchiveEntries();
    alert('আপনার ঐতিহাসিক গল্প সংরক্ষণের জন্য পাঠানো হয়েছে। সংশ্লিষ্ট কমিটি যাচাই করে ভল্টে সংযুক্ত করবে।');
  });

  renderArchiveEntries();
});
