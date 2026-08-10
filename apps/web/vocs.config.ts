import { defineConfig } from "vocs/config";

const docs = (path: string) => (path.length === 0 ? "/docs" : `/docs/${path}`);
const page = (text: string, path: string) => ({ text, link: docs(path) });

export default defineConfig({
  accentColor: "#587cff",
  colorScheme: "dark",
  description: "React components, hooks, and typed actions for integrating ENS v2.",
  head: {
    link: [{ rel: "manifest", href: "/site.webmanifest" }],
    meta: {
      themeColor: "#f4f4f4",
    },
  },
  iconUrl: "/namespace.svg",
  logoUrl: {
    dark: "/ens-components-logo-dark.svg",
    light: "/ens-components-logo-light.svg",
  },
  sidebar: {
    "/docs": [
      {
        text: "Introduction",
        items: [
          page("Overview", ""),
          page("Installation", "installation"),
          page("Getting Started", "getting-started"),
          page("TypeScript", "typescript"),
        ],
      },
      {
        text: "Guides",
        items: [
          page("Choosing an API", "guides/choosing-an-api"),
          page("Error Handling", "guides/error-handling"),
          page("Queries", "guides/queries"),
          page("Transactions", "guides/transactions"),
          page("Batching", "guides/batching"),
          page("Custom Configuration", "guides/custom-configuration"),
          page("Component Customization", "guides/component-customization"),
        ],
      },
      {
        text: "Configuration",
        items: [
          page("createEnsConfig", "config/create-ens-config"),
          page("EnsProvider", "config/ens-provider"),
          page("Contracts", "config/contracts"),
          page("Payment Tokens", "config/payment-tokens"),
        ],
      },
      {
        text: "Components",
        link: docs("components"),
        items: [
          page("NameRegistration", "components/name-registration"),
          page("NameRenewal", "components/name-renewal"),
          page("NameProfileEditor", "components/name-profile-editor"),
          page("TransactionProgress", "components/transaction-progress"),
        ],
      },
      {
        text: "Hooks",
        collapsed: true,
        link: docs("hooks"),
        items: [
          page("useNameAvailability", "hooks/use-name-availability"),
          page("useNameRegistrationPrice", "hooks/use-name-registration-price"),
          page("useNameRegistrationPaymentStatus", "hooks/use-name-registration-payment-status"),
          page("useCommitmentStatus", "hooks/use-commitment-status"),
          page("useCommitName", "hooks/use-commit-name"),
          page("useRegisterName", "hooks/use-register-name"),
          page("useNameRenewalPrice", "hooks/use-name-renewal-price"),
          page("useNameRenewalPaymentStatus", "hooks/use-name-renewal-payment-status"),
          page("useRenewName", "hooks/use-renew-name"),
          page("useNameProfile", "hooks/use-name-profile"),
          page("useNameRecords", "hooks/use-name-records"),
          page("useNameProfilePermissions", "hooks/use-name-profile-permissions"),
          page("useNameResolver", "hooks/use-name-resolver"),
          page("useResolverCapabilities", "hooks/use-resolver-capabilities"),
          page("useDeployPermissionedResolver", "hooks/use-deploy-permissioned-resolver"),
          page("useUpdateNameProfileRecords", "hooks/use-update-name-profile-records"),
          page("useSetAddressRecord", "hooks/use-set-address-record"),
          page("useSetPrimaryName", "hooks/use-set-primary-name"),
          page("useApprovePaymentToken", "hooks/use-approve-payment-token"),
          page("useWalletCapabilities", "hooks/use-wallet-capabilities"),
          page("useExecuteContractWrites", "hooks/use-execute-contract-writes"),
          page("useContractWritesStatus", "hooks/use-contract-writes-status"),
        ],
      },
      {
        text: "Actions",
        collapsed: true,
        link: docs("actions"),
        items: [
          page("readCommitmentStatus", "actions/read-commitment-status"),
          page("readNameAvailability", "actions/read-name-availability"),
          page("readNameProfileDiscovery", "actions/read-name-profile-discovery"),
          page("readNameProfilePermissions", "actions/read-name-profile-permissions"),
          page("readNameRecords", "actions/read-name-records"),
          page(
            "readNameRegistrationPaymentStatus",
            "actions/read-name-registration-payment-status",
          ),
          page("readNameRegistrationPrice", "actions/read-name-registration-price"),
          page("readNameRenewalPaymentStatus", "actions/read-name-renewal-payment-status"),
          page("readNameRenewalPrice", "actions/read-name-renewal-price"),
          page("readNameResolver", "actions/read-name-resolver"),
          page("readPermissionedResolverSupport", "actions/read-permissioned-resolver-support"),
          page(
            "readPermissionedResolverVerification",
            "actions/read-permissioned-resolver-verification",
          ),
          page("approvePaymentToken", "actions/approve-payment-token"),
          page("commitName", "actions/commit-name"),
          page("deployPermissionedResolver", "actions/deploy-permissioned-resolver"),
          page("registerName", "actions/register-name"),
          page("renewName", "actions/renew-name"),
          page("setAddressRecord", "actions/set-address-record"),
          page("setDefaultPrimaryName", "actions/set-default-primary-name"),
          page("setL1PrimaryName", "actions/set-l1-primary-name"),
          page("updateNameProfileRecords", "actions/update-name-profile-records"),
          page("Contract Reads", "actions/contract-reads"),
          page("GraphQL Reads", "actions/graphql-reads"),
          page("Contract Writes", "actions/contract-writes"),
          page("Contract Write Status", "actions/contract-write-status"),
          page("executeContractWrites", "actions/execute-contract-writes"),
          page("supportsAtomicBatchCalls", "actions/supports-atomic-batch-calls"),
        ],
      },
      {
        text: "Miscellaneous",
        collapsed: true,
        items: [page("Record Icons", "icons/icons")],
      },
    ],
  },
  socials: [
    {
      icon: "github",
      link: "https://github.com/thenamespace/ens-components-v2",
    },
  ],
  title: "ENS Components",
  titleTemplate: "%s · ENS Components",
  topNav: [
    { text: "Home", link: "/" },
    { text: "Documentation", link: "/docs", match: "/docs" },
    {
      text: "GitHub",
      link: "https://github.com/thenamespace/ens-components-v2",
    },
  ],
});
