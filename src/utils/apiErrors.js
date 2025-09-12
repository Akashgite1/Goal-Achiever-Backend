// custom error class to handle api errors 
// Purpose: Standardize error responses across the application.
// sending the error in a structured format
// statuscode - HTTP status code send user to indicate the type of error
//              200 - success
//              400 - bad request
//              401 - unauthorized
//              403 - forbidden
//              501 - not implemented 
//              500 - internal server error
// message - A brief description of the error
// errors - An array of specific error details (optional)
// stack - The stack trace for debugging (optional) 

class apiErrors extends Error {
    // constructor is used to create a new instance of the class instence = variable
    constructor(
        statusCode,
        message = 'Something went wrong',
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack) {
            this.stack = stack
        }else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {apiErrors}