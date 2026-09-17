@extends('layouts.admin', ['title' => 'Tambah Fasilitas Baru'])

@section('content')
<div class="max-w-3xl mx-auto space-y-6">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center justify-between">
        <div>
            <a href="{{ route('admin.facilities.index') }}" class="text-xs font-semibold text-[#2D4C79] hover:underline flex items-center gap-1">
                ← Kembali ke Daftar Fasilitas
            </a>
            <h1 class="text-xl font-bold text-slate-800 mt-2">Tambah Fasilitas Baru</h1>
            <p class="text-xs text-slate-500 mt-1">
                Daftarkan ruangan, aula, laboratorium, peralatan, atau lapangan baru ke sistem.
            </p>
        </div>
    </div>

    <!-- Form Card -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <form action="{{ route('admin.facilities.store') }}" method="POST" class="space-y-6">
            @csrf

            <!-- Name Field -->
            <div>
                <label for="name" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Fasilitas <span class="text-rose-600">*</span>
                </label>
                <input type="text"
                       name="name"
                       id="name"
                       value="{{ old('name') }}"
                       required
                       placeholder="Contoh: Ruang Kelas B.301, Lab Komputer, Projector Sony 01"
                       class="w-full text-sm rounded-md border-slate-300 shadow-sm focus:border-[#2D4C79] focus:ring-[#2D4C79] px-3 py-2 border bg-white @error('name') border-rose-500 @enderror">
                @error('name')
                    <p class="text-xs text-rose-600 mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Type Field -->
            <div>
                <label for="type" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipe Fasilitas <span class="text-rose-600">*</span>
                </label>
                <select name="type"
                        id="type"
                        required
                        onchange="handleTypeChange(this.value)"
                        class="w-full text-sm rounded-md border-slate-300 shadow-sm focus:border-[#2D4C79] focus:ring-[#2D4C79] px-3 py-2 border bg-white @error('type') border-rose-500 @enderror">
                    <option value="">-- Pilih Tipe Fasilitas --</option>
                    <option value="ruang_kelas" {{ old('type') === 'ruang_kelas' ? 'selected' : '' }}>Ruang Kelas</option>
                    <option value="aula" {{ old('type') === 'aula' ? 'selected' : '' }}>Aula</option>
                    <option value="laboratorium" {{ old('type') === 'laboratorium' ? 'selected' : '' }}>Laboratorium</option>
                    <option value="alat" {{ old('type') === 'alat' ? 'selected' : '' }}>Alat (Peralatan Ruangan)</option>
                    <option value="lapangan" {{ old('type') === 'lapangan' ? 'selected' : '' }}>Lapangan</option>
                </select>
                @error('type')
                    <p class="text-xs text-rose-600 mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Parent Room Field (Shown only for alat) -->
            <div id="parent-facility-container" class="{{ old('type') === 'alat' ? 'block' : 'hidden' }}">
                <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                    <label for="parent_facility_id" class="block text-xs font-bold text-amber-900 uppercase tracking-wider">
                        Ruangan Induk (Wajib untuk Alat) <span class="text-rose-600">*</span>
                    </label>
                    <p class="text-xs text-amber-700">
                        Aturan Hierarki: Fasilitas bertipe alat wajib ditempatkan di dalam ruangan induk bertipe ruang kelas, aula, atau laboratorium.
                    </p>
                    <select name="parent_facility_id"
                            id="parent_facility_id"
                            class="w-full text-sm rounded-md border-amber-300 shadow-sm focus:border-[#2D4C79] focus:ring-[#2D4C79] px-3 py-2 border bg-white @error('parent_facility_id') border-rose-500 @enderror">
                        <option value="">-- Pilih Ruangan Induk --</option>
                        @foreach($parentRooms as $room)
                            <option value="{{ $room->id }}" {{ (int) old('parent_facility_id') === (int) $room->id ? 'selected' : '' }}>
                                {{ $room->name }} ({{ ucfirst(str_replace('_', ' ', $room->type->value)) }} - {{ $room->location }})
                            </option>
                        @endforeach
                    </select>
                    @error('parent_facility_id')
                        <p class="text-xs text-rose-600 mt-1">{{ $message }}</p>
                    @enderror
                </div>
            </div>

            <!-- Location & Capacity Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="location" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Lokasi / Gedung <span class="text-rose-600">*</span>
                    </label>
                    <input type="text"
                           name="location"
                           id="location"
                           value="{{ old('location') }}"
                           required
                           placeholder="Contoh: Gedung Dekanat Lt. 2, Sayap Timur"
                           class="w-full text-sm rounded-md border-slate-300 shadow-sm focus:border-[#2D4C79] focus:ring-[#2D4C79] px-3 py-2 border bg-white @error('location') border-rose-500 @enderror">
                    @error('location')
                        <p class="text-xs text-rose-600 mt-1">{{ $message }}</p>
                    @enderror
                </div>
                <div>
                    <label for="capacity" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Kapasitas Orang <span class="text-rose-600">*</span>
                    </label>
                    <input type="number"
                           name="capacity"
                           id="capacity"
                           min="0"
                           value="{{ old('capacity', 0) }}"
                           required
                           class="w-full text-sm rounded-md border-slate-300 shadow-sm focus:border-[#2D4C79] focus:ring-[#2D4C79] px-3 py-2 border bg-white @error('capacity') border-rose-500 @enderror">
                    <p class="text-[11px] text-slate-500 mt-1">Gunakan 0 atau 1 untuk peralatan/alat.</p>
                    @error('capacity')
                        <p class="text-xs text-rose-600 mt-1">{{ $message }}</p>
                    @enderror
                </div>
            </div>

            <!-- Condition Field -->
            <div>
                <label for="condition" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status Kondisi Awal <span class="text-rose-600">*</span>
                </label>
                <select name="condition"
                        id="condition"
                        required
                        class="w-full text-sm rounded-md border-slate-300 shadow-sm focus:border-[#2D4C79] focus:ring-[#2D4C79] px-3 py-2 border bg-white @error('condition') border-rose-500 @enderror">
                    <option value="aktif" {{ old('condition', 'aktif') === 'aktif' ? 'selected' : '' }}>Aktif (Siap Digunakan)</option>
                    <option value="dalam_perbaikan" {{ old('condition') === 'dalam_perbaikan' ? 'selected' : '' }}>Dalam Perbaikan (Sedang Rusak/Maintenance)</option>
                    <option value="nonaktif" {{ old('condition') === 'nonaktif' ? 'selected' : '' }}>Nonaktif (Tidak Dapat Direservasi)</option>
                </select>
                @error('condition')
                    <p class="text-xs text-rose-600 mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Description Field -->
            <div>
                <label for="description" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Deskripsi / Catatan Tambahan (Opsional)
                </label>
                <textarea name="description"
                          id="description"
                          rows="3"
                          placeholder="Spesifikasi, fasilitas pendukung, atau catatan penting..."
                          class="w-full text-sm rounded-md border-slate-300 shadow-sm focus:border-[#2D4C79] focus:ring-[#2D4C79] px-3 py-2 border bg-white @error('description') border-rose-500 @enderror">{{ old('description') }}</textarea>
                @error('description')
                    <p class="text-xs text-rose-600 mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end space-x-3 border-t border-slate-200 pt-5">
                <a href="{{ route('admin.facilities.index') }}" class="text-xs font-medium text-slate-600 hover:text-slate-800 px-4 py-2 rounded-md border border-slate-300 transition">
                    Batal
                </a>
                <button type="submit" class="text-xs font-semibold bg-[#2D4C79] hover:bg-[#1e3454] text-white px-5 py-2 rounded-md shadow-sm transition">
                    Simpan Fasilitas
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    function handleTypeChange(val) {
        const container = document.getElementById('parent-facility-container');
        const parentSelect = document.getElementById('parent_facility_id');
        if (val === 'alat') {
            container.classList.remove('hidden');
            parentSelect.setAttribute('required', 'required');
        } else {
            container.classList.add('hidden');
            parentSelect.removeAttribute('required');
            parentSelect.value = '';
        }
    }
</script>
@endsection
