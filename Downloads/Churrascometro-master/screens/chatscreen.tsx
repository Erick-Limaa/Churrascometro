import React, { useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { enviarMensagem } from "../services/gemini";

export default function ChatScreen() {
  const [mensagem, setMensagem] = useState("");
  const [chat, setChat] = useState<{ role: string; text: string }[]>([]);

  const enviar = async () => {
    if (!mensagem) return;

    const novaMensagem = { role: "user", text: mensagem };
    setChat((prev) => [...prev, novaMensagem]);

    const resposta = await enviarMensagem(mensagem);

    const respostaIA = { role: "bot", text: resposta };
    setChat((prev) => [...prev, respostaIA]);

    setMensagem("");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={chat}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={{ marginVertical: 5 }}>
            {item.role === "user" ? "Você: " : "IA: "}
            {item.text}
          </Text>
        )}
      />

      <TextInput
        value={mensagem}
        onChangeText={setMensagem}
        placeholder="Digite sua mensagem..."
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Button title="Enviar" onPress={enviar} />
    </View>
  );
}