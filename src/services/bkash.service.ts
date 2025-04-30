import axios from 'axios'

const bkashConfig = {
    baseURL: process.env.BKASH_BASE_UR!,
    apiKey: process.env.BKASH_API_KEY!,
    username: process.env.BKASH_USERNAME!,
    password: process.env.BKASH_PASSWORD!,
    apiSecret: process.env.BKASH_APP_SECRET!
}

let token: string | null = null // Token will be set after the first request

export const BkashService = {

    // Grant token (OAuth)
    grantToken: async (): Promise<string> => {
        const response = await axios.post(`${bkashConfig.baseURL}/checkout/token/grant`,  //API endpoint provided by Bkash for token generation
            {
                app_key: bkashConfig.apiKey,
                app_secret: bkashConfig.apiSecret,
              },
              {
                headers: {
                  username: bkashConfig.username,
                  password: bkashConfig.password,
                  'Content-Type': 'application/json',
                },
              }
         )

         token = response.data.id_token;

         if (!token) {
             throw new Error('Token generation failed');
         }
         return token;
    },

    // 2. Create payment
    createPayment: async (
      amount: number,
      merchantInvoiceNumber: string,
      callbackURL: string,
      intent: string = 'sale'

    ): Promise<any> => {

    if (!token) await BkashService.grantToken();

    const response = await axios.post(
        `${bkashConfig.baseURL}/checkout/create`,
        {
        mode: '0011',
        amount: amount.toFixed(2),
        currency: 'BDT',
        intent,
        merchantInvoiceNumber,
        callbackURL,
        },
        {
        headers: {
            'Authorization': token!,
            'X-APP-Key': bkashConfig.apiKey,
            'Content-Type': 'application/json',
        },
        }
    );

    return response.data;
    },

    //execute the payment 
    executePayment: async (paymentID: string): Promise<any> => {

        if (!token) await BkashService.grantToken();
    
        const response = await axios.post(`${bkashConfig.baseURL}/checkout/execute`,
          { paymentID },
          {
            headers: {
              'Authorization': token!,
              'X-APP-Key': bkashConfig.apiKey,
              'Content-Type': 'application/json',
            },
          }
        );
    
        return response.data;
      },
    
      // 4. Query payment status
    queryPayment: async (paymentID: string): Promise<any> => {

    if (!token) await BkashService.grantToken();

    const response = await axios.get(`${bkashConfig.baseURL}/checkout/payment/status`,
        {
        headers: {
            'Authorization': token!,
            'X-APP-Key': bkashConfig.apiKey,
            'Content-Type': 'application/json',
        },
        params: { paymentID },
        }
    );

    return response.data;
    },
} 