@if(session('success'))
    <div class="mb-4">
        <x-alert type="success" :message="session('success')" />
    </div>
@endif

@if(session('status'))
    <div class="mb-4">
        <x-alert type="info" :message="session('status')" />
    </div>
@endif

@if(session('warning'))
    <div class="mb-4">
        <x-alert type="warning" :message="session('warning')" />
    </div>
@endif

@if(session('info'))
    <div class="mb-4">
        <x-alert type="info" :message="session('info')" />
    </div>
@endif

@if(session('error') || session('danger'))
    <div class="mb-4">
        <x-alert type="danger" :message="session('error') ?? session('danger')" />
    </div>
@endif
