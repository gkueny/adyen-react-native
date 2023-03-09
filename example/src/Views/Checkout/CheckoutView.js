// @ts-check

import React, { useEffect, useCallback } from 'react';
import { AdyenCheckout, ErrorCode } from '@adyen/react-native';
import {
  fetchPayments,
  fetchPaymentDetails,
  isSuccess,
} from '../../Utilities/APIClient';
import { SafeAreaView, Alert } from 'react-native';
import { usePaymentMethods } from '../../Utilities/PaymentMethodsProvider';
import PaymentMethods from './PaymentMethodsView';
import Styles from '../../Utilities/Styles';
import TopView from './TopView';

const CheckoutView = ({ navigation }) => {
  const { config, paymentMethods, refreshPaymentMethods } = usePaymentMethods();

  useEffect(() => {
    refreshPaymentMethods();
  }, []);

  const didSubmit = useCallback(
    async (data, nativeComponent) => {
      console.log(`didSubmit: ${data.paymentMethod.type}`);
      fetchPayments(data, config)
        .then((result) => {
          if (result.action) {
            console.log('Action!');
            nativeComponent.handle(result.action);
          } else {
            processResult(result, nativeComponent);
          }
        })
        .catch((error) => processError(error, nativeComponent));
    },
    [config]
  );

  const didProvide = useCallback(async (data, nativeComponent) => {
    console.log('didProvide');
    fetchPaymentDetails(data)
      .then((result) => processResult(result, nativeComponent))
      .catch((error) => processError(error, nativeComponent));
  }, []);

  const didComplete = useCallback(async (nativeComponent) => {
    console.log('didComplete');
    nativeComponent.hide(true, { message: 'Completed' });
  }, []);

  const didFail = useCallback(async (error, nativeComponent) => {
    console.log(`didFailed: ${error.message}`);
    processError(error, nativeComponent);
  }, []);

  const processResult = useCallback(async (result, nativeComponent) => {
    const success = isSuccess(result);
    console.log(
      `Payment: ${success ? 'success' : 'failure'} : ${result.resultCode}`
    );
    nativeComponent.hide(success, { message: result.resultCode });
    navigation.popToTop();
    navigation.push('Result', { result: result.resultCode });
  }, []);

  const processError = useCallback(async (error, nativeComponent) => {
    nativeComponent.hide(false, { message: error.message || 'Unknown error' });
    if (error.errorCode == ErrorCode.Canceled) {
      Alert.alert('Canceled');
    } else {
      Alert.alert('Error', error.message);
    }
  }, []);

  return (
    <SafeAreaView style={Styles.page}>
      <TopView />
      <AdyenCheckout
        config={config}
        paymentMethods={paymentMethods}
        onSubmit={didSubmit}
        onAdditionalDetails={didProvide}
        onComplete={didComplete}
        onError={didFail}
      >
        <PaymentMethods />
      </AdyenCheckout>
    </SafeAreaView>
  );
};

export default CheckoutView;