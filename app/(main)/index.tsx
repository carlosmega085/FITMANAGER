import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Text, ActivityIndicator, TextInput, Button, Searchbar } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { Camera, CameraView } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/colors';
import { verifyAccess, getClientes, AccessResultData } from '@/services/access';
import { playSuccessSound, playErrorSound } from '@/utils/sounds';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AccessResultData | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualCode, setManualCode] = useState('');
  
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  const isFocused = useIsFocused();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['clientes', debouncedSearchQuery],
    queryFn: () => getClientes(1, debouncedSearchQuery),
    enabled: isSearchModalVisible && debouncedSearchQuery.length > 0,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || loading) return;
    
    setScanned(true);
    setLoading(true);

    try {
      const res = await verifyAccess({ codigo: data });
      setResult(res);
      playSuccessSound();
    } catch (error: any) {
      // Formatear error
      setResult({
        success: false,
        status: 'error',
        message: error.message || 'Acceso Denegado',
      } as any);
      playErrorSound();
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualCode || loading) return;
    
    setScanned(true);
    setLoading(true);

    try {
      const res = await verifyAccess({ codigo: manualCode, metodo: 'Manual' });
      setResult(res);
      playSuccessSound();
      setManualCode('');
    } catch (error: any) {
      setResult({
        success: false,
        status: 'error',
        message: error.message || 'Acceso Denegado',
      } as any);
      playErrorSound();
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = async (clientCode: string) => {
    setIsSearchModalVisible(false);
    if (loading) return;
    
    setScanned(true);
    setLoading(true);

    try {
      const res = await verifyAccess({ codigo: clientCode, metodo: 'Manual' });
      setResult(res);
      playSuccessSound();
    } catch (error: any) {
      setResult({
        success: false,
        status: 'error',
        message: error.message || 'Acceso Denegado',
      } as any);
      playErrorSound();
    } finally {
      setLoading(false);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setResult(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Sin acceso a la cámara</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Si no hay resultado, mostramos la cámara o el modo manual */}
      {isFocused && !result && !loading && (
        isManualMode ? (
          <View style={styles.manualContainer}>
            <MaterialCommunityIcons name="keyboard" size={60} color={colors.primary} style={styles.manualIcon} />
            <Text style={styles.manualTitle}>Ingreso Manual</Text>
            <Text style={styles.manualSubtitle}>Digita el código del cliente</Text>
            
            <TextInput
              mode="outlined"
              label="Código de Acceso"
              value={manualCode}
              onChangeText={setManualCode}
              keyboardType="numeric"
              style={styles.manualInput}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              theme={{ colors: { background: colors.cardHover, onSurfaceVariant: colors.subtext } }}
              left={<TextInput.Icon icon="barcode" color={colors.subtext} />}
            />
            
            <Button
              mode="contained"
              onPress={handleManualSubmit}
              disabled={!manualCode || loading}
              style={styles.manualButton}
              buttonColor={colors.primary}
              textColor={colors.background}
              contentStyle={styles.manualButtonContent}
            >
              VERIFICAR ACCESO
            </Button>

            <TouchableOpacity style={styles.switchModeButton} onPress={() => setIsManualMode(false)}>
              <MaterialCommunityIcons name="camera" size={24} color={colors.primary} />
              <Text style={styles.switchModeText}>Volver al Escáner</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchModeButton} onPress={() => setIsSearchModalVisible(true)}>
              <MaterialCommunityIcons name="magnify" size={24} color={colors.primary} />
              <Text style={styles.switchModeText}>Buscar Cliente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={styles.overlay}>
              <View style={styles.scanArea} />
              <Text style={styles.instructionText}>
                Apunta al código QR o de barras
              </Text>

              <TouchableOpacity style={styles.switchModeButtonCamera} onPress={() => setIsManualMode(true)}>
                <MaterialCommunityIcons name="keyboard" size={24} color="#fff" />
                <Text style={styles.switchModeTextCamera}>Ingresar Manualmente</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.switchModeButtonCamera, { marginTop: spacing.md }]} onPress={() => setIsSearchModalVisible(true)}>
                <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
                <Text style={styles.switchModeTextCamera}>Buscar Cliente</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        )
      )}

      {/* Cargando */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 10 }}>Verificando...</Text>
        </View>
      )}

      {/* Resultado */}
      {result && !loading && (
        <View style={[
          styles.resultContainer, 
          result.success ? styles.bgSuccess : styles.bgError
        ]}>
          
          <MaterialCommunityIcons 
            name={result.success ? 'check-circle' : 'close-circle'} 
            size={100} 
            color="#fff" 
            style={styles.resultIcon}
          />

          <Text style={styles.resultTitle}>
            {result.success ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO'}
          </Text>
          
          <Text style={styles.resultMessage}>{result.message}</Text>

          {result.cliente && (
            <View style={styles.clientCard}>
              {result.cliente.foto ? (
                <Image source={{ uri: result.cliente.foto }} style={styles.clientImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <MaterialCommunityIcons name="account" size={40} color={colors.subtext} />
                </View>
              )}
              <Text style={styles.clientName}>{result.cliente.nombre}</Text>
              {result.cliente.membresia && (
                <Text style={styles.clientInfo}>Plan: {result.cliente.membresia}</Text>
              )}
              {result.cliente.vence && (
                <Text style={styles.clientInfo}>Vence: {result.cliente.vence}</Text>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.scanButton} onPress={handleScanAgain}>
            <Text style={styles.scanButtonText}>ESCANEAR OTRO</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de Búsqueda */}
      <Modal visible={isSearchModalVisible} animationType="slide" onRequestClose={() => setIsSearchModalVisible(false)}>
        <View style={styles.searchModalContainer}>
          <View style={styles.searchModalHeader}>
            <Text style={styles.searchModalTitle}>Buscar Cliente</Text>
            <TouchableOpacity onPress={() => setIsSearchModalVisible(false)} style={styles.closeModalButton}>
              <MaterialCommunityIcons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <Searchbar
            placeholder="Nombre, apellido o código..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={{ color: colors.text }}
            iconColor={colors.subtext}
            placeholderTextColor={colors.subtext}
          />

          {isSearching ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
          ) : (
            <FlatList
              data={searchResults?.data || []}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.searchList}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.searchItemCard} onPress={() => handleClientSelect(item.codigo)}>
                  <View style={styles.searchClientInfoRow}>
                    {item.foto ? (
                      <Image source={{ uri: item.foto }} style={styles.avatarSearch} />
                    ) : (
                      <MaterialCommunityIcons name="account-circle" size={40} color={colors.subtext} />
                    )}
                    <View style={styles.clientTextContainerSearch}>
                      <Text style={styles.searchItemName}>{item.nombre}</Text>
                      <Text style={styles.searchItemCode}>Código: {item.codigo}</Text>
                      {item.membresia && (
                         <Text style={styles.searchItemPlan}>{item.membresia} • {item.estado}</Text>
                      )}
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color={colors.subtext} />
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                debouncedSearchQuery.length > 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No se encontraron clientes.</Text>
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="magnify" size={48} color={colors.subtext} />
                    <Text style={styles.emptyText}>Escribe para buscar un cliente</Text>
                  </View>
                )
              }
            />
          )}
        </View>
      </Modal>
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
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
    borderRadius: borderRadius.md,
  },
  instructionText: {
    color: '#fff',
    marginTop: spacing.xl,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  bgSuccess: {
    backgroundColor: colors.success,
  },
  bgError: {
    backgroundColor: colors.error,
  },
  resultIcon: {
    marginBottom: spacing.md,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  resultMessage: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  clientCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.xl,
  },
  clientImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.md,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  clientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  clientInfo: {
    fontSize: 14,
    color: '#eee',
  },
  scanButton: {
    backgroundColor: '#fff',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  scanButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  manualContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  manualIcon: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  manualTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  manualSubtitle: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  manualInput: {
    marginBottom: spacing.xl,
    backgroundColor: colors.cardHover,
  },
  manualButton: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  manualButtonContent: {
    height: 50,
  },
  switchModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  switchModeText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  switchModeButtonCamera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: borderRadius.full,
    marginTop: spacing.xl * 2,
  },
  switchModeTextCamera: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  searchModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.xl, // Safe area approx
  },
  searchModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeModalButton: {
    padding: spacing.xs,
  },
  searchBar: {
    backgroundColor: colors.cardHover,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  searchList: {
    paddingBottom: spacing.xl,
  },
  searchItemCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchClientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSearch: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  clientTextContainerSearch: {
    marginLeft: spacing.md,
    flex: 1,
  },
  searchItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchItemCode: {
    fontSize: 12,
    color: colors.subtext,
  },
  searchItemPlan: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
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
