import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
const ReportAttachmentController = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ReportAttachmentController.url(args, options),
    method: 'get',
})

ReportAttachmentController.definition = {
    methods: ["get","head"],
    url: '/report-attachments/{attachment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
ReportAttachmentController.url = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return ReportAttachmentController.definition.url
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
ReportAttachmentController.get = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ReportAttachmentController.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
ReportAttachmentController.head = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ReportAttachmentController.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
    const ReportAttachmentControllerForm = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ReportAttachmentController.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
        ReportAttachmentControllerForm.get = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ReportAttachmentController.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportAttachmentController::__invoke
 * @see app/Http/Controllers/ReportAttachmentController.php:12
 * @route '/report-attachments/{attachment}'
 */
        ReportAttachmentControllerForm.head = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ReportAttachmentController.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ReportAttachmentController.form = ReportAttachmentControllerForm
export default ReportAttachmentController