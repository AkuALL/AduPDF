import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/verifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
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
const verifications = {
    index: Object.assign(index, index),
}

export default verifications