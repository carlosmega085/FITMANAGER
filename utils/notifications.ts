import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 1. Configurar cómo se comportan las notificaciones quando la app está abierta (en primer plano)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const NOTIFICATION_CHANNEL_ID = 'default';

/**
 * Registra el dispositivo para recibir tokens push.
 */
export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
            name: 'General Notifications',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        // 2. Pedir permisos
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Fallo al obtener el token push! Permiso no concedido.');
            return;
        }

        // 3. Obtener el token de Expo
        try {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
            if (!projectId) {
                throw new Error('Project ID not found in Constants.expoConfig');
            }
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;

            console.log('Expo Push Token obtenido:', token);

            // Aquí puedes enviar el 'token' a tu servidor para almacenarlo y usarlo
            // await fetchApi('usuarios/guardar-token', { method: 'POST', body: JSON.stringify({ token }) });

        } catch (e) {
            console.error('Error al obtener Expo Push Token:', e);
        }
    } else {
        console.warn('Debe usar un dispositivo físico o un development build para Push Notifications');
    }

    return token;
}

 

/**
 * Programa la alerta diaria de Jornada Finalizada
 */
export async function scheduleDailyShiftAlert() {
    const identifier = 'jornada-finalizada';

    // 1. Limpiar cualquier programación previa del mismo ID para evitar duplicados "fantasmas"
    await Notifications.cancelScheduledNotificationAsync(identifier);

    // 2. Programar de nuevo
    await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
            title: "💰 ¡Jornada Finalizada!",
            body: "Todos los turnos de hoy acabaron. Toca aquí para ver tu Dinero a Entregar.",
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
            color: '#2563eb', 
            badge: 1,
            data: { pantallaDestino: "caja" },
        },
        trigger: {
            hour: 21,
            minute: 15,
            repeats: true
        } as Notifications.NotificationTriggerInput,
    });

   // console.log('Notificación de Jornada Finalizada programada para las 21:15');
}
