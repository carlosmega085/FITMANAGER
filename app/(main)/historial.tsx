import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Image } from 'react-native';
import { Text, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAsistencias, Asistencia } from '@/services/access';
import { colors, spacing, borderRadius } from '@/constants/colors';

export default function HistorialScreen() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Implementación simple de debounce para búsqueda
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['asistencias', debouncedSearch],
    queryFn: () => getAsistencias(1, { cliente: debouncedSearch }),
  });

  const renderItem = ({ item }: { item: Asistencia }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.clientInfoRow}>
          {item.cliente.foto ? (
            <Image source={{ uri: item.cliente.foto }} style={styles.avatar} />
          ) : (
            <MaterialCommunityIcons name="account-circle" size={40} color={colors.subtext} />
          )}
          <View style={styles.clientTextContainer}>
            <Text style={styles.clientName}>{item.cliente.nombre}</Text>
            <Text style={styles.clientCode}>Código: {item.cliente.codigo}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.timeRow}>
          <MaterialCommunityIcons name="calendar" size={16} color={colors.subtext} />
          <Text style={styles.timeText}>{item.fecha}</Text>
        </View>
        <View style={styles.timeRow}>
          <MaterialCommunityIcons name="login" size={16} color={colors.success} />
          <Text style={styles.timeText}>Entrada: {item.hora_entrada}</Text>
        </View>
        <View style={styles.timeRow}>
          <MaterialCommunityIcons name="logout" size={16} color={item.hora_salida ? colors.error : colors.subtext} />
          <Text style={styles.timeText}>
            Salida: {item.hora_salida ? item.hora_salida : 'En gimnasio / Sin registrar'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar cliente..."
          onChangeText={setSearch}
          value={search}
          style={styles.searchBar}
          inputStyle={{ color: colors.text }}
          iconColor={colors.subtext}
          placeholderTextColor={colors.subtext}
        />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={data?.data || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="text-box-search-outline" size={64} color={colors.subtext} />
              <Text style={styles.emptyText}>No se encontraron asistencias</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchBar: {
    backgroundColor: colors.cardHover,
    borderRadius: borderRadius.md,
  },
  listContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
  },
  clientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  clientTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  clientCode: {
    fontSize: 12,
    color: colors.subtext,
  },
  cardBody: {
    marginTop: spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: colors.subtext,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: colors.subtext,
    marginTop: spacing.md,
    fontSize: 16,
  },
});
