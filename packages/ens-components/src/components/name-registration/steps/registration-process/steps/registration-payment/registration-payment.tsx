"use client";

import { Button, Skeleton, Surface, Typography } from "@thenamespace/uikit";

import { useNameRegistration } from "#/components/name-registration/context";
import { useRegistrationPayment } from "#/components/name-registration/steps/registration-process/steps/registration-payment/use-registration-payment";
import type { RegistrationSuccessDetails } from "#/components/name-registration/steps/registration-success";
import { PaymentTokenIcon } from "#/components/payment-token-icon";
import { TransactionProgress } from "#/components/transaction-progress";
import { formatError, formatTokenAmount } from "#/lib";
import { formatRegistrationTimeRemaining } from "#/lib/helpers";
import { useEnsConfig } from "#/providers";

export interface RegistrationPaymentProps {
  onCommitmentInvalid: (error: unknown) => void;
  onPendingChange?: (isPending: boolean) => void;
  onSuccess: (registration: RegistrationSuccessDetails) => void;
}

export function RegistrationPayment({
  onCommitmentInvalid,
  onPendingChange,
  onSuccess,
}: RegistrationPaymentProps) {
  const { chain } = useEnsConfig();
  const { slots } = useNameRegistration();
  const registration = useRegistrationPayment({
    onCommitmentInvalid,
    onSuccess,
    ...(onPendingChange === undefined ? {} : { onPendingChange }),
  });
  const { payment, paymentToken, storedAttempt } = registration;

  return (
    <div className="mt-4">
      <Surface
        className="flex items-center justify-between gap-4 rounded-xl px-3 py-2"
        variant="secondary"
      >
        <Typography.Paragraph color="muted" size="xs">
          Registration price
        </Typography.Paragraph>
        <div className="flex items-center gap-2">
          <PaymentTokenIcon icon={paymentToken.icon} symbol={paymentToken.symbol} />
          {payment.isPending || payment.isFetching ? (
            <Skeleton className="h-5 w-14 rounded-md" />
          ) : payment.data ? (
            <span className="text-foreground text-sm font-semibold">
              {formatTokenAmount(payment.data.total, payment.data.decimals, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
          ) : (
            <span className="text-muted text-sm">N/A</span>
          )}
        </div>
      </Surface>
      <Typography.Paragraph className="mt-2 text-center" color="muted" size="xs">
        Complete registration within {formatRegistrationTimeRemaining(registration.timeRemaining)}.
      </Typography.Paragraph>
      {registration.actionStatus === "confirming-approval" ||
      registration.actionStatus === "confirming-address-record" ||
      registration.actionStatus === "confirming-batch" ||
      registration.actionStatus === "confirming-default-primary-name" ||
      registration.actionStatus === "confirming-l1-primary-name" ||
      registration.actionStatus === "confirming-registration" ? (
        <TransactionProgress
          account={storedAttempt?.account}
          blockExplorerUrl={chain.blockExplorers?.default.url}
          chainId={chain.id}
          className="mt-4"
          icon={slots.transactionProgressIcon}
          isConfirmed={registration.isTransactionConfirmed}
          transactionHash={registration.transactionHash}
        />
      ) : (
        <Button
          className="mt-4 w-full"
          isDisabled={
            !registration.isWalletConnected ||
            payment.isPending ||
            (payment.data !== undefined && !payment.data.hasSufficientBalance)
          }
          isPending={registration.isPending}
          onPress={registration.handlePayment}
        >
          {registration.buttonLabel}
        </Button>
      )}
      {payment.isError || registration.error !== undefined ? (
        <Typography.Paragraph
          className="text-danger mx-auto mt-2 text-center"
          size="xs"
          role="alert"
        >
          {formatError(registration.error ?? payment.error, {
            name: storedAttempt?.label,
          })}
        </Typography.Paragraph>
      ) : null}
    </div>
  );
}
