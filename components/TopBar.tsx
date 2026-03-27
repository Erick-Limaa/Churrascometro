import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { S } from '../constants/styles';

type Props = {
  titulo: string;
  onVoltar: () => void;
  direita?: React.ReactNode;
};

export default function TopBar({ titulo, onVoltar, direita }: Props) {
  return (
    <View style={S.topBar}>
      <TouchableOpacity onPress={onVoltar}>
        <Text style={S.backBtn}>Voltar</Text>
      </TouchableOpacity>
      <Text style={S.topBarTitle}>{titulo}</Text>
      {direita ?? <View style={{ width: 60 }} />}
    </View>
  );
}