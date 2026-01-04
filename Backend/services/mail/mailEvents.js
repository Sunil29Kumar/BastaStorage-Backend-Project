import { sendMail } from "./index.js";
import { subscriptionActivatedTemplate } from "./templates/subscriptionActivated.js";
import { subscriptionPausedTemplate } from "./templates/subscriptionPaused.js";
import { subscriptionResumedTemplate } from "./templates/subscriptionResumed.js";
import { subscriptionCancelledTemplate } from "./templates/subscriptionCancelled.js";
import { graceReminderTemplate } from "./templates/graceReminder.js";
import { subscriptionExpiredTemplate } from "./templates/subscriptionExpired.js";
import { graceEndedTemplate } from "./templates/graceEnded.js";


export const sendSubscriptionMail = async ({
    type,
    user,
    meta = {},
}) => {

    const map = {
        ACTIVATED: {
            subject: "Your subscription is active",
            template: subscriptionActivatedTemplate,
        },
        PAUSED: {
            subject: "Subscription paused",
            template: subscriptionPausedTemplate,
        },
        RESUMED: {
            subject: "Subscription resumed",
            template: subscriptionResumedTemplate,
        },
        CANCELLED: {
            subject: "Subscription cancelled",
            template: subscriptionCancelledTemplate,
        },
        EXPIRED: {
            subject: "Subscription expired",
            template: subscriptionExpiredTemplate,
        },
        GRACE_REMINDER: {
            subject: `⏳ ${meta.days} days left`,
            template: graceReminderTemplate,
        },
        GRACE_ENDED: {
            subject: "Paid data removed",
            template: graceEndedTemplate,
        },
    };

    const event = map[type];
    if (!event) return;

    await sendMail({
        to: user.email,
        subject: event.subject,
        html: event.template({ name: user.name, ...meta }),
    });
};
