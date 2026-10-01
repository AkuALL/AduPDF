import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import reservations from './reservations'
import reports from './reports'
/**
* @see \App\Http\Controllers\PetugasDashboardController::dashboard
 * @see app/Http/Controllers/PetugasDashboardController.php:22
 * @route '/petugas/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/petugas/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PetugasDashboardController::dashboard
 * @see app/Http/Controllers/PetugasDashboardController.php:22
 * @route '/petugas/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PetugasDashboardController::dashboard
 * @see app/Http/Controllers/PetugasDashboardController.php:22
 * @route '/petugas/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PetugasDashboardController::dashboard
 * @see app/Http/Controllers/PetugasDashboardController.php:22
 * @route '/petugas/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PetugasDashboardController::dashboard
 * @see app/Http/Controllers/PetugasDashboardController.php:22
 * @route '/petugas/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PetugasDashboardController::dashboard
 * @see app/Http/Controllers/PetugasDashboardController.php:22
 * @route '/petugas/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PetugasDashboardController::dashboard
 * @see app/Http/Controllers/PetugasDashboardController.php:22
 * @route '/petugas/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
const petugas = {
    reservations: Object.assign(reservations, reservations),
reports: Object.assign(reports, reports),
dashboard: Object.assign(dashboard, dashboard),
}

export default petugas