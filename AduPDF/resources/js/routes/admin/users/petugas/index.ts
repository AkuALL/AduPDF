import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/users/petugas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
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
* @see \App\Http\Controllers\Admin\AccountManagementController::store
 * @see app/Http/Controllers/Admin/AccountManagementController.php:47
 * @route '/admin/users/petugas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/users/petugas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::store
 * @see app/Http/Controllers/Admin/AccountManagementController.php:47
 * @route '/admin/users/petugas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::store
 * @see app/Http/Controllers/Admin/AccountManagementController.php:47
 * @route '/admin/users/petugas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::store
 * @see app/Http/Controllers/Admin/AccountManagementController.php:47
 * @route '/admin/users/petugas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::store
 * @see app/Http/Controllers/Admin/AccountManagementController.php:47
 * @route '/admin/users/petugas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const petugas = {
    create: Object.assign(create, create),
store: Object.assign(store, store),
}

export default petugas