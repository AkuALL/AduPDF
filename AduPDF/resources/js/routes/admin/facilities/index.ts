import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::index
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:23
 * @route '/admin/facilities'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/facilities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::index
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:23
 * @route '/admin/facilities'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::index
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:23
 * @route '/admin/facilities'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::index
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:23
 * @route '/admin/facilities'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::index
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:23
 * @route '/admin/facilities'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::index
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:23
 * @route '/admin/facilities'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::index
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:23
 * @route '/admin/facilities'
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
* @see \App\Http\Controllers\Admin\FacilityManagementController::create
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:63
 * @route '/admin/facilities/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/facilities/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::create
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:63
 * @route '/admin/facilities/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::create
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:63
 * @route '/admin/facilities/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::create
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:63
 * @route '/admin/facilities/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::create
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:63
 * @route '/admin/facilities/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::create
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:63
 * @route '/admin/facilities/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::create
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:63
 * @route '/admin/facilities/create'
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
* @see \App\Http\Controllers\Admin\FacilityManagementController::store
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:76
 * @route '/admin/facilities'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/facilities',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::store
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:76
 * @route '/admin/facilities'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::store
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:76
 * @route '/admin/facilities'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::store
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:76
 * @route '/admin/facilities'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::store
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:76
 * @route '/admin/facilities'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::show
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:93
 * @route '/admin/facilities/{facility}'
 */
export const show = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/facilities/{facility}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::show
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:93
 * @route '/admin/facilities/{facility}'
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
* @see \App\Http\Controllers\Admin\FacilityManagementController::show
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:93
 * @route '/admin/facilities/{facility}'
 */
show.get = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::show
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:93
 * @route '/admin/facilities/{facility}'
 */
show.head = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::show
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:93
 * @route '/admin/facilities/{facility}'
 */
    const showForm = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::show
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:93
 * @route '/admin/facilities/{facility}'
 */
        showForm.get = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::show
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:93
 * @route '/admin/facilities/{facility}'
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
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::edit
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:106
 * @route '/admin/facilities/{facility}/edit'
 */
export const edit = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/facilities/{facility}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::edit
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:106
 * @route '/admin/facilities/{facility}/edit'
 */
edit.url = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{facility}', parsedArgs.facility.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::edit
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:106
 * @route '/admin/facilities/{facility}/edit'
 */
edit.get = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::edit
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:106
 * @route '/admin/facilities/{facility}/edit'
 */
edit.head = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::edit
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:106
 * @route '/admin/facilities/{facility}/edit'
 */
    const editForm = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::edit
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:106
 * @route '/admin/facilities/{facility}/edit'
 */
        editForm.get = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::edit
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:106
 * @route '/admin/facilities/{facility}/edit'
 */
        editForm.head = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::update
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:120
 * @route '/admin/facilities/{facility}'
 */
export const update = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/facilities/{facility}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::update
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:120
 * @route '/admin/facilities/{facility}'
 */
update.url = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{facility}', parsedArgs.facility.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::update
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:120
 * @route '/admin/facilities/{facility}'
 */
update.put = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::update
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:120
 * @route '/admin/facilities/{facility}'
 */
update.patch = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::update
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:120
 * @route '/admin/facilities/{facility}'
 */
    const updateForm = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::update
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:120
 * @route '/admin/facilities/{facility}'
 */
        updateForm.put = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::update
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:120
 * @route '/admin/facilities/{facility}'
 */
        updateForm.patch = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::destroy
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:177
 * @route '/admin/facilities/{facility}'
 */
export const destroy = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/facilities/{facility}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::destroy
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:177
 * @route '/admin/facilities/{facility}'
 */
destroy.url = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{facility}', parsedArgs.facility.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::destroy
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:177
 * @route '/admin/facilities/{facility}'
 */
destroy.delete = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::destroy
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:177
 * @route '/admin/facilities/{facility}'
 */
    const destroyForm = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::destroy
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:177
 * @route '/admin/facilities/{facility}'
 */
        destroyForm.delete = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::deactivate
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:150
 * @route '/admin/facilities/{facility}/deactivate'
 */
export const deactivate = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: deactivate.url(args, options),
    method: 'patch',
})

deactivate.definition = {
    methods: ["patch"],
    url: '/admin/facilities/{facility}/deactivate',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::deactivate
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:150
 * @route '/admin/facilities/{facility}/deactivate'
 */
deactivate.url = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return deactivate.definition.url
            .replace('{facility}', parsedArgs.facility.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::deactivate
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:150
 * @route '/admin/facilities/{facility}/deactivate'
 */
deactivate.patch = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: deactivate.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::deactivate
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:150
 * @route '/admin/facilities/{facility}/deactivate'
 */
    const deactivateForm = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deactivate.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::deactivate
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:150
 * @route '/admin/facilities/{facility}/deactivate'
 */
        deactivateForm.patch = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deactivate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deactivate.form = deactivateForm
/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::activate
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:167
 * @route '/admin/facilities/{facility}/activate'
 */
export const activate = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: activate.url(args, options),
    method: 'patch',
})

activate.definition = {
    methods: ["patch"],
    url: '/admin/facilities/{facility}/activate',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::activate
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:167
 * @route '/admin/facilities/{facility}/activate'
 */
activate.url = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return activate.definition.url
            .replace('{facility}', parsedArgs.facility.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FacilityManagementController::activate
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:167
 * @route '/admin/facilities/{facility}/activate'
 */
activate.patch = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: activate.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::activate
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:167
 * @route '/admin/facilities/{facility}/activate'
 */
    const activateForm = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: activate.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\FacilityManagementController::activate
 * @see app/Http/Controllers/Admin/FacilityManagementController.php:167
 * @route '/admin/facilities/{facility}/activate'
 */
        activateForm.patch = (args: { facility: number | { id: number } } | [facility: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: activate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    activate.form = activateForm
const facilities = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
deactivate: Object.assign(deactivate, deactivate),
activate: Object.assign(activate, activate),
}

export default facilities