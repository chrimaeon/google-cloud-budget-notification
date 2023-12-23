import { IncomingWebhook } from '@slack/webhook'
import { cloudEvent } from '@google-cloud/functions-framework'
import { RawPubSubBody } from '@google-cloud/functions-framework/build/src/pubsub_middleware'

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

cloudEvent<RawPubSubBody>('google-cloud-budget-notification', async (cloudEvent) => {
  const budgetInfo: BillingMessage = JSON.parse(Buffer.from(cloudEvent.data!.message.data, 'base64').toString())

  const budgetNotificationText = JSON.stringify(budgetInfo, null, 2)

  await webhook.send({
    text: budgetNotificationText,
  })

  return 'Slack notification sent successfully'
})
