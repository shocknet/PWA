let dialogCallback = null
export const addDialogCallback = cb => {
    dialogCallback = cb
}

export const callDialogCallBack = async () => {
    if(!dialogCallback){
        return Promise.resolve()
    }
    return dialogCallback()
}