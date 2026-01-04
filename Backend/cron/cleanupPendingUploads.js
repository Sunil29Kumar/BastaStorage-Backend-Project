import { CronJob } from "cron";
import Subscription from "../models/subscriptionModel.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";

export const cleanupPendingUploads = () => {

    const DAY = 24 * 60 * 60 * 1000;

    new CronJob(
        "*/3 * * * * *",   // every 6 hours (REALISTIC)
        async () => {
            console.log(" Grace expiry cron started");

            const now = Date.now();

            const subscriptions = await Subscription.find({
                status: "expired",
                "grace.enabled": true,
            });

            for (const sub of subscriptions) {

                const remainingMs = new Date(sub.grace.until).getTime() - now;
                const remainingDays = Math.ceil(remainingMs / DAY);
                console.log(remainingDays);


                //  DAILY NOTIFICATION (ONCE PER DAY)
                if (remainingDays > 0 && remainingDays <= 7) {

                    const alreadyNotified = sub.logs?.some(
                        log => log.action === `grace_notify_${remainingDays}`
                    );

                    if (!alreadyNotified) {
                        console.log(` Notify user ${sub.userId}: ${remainingDays} days left`);

                        await Subscription.findByIdAndUpdate(sub._id, {
                            $push: {
                                logs: {
                                    action: `grace_notify_${remainingDays}`,
                                    by: "system",
                                    at: new Date(),
                                    note: `${remainingDays} days grace left`
                                }
                            }
                        });
                    }
                }

                //  GRACE EXPIRED
                if (remainingMs <= 0) {

                    console.log(`❌ Grace expired for user ${sub.userId}`);

                    // Delete all paid files uploaded by the user
                    const proFiles = await File.find({
                        userId: sub.userId,
                        uploadedUnderPlan: { $ne: "free" }
                    });

                    let totalProFilesSize = 0;
                    if (proFiles.length > 0) totalProFilesSize = proFiles.reduce((a, f) => a + f.size, 0);

                    await File.deleteMany({
                        userId: sub.userId,
                        uploadedUnderPlan: { $ne: "free" }
                    });


                    // update user usedSpace
                    // const user = await User.findById(sub.userId);
                    // if (user) {
                    //     user.usedSpace -= totalProFilesSize; 
                    //     await user.save();
                    // }

                    await User.findByIdAndUpdate(
                        sub.userId,
                        { $inc: { usedSpace: -totalProFilesSize } }
                    );

                    // update subscription to disable grace
                    await Subscription.findByIdAndUpdate(sub._id, {
                        "grace.enabled": false,
                        $push: {
                            logs: {
                                action: "grace_ended_cleanup_done",
                                by: "system",
                                at: new Date(),
                                note: "Paid files deleted after grace period"
                            }
                        }
                    });

                    // update notification 
                    await Notification.create({
                        userId: sub.userId,
                        title: "subscription",
                        message: "Your subscription grace period has ended. All paid files have been deleted and your account has been downgraded to free tier.",
                        type: "warning",
                    });
                }
            }
        },
        null,
        true,
        "Asia/Kolkata"
    );
};
