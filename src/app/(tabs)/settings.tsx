import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, View } from 'react-native';
import { getProOffer, purchasePro, restorePro, type ProOffer } from '@/billing/purchases';
import { Body, Button, Card, ChipRow } from '@/components/ui';
import { CONTACT_EMAIL, PRIVACY_POLICY_URL } from '@/config';
import { type ThemePref, type Unit, useSettings } from '@/state/settings';
import type { Lang } from '@/data/types';

const REST_OPTIONS = [30, 45, 60, 90, 120, 150, 180, 240, 300];

export default function SettingsScreen() {
  const { t, lang, unit, theme, restSeconds, isPro, update } = useSettings();
  const [offer, setOffer] = useState<ProOffer | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPro) getProOffer().then(setOffer);
  }, [isPro]);

  const unlock = async () => {
    // The offer may not have loaded yet (slow start or offline), so try once more on tap.
    const current = offer ?? (await getProOffer());
    setOffer(current);
    if (!current) return Alert.alert(t('pro.title'), t('pro.unavailable'));
    setBusy(true);
    const result = await purchasePro(current);
    setBusy(false);
    if (result === 'purchased') {
      await update({ isPro: true });
      Alert.alert(t('pro.title'), t('pro.thanks'));
    } else if (result === 'failed') {
      Alert.alert(t('pro.title'), t('pro.failed'));
    }
  };

  const restore = async () => {
    setBusy(true);
    const active = await restorePro();
    setBusy(false);
    if (active === null) return Alert.alert(t('pro.title'), t('pro.unavailable'));
    if (active) await update({ isPro: true });
    Alert.alert(t('pro.title'), active ? t('pro.restored') : t('pro.nothingToRestore'));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Card>
        <Body bold style={{ fontSize: 17 }}>
          {t('settings.pro')}
        </Body>
        <Body muted style={{ marginVertical: 8 }}>
          {isPro ? t('settings.proActive') : t('settings.proTeaser')}
        </Body>
        {!isPro && (
          <>
            <Button
              label={offer ? t('settings.proUnlockPrice', { price: offer.price }) : t('settings.proUnlock')}
              onPress={unlock}
              disabled={busy}
            />
            <Button
              label={t('settings.proRestore')}
              variant="ghost"
              onPress={restore}
              disabled={busy}
              style={{ marginTop: 6 }}
            />
          </>
        )}
        {__DEV__ && (
          <Button
            label={t('settings.proDevToggle')}
            variant="ghost"
            onPress={() => update({ isPro: !isPro })}
            style={{ marginTop: 6 }}
          />
        )}
      </Card>

      <Section title={t('settings.language')}>
        <ChipRow<Lang>
          options={[
            { value: 'en', label: 'English' },
            { value: 'ro', label: 'Română' },
          ]}
          value={lang}
          onChange={(v) => v && update({ lang: v })}
        />
      </Section>

      <Section title={t('settings.units')}>
        <ChipRow<Unit>
          options={[
            { value: 'kg', label: 'kg' },
            { value: 'lb', label: 'lb' },
          ]}
          value={unit}
          onChange={(v) => v && update({ unit: v })}
        />
      </Section>

      <Section title={t('settings.theme')}>
        <ChipRow<ThemePref>
          options={[
            { value: 'dark', label: t('settings.theme.dark') },
            { value: 'light', label: t('settings.theme.light') },
            { value: 'system', label: t('settings.theme.system') },
          ]}
          value={theme}
          onChange={(v) => v && update({ theme: v })}
        />
      </Section>

      <Section title={t('settings.rest')}>
        <ChipRow<string>
          options={REST_OPTIONS.map((s) => ({ value: String(s), label: t('settings.restSeconds', { n: s }) }))}
          value={String(restSeconds)}
          onChange={(v) => v && update({ restSeconds: Number(v) })}
        />
      </Section>

      <View style={{ gap: 8 }}>
        <Body bold>{t('settings.about')}</Body>
        <Button
          label={t('settings.feedback')}
          variant="secondary"
          onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=RepLog%20feedback`)}
        />
        <Button label={t('settings.privacy')} variant="secondary" onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} />
        <Body muted style={{ fontSize: 13 }}>
          {t('settings.disclaimer')}
        </Body>
      </View>

      <Body muted style={{ textAlign: 'center', marginTop: 8 }}>
        RepLog · {t('settings.version', { v: Constants.expoConfig?.version ?? '1.0.0' })}
      </Body>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Body bold style={{ marginBottom: 2 }}>
        {title}
      </Body>
      <View style={{ marginHorizontal: -16 }}>{children}</View>
    </View>
  );
}
