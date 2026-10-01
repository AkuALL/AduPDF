import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import facilityCondition from './facility-condition'
/**
* @see \App\Http\Controllers\PetugasReportController::index
 * @see app/Http/Controllers/PetugasReportController.php:19
 * @route '/petugas/reports'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/petugas/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PetugasReportController::index
 * @see app/Http/Controllers/PetugasReportController.php:19
 * @route '/petugas/reports'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PetugasReportController::index
 * @see app/Http/Controllers/PetugasReportController.php:19
 * @route '/petugas/reports'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PetugasReportController::index
 * @see app/Http/Controllers/PetugasReportController.php:19
 * @route '/petugas/reports'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PetugasReportController::index
 * @see app/Http/Controllers/PetugasReportController.php:19
 * @route '/petugas/reports'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PetugasReportController::index
 * @see app/Http/Controllers/PetugasReportController.php:19
 * @route '/petugas/reports'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PetugasReportController::index
 * @see app/Http/Controllers/PetugasReportController.php:19
 * @route '/petugas/reports'
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
* @see \App\Http\Controllers\PetugasReportController::show
 * @see app/Http/Controllers/PetugasReportController.php:35
 * @route '/petugas/reports/{report}'
 */
export const show = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/petugas/reports/{report}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PetugasReportController::show
 * @see app/Http/Controllers/PetugasReportController.php:35
 * @route '/petugas/reports/{report}'
 */
show.url = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { report: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { report: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    report: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        report: typeof args.report === 'object'
                ? args.report.id
                : args.report,
                }

    return show.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PetugasReportController::show
 * @see app/Http/Controllers/PetugasReportController.php:35
 * @route '/petugas/reports/{report}'
 */
show.get = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PetugasReportController::show
 * @see app/Http/Controllers/PetugasReportController.php:35
 * @route '/petugas/reports/{report}'
 */
show.head = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PetugasReportController::show
 * @see app/Http/Controllers/PetugasReportController.php:35
 * @route '/petugas/reports/{report}'
 */
    const showForm = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PetugasReportController::show
 * @see app/Http/Controllers/PetugasReportController.php:35
 * @route '/petugas/reports/{report}'
 */
        showForm.get = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PetugasReportController::show
 * @see app/Http/Controllers/PetugasReportController.php:35
 * @route '/petugas/reports/{report}'
 */
        showForm.head = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PetugasReportController::update
 * @see app/Http/Controllers/PetugasReportController.php:49
 * @route '/petugas/reports/{report}'
 */
export const update = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/petugas/reports/{report}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PetugasReportController::update
 * @see app/Http/Controllers/PetugasReportController.php:49
 * @route '/petugas/reports/{report}'
 */
update.url = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { report: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { report: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    report: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        report: typeof args.report === 'object'
                ? args.report.id
                : args.report,
                }

    return update.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PetugasReportController::update
 * @see app/Http/Controllers/PetugasReportController.php:49
 * @route '/petugas/reports/{report}'
 */
update.patch = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PetugasReportController::update
 * @see app/Http/Controllers/PetugasReportController.php:49
 * @route '/petugas/reports/{report}'
 */
    const updateForm = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PetugasReportController::update
 * @see app/Http/Controllers/PetugasReportController.php:49
 * @route '/petugas/reports/{report}'
 */
        updateForm.patch = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const reports = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
update: Object.assign(update, update),
facilityCondition: Object.assign(facilityCondition, facilityCondition),
}

export default reports