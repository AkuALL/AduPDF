import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PetugasReservationController::index
 * @see app/Http/Controllers/PetugasReservationController.php:21
 * @route '/petugas/reservations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/petugas/reservations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PetugasReservationController::index
 * @see app/Http/Controllers/PetugasReservationController.php:21
 * @route '/petugas/reservations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PetugasReservationController::index
 * @see app/Http/Controllers/PetugasReservationController.php:21
 * @route '/petugas/reservations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PetugasReservationController::index
 * @see app/Http/Controllers/PetugasReservationController.php:21
 * @route '/petugas/reservations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PetugasReservationController::index
 * @see app/Http/Controllers/PetugasReservationController.php:21
 * @route '/petugas/reservations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PetugasReservationController::index
 * @see app/Http/Controllers/PetugasReservationController.php:21
 * @route '/petugas/reservations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PetugasReservationController::index
 * @see app/Http/Controllers/PetugasReservationController.php:21
 * @route '/petugas/reservations'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\PetugasReservationController::approve
 * @see app/Http/Controllers/PetugasReservationController.php:59
 * @route '/petugas/reservations/{reservation}/approve'
 */
export const approve = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

approve.definition = {
    methods: ["patch"],
    url: '/petugas/reservations/{reservation}/approve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PetugasReservationController::approve
 * @see app/Http/Controllers/PetugasReservationController.php:59
 * @route '/petugas/reservations/{reservation}/approve'
 */
approve.url = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return approve.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PetugasReservationController::approve
 * @see app/Http/Controllers/PetugasReservationController.php:59
 * @route '/petugas/reservations/{reservation}/approve'
 */
approve.patch = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PetugasReservationController::approve
 * @see app/Http/Controllers/PetugasReservationController.php:59
 * @route '/petugas/reservations/{reservation}/approve'
 */
    const approveForm = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PetugasReservationController::approve
 * @see app/Http/Controllers/PetugasReservationController.php:59
 * @route '/petugas/reservations/{reservation}/approve'
 */
        approveForm.patch = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\PetugasReservationController::reject
 * @see app/Http/Controllers/PetugasReservationController.php:118
 * @route '/petugas/reservations/{reservation}/reject'
 */
export const reject = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reject.url(args, options),
    method: 'patch',
})

reject.definition = {
    methods: ["patch"],
    url: '/petugas/reservations/{reservation}/reject',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PetugasReservationController::reject
 * @see app/Http/Controllers/PetugasReservationController.php:118
 * @route '/petugas/reservations/{reservation}/reject'
 */
reject.url = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return reject.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PetugasReservationController::reject
 * @see app/Http/Controllers/PetugasReservationController.php:118
 * @route '/petugas/reservations/{reservation}/reject'
 */
reject.patch = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reject.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PetugasReservationController::reject
 * @see app/Http/Controllers/PetugasReservationController.php:118
 * @route '/petugas/reservations/{reservation}/reject'
 */
    const rejectForm = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PetugasReservationController::reject
 * @see app/Http/Controllers/PetugasReservationController.php:118
 * @route '/petugas/reservations/{reservation}/reject'
 */
        rejectForm.patch = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\PetugasReservationController::cancel
 * @see app/Http/Controllers/PetugasReservationController.php:141
 * @route '/petugas/reservations/{reservation}/cancel'
 */
export const cancel = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

cancel.definition = {
    methods: ["patch"],
    url: '/petugas/reservations/{reservation}/cancel',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PetugasReservationController::cancel
 * @see app/Http/Controllers/PetugasReservationController.php:141
 * @route '/petugas/reservations/{reservation}/cancel'
 */
cancel.url = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return cancel.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PetugasReservationController::cancel
 * @see app/Http/Controllers/PetugasReservationController.php:141
 * @route '/petugas/reservations/{reservation}/cancel'
 */
cancel.patch = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PetugasReservationController::cancel
 * @see app/Http/Controllers/PetugasReservationController.php:141
 * @route '/petugas/reservations/{reservation}/cancel'
 */
    const cancelForm = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PetugasReservationController::cancel
 * @see app/Http/Controllers/PetugasReservationController.php:141
 * @route '/petugas/reservations/{reservation}/cancel'
 */
        cancelForm.patch = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cancel.form = cancelForm
const PetugasReservationController = { index, approve, reject, cancel }

export default PetugasReservationController