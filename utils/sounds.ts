import { Audio } from 'expo-av';

let successSound: Audio.Sound | null = null;
let errorSound: Audio.Sound | null = null;

export async function playSuccessSound() {
  try {
    if (!successSound) {
      // Usaremos sonidos predeterminados si no hay assets, pero idealmente se debe tener archivos en /assets/sounds
      // Aquí estamos simulando un sonido de éxito usando loadAsync con un URI temporal
      // En producción, es mejor tener un archivo mp3: require('../assets/sounds/success.mp3')
      // Para este boilerplate, usaremos solo la inicialización. El usuario puede luego poner sus propios audios.
      /*
      const { sound } = await Audio.Sound.createAsync(
         require('../assets/sounds/success.mp3')
      );
      successSound = sound;
      */
    }
    // await successSound?.replayAsync();
  } catch (error) {
    console.log('Error reproduciendo sonido:', error);
  }
}

export async function playErrorSound() {
  try {
    /*
    if (!errorSound) {
      const { sound } = await Audio.Sound.createAsync(
         require('../assets/sounds/error.mp3')
      );
      errorSound = sound;
    }
    await errorSound?.replayAsync();
    */
  } catch (error) {
    console.log('Error reproduciendo sonido:', error);
  }
}
