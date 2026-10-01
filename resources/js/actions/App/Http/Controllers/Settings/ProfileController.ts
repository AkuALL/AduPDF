import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/profile'
 */
const editaed0d18b6699640aa4d85cb0451e9ce2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editaed0d18b6699640aa4d85cb0451e9ce2.url(options),
    method: 'get',
})

editaed0d18b6699640aa4d85cb0451e9ce2.definition = {
    methods: ["get","head"],
    url: '/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/profile'
 */
editaed0d18b6699640aa4d85cb0451e9ce2.url = (options?: RouteQueryOptions) => {
    return editaed0d18b6699640aa4d85cb0451e9ce2.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/profile'
 */
editaed0d18b6699640aa4d85cb0451e9ce2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editaed0d18b6699640aa4d85cb0451e9ce2.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/profile'
 */
editaed0d18b6699640aa4d85cb0451e9ce2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editaed0d18b6699640aa4d85cb0451e9ce2.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/profile'
 */
    const editaed0d18b6699640aa4d85cb0451e9ce2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: editaed0d18b6699640aa4d85cb0451e9ce2.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/profile'
 */
        editaed0d18b6699640aa4d85cb0451e9ce2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editaed0d18b6699640aa4d85cb0451e9ce2.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/profile'
 */
        editaed0d18b6699640aa4d85cb0451e9ce2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editaed0d18b6699640aa4d85cb0451e9ce2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    editaed0d18b6699640aa4d85cb0451e9ce2.form = editaed0d18b6699640aa4d85cb0451e9ce2Form
    /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/settings/profile'
 */
const editfc6874003af373efc88e5e18eecd9c17 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'get',
})

editfc6874003af373efc88e5e18eecd9c17.definition = {
    methods: ["get","head"],
    url: '/settings/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/settings/profile'
 */
editfc6874003af373efc88e5e18eecd9c17.url = (options?: RouteQueryOptions) => {
    return editfc6874003af373efc88e5e18eecd9c17.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/settings/profile'
 */
editfc6874003af373efc88e5e18eecd9c17.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/settings/profile'
 */
editfc6874003af373efc88e5e18eecd9c17.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/settings/profile'
 */
    const editfc6874003af373efc88e5e18eecd9c17Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: editfc6874003af373efc88e5e18eecd9c17.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/settings/profile'
 */
        editfc6874003af373efc88e5e18eecd9c17Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editfc6874003af373efc88e5e18eecd9c17.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:22
 * @route '/settings/profile'
 */
        editfc6874003af373efc88e5e18eecd9c17Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editfc6874003af373efc88e5e18eecd9c17.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    editfc6874003af373efc88e5e18eecd9c17.form = editfc6874003af373efc88e5e18eecd9c17Form

/**
* Multiple routes resolve to \App\Http\Controllers\Settings\ProfileController::edit, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `edit['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const edit = {
    '/profile': editaed0d18b6699640aa4d85cb0451e9ce2,
    '/settings/profile': editfc6874003af373efc88e5e18eecd9c17,
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:33
 * @route '/profile'
 */
const updateaed0d18b6699640aa4d85cb0451e9ce2 = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateaed0d18b6699640aa4d85cb0451e9ce2.url(options),
    method: 'patch',
})

updateaed0d18b6699640aa4d85cb0451e9ce2.definition = {
    methods: ["patch"],
    url: '/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:33
 * @route '/profile'
 */
updateaed0d18b6699640aa4d85cb0451e9ce2.url = (options?: RouteQueryOptions) => {
    return updateaed0d18b6699640aa4d85cb0451e9ce2.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:33
 * @route '/profile'
 */
updateaed0d18b6699640aa4d85cb0451e9ce2.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateaed0d18b6699640aa4d85cb0451e9ce2.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:33
 * @route '/profile'
 */
    const updateaed0d18b6699640aa4d85cb0451e9ce2Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateaed0d18b6699640aa4d85cb0451e9ce2.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:33
 * @route '/profile'
 */
        updateaed0d18b6699640aa4d85cb0451e9ce2Form.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateaed0d18b6699640aa4d85cb0451e9ce2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateaed0d18b6699640aa4d85cb0451e9ce2.form = updateaed0d18b6699640aa4d85cb0451e9ce2Form
    /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:33
 * @route '/settings/profile'
 */
const updatefc6874003af373efc88e5e18eecd9c17 = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatefc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'patch',
})

updatefc6874003af373efc88e5e18eecd9c17.definition = {
    methods: ["patch"],
    url: '/settings/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:33
 * @route '/settings/profile'
 */
updatefc6874003af373efc88e5e18eecd9c17.url = (options?: RouteQueryOptions) => {
    return updatefc6874003af373efc88e5e18eecd9c17.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:33
 * @route '/settings/profile'
 */
updatefc6874003af373efc88e5e18eecd9c17.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatefc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:33
 * @route '/settings/profile'
 */
    const updatefc6874003af373efc88e5e18eecd9c17Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatefc6874003af373efc88e5e18eecd9c17.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:33
 * @route '/settings/profile'
 */
        updatefc6874003af373efc88e5e18eecd9c17Form.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatefc6874003af373efc88e5e18eecd9c17.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatefc6874003af373efc88e5e18eecd9c17.form = updatefc6874003af373efc88e5e18eecd9c17Form

/**
* Multiple routes resolve to \App\Http\Controllers\Settings\ProfileController::update, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `update['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const update = {
    '/profile': updateaed0d18b6699640aa4d85cb0451e9ce2,
    '/settings/profile': updatefc6874003af373efc88e5e18eecd9c17,
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:67
 * @route '/profile'
 */
const destroyaed0d18b6699640aa4d85cb0451e9ce2 = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyaed0d18b6699640aa4d85cb0451e9ce2.url(options),
    method: 'delete',
})

destroyaed0d18b6699640aa4d85cb0451e9ce2.definition = {
    methods: ["delete"],
    url: '/profile',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:67
 * @route '/profile'
 */
destroyaed0d18b6699640aa4d85cb0451e9ce2.url = (options?: RouteQueryOptions) => {
    return destroyaed0d18b6699640aa4d85cb0451e9ce2.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:67
 * @route '/profile'
 */
destroyaed0d18b6699640aa4d85cb0451e9ce2.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyaed0d18b6699640aa4d85cb0451e9ce2.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:67
 * @route '/profile'
 */
    const destroyaed0d18b6699640aa4d85cb0451e9ce2Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyaed0d18b6699640aa4d85cb0451e9ce2.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:67
 * @route '/profile'
 */
        destroyaed0d18b6699640aa4d85cb0451e9ce2Form.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyaed0d18b6699640aa4d85cb0451e9ce2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyaed0d18b6699640aa4d85cb0451e9ce2.form = destroyaed0d18b6699640aa4d85cb0451e9ce2Form
    /**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:67
 * @route '/settings/profile'
 */
const destroyfc6874003af373efc88e5e18eecd9c17 = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'delete',
})

destroyfc6874003af373efc88e5e18eecd9c17.definition = {
    methods: ["delete"],
    url: '/settings/profile',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:67
 * @route '/settings/profile'
 */
destroyfc6874003af373efc88e5e18eecd9c17.url = (options?: RouteQueryOptions) => {
    return destroyfc6874003af373efc88e5e18eecd9c17.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:67
 * @route '/settings/profile'
 */
destroyfc6874003af373efc88e5e18eecd9c17.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyfc6874003af373efc88e5e18eecd9c17.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:67
 * @route '/settings/profile'
 */
    const destroyfc6874003af373efc88e5e18eecd9c17Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyfc6874003af373efc88e5e18eecd9c17.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:67
 * @route '/settings/profile'
 */
        destroyfc6874003af373efc88e5e18eecd9c17Form.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyfc6874003af373efc88e5e18eecd9c17.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyfc6874003af373efc88e5e18eecd9c17.form = destroyfc6874003af373efc88e5e18eecd9c17Form

/**
* Multiple routes resolve to \App\Http\Controllers\Settings\ProfileController::destroy, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `destroy['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const destroy = {
    '/profile': destroyaed0d18b6699640aa4d85cb0451e9ce2,
    '/settings/profile': destroyfc6874003af373efc88e5e18eecd9c17,
}

const ProfileController = { edit, update, destroy }

export default ProfileController