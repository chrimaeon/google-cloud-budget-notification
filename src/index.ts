import { IncomingWebhook } from '@slack/webhook'
import { cloudEvent } from '@google-cloud/functions-framework'

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK)

type BillingMessage = {
  budgetDisplayName: string
  costAmount: number
  costIntervalStart: string
  budgetAmount: number
  budgetAmountType: 'SPECIFIED_AMOUNT' | 'LAST_MONTH_COST' | 'LAST_PERIODS_COST'
  alertThresholdExceeded: number
  forecastThresholdExceeded: number
  currencyCode: string
}

cloudEvent<BillingMessage>('google-cloud-billing-notification', async (cloudEvent) => {
  const budgetNotificationText = JSON.stringify(cloudEvent.data)

  await webhook.send({
    text: budgetNotificationText,
  })

  return 'Slack notification sent successfully'
})
