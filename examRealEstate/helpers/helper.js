module.exports = {
    createErrorMsg: errors =>
        errors
            .array()
            .map(x => x.msg)
            .join(" <br/>"),

    createErrorFromModel: error => error.message.split(':')[2].split(',')[0],
}
