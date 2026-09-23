<header class="bg-[#2D4C79] text-white shadow-sm sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
            <!-- Left: Brand & Desktop Navigation Links -->
            <div class="flex items-center gap-6 lg:gap-8">
                <a href="{{ route('home') }}" class="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-white/40 rounded-md py-1">
                    <span class="text-2xl font-bold tracking-wider text-white select-none">AduPDF</span>
                    <span class="text-[11px] bg-white/15 text-white/90 border border-white/20 px-2 py-0.5 rounded font-medium tracking-wide">
                        KAMPUS
                    </span>
                </a>

                <!-- Desktop Nav Items -->
                <nav class="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Navigasi Utama">
                    {{-- Common: Katalog Fasilitas (Guest, Pengguna, Petugas, Admin) --}}
                    @if(Route::has('facilities.index'))
                        <a
                            href="{{ route('facilities.index') }}"
                            @class([
                                'px-3 py-2 rounded-md transition duration-150',
                                'bg-white/20 text-white font-semibold' => request()->routeIs('facilities.*'),
                                'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('facilities.*'),
                            ])
                        >
                            Fasilitas
                        </a>
                    @endif

                    @auth
                        {{-- Pengguna Role Navigation --}}
                        @if(auth()->user()->isPengguna())
                            @if(Route::has('reservations.index'))
                                <a
                                    href="{{ route('reservations.index') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('reservations.index') || request()->routeIs('reservations.show'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !(request()->routeIs('reservations.index') || request()->routeIs('reservations.show')),
                                    ])
                                >
                                    Reservasi Saya
                                </a>
                            @endif

                            @if(Route::has('reservations.create'))
                                <a
                                    href="{{ route('reservations.create') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('reservations.create'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('reservations.create'),
                                    ])
                                >
                                    Ajukan Reservasi
                                </a>
                            @endif

                            @if(Route::has('reports.index'))
                                <a
                                    href="{{ route('reports.index') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('reports.*'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('reports.*'),
                                    ])
                                >
                                    Laporan Saya
                                </a>
                            @elseif(Route::has('reports.create'))
                                <a
                                    href="{{ route('reports.create') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('reports.*'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('reports.*'),
                                    ])
                                >
                                    Lapor Kerusakan
                                </a>
                            @endif

                            @if(Route::has('profile.edit'))
                                <a
                                    href="{{ route('profile.edit') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('profile*') || request()->routeIs('settings*'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !(request()->routeIs('profile*') || request()->routeIs('settings*')),
                                    ])
                                >
                                    Profil
                                </a>
                            @elseif(Route::has('profile'))
                                <a
                                    href="{{ route('profile') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('profile*') || request()->routeIs('settings*'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !(request()->routeIs('profile*') || request()->routeIs('settings*')),
                                    ])
                                >
                                    Profil
                                </a>
                            @endif
                        @endif

                        {{-- Petugas Role Navigation --}}
                        @if(auth()->user()->isPetugas())
                            @if(Route::has('petugas.reservations.index'))
                                <a
                                    href="{{ route('petugas.reservations.index') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('petugas.reservations.*'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('petugas.reservations.*'),
                                    ])
                                >
                                    Antrean Reservasi
                                </a>
                            @endif

                            @if(Route::has('petugas.reports.index'))
                                <a
                                    href="{{ route('petugas.reports.index') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('petugas.reports.*'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('petugas.reports.*'),
                                    ])
                                >
                                    Antrean Laporan
                                </a>
                            @endif
                        @endif

                        {{-- Admin Role Navigation --}}
                        @if(auth()->user()->isAdmin())
                            @if(Route::has('admin.users.index'))
                                <a
                                    href="{{ route('admin.users.index') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('admin.users.index'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('admin.users.index'),
                                    ])
                                >
                                    Kelola Akun
                                </a>
                            @endif

                            @if(Route::has('admin.users.petugas.create'))
                                <a
                                    href="{{ route('admin.users.petugas.create') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('admin.users.petugas.*'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('admin.users.petugas.*'),
                                    ])
                                >
                                    Tambah Petugas
                                </a>
                            @endif

                            @if(Route::has('admin.users.pengguna.create'))
                                <a
                                    href="{{ route('admin.users.pengguna.create') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('admin.users.pengguna.*'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('admin.users.pengguna.*'),
                                    ])
                                >
                                    Tambah Pengguna
                                </a>
                            @endif

                            @if(Route::has('admin.facilities.index'))
                                <a
                                    href="{{ route('admin.facilities.index') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('admin.facilities.*'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('admin.facilities.*'),
                                    ])
                                >
                                    Kelola Fasilitas
                                </a>
                            @endif

                            @if(Route::has('admin.recap.index'))
                                <a
                                    href="{{ route('admin.recap.index') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('admin.recap.*'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('admin.recap.*'),
                                    ])
                                >
                                    Rekap Okupansi
                                </a>
                            @endif

                            @if(Route::has('admin.password.edit'))
                                <a
                                    href="{{ route('admin.password.edit') }}"
                                    @class([
                                        'px-3 py-2 rounded-md transition duration-150',
                                        'bg-white/20 text-white font-semibold' => request()->routeIs('admin.password.*'),
                                        'text-slate-200 hover:bg-white/10 hover:text-white' => !request()->routeIs('admin.password.*'),
                                    ])
                                >
                                    Ganti Password
                                </a>
                            @endif
                        @endif
                    @endauth
                </nav>
            </div>

            <!-- Right: Auth Action / User Profile -->
            <div class="hidden md:flex items-center gap-4">
                @auth
                    <div class="text-right">
                        @if(Route::has('profile.edit'))
                            <a href="{{ route('profile.edit') }}" class="text-sm font-semibold text-white hover:underline leading-tight block">
                                {{ auth()->user()->nama ?? auth()->user()->name }}
                            </a>
                        @elseif(Route::has('profile'))
                            <a href="{{ route('profile') }}" class="text-sm font-semibold text-white hover:underline leading-tight block">
                                {{ auth()->user()->nama ?? auth()->user()->name }}
                            </a>
                        @else
                            <div class="text-sm font-semibold text-white leading-tight">
                                {{ auth()->user()->nama ?? auth()->user()->name }}
                            </div>
                        @endif
                        <div class="flex items-center justify-end gap-1.5 mt-0.5">
                            @if(auth()->user()->isAdmin())
                                <span class="inline-block px-1.5 py-0.2 text-[10px] font-bold rounded bg-amber-400/20 text-amber-200 border border-amber-400/30">
                                    ADMIN
                                </span>
                            @elseif(auth()->user()->isPetugas())
                                <span class="inline-block px-1.5 py-0.2 text-[10px] font-bold rounded bg-sky-400/20 text-sky-200 border border-sky-400/30">
                                    PETUGAS
                                </span>
                            @elseif(auth()->user()->isPengguna())
                                <span class="inline-block px-1.5 py-0.2 text-[10px] font-bold rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                                    PENGGUNA
                                </span>
                            @endif
                            <span class="text-xs text-slate-300 truncate max-w-[150px]" title="{{ auth()->user()->email }}">
                                {{ auth()->user()->email }}
                            </span>
                        </div>
                    </div>

                    @if(Route::has('logout'))
                        <form action="{{ route('logout') }}" method="POST" class="inline">
                            @csrf
                            <button
                                type="submit"
                                class="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 active:bg-white/30 text-white px-3 py-2 rounded-md transition duration-150 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                            >
                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                </svg>
                                <span>Keluar</span>
                            </button>
                        </form>
                    @endif
                @else
                    <div class="flex items-center gap-2">
                        @if(Route::has('login'))
                            <a
                                href="{{ route('login') }}"
                                class="text-xs font-semibold text-white hover:text-slate-200 px-3 py-2 rounded-md transition duration-150"
                            >
                                Masuk
                            </a>
                        @endif

                        @if(Route::has('register'))
                            <a
                                href="{{ route('register') }}"
                                class="text-xs font-semibold bg-white text-[#2D4C79] hover:bg-slate-100 px-3.5 py-2 rounded-md shadow-xs transition duration-150"
                            >
                                Daftar Akun
                            </a>
                        @endif
                    </div>
                @endauth
            </div>

            <!-- Mobile Hamburger Button -->
            <div class="flex items-center md:hidden">
                <button
                    type="button"
                    onclick="const m = document.getElementById('mobile-menu'); m.classList.toggle('hidden');"
                    class="p-2 rounded-md text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                    aria-label="Buka menu navigasi"
                >
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-white/15 bg-[#243E63] px-4 pt-3 pb-4 space-y-1">
        @if(Route::has('facilities.index'))
            <a
                href="{{ route('facilities.index') }}"
                class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('facilities.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
            >
                Fasilitas
            </a>
        @endif

        @auth
            @if(auth()->user()->isPengguna())
                @if(Route::has('reservations.index'))
                    <a
                        href="{{ route('reservations.index') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('reservations.index') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Reservasi Saya
                    </a>
                @endif
                @if(Route::has('reservations.create'))
                    <a
                        href="{{ route('reservations.create') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('reservations.create') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Ajukan Reservasi
                    </a>
                @endif
                @if(Route::has('reports.index'))
                    <a
                        href="{{ route('reports.index') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('reports.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Laporan Saya
                    </a>
                @endif
                @if(Route::has('profile.edit'))
                    <a
                        href="{{ route('profile.edit') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('profile*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Profil
                    </a>
                @elseif(Route::has('profile'))
                    <a
                        href="{{ route('profile') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('profile*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Profil
                    </a>
                @endif
            @endif

            @if(auth()->user()->isPetugas())
                @if(Route::has('petugas.reservations.index'))
                    <a
                        href="{{ route('petugas.reservations.index') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('petugas.reservations.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Antrean Reservasi
                    </a>
                @endif
                @if(Route::has('petugas.reports.index'))
                    <a
                        href="{{ route('petugas.reports.index') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('petugas.reports.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Antrean Laporan
                    </a>
                @endif
            @endif

            @if(auth()->user()->isAdmin())
                @if(Route::has('admin.users.index'))
                    <a
                        href="{{ route('admin.users.index') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('admin.users.index') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Kelola Akun
                    </a>
                @endif
                @if(Route::has('admin.users.petugas.create'))
                    <a
                        href="{{ route('admin.users.petugas.create') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('admin.users.petugas.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Tambah Petugas
                    </a>
                @endif
                @if(Route::has('admin.users.pengguna.create'))
                    <a
                        href="{{ route('admin.users.pengguna.create') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('admin.users.pengguna.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Tambah Pengguna
                    </a>
                @endif
                @if(Route::has('admin.facilities.index'))
                    <a
                        href="{{ route('admin.facilities.index') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('admin.facilities.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Kelola Fasilitas
                    </a>
                @endif
                @if(Route::has('admin.recap.index'))
                    <a
                        href="{{ route('admin.recap.index') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('admin.recap.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Rekap Okupansi
                    </a>
                @endif
                @if(Route::has('admin.password.edit'))
                    <a
                        href="{{ route('admin.password.edit') }}"
                        class="block px-3 py-2 rounded-md text-sm font-medium {{ request()->routeIs('admin.password.*') ? 'bg-white/20 text-white font-semibold' : 'text-slate-200 hover:bg-white/10 hover:text-white' }}"
                    >
                        Ganti Password
                    </a>
                @endif
            @endif

            <div class="pt-4 border-t border-white/15 mt-3">
                <div class="text-sm font-semibold text-white">
                    {{ auth()->user()->nama ?? auth()->user()->name }}
                </div>
                <div class="text-xs text-slate-300 mt-0.5">
                    {{ auth()->user()->email }} ({{ strtoupper(auth()->user()->role) }})
                </div>
                <form action="{{ route('logout') }}" method="POST" class="mt-3">
                    @csrf
                    <button
                        type="submit"
                        class="w-full text-center text-xs font-semibold bg-white/10 hover:bg-white/20 text-white py-2 rounded-md transition"
                    >
                        Keluar
                    </button>
                </form>
            </div>
        @else
            <div class="pt-4 border-t border-white/15 mt-3 space-y-2">
                @if(Route::has('login'))
                    <a
                        href="{{ route('login') }}"
                        class="block w-full text-center text-sm font-semibold bg-white/10 hover:bg-white/20 text-white py-2 rounded-md transition"
                    >
                        Masuk
                    </a>
                @endif
                @if(Route::has('register'))
                    <a
                        href="{{ route('register') }}"
                        class="block w-full text-center text-sm font-semibold bg-white text-[#2D4C79] hover:bg-slate-100 py-2 rounded-md transition"
                    >
                        Daftar Akun
                    </a>
                @endif
            </div>
        @endauth
    </div>
</header>
