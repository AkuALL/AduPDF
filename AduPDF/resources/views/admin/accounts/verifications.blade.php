@extends('layouts.admin', ['title' => 'Antrian Verifikasi Pengguna'])

@section('content')
<div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 class="text-xl font-bold text-slate-800">Verifikasi Akun</h1>
            <p class="text-xs text-slate-500 mt-1">
                Tinjau dan proses akun yang menunggu persetujuan.
            </p>
        </div>
        <div class="flex space-x-2">
            <a href="{{ route('admin.users.pengguna.create') }}"
               class="inline-flex items-center text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-2 rounded-md border border-slate-300 transition">
                + Buat Pengguna Langsung
            </a>
            <a href="{{ route('admin.users.petugas.create') }}"
               class="inline-flex items-center text-xs bg-[#2D4C79] hover:bg-[#1e3454] text-white font-medium px-3 py-2 rounded-md shadow-sm transition">
                + Buat Akun Petugas
            </a>
        </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex border-b border-slate-200 bg-slate-50 px-6">
        <a href="{{ route('admin.verifications.index', ['status' => 'pending']) }}"
           class="py-3 px-4 border-b-2 font-medium text-xs flex items-center space-x-2 transition {{ $status === 'pending' ? 'border-[#2D4C79] text-[#2D4C79] font-bold bg-white' : 'border-transparent text-slate-600 hover:text-slate-900' }}">
            <span>Menunggu Verifikasi</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] {{ $status === 'pending' ? 'bg-[#2D4C79] text-white' : 'bg-slate-200 text-slate-700' }}">
                {{ $counts['pending'] }}
            </span>
        </a>
        <a href="{{ route('admin.verifications.index', ['status' => 'approved']) }}"
           class="py-3 px-4 border-b-2 font-medium text-xs flex items-center space-x-2 transition {{ $status === 'approved' ? 'border-[#2D4C79] text-[#2D4C79] font-bold bg-white' : 'border-transparent text-slate-600 hover:text-slate-900' }}">
            <span>Disetujui</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] {{ $status === 'approved' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700' }}">
                {{ $counts['approved'] }}
            </span>
        </a>
        <a href="{{ route('admin.verifications.index', ['status' => 'rejected']) }}"
           class="py-3 px-4 border-b-2 font-medium text-xs flex items-center space-x-2 transition {{ $status === 'rejected' ? 'border-[#2D4C79] text-[#2D4C79] font-bold bg-white' : 'border-transparent text-slate-600 hover:text-slate-900' }}">
            <span>Ditolak</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] {{ $status === 'rejected' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700' }}">
                {{ $counts['rejected'] }}
            </span>
        </a>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-700">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                    <th scope="col" class="px-6 py-3">Nama Lengkap</th>
                    <th scope="col" class="px-6 py-3">Alamat Email</th>
                    <th scope="col" class="px-6 py-3">Tanggal Daftar</th>
                    <th scope="col" class="px-6 py-3">Status</th>
                    <th scope="col" class="px-6 py-3 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
                @forelse($users as $user)
                    <tr class="hover:bg-slate-50/80 transition">
                        <td class="px-6 py-4 font-medium text-slate-900">
                            {{ $user->nama ?? $user->name }}
                        </td>
                        <td class="px-6 py-4 text-slate-600">
                            {{ $user->email }}
                        </td>
                        <td class="px-6 py-4 text-slate-500 text-xs">
                            {{ $user->created_at ? $user->created_at->format('d M Y, H:i') : '-' }} WIB
                        </td>
                        <td class="px-6 py-4">
                            @if($user->isPending())
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
                                    <span class="w-1.5 h-1.5 mr-1.5 bg-amber-500 rounded-full"></span>
                                    Menunggu Verifikasi
                                </span>
                            @elseif($user->isApproved())
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <span class="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"></span>
                                    Disetujui
                                </span>
                            @elseif($user->isRejected())
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-300">
                                    <span class="w-1.5 h-1.5 mr-1.5 bg-rose-500 rounded-full"></span>
                                    Ditolak
                                </span>
                            @endif
                        </td>
                        <td class="px-6 py-4 text-right space-x-2">
                            @if($user->isPending())
                                <form action="{{ route('admin.users.verify', $user) }}" method="POST" class="inline">
                                    @csrf
                                    @method('PATCH')
                                    <button type="submit"
                                            onclick="return confirm('Apakah Anda yakin ingin MENYETUJUI akun {{ $user->nama ?? $user->name }}?')"
                                            class="inline-flex items-center text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded transition shadow-sm">
                                        Setujui
                                    </button>
                                </form>

                                <form action="{{ route('admin.users.reject', $user) }}" method="POST" class="inline">
                                    @csrf
                                    @method('PATCH')
                                    <button type="submit"
                                            onclick="return confirm('Apakah Anda yakin ingin MENOLAK akun {{ $user->nama ?? $user->name }}? Akun tidak akan dapat login.')"
                                            class="inline-flex items-center text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium px-3 py-1.5 rounded transition shadow-sm">
                                        Tolak
                                    </button>
                                </form>
                            @else
                                <span class="text-xs text-slate-400 italic">Sudah Diproses</span>
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-slate-500 text-sm">
                            <div class="max-w-xs mx-auto">
                                <svg class="w-10 h-10 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <p class="font-medium text-slate-600">Tidak ada data untuk status ini</p>
                                <p class="text-xs text-slate-400 mt-1">Akun baru akan muncul di sini.</p>
                            </div>
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @if($users->hasPages())
        <div class="p-4 border-t border-slate-200">
            {{ $users->links() }}
        </div>
    @endif
</div>
@endsection
