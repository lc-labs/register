import { t } from '@lingui/macro'
import { TitleCard } from 'components'
import { FormField } from 'components/field'
import { BoxProps } from 'theme-ui'
import { decimalPattern, numberPattern } from 'utils'

const BackingForm = (props: BoxProps) => {
  return (
    <TitleCard title={t`Backing Manager`} {...props}>
      <FormField
        label={t`Trading delay (s)`}
        placeholder={t`Delay in seconds`}
        mb={3}
        name="tradingDelay"
        options={{
          required: true,
          pattern: numberPattern,
          min: 0,
          max: 604800,
        }}
      />
      <FormField
        label={t`Auction length (s)`}
        placeholder={t`Duration in Seconds`}
        mb={3}
        name="auctionLength"
        options={{
          required: true,
          pattern: numberPattern,
          max: 3600,
          min: 60,
        }}
      />
      <FormField
        label={t`Minimum bid size`}
        placeholder={t`Amount`}
        mb={3}
        name="minBidSize"
        options={{
          required: true,
          pattern: numberPattern,
          max: 1000000,
          min: 1,
        }}
      />
      <FormField
        label={t`Backing buffer (%)`}
        placeholder={t`Extra collateral to keep`}
        mb={3}
        name="backingBuffer"
        options={{
          required: true,
          pattern: decimalPattern,
          min: 0.01,
          max: 100,
        }}
      />
      <FormField
        label={t`Max trade slippage (%)`}
        placeholder={t`% Acceptable`}
        mb={3}
        name="maxTradeSlippage"
        options={{
          required: true,
          pattern: decimalPattern,
          min: 0.01,
          max: 100,
        }}
      />
      <FormField
        label={t`Issuance rate (decimals)`}
        placeholder={t`Rate`}
        mb={3}
        name="issuanceRate"
        options={{
          required: true,
          pattern: decimalPattern,
          min: 0.000000001,
          max: 0.01,
        }}
      />
      <FormField
        label={t`Dust amount`}
        placeholder={t`Dust Amount`}
        mb={3}
        name="dustAmount"
        options={{
          required: true,
          pattern: numberPattern,
          min: 1,
          max: 1000000000,
        }}
      />
    </TitleCard>
  )
}

export default BackingForm
