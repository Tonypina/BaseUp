import { useContext, createContext, useState, ReactNode } from 'react';
import { DeviceEventEmitter, PermissionsAndroid } from 'react-native';
import { BluetoothManager, BluetoothEscposPrinter, ALIGN} from 'tp-react-native-bluetooth-printer';

interface BluetoothContextType {
  isBluetoothConnected: boolean,
  scanForDevices: () => Promise<any>,
  connectToDevice: (address: string) => void,
  printToDevice: (image: string) => Promise<string>
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);


export const BluetoothProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false)
  
  DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, (rsp) => {
    setIsBluetoothConnected(false)  
  })

  const requestBluetoothPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,// Necesario para escanear
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,// Necesario para escanear
      ]);

      return (
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.error('There was a problem:', err);
      return false;
    }
  }

  const scanForDevices = async () => {
    const isPermissionGranted = await requestBluetoothPermissions();
    if (!isPermissionGranted) {
      throw new Error('Bluetooth permission denied.');
    }

    return new Promise(async (resolve, reject) => {
      try {
        const devices = await BluetoothManager.scanDevices()        
        resolve(JSON.parse(devices));
      } catch (error) {
        reject(error);
      }
    });
  }

  const connectToDevice = async (address: string) => {
    try {
      await BluetoothManager.connect(address)
      setIsBluetoothConnected(true)
    } catch (error) {
      setIsBluetoothConnected(false)
    }
  }

  const printToDevice = async (image: string) : Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        await BluetoothEscposPrinter.setWidth(576)
        await BluetoothEscposPrinter.printerAlign(ALIGN.CENTER);
        await BluetoothEscposPrinter.printPic(image, {
          width: 576,
          left: 0,
        });

        resolve("Print successful.");
      } catch (err: any) {
        reject("A problem ocurred.");
      }
    });
  }

  return (
    <BluetoothContext.Provider value={{isBluetoothConnected, scanForDevices, connectToDevice, printToDevice}}>
      {children}
    </BluetoothContext.Provider>
  )
}

export const useBluetooth = (): BluetoothContextType => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};