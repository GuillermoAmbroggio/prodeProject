import axios from 'axios';
import { configMpHeader } from './addPayment';

export const getCard = ({
  cardId,
  customer_id,
}: {
  cardId: string;
  customer_id: string;
}) => {
  const { MP_URL_API } = process.env;

  return axios.get(
    `${MP_URL_API}/customers/${customer_id}/cards/${cardId}`,
    configMpHeader
  );
};

export const getPaymentDetail = ({ payment_id }: { payment_id: string }) => {
  const { MP_URL_API } = process.env;

  return axios.get(`${MP_URL_API}/payments/${payment_id}`, configMpHeader);
};
