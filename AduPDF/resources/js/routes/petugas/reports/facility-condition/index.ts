import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PetugasReportController::update
 * @see app/Http/Controllers/PetugasReportController.php:70
 * @route '/petugas/reports/{report}/facility-condition'
 */
export const update = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/petugas/reports/{report}/facility-condition',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PetugasReportController::update
 * @see app/Http/Controllers/PetugasReportController.php:70
 * @route '/petugas/reports/{report}/facility-condition'
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
 * @see app/Http/Controllers/PetugasReportController.php:70
 * @route '/petugas/reports/{report}/facility-condition'
 */
update.patch = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PetugasReportController::update
 * @see app/Http/Controllers/PetugasReportController.php:70
 * @route '/petugas/reports/{report}/facility-condition'
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
 * @see app/Http/Controllers/PetugasReportController.php:70
 * @route '/petugas/reports/{report}/facility-condition'
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
const facilityCondition = {
    update: Object.assign(update, update),
}

export default facilityCondition