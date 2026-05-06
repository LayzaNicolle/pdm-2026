import { useState } from "react";
import {
  View, ScrollView, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, TouchableOpacity,
} from "react-native";
import {
  Text, Portal, Modal, TextInput,
  ActivityIndicator, Snackbar, Avatar, IconButton, Button, Divider,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUsuarios, criarUsuario, atualizarUsuario, deletarUsuario } from "../api";
import { C } from "../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const NAV_ITEMS: { label: string; icon: IconName; route: string }[] = [
  { label: "Currículo", icon: "file-account-outline", route: "curriculo" },
  { label: "Acadêmica", icon: "school-outline", route: "academica" },
  { label: "Profissional", icon: "briefcase-outline", route: "profissional" },
  { label: "Projetos", icon: "code-tags", route: "projetos" },
];

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", bio: "" });

  const { data: usuarios = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
  });

  const criarMutation = useMutation({
    mutationFn: criarUsuario,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["usuarios"] }); setModalVisible(false); showSnack("Perfil criado!"); },
    onError: () => showSnack("Erro ao criar perfil"),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: any }) => atualizarUsuario(id, dados),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["usuarios"] }); setModalVisible(false); showSnack("Perfil atualizado!"); },
    onError: () => showSnack("Erro ao atualizar"),
  });

  const deletarMutation = useMutation({
    mutationFn: deletarUsuario,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["usuarios"] }); showSnack("Perfil removido."); },
    onError: () => showSnack("Erro ao remover"),
  });

  function showSnack(msg: string) { setSnackMsg(msg); setSnackVisible(true); }

  function abrirCriar() {
    setEditando(null);
    setForm({ nome: "", email: "", bio: "" });
    setModalVisible(true);
  }

  function abrirEditar(u: any) {
    setEditando(u);
    setForm({ nome: u.nome, email: u.email, bio: u.bio || "" });
    setModalVisible(true);
  }

  function salvar() {
    if (!form.nome.trim() || !form.email.trim()) { showSnack("Nome e e-mail são obrigatórios"); return; }
    if (editando) {
      atualizarMutation.mutate({ id: editando._id || editando.id, dados: form });
    } else {
      criarMutation.mutate(form);
    }
  }

  function confirmarDeletar(u: any) {
    Alert.alert("Remover perfil", `Deseja remover "${u.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: () => deletarMutation.mutate(u._id || u.id) },
    ]);
  }

  function getIniciais(nome: string) {
    return nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  }

  const isSaving = criarMutation.isPending || atualizarMutation.isPending;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Portfólios</Text>
          <Text style={styles.headerSub}>PDM 2026 · Layza Nicolle</Text>
        </View>
        <View style={styles.headerActions}>
          <IconButton icon="information-outline" iconColor="#fff" size={22} onPress={() => router.push("/sobre")} style={styles.headerBtn} />
          <TouchableOpacity style={styles.addHeaderBtn} onPress={abrirCriar}>
            <MaterialCommunityIcons name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <MaterialCommunityIcons name="card-account-details-outline" size={28} color={C.primary} />
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>Currículos cadastrados</Text>
          <Text style={styles.bannerSub}>Toque em um perfil para ver o currículo completo</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {isLoading ? (
          <ActivityIndicator size="large" color={C.primary} style={styles.centered} />
        ) : isError ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="wifi-off" size={48} color={C.textMuted} />
            <Text style={styles.emptyTitle}>Falha na conexão</Text>
            <Text style={styles.emptySub}>Verifique sua internet e tente novamente</Text>
            <Button mode="outlined" onPress={() => refetch()} textColor={C.primary} style={{ marginTop: 16, borderRadius: 8 }}>
              Tentar novamente
            </Button>
          </View>
        ) : usuarios.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="account-plus-outline" size={56} color={C.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum perfil cadastrado</Text>
            <Text style={styles.emptySub}>Adicione o primeiro currículo</Text>
            <Button mode="contained" onPress={abrirCriar} buttonColor={C.primary} style={{ marginTop: 16, borderRadius: 10 }}>
              Novo perfil
            </Button>
          </View>
        ) : (
          <>
            <Text style={styles.countLabel}>
              {usuarios.length} {usuarios.length === 1 ? "perfil" : "perfis"}
            </Text>

            {usuarios.map((u: any) => {
              const id = u._id || u.id;
              return (
                <View key={id} style={styles.card}>
                  {/* Topo clicável vai para currículo completo */}
                  <TouchableOpacity
                    style={styles.cardTop}
                    onPress={() => router.push(`/usuario/${id}/curriculo`)}
                    activeOpacity={0.7}
                  >
                    <Avatar.Text
                      size={52}
                      label={getIniciais(u.nome)}
                      style={{ backgroundColor: C.primary }}
                      color="#fff"
                    />
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName}>{u.nome}</Text>
                      <Text style={styles.cardEmail}>{u.email}</Text>
                      {u.bio ? <Text style={styles.cardBio} numberOfLines={2}>{u.bio}</Text> : null}
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={C.textMuted} />
                  </TouchableOpacity>

                  <Divider style={styles.divider} />

                  {/* Grade 2x2 de navegação */}
                  <View style={styles.navGrid}>
                    {NAV_ITEMS.map((item) => (
                      <TouchableOpacity
                        key={item.route}
                        style={[
                          styles.navItem,
                          item.route === "curriculo" && styles.navItemHighlight,
                        ]}
                        onPress={() => router.push(`/usuario/${id}/${item.route}`)}
                        activeOpacity={0.7}
                      >
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={20}
                          color={item.route === "curriculo" ? "#fff" : C.primary}
                        />
                        <Text style={[
                          styles.navLabel,
                          item.route === "curriculo" && styles.navLabelHighlight,
                        ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Divider style={styles.divider} />

                  {/* Ações */}
                  <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => abrirEditar(u)}>
                      <MaterialCommunityIcons name="pencil-outline" size={16} color={C.primary} />
                      <Text style={[styles.actionLabel, { color: C.primary }]}>Editar</Text>
                    </TouchableOpacity>
                    <View style={styles.actionDivider} />
                    <TouchableOpacity style={styles.actionBtn} onPress={() => confirmarDeletar(u)}>
                      <MaterialCommunityIcons name="trash-can-outline" size={16} color={C.danger} />
                      <Text style={[styles.actionLabel, { color: C.danger }]}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalWrapper}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <MaterialCommunityIcons name="account-plus-outline" size={24} color={C.primary} />
                <Text style={styles.modalTitle}>{editando ? "Editar perfil" : "Novo perfil"}</Text>
              </View>
              <TextInput label="Nome *" value={form.nome} onChangeText={(v) => setForm({ ...form, nome: v })} mode="outlined" style={styles.input} outlineColor={C.border} activeOutlineColor={C.primary} />
              <TextInput label="E-mail *" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={styles.input} outlineColor={C.border} activeOutlineColor={C.primary} />
              <TextInput label="Bio" value={form.bio} onChangeText={(v) => setForm({ ...form, bio: v })} mode="outlined" multiline numberOfLines={3} style={styles.input} outlineColor={C.border} activeOutlineColor={C.primary} />
              <View style={styles.modalActions}>
                <Button onPress={() => setModalVisible(false)} textColor={C.textSecondary} disabled={isSaving}>Cancelar</Button>
                <Button mode="contained" onPress={salvar} buttonColor={C.primary} loading={isSaving} disabled={isSaving} style={{ borderRadius: 8 }}>Salvar</Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>

      <Snackbar visible={snackVisible} onDismiss={() => setSnackVisible(false)} duration={3000}>{snackMsg}</Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.headerBg },

  header: {
    backgroundColor: C.headerBg,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800", letterSpacing: 0.3 },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerBtn: { margin: 0 },
  addHeaderBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  banner: {
    backgroundColor: C.primaryLight,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 13, fontWeight: "700", color: C.primary },
  bannerSub: { fontSize: 11, color: C.textSecondary, marginTop: 2 },

  scroll: { padding: 16, backgroundColor: C.bg },
  centered: { marginTop: 80 },

  emptyBox: { alignItems: "center", paddingTop: 80, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: C.textPrimary, marginTop: 12 },
  emptySub: { fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 6 },

  countLabel: {
    fontSize: 11,
    color: C.textMuted,
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "600",
  },

  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: "700", color: C.textPrimary },
  cardEmail: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
  cardBio: { fontSize: 12, color: C.textMuted, marginTop: 4, fontStyle: "italic", lineHeight: 16 },

  divider: { backgroundColor: C.border },

  navGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 8,
  },
  navItem: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.primaryLight,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  navItemHighlight: {
    backgroundColor: C.primary,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.primary,
  },
  navLabelHighlight: {
    color: "#fff",
  },

  cardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  actionLabel: { fontSize: 13, fontWeight: "600" },
  actionDivider: { width: 1, height: 20, backgroundColor: C.border },

  modalWrapper: { margin: 24 },
  modal: { backgroundColor: C.surface, borderRadius: 20, padding: 24 },
  modalHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: "700", color: C.textPrimary },
  input: { marginBottom: 12, backgroundColor: C.surface },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 6 },
});