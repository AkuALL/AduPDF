import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/auth.php:29
 * @route '/confirm-password'
 */
export const confirm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirm.url(options),
    method: 'get',
})

confirm.definition = {
    methods: ["get","head"],
    url: '/confirm-password',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/auth.php:29
 * @route '/confirm-password'
 */
confirm.url = (options?: RouteQueryOptions) => {
    return confirm.definition.url + queryParams(options)
}

/**
 * @see routes/auth.php:29
 * @route '/confirm-password'
 */
confirm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirm.url(options),
    method: 'get',
})
/**
 * @see routes/auth.php:29
 * @route '/confirm-password'
 */
confirm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: confirm.url(options),
    method: 'head',
})

    /**
 * @see routes/auth.php:29
 * @route '/confirm-password'
 */
    const confirmForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: confirm.url(options),
        method: 'get',
    })

            /**
 * @see routes/auth.php:29
 * @route '/confirm-password'
 */
        confirmForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: confirm.url(options),
            method: 'get',
        })
            /**
 * @see routes/auth.php:29
 * @route '/confirm-password'
 */
        confirmForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: confirm.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    confirm.form = confirmForm
const password = {
    confirm: Object.assign(confirm, confirm),
}

export default password