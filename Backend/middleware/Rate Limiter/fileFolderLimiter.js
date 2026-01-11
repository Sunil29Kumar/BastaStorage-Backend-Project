import rateLimit from 'express-rate-limit';


// file limiters
export const uploadFileLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Too many uploads. Please wait a minute." }
});



// file/folder rename limiters
export const fileFolderRenameLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50,
    message: { error: "Too many uploads. Please wait an hour." }
});

// delete file/folder limiters
export const fileFolderDeleteLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: { error: "Too many delete requests. Please wait a minute." }
});


// download file limiters
export const fileDownloadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: { error: "Too many download requests. Please wait an hour." }
});


// folder limiters 
export const directoryCreateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: "Too many folders created. Please wait a minute." }
});
