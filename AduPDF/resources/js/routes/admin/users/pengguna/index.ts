import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/users/pengguna/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::create
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
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
 * @see app/Http/Controllers/Admin/AccountManagementController.php:86
 * @route '/admin/users/pengguna'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/users/pengguna',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::store
 * @see app/Http/Controllers/Admin/AccountManagementController.php:86
 * @route '/admin/users/pengguna'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::store
 * @see app/Http/Controllers/Admin/AccountManagementController.php:86
 * @route '/admin/users/pengguna'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::store
 * @see app/Http/Controllers/Admin/AccountManagementController.php:86
 * @route '/admin/users/pengguna'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::store
 * @see app/Http/Controllers/Admin/AccountManagementController.php:86
 * @route '/admin/users/pengguna'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const pengguna = {
    create: Object.assign(create, create),
store: Object.assign(store, store),
}

export default pengguna