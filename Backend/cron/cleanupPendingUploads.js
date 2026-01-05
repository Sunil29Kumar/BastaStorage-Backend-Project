import { CronJob } from "cron";
import Subscription from "../models/subscriptionModel.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import { sendSubscriptionMail } from "../services/mail/mailEvents.js";
import { deleteFilesFromS3 } from "../utils/s3.js";
import plans from "../utils/plans.js";

export const cleanupPendingUploads = () => {

    const DAY = 24 * 60 * 60 * 1000;

    new CronJob(
        "*/10 * * * * *",   // every 6 hours (REALISTIC)
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
                const userCache = new Map();


                // DAILY GRACE REMINDER (ONCE PER DAY)
                if (remainingDays > 0 && remainingDays <= 7) {

                    const alreadyNotified = sub.logs?.some(
                        log => log.action === `grace_notify_${remainingDays}`
                    );

                    if (!alreadyNotified) {

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

                        let user = userCache.get(sub.userId.toString());
                        if (!user) {
                            user = await User.findById(sub.userId);
                            if (!user) continue;
                            userCache.set(sub.userId.toString(), user);
                        }

                        try {
                            await sendSubscriptionMail({
                                type: "GRACE_REMINDER",
                                user,
                                meta: { days: remainingDays }
                            });
                        } catch (err) {
                            console.error("Grace reminder mail failed:", err.message);
                        }
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

                    // delete multi fle from S3
                    const keys = proFiles.map(f => `${f._id}${f.extension}`);
                    if (keys.length > 0) await deleteFilesFromS3(keys);


                    // update user usedSpace
                    // downgrade user to free plan
                    await User.findByIdAndUpdate(
                        sub.userId,
                        {
                            $inc: { usedSpace: -totalProFilesSize },
                            userIs: "free", subscriptionTier: "free", totalSpace: plans["plan_free"].storageQuotaBytes
                        }
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

                    // grace ended mail
                    await sendSubscriptionMail({
                        type: "GRACE_ENDED",
                        user: userCache.get(sub.userId.toString()) || await User.findById(sub.userId),
                        meta: { graceDays: 0 }
                    });

                }
            }
        },
        null,
        true,
        "Asia/Kolkata"
    );
};
