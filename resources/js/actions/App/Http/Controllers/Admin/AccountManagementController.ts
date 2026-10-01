import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:18
 * @route '/admin/users'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:18
 * @route '/admin/users'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:18
 * @route '/admin/users'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:18
 * @route '/admin/users'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:18
 * @route '/admin/users'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:18
 * @route '/admin/users'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::index
 * @see app/Http/Controllers/Admin/AccountManagementController.php:18
 * @route '/admin/users'
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
* @see \App\Http\Controllers\Admin\AccountManagementController::createPetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
export const createPetugas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createPetugas.url(options),
    method: 'get',
})

createPetugas.definition = {
    methods: ["get","head"],
    url: '/admin/users/petugas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
createPetugas.url = (options?: RouteQueryOptions) => {
    return createPetugas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
createPetugas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createPetugas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
createPetugas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createPetugas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
    const createPetugasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createPetugas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
        createPetugasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createPetugas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:39
 * @route '/admin/users/petugas/create'
 */
        createPetugasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createPetugas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createPetugas.form = createPetugasForm
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::storePetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:47
 * @route '/admin/users/petugas'
 */
export const storePetugas = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePetugas.url(options),
    method: 'post',
})

storePetugas.definition = {
    methods: ["post"],
    url: '/admin/users/petugas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::storePetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:47
 * @route '/admin/users/petugas'
 */
storePetugas.url = (options?: RouteQueryOptions) => {
    return storePetugas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::storePetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:47
 * @route '/admin/users/petugas'
 */
storePetugas.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePetugas.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::storePetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:47
 * @route '/admin/users/petugas'
 */
    const storePetugasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePetugas.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::storePetugas
 * @see app/Http/Controllers/Admin/AccountManagementController.php:47
 * @route '/admin/users/petugas'
 */
        storePetugasForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePetugas.url(options),
            method: 'post',
        })
    
    storePetugas.form = storePetugasForm
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
export const createPengguna = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createPengguna.url(options),
    method: 'get',
})

createPengguna.definition = {
    methods: ["get","head"],
    url: '/admin/users/pengguna/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
createPengguna.url = (options?: RouteQueryOptions) => {
    return createPengguna.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
createPengguna.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createPengguna.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
createPengguna.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createPengguna.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
    const createPenggunaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createPengguna.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
        createPenggunaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createPengguna.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::createPengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:78
 * @route '/admin/users/pengguna/create'
 */
        createPenggunaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createPengguna.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createPengguna.form = createPenggunaForm
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::storePengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:86
 * @route '/admin/users/pengguna'
 */
export const storePengguna = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePengguna.url(options),
    method: 'post',
})

storePengguna.definition = {
    methods: ["post"],
    url: '/admin/users/pengguna',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::storePengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:86
 * @route '/admin/users/pengguna'
 */
storePengguna.url = (options?: RouteQueryOptions) => {
    return storePengguna.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::storePengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:86
 * @route '/admin/users/pengguna'
 */
storePengguna.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePengguna.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::storePengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:86
 * @route '/admin/users/pengguna'
 */
    const storePenggunaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePengguna.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::storePengguna
 * @see app/Http/Controllers/Admin/AccountManagementController.php:86
 * @route '/admin/users/pengguna'
 */
        storePenggunaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePengguna.url(options),
            method: 'post',
        })
    
    storePengguna.form = storePenggunaForm
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::destroy
 * @see app/Http/Controllers/Admin/AccountManagementController.php:121
 * @route '/admin/users/{user}/deactivate'
 */
const destroy35d5885c4463392eec31fe060ef6a976 = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: destroy35d5885c4463392eec31fe060ef6a976.url(args, options),
    method: 'patch',
})

destroy35d5885c4463392eec31fe060ef6a976.definition = {
    methods: ["patch"],
    url: '/admin/users/{user}/deactivate',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::destroy
 * @see app/Http/Controllers/Admin/AccountManagementController.php:121
 * @route '/admin/users/{user}/deactivate'
 */
destroy35d5885c4463392eec31fe060ef6a976.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return destroy35d5885c4463392eec31fe060ef6a976.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::destroy
 * @see app/Http/Controllers/Admin/AccountManagementController.php:121
 * @route '/admin/users/{user}/deactivate'
 */
destroy35d5885c4463392eec31fe060ef6a976.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: destroy35d5885c4463392eec31fe060ef6a976.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::destroy
 * @see app/Http/Controllers/Admin/AccountManagementController.php:121
 * @route '/admin/users/{user}/deactivate'
 */
    const destroy35d5885c4463392eec31fe060ef6a976Form = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy35d5885c4463392eec31fe060ef6a976.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::destroy
 * @see app/Http/Controllers/Admin/AccountManagementController.php:121
 * @route '/admin/users/{user}/deactivate'
 */
        destroy35d5885c4463392eec31fe060ef6a976Form.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy35d5885c4463392eec31fe060ef6a976.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy35d5885c4463392eec31fe060ef6a976.form = destroy35d5885c4463392eec31fe060ef6a976Form
    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::destroy
 * @see app/Http/Controllers/Admin/AccountManagementController.php:121
 * @route '/admin/users/{user}'
 */
const destroyfcf537c0ef09758de25ef4ed617562a1 = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyfcf537c0ef09758de25ef4ed617562a1.url(args, options),
    method: 'delete',
})

destroyfcf537c0ef09758de25ef4ed617562a1.definition = {
    methods: ["delete"],
    url: '/admin/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::destroy
 * @see app/Http/Controllers/Admin/AccountManagementController.php:121
 * @route '/admin/users/{user}'
 */
destroyfcf537c0ef09758de25ef4ed617562a1.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return destroyfcf537c0ef09758de25ef4ed617562a1.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::destroy
 * @see app/Http/Controllers/Admin/AccountManagementController.php:121
 * @route '/admin/users/{user}'
 */
destroyfcf537c0ef09758de25ef4ed617562a1.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyfcf537c0ef09758de25ef4ed617562a1.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::destroy
 * @see app/Http/Controllers/Admin/AccountManagementController.php:121
 * @route '/admin/users/{user}'
 */
    const destroyfcf537c0ef09758de25ef4ed617562a1Form = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyfcf537c0ef09758de25ef4ed617562a1.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::destroy
 * @see app/Http/Controllers/Admin/AccountManagementController.php:121
 * @route '/admin/users/{user}'
 */
        destroyfcf537c0ef09758de25ef4ed617562a1Form.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyfcf537c0ef09758de25ef4ed617562a1.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyfcf537c0ef09758de25ef4ed617562a1.form = destroyfcf537c0ef09758de25ef4ed617562a1Form

/**
* Multiple routes resolve to \App\Http\Controllers\Admin\AccountManagementController::destroy, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `destroy['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const destroy = {
    '/admin/users/{user}/deactivate': destroy35d5885c4463392eec31fe060ef6a976,
    '/admin/users/{user}': destroyfcf537c0ef09758de25ef4ed617562a1,
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::verifications
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
export const verifications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifications.url(options),
    method: 'get',
})

verifications.definition = {
    methods: ["get","head"],
    url: '/admin/verifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::verifications
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
verifications.url = (options?: RouteQueryOptions) => {
    return verifications.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountManagementController::verifications
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
verifications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifications.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AccountManagementController::verifications
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
verifications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifications.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AccountManagementController::verifications
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
    const verificationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verifications.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::verifications
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
        verificationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verifications.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AccountManagementController::verifications
 * @see app/Http/Controllers/Admin/AccountManagementController.php:31
 * @route '/admin/verifications'
 */
        verificationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verifications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verifications.form = verificationsForm
const AccountManagementController = { index, createPetugas, storePetugas, createPengguna, storePengguna, destroy, verifications }

export default AccountManagementController