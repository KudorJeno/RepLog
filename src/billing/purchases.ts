import { Platform } from 'react-native';
import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

/** RevenueCat entitlement identifier that unlocks Pro. Must match the dashboard. */
export const PRO_ENTITLEMENT = 'pro';

// Public SDK key (safe to ship). Set EXPO_PUBLIC_REVENUECAT_ANDROID_KEY in .env or as an EAS env var.
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

type PurchasesModule = typeof import('react-native-purchases').default;

let purchases: PurchasesModule | null = null;
let configured = false;

/** Billing only works on Android with an API key; elsewhere the app stays on the free tier. */
export const billingSupported = Platform.OS === 'android' && ANDROID_KEY.length > 0;

function hasPro(info: CustomerInfo): boolean {
  return info.entitlements.active[PRO_ENTITLEMENT] !== undefined;
}

/** Configures RevenueCat once and subscribes to entitlement changes. Safe to call repeatedly. */
export async function initBilling(onProChange: (isPro: boolean) => void): Promise<void> {
  if (!billingSupported || configured) return;
  try {
    purchases = (await import('react-native-purchases')).default;
    purchases.configure({ apiKey: ANDROID_KEY });
    configured = true;
    purchases.addCustomerInfoUpdateListener((info) => onProChange(hasPro(info)));
    onProChange(hasPro(await purchases.getCustomerInfo()));
  } catch {
    // Offline or store unavailable: keep whatever Pro state is already stored locally.
  }
}

export interface ProOffer {
  pkg: PurchasesPackage;
  price: string;
}

export async function getProOffer(): Promise<ProOffer | null> {
  if (!purchases || !configured) return null;
  try {
    const offerings = await purchases.getOfferings();
    const pkg = offerings.current?.availablePackages[0];
    return pkg ? { pkg, price: pkg.product.priceString } : null;
  } catch {
    return null;
  }
}

export type PurchaseResult = 'purchased' | 'cancelled' | 'failed';

export async function purchasePro(offer: ProOffer): Promise<PurchaseResult> {
  if (!purchases) return 'failed';
  try {
    const { customerInfo } = await purchases.purchasePackage(offer.pkg);
    return hasPro(customerInfo) ? 'purchased' : 'failed';
  } catch (e) {
    return (e as { userCancelled?: boolean }).userCancelled ? 'cancelled' : 'failed';
  }
}

/** Returns whether Pro is active after restoring, or null if the restore failed. */
export async function restorePro(): Promise<boolean | null> {
  if (!purchases) return null;
  try {
    return hasPro(await purchases.restorePurchases());
  } catch {
    return null;
  }
}
