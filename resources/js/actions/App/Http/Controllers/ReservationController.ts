import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReservationController::index
 * @see app/Http/Controllers/ReservationController.php:19
 * @route '/reservations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reservations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservationController::index
 * @see app/Http/Controllers/ReservationController.php:19
 * @route '/reservations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservationController::index
 * @see app/Http/Controllers/ReservationController.php:19
 * @route '/reservations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservationController::index
 * @see app/Http/Controllers/ReservationController.php:19
 * @route '/reservations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReservationController::index
 * @see app/Http/Controllers/ReservationController.php:19
 * @route '/reservations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReservationController::index
 * @see app/Http/Controllers/ReservationController.php:19
 * @route '/reservations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReservationController::index
 * @see app/Http/Controllers/ReservationController.php:19
 * @route '/reservations'
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
* @see \App\Http\Controllers\ReservationController::create
 * @see app/Http/Controllers/ReservationController.php:36
 * @route '/reservations/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/reservations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservationController::create
 * @see app/Http/Controllers/ReservationController.php:36
 * @route '/reservations/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservationController::create
 * @see app/Http/Controllers/ReservationController.php:36
 * @route '/reservations/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservationController::create
 * @see app/Http/Controllers/ReservationController.php:36
 * @route '/reservations/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReservationController::create
 * @see app/Http/Controllers/ReservationController.php:36
 * @route '/reservations/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReservationController::create
 * @see app/Http/Controllers/ReservationController.php:36
 * @route '/reservations/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReservationController::create
 * @see app/Http/Controllers/ReservationController.php:36
 * @route '/reservations/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\ReservationController::store
 * @see app/Http/Controllers/ReservationController.php:49
 * @route '/reservations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/reservations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReservationController::store
 * @see app/Http/Controllers/ReservationController.php:49
 * @route '/reservations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservationController::store
 * @see app/Http/Controllers/ReservationController.php:49
 * @route '/reservations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReservationController::store
 * @see app/Http/Controllers/ReservationController.php:49
 * @route '/reservations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReservationController::store
 * @see app/Http/Controllers/ReservationController.php:49
 * @route '/reservations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ReservationController::show
 * @see app/Http/Controllers/ReservationController.php:66
 * @route '/reservations/{reservation}'
 */
export const show = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/reservations/{reservation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReservationController::show
 * @see app/Http/Controllers/ReservationController.php:66
 * @route '/reservations/{reservation}'
 */
show.url = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReservationController::show
 * @see app/Http/Controllers/ReservationController.php:66
 * @route '/reservations/{reservation}'
 */
show.get = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReservationController::show
 * @see app/Http/Controllers/ReservationController.php:66
 * @route '/reservations/{reservation}'
 */
show.head = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReservationController::show
 * @see app/Http/Controllers/ReservationController.php:66
 * @route '/reservations/{reservation}'
 */
    const showForm = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReservationController::show
 * @see app/Http/Controllers/ReservationController.php:66
 * @route '/reservations/{reservation}'
 */
        showForm.get = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReservationController::show
 * @see app/Http/Controllers/ReservationController.php:66
 * @route '/reservations/{reservation}'
 */
        showForm.head = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\ReservationController::cancel
 * @see app/Http/Controllers/ReservationController.php:78
 * @route '/reservations/{reservation}/cancel'
 */
export const cancel = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

cancel.definition = {
    methods: ["patch"],
    url: '/reservations/{reservation}/cancel',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ReservationController::cancel
 * @see app/Http/Controllers/ReservationController.php:78
 * @route '/reservations/{reservation}/cancel'
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
* @see \App\Http\Controllers\ReservationController::cancel
 * @see app/Http/Controllers/ReservationController.php:78
 * @route '/reservations/{reservation}/cancel'
 */
cancel.patch = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ReservationController::cancel
 * @see app/Http/Controllers/ReservationController.php:78
 * @route '/reservations/{reservation}/cancel'
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
* @see \App\Http\Controllers\ReservationController::cancel
 * @see app/Http/Controllers/ReservationController.php:78
 * @route '/reservations/{reservation}/cancel'
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
const ReservationController = { index, create, store, show, cancel }

export default ReservationController