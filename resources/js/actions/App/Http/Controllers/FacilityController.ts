import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FacilityController::index
 * @see app/Http/Controllers/FacilityController.php:17
 * @route '/facilities'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/facilities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FacilityController::index
 * @see app/Http/Controllers/FacilityController.php:17
 * @route '/facilities'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FacilityController::index
 * @see app/Http/Controllers/FacilityController.php:17
 * @route '/facilities'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FacilityController::index
 * @see app/Http/Controllers/FacilityController.php:17
 * @route '/facilities'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FacilityController::index
 * @see app/Http/Controllers/FacilityController.php:17
 * @route '/facilities'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FacilityController::index
 * @see app/Http/Controllers/FacilityController.php:17
 * @route '/facilities'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FacilityController::index
 * @see app/Http/Controllers/FacilityController.php:17
 * @route '/facilities'
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
* @see \App\Http\Controllers\FacilityController::show
 * @see app/Http/Controllers/FacilityController.php:58
 * @route '/facilities/{facility}'
 */
export const show = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/facilities/{facility}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FacilityController::show
 * @see app/Http/Controllers/FacilityController.php:58
 * @route '/facilities/{facility}'
 */
show.url = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { facility: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { facility: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    facility: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        facility: typeof args.facility === 'object'
                ? args.facility.id
                : args.facility,
                }

    return show.definition.url
            .replace('{facility}', parsedArgs.facility.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FacilityController::show
 * @see app/Http/Controllers/FacilityController.php:58
 * @route '/facilities/{facility}'
 */
show.get = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FacilityController::show
 * @see app/Http/Controllers/FacilityController.php:58
 * @route '/facilities/{facility}'
 */
show.head = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FacilityController::show
 * @see app/Http/Controllers/FacilityController.php:58
 * @route '/facilities/{facility}'
 */
    const showForm = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FacilityController::show
 * @see app/Http/Controllers/FacilityController.php:58
 * @route '/facilities/{facility}'
 */
        showForm.get = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FacilityController::show
 * @see app/Http/Controllers/FacilityController.php:58
 * @route '/facilities/{facility}'
 */
        showForm.head = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const FacilityController = { index, show }

export default FacilityController