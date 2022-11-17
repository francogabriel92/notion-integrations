import axios, { AxiosResponse } from '../../node_modules/axios/index';
import { DOLAR_API_URL, NOTION_URL } from '../constants/constants.js';
import { DATABASE_ID, NOTION_KEY } from '../config';

interface RawDolar {
  casa: {
    nombre: string;
    compra: string;
    venta: string;
  }
}

interface Dolar {
  name: string;
  buy?: number;
  sell: number;
}

interface DatabaseResponse {
  id: string;
  properties: any;
}

interface Page extends Dolar {
  id: number;
}

const getDolarValue = async () => {
  const response: AxiosResponse = await axios.get(DOLAR_API_URL);
  const data = response.data;
  const processedData: Dolar[] = data.map( (el: RawDolar) => {
    return {
      name: el.casa.nombre.toLowerCase(),
      buy: parseFloat(el.casa.compra),
      sell: parseFloat(el.casa.venta)
    }
  });
  return processedData;
};

const getPages = async (key: string, id: string) => {
  const response: AxiosResponse = await axios.post(
    `${NOTION_URL}/databases/${id}/query`,
    {},
    {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': `Bearer ${key}`,
      }
    } 
  );
  const data = response.data.results;
  const pages: Page[] = data.map( (el: DatabaseResponse) => {
    return {
      id: el.id,
      name: el.properties.Name.title[0].plain_text.toLowerCase(),
      buy: el.properties.Buy.number,
      sell: el.properties.Sell.number
    }
  })
  return pages;
};

export const dolarUpdate = async () => {
  const dolars: Dolar[] = await getDolarValue();
  const pages: Page[] = await getPages(NOTION_KEY, DATABASE_ID);
  
  await Promise.all(
    await dolars.map(async d => {
      console.log(typeof(d.sell));
      const { name, buy, sell } = d;
      const page: Page = pages.filter( p => p.name === name )[0];
      if(!page) return;
      const payload = {
        properties: {
          Sell: {
            number: sell,
          },
          Buy: {
            number: buy
          },
        },
      };
      console.log(typeof(payload.properties.Sell.number));
      
      const response: AxiosResponse = await axios.patch(`${NOTION_URL}/pages/${page.id}`, 
      payload,
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Notion-Version': '2022-06-28',
          'Authorization': `Bearer ${NOTION_KEY}`,
        },
      });
      return response.status;
    })
  );
};
