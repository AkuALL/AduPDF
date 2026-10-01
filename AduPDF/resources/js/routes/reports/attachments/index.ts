import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
export const show = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/report-attachments/{attachment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
show.url = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attachment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { attachment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    attachment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attachment: typeof args.attachment === 'object'
                ? args.attachment.id
                : args.attachment,
                }

    return show.definition.url
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
show.get = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
show.head = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
    const showForm = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
        showForm.get = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
        showForm.head = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const attachments = {
    show: Object.assign(show, show),
}

export default attachments