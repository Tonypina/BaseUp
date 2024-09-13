import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useBluetooth } from '@/context/BluetoothContext';

export default function BluetoothModal({ bluetoothModalVisible, setBluetoothModalVisible }) {
    const [isLoadingDevices, setIsLoadingDevices] = useState(false);
    const [devices, setDevices] = useState({ paired: [], found: [] });

    const { 
        isBluetoothConnected,
        scanForDevices, 
        connectToDevice,
    } = useBluetooth()

    useEffect(() => {
        const getDevices = async () => {
            setIsLoadingDevices(true);
            try {
                // Escanear dispositivos
                const devices = await scanForDevices();
                setDevices(devices);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoadingDevices(false);
            }
        };

        if (bluetoothModalVisible) {
            getDevices();
        }
    }, [bluetoothModalVisible]);

    const connectToPrinter = async (address) => {
        try {
            connectToDevice(address);

            if (isBluetoothConnected) {
                setBluetoothModalVisible(false);
            } else {
                alert("Couldn't connect to printer.");
            }
        } catch (err) {
            alert(err);
        }
    };

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={bluetoothModalVisible}
            onRequestClose={() => setBluetoothModalVisible(false)}
        >
            <View style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
                <View style={{
                    width: '100%',
                    height: '85%',
                    backgroundColor: 'white',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    elevation: 5,
                    paddingTop: 20
                }}>
                    <View style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: 30,
                        }}>Connect To Printer</Text>
                    </View>
                    <View style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 15
                    }}>
                        <Text style={{
                            fontSize: 13,
                            color: 'gray'
                        }}>Select the printer</Text>
                    </View>
  
                    <View style={{
                        width: '100%',
                        paddingHorizontal: 20,
                    }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginBottom: 10
                        }}>Paired Devices</Text>
                                
                        <ScrollView style={{ height: 270 }}>
                            {isLoadingDevices ? (
                                <ActivityIndicator size="large" color="#0000ff" />
                            ) : (
                                devices.paired.length > 0 ? (
                                    devices.paired.map((device, index) => (
                                        <TouchableOpacity key={index} onPress={() => connectToPrinter(device.address)}>
                                            <View style={{
                                                paddingVertical: 10,
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#ccc'
                                            }}>
                                                <Text>{device.name || device.address}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text>No Paired Devices Found</Text>
                                )
                            )}
                        </ScrollView>
                    </View>
  
                    <View style={{
                        width: '100%',
                        paddingHorizontal: 20,
                        marginTop: 20
                    }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginBottom: 10
                        }}>Found Devices</Text>

                        <ScrollView style={{ height: 270 }}>
                            {isLoadingDevices ? (
                                <ActivityIndicator size="large" color="#0000ff" />
                            ) : (
                                devices.found.length > 0 ? (
                                    devices.found.map((device, index) => (
                                        <TouchableOpacity key={index} onPress={() => connectToPrinter(device.address)}>
                                            <View style={{
                                                paddingVertical: 10,
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#ccc'
                                            }}>
                                                <Text>{device.name || device.address}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text>No Devices Found</Text>
                                )
                            )}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
