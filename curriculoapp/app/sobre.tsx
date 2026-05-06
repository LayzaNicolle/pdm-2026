import { ScrollView, StyleSheet, View, Linking, TouchableOpacity } from "react-native";
import { Text, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { C } from "../constants/colors";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const TECNOLOGIAS: { nome: string; desc: string; icon: IconName }[] = [
  { nome: "React Native", desc: "Framework mobile multiplataforma", icon: "react" },
  { nome: "Expo", desc: "Plataforma de desenvolvimento React Native", icon: "rocket-launch-outline" },
  { nome: "Expo Router", desc: "Navegação file-based (v4)", icon: "sitemap-outline" },
  { nome: "React Native Paper", desc: "UI Kit com Material Design 3", icon: "palette-outline" },
  { nome: "TanStack Query", desc: "Cache e sincronização de dados", icon: "database-sync-outline" },
  { nome: "Axios", desc: "Cliente HTTP para consumo da API REST", icon: "api" },
  { nome: "TypeScript", desc: "Tipagem estática para JavaScript", icon: "language-typescript" },
];

const TELAS: { nome: string; desc: string; icon: IconName; extra?: boolean }[] = [
  { nome: "Home", desc: "Lista e gerenciamento de currículos com CRUD completo", icon: "home-outline" },
  { nome: "Sobre", desc: "Informações sobre o app, tecnologias e funcionalidade extra", icon: "information-outline" },
  { nome: "Experiência Acadêmica", desc: "Gerenciamento da formação acadêmica", icon: "school-outline" },
  { nome: "Experiência Profissional", desc: "Gerenciamento do histórico profissional", icon: "briefcase-outline" },
  { nome: "Projetos", desc: "Gerenciamento dos projetos desenvolvidos", icon: "code-tags" },
  { nome: "Currículo Completo", desc: "Visualização unificada de todo o currículo com timeline e estatísticas", icon: "file-account-outline", extra: true },
];

export default function SobreScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <MaterialCommunityIcons name="file-account-outline" size={40} color={C.primary} />
          </View>
          <Text style={styles.heroTitle}>Currículo App</Text>
          <Text style={styles.heroVersion}>v1.0.0 · PDM 2026</Text>
          <Text style={styles.heroDesc}>
            App mobile para gerenciamento e visualização de portfólios profissionais,
            com back-end próprio em Neon DB hospedado na Vercel.
          </Text>

          {/* Dev card */}
          <TouchableOpacity
            style={styles.devCard}
            onPress={() => Linking.openURL("https://github.com/LayzaNicolle")}
            activeOpacity={0.8}
          >
            <View style={styles.devAvatar}>
              <Text style={styles.devAvatarText}>LN</Text>
            </View>
            <View style={styles.devInfo}>
              <Text style={styles.devName}>Layza Nicolle Costa Silva</Text>
              <Text style={styles.devRole}>Analista de dados · Sistemas para Internet — UNICAP</Text>
              <View style={styles.devGithub}>
                <MaterialCommunityIcons name="github" size={13} color="rgba(255,255,255,0.7)" />
                <Text style={styles.devGithubText}>github.com/LayzaNicolle</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="open-in-new" size={16} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        </View>

        {/* Funcionalidade Extra — destaque */}
        <View style={styles.extraSection}>
          <View style={styles.extraBadge}>
            <MaterialCommunityIcons name="star-four-points" size={12} color={C.primary} />
            <Text style={styles.extraBadgeText}>FUNCIONALIDADE EXTRA</Text>
          </View>
          <Text style={styles.extraTitle}>Currículo Visual Completo</Text>
          <Text style={styles.extraDesc}>
            Tela dedicada que reúne em uma única visualização todo o conteúdo
            do currículo — perfil, formações, experiências e projetos — com
            layout de timeline e painel de estatísticas.
          </Text>
          <View style={styles.extraFeatures}>
            {[
              { icon: "account-circle-outline" as IconName, label: "Perfil completo com bio" },
              { icon: "chart-bar" as IconName, label: "Estatísticas em destaque" },
              { icon: "timeline-outline" as IconName, label: "Layout de timeline" },
              { icon: "lightning-bolt-outline" as IconName, label: "Cache instantâneo" },
            ].map((f) => (
              <View key={f.label} style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <MaterialCommunityIcons name={f.icon} size={16} color={C.primary} />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Telas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Telas do aplicativo</Text>
          <View style={styles.telasGrid}>
            {TELAS.map((t) => (
              <View key={t.nome} style={[styles.telaCard, t.extra && styles.telaCardExtra]}>
                <View style={[styles.telaIconWrap, t.extra && styles.telaIconWrapExtra]}>
                  <MaterialCommunityIcons
                    name={t.icon}
                    size={20}
                    color={t.extra ? "#fff" : C.primary}
                  />
                </View>
                <Text style={[styles.telaNome, t.extra && styles.telaNomeExtra]}>{t.nome}</Text>
                <Text style={[styles.telaDesc, t.extra && styles.telaDescExtra]}>{t.desc}</Text>
                {t.extra && (
                  <View style={styles.telaExtraBadge}>
                    <Text style={styles.telaExtraBadgeText}>extra</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Tecnologias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tecnologias utilizadas</Text>
          <View style={styles.techList}>
            {TECNOLOGIAS.map((t, i) => (
              <View key={t.nome}>
                <View style={styles.techRow}>
                  <View style={styles.techIconWrap}>
                    <MaterialCommunityIcons name={t.icon} size={18} color={C.primary} />
                  </View>
                  <View style={styles.techInfo}>
                    <Text style={styles.techNome}>{t.nome}</Text>
                    <Text style={styles.techDesc}>{t.desc}</Text>
                  </View>
                </View>
                {i < TECNOLOGIAS.length - 1 && <Divider style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Back-end */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Back-end</Text>
          <TouchableOpacity
            style={styles.apiCard}
            onPress={() => Linking.openURL("https://layzanicolle-aos-2026-1.vercel.app")}
            activeOpacity={0.8}
          >
            <View style={styles.apiIconWrap}>
              <MaterialCommunityIcons name="server-outline" size={22} color={C.primary} />
            </View>
            <View style={styles.apiInfo}>
              <Text style={styles.apiLabel}>API REST · Vercel + Neon DB</Text>
              <Text style={styles.apiUrl}>layzanicolle-aos-2026-1.vercel.app</Text>
              <Text style={styles.apiDesc}>PostgreSQL · Endpoints: usuários, acadêmicas, profissionais e projetos</Text>
            </View>
            <MaterialCommunityIcons name="open-in-new" size={16} color={C.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { paddingBottom: 24 },

  // Hero
  hero: {
    backgroundColor: C.primary,
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "800", letterSpacing: 0.3 },
  heroVersion: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4, marginBottom: 10 },
  heroDesc: { color: "rgba(255,255,255,0.82)", fontSize: 13, textAlign: "center", lineHeight: 20, paddingHorizontal: 8 },

  devCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    width: "100%",
  },
  devAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  devAvatarText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  devInfo: { flex: 1 },
  devName: { color: "#fff", fontSize: 13, fontWeight: "700" },
  devRole: { color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 },
  devGithub: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  devGithubText: { color: "rgba(255,255,255,0.7)", fontSize: 11 },

  // Extra
  extraSection: {
    margin: 16,
    backgroundColor: C.primaryLight,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
  },
  extraBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.surface,
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  extraBadgeText: { fontSize: 10, fontWeight: "800", color: C.primary, letterSpacing: 0.8 },
  extraTitle: { fontSize: 17, fontWeight: "800", color: C.primary, marginBottom: 8 },
  extraDesc: { fontSize: 13, color: C.textSecondary, lineHeight: 20 },
  extraFeatures: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  featureItem: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.surface, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  featureIconWrap: {},
  featureLabel: { fontSize: 11, fontWeight: "600", color: C.textSecondary },

  // Seções
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 },

  // Telas grid
  telasGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  telaCard: {
    width: "47%",
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  telaCardExtra: { backgroundColor: C.primary, width: "100%" },
  telaIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  telaIconWrapExtra: { backgroundColor: "rgba(255,255,255,0.2)" },
  telaNome: { fontSize: 13, fontWeight: "700", color: C.textPrimary },
  telaNomeExtra: { color: "#fff" },
  telaDesc: { fontSize: 11, color: C.textMuted, lineHeight: 16 },
  telaDescExtra: { color: "rgba(255,255,255,0.75)" },
  telaExtraBadge: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 },
  telaExtraBadgeText: { fontSize: 10, color: "#fff", fontWeight: "700" },

  // Tecnologias
  techList: { backgroundColor: C.surface, borderRadius: 14, overflow: "hidden" },
  techRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 12 },
  techIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  techInfo: { flex: 1 },
  techNome: { fontSize: 13, fontWeight: "700", color: C.textPrimary },
  techDesc: { fontSize: 11, color: C.textSecondary, marginTop: 2 },
  divider: { backgroundColor: C.border, marginHorizontal: 16 },

  // API
  apiCard: {
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  apiIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  apiInfo: { flex: 1 },
  apiLabel: { fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 },
  apiUrl: { fontSize: 13, fontWeight: "700", color: C.primary, marginTop: 3 },
  apiDesc: { fontSize: 11, color: C.textSecondary, marginTop: 3, lineHeight: 16 },
});