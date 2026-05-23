import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Tarefa = {
  id: number;
  titulo: string;
  concluido: boolean;
};

export default function Index() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [filtro, setFiltro] = useState<"todas" | "concluidas" | "pendentes">(
    "todas"
  );

  useEffect(() => {
    const carregarTarefas = async () => {
      const tarefasSalvas = await AsyncStorage.getItem("tarefas");

      if (tarefasSalvas) {
        setTarefas(JSON.parse(tarefasSalvas));
      }
    };

    carregarTarefas();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  function adicionarTarefa() {
    if (!novaTarefa.trim()) return;

    setTarefas((prev) => [
      ...prev,
      {
        id: Date.now(),
        titulo: novaTarefa,
        concluido: false,
      },
    ]);

    setNovaTarefa("");
  }

  function toggleTarefa(id: number) {
    setTarefas((prev) =>
      prev.map((tarefa) =>
        tarefa.id === id
          ? { ...tarefa, concluido: !tarefa.concluido }
          : tarefa
      )
    );
  }

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === "concluidas") return tarefa.concluido;
    if (filtro === "pendentes") return !tarefa.concluido;
    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas tarefas</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa"
          value={novaTarefa}
          onChangeText={setNovaTarefa}
        />

        <Button title="Adicionar" onPress={adicionarTarefa} />
      </View>kl
      <View style={styles.filterRow}>
        <Button title="Todos" onPress={() => setFiltro("todas")} />

        <Button
          title="Concluídos"onPress={() => setFiltro("concluidas")} />

        <Button
          title="Pendentes"onPress={() => setFiltro("pendentes")} />
      </View>

      <FlatList
        data={tarefasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.itemRow}
            onPress={() => toggleTarefa(item.id)}
          >
            <View
              style={[
                styles.checkbox,
                item.concluido && styles.checkboxConcluido,
              ]}
            />

            <Text
              style={[
                styles.itemText,
                item.concluido && styles.itemTextConcluido,
              ]}
            >
              {item.titulo}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: "#f6f7fb",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
  },

  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#c9ccd6",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#777",
    borderRadius: 4,
    marginRight: 10,
  },

  itemText: {
    fontSize: 18,
  },

  checkboxConcluido: {
    backgroundColor: "#691212",
    borderColor: "#8f172b",
  },

  itemTextConcluido: {
    textDecorationLine: "line-through",
    color: "#9b1414",
  },
});