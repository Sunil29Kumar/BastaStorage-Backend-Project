import cron from "cron"


export const cleanupPendingUploadsJob = new cron.CronJob(
    "*/2 * * * * *",
    async () => {
       
    },
    null,
    true,
    "Asia/Kolkata"
)